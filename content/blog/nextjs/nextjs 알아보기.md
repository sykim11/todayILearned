---
title: NextJS로 마이그레이션하기 - 개념
date: 2022-11-15
tags: [nextjs]
publish: false
image: "./nextjs.jpg"
---


기존에 개발된 프로젝트들이 모두 리액트 라이브러리로 이루어져있고 개발 중 빌드 단계에서 긴 시간을 잡아먹는 게 불편하다는 생각이 들었다. 그래서 빌드 툴만 바꿀 생각으로 이런 저런 내용들을 찾아보다 결국 NextJS로 다시 돌아왔다.   
현재까지 나온 NextJS의 버전은 13이고 버전 12부터 SWC 라는 컴파일러를 사용한다고 한다. (*SWC는 웹을 위해 나온 러스트 기반의 플랫폼이다)   

### NextJS란
> 리액트 라이브러리 + express + react-router-dom + ssr   

한 줄로 설명하자면 이렇게 되겠다. 정확히 expressjs, reac-router-dom을 가져다 쓰고 있다는 의미가 아닌, express의 기능을 갖추고 있고 리액트 프로젝트로 구성을 할 때 매번 따로 설치해줘야했던 라우터 설정이 이미 포함되어있다는 의미로 이렇게 표현한다.   

#### 단일 페이지 개발 기능
NextJS의 베이스에는 리액트 라이브러리가 존재한다. 즉, 리액트에서 사용하던 useEffect, useState 등 리액트에서 유용하게 활용하던 api 함수들을 모두 가져다 쓸 수 있다는 말이다. NextJS는 SPA 형식으로 웹 개발이 가능하고 NextJS에서 제공해 주는 api들을 통해 특정 페이지 범위, 혹은 전역 범위에서 서버사이드렌더링 개발이 별다른 설치 없이 이루어지도록 만들어진 프레임워크이다.   

#### 자체 API 기능
NextJS에서 express에 해당하는 기능으로는 웹 api 기능을 자체적으로 지원하는 부분에서 유사하다.   
```js

```
NextJS 프레임워크를 설치하여 내부 폴더를 보면 위와 같은 파일이 존재하고 브라우저에 http://localhost:3000/api/hello 에 접속해보면 일반 웹 화면이 아닌 json 결과 값이 보인다. 이 기능을 본 프로젝트(리액트 프로젝트)를 마이그레이션할 때 사용할 것 같지는 않지만 일단 지금은 이런 기능이 있구나 하고 넘어가자.   

#### 페이지 단위 라우팅 기능
package.json 과 같은 경로에서 npm run build 명령어로 NextJS 프레임워크를 빌드해 보면 .next 폴더가 생긴다. 그리고 이 폴더의 내부를 살펴보면 /static 하위에 페이지별로 js 파일들이 나뉘어서 들어가있는 걸 확인할 수 있다. 라우팅시키는 개발 방식 또한 굉장히 간단하다.   
http://localhost:3000/main -> /page/main/index.ts   
http://localhost:3000/detail/1 (동적 페이지) -> /page/detail/[id].ts


#### 서버사이드렌더링

### root html이 없는 nextjs
NextJS를 빌드한 결과물은 다음과 같다.   
![image](https://user-images.githubusercontent.com/24996316/202131938-87e20156-8380-484e-8338-093227c268e7.png)   
ReactJS를 빌드했던 결과물과 비교했을 때 가장 어색한 부분은 아마 root(뼈대 html)에 해당하는 html 파일이 없다는 것이다.   
![image](https://user-images.githubusercontent.com/24996316/202132315-c0ef4078-55fb-40de-8b2f-0b178abbe68d.png)   
NextJS에서 뼈대 html에 해당하는 파일은 _app.tsx 파일이 역할을 하는데 나는 이 말에도 구현 방식이 확 닿지 않아서 express를 살펴보니 아하... 싶은 개념이 떠올랐다. 잠깐 express 기반의 웹 구동 방식을 살펴보면 얼핏 유사하다. express 모듈을 설치하고 app.js 파일을 아래와 같이 기재 후 node app.js로 실행을 하면   
```js
var express = requeire('express') // node_modules에 있는 express 관련 파일 임포트
var app = express() // express 함수의 결과값을 app으로 지정
app.listen(3000, function() {}) // 3000 포트로 서버 열기

app.get('/', function(req, res) { // "/" 라우트로 접속 시 작성된 태그를 반환하여 브라우저에 노출
  res.send("<h1>i am root content</h1>")
})
```
이렇게 뿅... 내가 접근한 라우팅 페이지에 들어가면 작성했던 html 태그가 반환되어 정상적인 페이지를 그려준다. 정적 페이지 정도는 js 모듈들만으로도 만들어지는 신기한 세상...
![image](https://user-images.githubusercontent.com/24996316/202136308-1b88e877-5840-4941-bbcb-40d2051f2159.png)



### nginx와의 연관성

NextJS 사용 방법을 검색해 보면 nginx가 심심찮게 보이는 걸 확인할 수 있다. 사내 프로젝트에서도 리액트의 정적인 빌드 결과물을 nginx를 이용해 서버로 올린다는 표현을 했는데... 웹 서버에 nginx를 사용하는 이유가 뭔지 궁금해 겸사로 찾아보았다. (어차피 이 다음 해 볼 일이 NextJS 배포 관련이니 지금 미리 공부해 둔다고 생각하자)   
nginx가 웹에서 하는 역할로는 프록시 서버라는 기능이 있다. 웹 리소스를 올리는 서버의 실제 포트가 3000이라면 nginx에서 80으로 연결시켜 실제 서버의 정보를 한 겹 숨겨주는 보안적 기능을 가져갈 수 있다.

#### nginx 프로세스와 nginx.conf 파일
nginx 프로세스는 쿠버네티스처럼 마스터와 워커들이라는 개념이 있고 이것들을 각각 마스터 프로세스, 여러 작업자 프로세스라고 부른다. 마스터 프로세스가 하는 일은 nginx.conf 파일을 토대로 구성을 하고 평가하여 여러 작업자 프로세스들이 실제 요청된 일을 처리하도록 관리한다.   
http 컨텍스트 안에서 여러 개의 서버를 선언할 수 있고 server 컨텍스트 안에서 여러 개의 location을 선언할 수 있다.

```conf
http {
  server {
    listen 80;
    location / {
      root   /usr/share/nginx/html;
      index  index.html index.htm;
      try_files $uri $uri/ /index.html;
    }
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www;
    }
  }
}
```


