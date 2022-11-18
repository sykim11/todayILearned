---
title: NextJS로 마이그레이션하기 - 도커라이징(feat.NGINX)
date: 2022-11-18
tags: [nextjs]
publish: false
image: "./nextjs.jpg"
---

해당 포스팅은 [이 글](https://steveholgado.com/nginx-for-nextjs/)을 번역해 실습하며 정리한 글이다. 또한 NextJS 사용 방법을 검색해 보면 NGINX가 심심찮게 보이는 걸 확인할 수 있다. 사내 프로젝트에서도 리액트의 정적인 빌드 결과물을 NGINX를 이용해 서버로 올린다는 표현을 했는데 웹 서버에 NGINX를 사용하는 이유가 뭔지 궁금해 NextJS 웹앱을 도커로 배포하는 작업과 함께 NGINX에 대해서도 짤막하게 공부해 봤다.

### NGINX와 웹앱의 연관성

NGINX가 웹에서 하는 역할로는 프록시 서버라는 기능이 있다. 웹을 띄워주는 서버의 실제 포트가 3000이라면 NGINX에서 80으로 맵핑시켜 실제 서버의 주소를 한 겹 숨겨주는 보안적 기능을 가져갈 수 있다. NGINX는 프록시 기능 외에도 고성능 기능들이 많다는데 이 글에서는 프록시와 NextJS 웹앱의 정적 리소스를 캐싱시켜주는 기능에 대해서만 다룰 예정이다.

#### NGINX 설정 파일 내부 위치별 역할

```conf{numberLines: true}
# core 모듈 설정
worker_process 1;

# events 블록
events {
  worker_connections 100;
}

# http 블록
http {
  ...
  # server 블록들
  server {
    server_name domain1.com;
    root /var/www/domain1.com;
    # location 블록들
    location / {
      root html;
      index index.html index.htm;
    }
    location /user/ {
      root /home/user;
    }
  }
  server {
    server_name domain2.com;
    root /var/www/domain2.com;
  }
}

```

** core 모듈 설정 **  
NGINX conf 파일의 최상단에는 NGINX의 프로세스를 관리해 주는 프로세스의 수 및 기본적인 동작 방식을 정의한다. NGINX는 하나의 마스터 프로세스와 여러 개의 작업자 프로세스로 구성되어 실행된다. 마스터의 역할은 설정 파일을 읽고 이를 토대로 구성 및 평가하여 여러 작업자 프로세스들이 실제 요청된 일을 처리하도록 관리한다.

** events 블록 **  
이벤트 블록 안에서는 네트워크 동작 방법에 관련된 설정이 가능하다.  
예시로 worker_connections의 값이 100이라는 의미는 한 개의 작업자 프로세스가 동시에 처리할 수 있는 커넥션의 수를 의미한다.

** http 블록 **  
http 블록은 server 블록의 루트 역할을 한다. 루트에 기재한 값들은 모든 server 블록들의 기본값이 된다. 테스트해 보니 server가 하나인 경우 생략해도 정상 작동하는 것 같다.

** server 블록 **  
서버의 포트가 어디로 연결될 것인지 해당 서버의 이름은 무엇인지 정의하는 곳이다. 또한, 하나의 서버에서 한 개 이상의 도메인을 서비스할 수 있다.

** location 블록 **  
location 블록은 server 블록 안에 쓰여지며 server와 마찬가지로 여러 개 사용 가능하다. 해당 링크로 접근했을 때 어떤 경로의 파일을 root로 정할 지 결정하는 지시문이다.

❗ 아래 글부터는 NextJS 프레임워크를 설치했다는 가정하에 진행된다.

### NextJS 웹앱 컨테이너화

NextJS를 설치한 프로젝트 폴더를 열어보면 package.json이 있는데 해당 파일과 동일한 위치에 Dockerfile을 생성한다.  
./Dockerfile

```dockerfile{numberLines: true}
FROM node:16-alpine as builder
WORKDIR /app
COPY package.json .
RUN npm install --force
COPY . .

RUN npm run build
EXPOSE 3000
# USER node
CMD ["npm", "start"]
```

NextJS는 리액트 기반의 웹 어플리케이션 기능들을 가능하게 하는 NodeJS 위에서 빌드된 웹 개발 프레임워크이기 때문에 NodeJS가 반드시 설치되어야 NextJS 웹앱 서버가 구동된다.  
해당 도커파일에 설치된 노드 버전이 16-alpine인데 alpine은 보안 및 작은 파일 크기에 중점을 둔 무척 가벼운 리눅스 배포판이라는 뜻이다.  
이후 작업 폴더를 /app 으로 지정하고 package.json 파일을 복사해 NextJS에 종속된 패키지가 설치되도록 설정한다. package.json을 먼저 복사하는 이유는 도커 캐싱 시스템을 활용하기 위함이다. 프로세스의 각 단계마다 레이어가 생성이 되고 도커 캐싱 시스템은 이 레이어들을 기억할 수 있다. 만일 package.json에 변화가 없다면 NextJS에 종속된 패키지 설치를 진행하지 않고 캐싱시켜 건너뛰어준다. (도커 이미지 만드는 속도가 빨라진다 👍)

❗ 기본적으로 도커는 컨테이너를 루트로 실행한다. 하지만 NodeJS를 루트로 실행하면 보안 문제가 발생할 수 있다. 이를 방지하기 위해 `USER node` 를 통해 루트 권한이 없는 사용자인 노드로 전환해 주는 게 좋다. node라는 사용자는 node:16-alpine에서 제공이 된다. 하지만 나는 테스트용 프로젝트를 작업 중이므로... 권한이 맘껏 뚫린 루트 권한 그대로 가져가려고 한다. 배포 때 추가해 보자.

종속된 패키지 설치까지 끝낸다면 NextJS 빌드 작업이 진행되고 로컬 포트 3000에서 npm start 스크립트를 통해 NextJS 서버가 배포 모드로 실행이 된다.

🙄 해당 글에는 pm2를 배포 준비 프로세스에 포함시켰다. pm2는 NodeJS 어플리케이션을 위한 배포용 준비 프로세스로 어떤 이유에서 웹앱 이미지가 깨져 NodeJS 프로세스가 종료되면 웹앱을 더이상 사용할 수 없게 된다. 이를 방지하기 위해 pm2는 충돌 및 에러가 난 경우 앱이 항상 자동으로 다시 시작되도록 되살림 기능을 해 주는 역할을 하는데 내가 진행하고 있는 NextJS 웹앱은 쿠버네티스로 올라갈 것 같아서 pm2 프로세스는 제거한 상태로 진행했다.

### NGINX 설정 파일 생성

(nginx, nextjs 도커라이진된 컨테이너 도식화 그림 추가)
위 그림과 같이 NGINX는 NextJS 웹앱으로 들어오는 모든 요청을 다루는 디폴트 서버의 역할을 할 예정이라 default.conf라 이름 지었다. 이름은 뭐라 짓든 관련이 전혀 없으나 `.conf` 확장자는 꼭 잊지 말자.

nginx 폴더 하위 경로에 default.conf 파일을 생성했다.  
/nginx/default.conf

```conf{numberLines: true}
upstream nextjs_upstream {
  server nextjs:3000;
}

server {
  listen 80 default_server;

  server_name _;

  server_tokens off;
}
```

NGINX에 설정한 디폴트 서버는 단 하나이기 때문에 다른 여러 server 블록이 필요 없어서 http 블록을 생략하고 바로 server 블록부터 지시했다. 또한 디폴트 하나라서 이름도 필요가 없기에 \_; 으로 지정했다. server_tokens off; 는 NGINX 버전이 응답의 헤더에 나타나지 않도록 하는 기능이다. 마찬가지로 보안 이슈와 관련이 있는 것 같다.  
위 그림과 같이 도커 컨테이너는 NGINX, NextJS 두 개가 뜰 예정이다. NextJS 웹앱이 어떤 이유로 두 개 이상 띄워야한다면 서로 다른 포트를 가진 여러 개의 NextJS 컨테이너들을 NGINX 상단에 업스트림 형태로 추가할 수 있다. 그리고 NGINX는 이들 간의 요청을 로드 밸런싱하는 역할을 해 준다.

```conf{numberLines: true}
upstream nextjs_upstream {
  server nextjs:3000;
}
...
```

여기서 nextjs:3000 은 어디서 읽어들이고 있는 걸까?  
위 conf 파일은 NGINX 컨테이너고 해당 컨테이너의 localhost는 NGINX 자체를 참조한다. NGINX 컨테이너에서 NextJS 웹앱을 띄우고 있는 다른 컨테이너를 참조할 수 있는 방법은 IP 주소를 통해 가능하다. 또한 도커를 실행시킬 때 링크 옵션 기능을 이용해 참조할 수 있는 이름을 nextjs로 할당시켜주면 해당 IP 주소를 이름을 이용해서도 매핑할 수 있다.

🙄 나중에 Docker Compose를 설정해서 컨테이너를 실행하면 서로 다른 컨테이너끼리의 링크가 자동으로 설정된다고 한다. 하지만 마이그레이션 대상인 현재 웹앱은 Docker Compose를 사용하고 있지 않다. 쿠버네티스에 올라가 있는 앱들의 폴더 내부에 Docker Compose 파일이 없고 도커 파일만 존재하기에... 일단 Docker Compose 설정 없이 진행해 보았다. 어떤 경우에서 Docker Compose를 사용할 수 없는지도 나중에 꼭 알아보자.

어쨌든 링크 옵션 기능을 사용하든 Docker Composer 설정으로 컨테이너를 실행하든 nextjs:3000을 참조할 때 실제로는 NextJS 컨테이너의 localhost:3000을 참조하게 된다.

### NextJS 웹앱으로 요청 보내기

NextJS 웹앱 앞단에 NGINX를 리버스 프록시로 사용하고 있기 때문에 모든 요청들이 NGINX에 들어온다. 그리고 이 NGINX가 올바른 응답을 NextJS 웹앱으로 넘겨주기 위해선 프록시 헤더와 관련된 추가 설정이 필요하다.

```conf{numberLines: true}
upstream nextjs_upstream {
  server nextjs:3000;
}

server {
  listen 80 default_server;

  server_name _;

  server_tokens off;

  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;

  location / {
    proxy_pass http://nextjs_upstream;
  }
}
```

모든 요청은 NextJS 웹앱 서버 구성에 지정된 http://localhost:3000 으로 들어가는 게 아니라 NGINX 설정과 같이 업스트림으로 지정된 http://nextjs_upstream 에 요청을 전달하고 있다.

❓ NGINX 에서 upstream 이란?  
proxy_pass 지시자를 통해 NGINX가 받은 요청을 넘겨줄 서버들을 정의하는 지시자를 의미한다.  
[nginx stream 성능 최적화에 관련된 글](https://brunch.co.kr/@alden/11)

🙄 잘 쫓아가다 갑자기 헤더 설정이 나오니 어려워지기 시작해 서브 공부한 내용을 간략하게 적어보았다.

**HTTP 헤더의 역할**  
클라이언트와 서버가 요청 또는 응답으로 부가적인 정보를 전송하도록 도와주는 역할을 한다.  
헤더라는 이름에서 알 수 있듯 저장되거나 전송되는 데이터 블록의 맨 앞에 위치한 데이터를 HTTP 헤더라고도 한다. 특정 프로토콜로 통신해야하는 경우엔 특정 프로토콜의 기능을 제공하는 헤더 정보로 담아줘야 한다. 헤더의 뒤에 이어지는 데이터가 바로 프론트에서 주로 전달 받는 페이로드, 혹은 바디라 불리는 본문 데이터다.

**HTTP 헤더의 종류**

- end-to-end
- ** hop-by-hop ** : Connection, Keep-Alive, Proxy-Authenticate, Proxy-Authorization, TE, Trailer, Transfer-Encoding, Upgrade
- general header
- request header
- response header
- entity header

이 많은 헤더 중 프록시 설정에 Upgrade와 Connection이라는 hop-by-hop 헤더를 사용했다. NGINX.conf 파일에서 프록시 서버의 헤더를 설정할 때 hop-by-hop을 사용하는 이유가 뭘까?  
여기서 나오는 홉이란 쉽게 말해 네크워크에서 출발지와 목적지 사이의 경로를 의미한다. 홉 바이 홉 = 네트워크 경로 간의 경로를 의미하는데 프록시 특성상 버스 환승점처럼 원래의 목적지로 가기 위해 한 점을 찍고 넘어간다는 의미에서 hop-by-hop 헤더를 사용한 것이다. 그런데 이런 헤더의 특징으로는 요청의 헤더들이 다음 연결점에 영향을 끼쳐선 안 되기 때문에 현재 요청의 헤더 정보들을 모두 삭제하고 다음 연결점으로 넘어간다. 하지만 여기서 쓰고 있는 프록시 헤더들의 정보를 NextJS 웹앱 목적지로 모두 넘어가야하기 때문에 `Upgrade` 값을 사용해 클라이언트의 헤더 값들을 NextJS 헤더로 넘겨주고 있는 것이다.  
다양한 [NGINX 변수들](http://nginx.org/en/docs/varindex.html)이 있는데 나중에 꼭 참고하자.

### NGINX를 이용한 정적 리소스 캐시

NGINX를 사용했을 때 가져갈 수 있는 주요 이점 중 하나는 NodeJS보다 정적 리소스를 효율적으로 관리할 수 있다는 점이다.  
NGINX는 설정한 디렉터리에 한해서 효율적인 캐싱 기능을 제공한다. 사용자가 최초에 웹앱에서 정적 리소스를 요청하면 (ex. 첫 화면에서 이미지 로드) NGINX가 해당 파일이 캐싱으로 설정한 디렉터리에 있는 경우, 요청 정보를 저장해 둔다. 이렇게 하면 사용자는 매 요청마다 같은 리소스를 반복해서 NodeJS 서버에 요청하지 않아도 된다.

** 캐싱 영역 만들기 **

NGINX는 어떤 방식으로 캐싱시키는 걸까?  
NGINX는 우선 캐싱 영역이라는 메모리 영역을 생성한다. 그리고 그 캐싱 영역에 특정 파일에 대한 캐시 키를 저장해 놓는데, 이 키는 해당 파일이 캐싱 영역에 저장되어있는지 아닌지 판별하기 위해 사용된다.  
캐싱 설정은 NGINX 설정 파일 최상단에 아래와 같이 기재해 준다.

```conf{numberLines: true}
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;

upstream nextjs_upstream {
  server nextjs:3000;
}

...
```

NGINX에서 캐싱 영역에 대한 세부 설정은 아래와 같이 설명된다

`/var/cache/nginx` 캐싱된 리소스를 저장할 디렉터리     
`levels=1:2` 너무 많은 파일이 하나의 디렉터리에 있는 경우 파일 접근 속도가 감소될 수 있으니 2단계 디렉터리의 계층 구조로 만들겠다는 의미   
`keys_zone=STATIC:10m` STATIC이라는 이름을 가진 캐시용 메모리 영역을 명명하고 크기 제한은 10MB로 설정한다 (파일이 수천 개가 아닌 이상 충분)   
`inactive=7d` 캐싱된 리소스가 유지되는 기간이고 이후에 접근되지 않은 리소스는 캐싱 영역에서 삭제한다   
`use_temp_path=off` 리소스를 캐싱 디렉터리에 직접 사용하고 임시 저장될 영역을 자동으로 생성하지 않도록 설정한다   

** NextJS에서 빌드된 정적 리소스 캐싱 설정 **

```conf{numberLines: true}
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;

upstream nextjs_upstream {
  server nextjs:3000;
}

server{
  ...
    location /_next/static {
      proxy_cache STATIC;
      proxy_pass http://nextjs_upstream;

      # For testing cache - remove before deploying to production
      add_header X-Cache-Status $upstream_cache_status;
    }
  ...
}
```

NextJS는 빌드할 때 웹앱에서 구동할 각 페이지들을 만들어주기 위해 자바스크립트 번들러를 생성한다. 그리고 이 자바스크립트 번들러들은 /\_next/static/\* 경로에서 생성되어 NextJS가 페이지를 렌더링하게끔 만들어준다.  
이 정적인 번들러 파일들을 캐싱하기 위해 /\_next/static 경로로 설정된 location 블럭 내부에 STATIC이라는 이름을 가진 프록시 캐시를 지정해주었다. 이렇게 지정해 두면 /\_next/static 디렉터리 하위에 포함하고 있는 리소스들이 캐싱된다.  
캐싱된 이후 모든 요청들은 NextJS 웹앱으로 전달된다.   

![image](https://user-images.githubusercontent.com/24996316/202636898-b00441bd-f54e-47ae-8305-0d5b67ecbe99.png)   

NextJS는 웹에서 브라우저 캐싱 작업을 처리하기 위해 응답의 헤더를 설정하는데 /\_next/static/\* 에 있는 빌드된 정적인 리소스의 경우 각 URL에 고유한 빌드 ID가 존재해 브라우저 캐시 헤더가 동작하도록 설정한다. (NextJS를 다시 빌드해 보면 이 ID 값들이 달라져있는 걸 확인할 수 있다.)  
문제는 static/ 디렉터리(사용자가 생성한)의 동적 리소스에는 고유한 빌드 ID가 생성되지 않는다는 점이다. NextJS는 이런 리소스들에 대해서는 캐시가 없는 헤더를 설정하기 때문에 브라우저가 해당 리소스들은 캐시하지 않게 된다. 이 경우 NGINX에 해당 디렉터리에 대한 추가 설정이 필요하다.

** NextJS에서 빌드된 동적 리소스 캐싱 설정 **

```conf{numberLines: true}
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;

upstream nextjs_upstream {
  server nextjs:3000;
}

server{
  ...
    location /static {
      proxy_cache STATIC;
      proxy_ignore_headers Cache-Control;
      proxy_cache_valid 60m;
      proxy_pass http://nextjs_upstream;

      # For testing cache - remove before deploying to production
      add_header X-Cache-Status $upstream_cache_status;
    }
  ...
}
```

위와 같이 NGINX에 들어오는 요청들 /static 하위 경로에 한해서, 캐시가 없는 헤더를 무시하는 작업이 필요하다. /static 경로로 설정된 location 블럭 내부에 마찬가지로 아까 이름 지어둔 STATIC 캐시를 연결해 주고 캐시된 파일의 유효 기간을 60분으로 설정했다. 이렇게 설정해 두면 /static/\* 리소스에 한해서 최대 60분에 한 번만 캐시 메모리를 새로고침해 준다. 만약에 유효 기간을 설정하지 않으면 리소스들이 캐시 영역에 무기한으로 남지만 캐싱된 리소스는 기본적으로 비활성 기간이 7일이기 때문에 7일이 지나면 캐싱 영역에서 제거된다.

### NGINX에서 gzip 설정

NGINX 서버에서 gzip을 활성화해 사용자에게 리소스들이 압축된 상태로 로드되도록 설정하자.

```conf{numberLines: true}
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;

upstream nextjs_upstream {
  server nextjs:3000;
}

server{
  ...
  gzip on;
  gzip_proxied any;
  gzip_comp_level 4;
  gzip_types text/css application/javascript image/svg+xml;
  ...
}
```

`gzip on` gzip 활성  
`gzip_proxied any` NGINX에게 어떤 파일이든 gzip되도록 지정  
`gzip_comp_level 4` gzip 압축 레벨 설정 (4 정도가 평균)
`gzip_types text/css application/javascript image/svg+xml` 압축할 파일 타입 지정

파일의 크기가 작을수록 압축 수준을 높게 설정할 수 있지만 압축 수준이 높을수록 압축 및 압축 해제에 시간이 더 오래 걸린다. 그리고 본문 글에 따르면 파일 크기가 절약되는 구간이 4 이후부터 감소된다고 하니 평균 4 정도가 적당하다고 본다. gzip 압축 형식은 텍스트가 많은 파일에서 가장 잘 작동하고 일반적으로 이미지 파일을 압축하는 건 권장하지 않는다. 이미지 파일의 경우 고도로 압축되는 경향이 있어 gzip에 실행되는 시간이 예상보다 더 많이 걸릴 수 있다. 하지만 svg 는 텍스트 기반이라 gzip 압축의 장점을 고스란히 가져갈 수 있다고 한다. 이미지들을 웬만하면 svg 형태로 표현해주는 게 최적화에 도움이 되겠다.

### NGINX 도커라이징

nginx 폴더 하위 경로에 Dockerfile 파일을 생성했다.  
/nginx/Dockerfile

```Dockerfile{numberLines: true}
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/*

COPY ./default.conf /etc/nginx/conf.d/

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
```

리눅스의 alpine 배포판을 사용해 NGINX 도커 이미지를 기반으로 컨테이너를 생성한다. 그런 다음 NGINX 에 기본적으로 제공되는 구성 파일을 삭제하고 위에서 작업한 설정 파일로 교체하고 컨테이너 80 포트를 열어 실행해주면 해당 이미지를 실행 시 우리가 설정한 NGINX.conf 파일에 따라 NGINX가 실행된다.

### 도커에서 생성된 컨테이너들 실행하기

도커 파일이 있는 곳에서 각각 NextJS 이미지, NGNX 이미지를 생성한다.

```cmd
> docker build --t nextjs-image .
> docker build --t nextjs-image ./nginx
```

두 컨테이너가 공유할 네트워크를 생성한다.

```cmd
> docker network create my-network
```

두 컨테이너를 링크시켜 실행한다.  
NextJS 도커 컨테이너의 네트워크는 앞서 생성한 my-network에 연결해 주고 컨테이너 이름을 nextjs-container라 명명한 뒤 nextjs-image 이미지를 이용해 도커 실행  
NGINX 도커 컨테이너의 네트워크도 앞서 생성한 my-network에 연결해 주고 nextjs-container 컨테이너를 nextjs로 link 옵션을 이용해 맵핑시킨 뒤 nginx-image 이미지를 이용해 localhost:80 포트로 도커를 실행

반드시 --link 옵션을사용해 default.conf에서 nextjs로 참조되는 Next.js 컨테이너를 NGINX 컨테이너에 매핑해야 한다.

```cmd
> docker run --network my-network --name nextjs-container nextjs-image
> docker run --network my-network --link nextjs-container:nextjs --publish 80:80 nginx-image
```

### 캐싱 결과

![nginx_설정전_nextjs화면](https://user-images.githubusercontent.com/24996316/202617408-9221d78c-49d3-4f62-884a-e18b3a2c29a3.jpg)

NGINX를 적용하기 전 그냥 도커로 NextJS를 띄운 웹앱 화면을 보면 /static 경로에 들어있는 이미지의 네트워크 탭에서 해당 이미지를 로딩하는데 70 밀리초정도 걸린다.   

![nginx_설정후_nextjs_정적리소스_캐시화면_miss](https://user-images.githubusercontent.com/24996316/202617872-dbe14d20-f775-44fa-9d86-d14c94d676e4.jpg)

NextJS 웹앱 앞단에 NGINX를 적용해 프록시 리소스 캐싱을 적용한 웹앱 화면을 보면 NGINX 적용 전과 달리 30 밀리초보다 조금 덜 미치는 걸 확인할 수 있다. 그리고 NextJS 웹앱의 응답 헤더에 X-Cache-Status: MISS 값이 보이는데 이 의미는 해당 리소스가 첫 로딩이라 NGINX 캐싱 영역에 해당 리소스가 없어서 나오는 결과다.   

![nginx_설정후_nextjs_정적리소스_캐시화면_hit](https://user-images.githubusercontent.com/24996316/202618212-74d00b8a-ae9f-4c93-8cd6-e76c54d8e021.jpg)

다시 새로고침을 해서 결과를 보면 X-Cache-Status 값이 HIT 로 바뀌면서 NGINX 캐싱 영역에서 해당 리소스를 찾아 캐싱된 결과를 볼 수 있다.   



### 참고 자료

https://steveholgado.com/nginx-for-nextjs/
