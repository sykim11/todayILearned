---
title: 깃랩 cicd
date: 2022-01-22
tags: [git]
publish: true
image: "./git.jpg"
---

### 목표

웹서버에 올릴 프론트 파일을 깃랩을 이용해 자동 배포하도록 설정해 본다.

### 어떻게 돌아가는 걸까 & 시나리오

깃랩의 cicd는 도커에서 돌아간다. 그리고 연결된 쿠버네티스에 배포가 된다. (@.@? 쿠버네티스가 뭔지 모르겠지만 일단은 넘어가자) 깃랩의 cicd는 프로젝트의 루트 위치에 .gitlab-ci.yml이 있는 상태에서 새로운 푸시가 들어오면 yml에 작성된 명령어들이 일련의 묶음으로 연결되어 실행된다. 이것을 파이프라인이라고도 한다.  
내가 하고픈 cicd의 전반적인 그림은 아래와 같다.

![](./gitlab_cicd_image1.jpg)

1. 우선 로컬 피시에서 리액트 코드를 작성하고 master 브랜치에 커밋하면
2. 깃랩의 러너가 변화를 감지해 작성해둔 .gitlab-ci.yml 파일의 스테이지 단계대로 실행한다
3. yml 파일은 크게 도커 빌드 단계, 배포 단계로 구성했다.
4. 빌드 단계에서 docker in docker 이미지를 받아와 도커 안의 도커에서 이미지를 만들어 도커 레지스트리(a.k.a 팀 내부용 도커 허브)에 등록한다.
5. 배포 단계에서 kroniak/ssh-client 이미지를 받아와 ssh 연결을 통해 배포 서버에서 도커 레지스트리에서 이미지를 당겨와 배포한다.

**dind란?**  
도커 호스트 내부에 또 다른 도커를 서비스 형태로 실행시킨다.

### 1. 웹 어플리케이션으로 활용할 프로젝트 생성

나의 경우 create-react-app 명령어를 이용해 보일러 프로젝트로 간단하게만 만들어보았다.

### 2. 루트 위치에 yml 파일 생성

깃랩 cicd 파이프라인 기능을 사용하기 위해선 yml 파일을 작성해야 한다. 그리고 이 파일은 **프로젝트의 루트 폴더**에 위치해야 한다. (나의 경우 package.json과 동일한 위치에 해당 파일을 작성)

```yml{numberLines: true}
stages:
  - build
  - deploy

docker-build:
  stage: build
  tags:
    - ci-tag
  image: docker:stable
  services:
    - name: docker:dind
      command: ["--tls=false", "--insecure-registry=$DOCKER_REGISTRY"]
  variables:
    DOCKER_HOST: tcp://docker:2375/
    DOCKER_DRIVER: overlay2
    DOCKER_TLS_CERTDIR: ""
  before_script:
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" $CI_REGISTRY
  script:
    - docker build -t project-name .
    - docker tag project-name $DOCKER_REGISTRY/project-name
    - docker push $DOCKER_REGISTRY/project-name

deploy_dev:
  stage: deploy
  tags:
    - ci-tag
  needs: [docker-build]
  image: kroniak/ssh-client
  before_script:
    - echo "deploying app"
  script:
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' > key.pem
    - chmod 400 key.pem
    - ssh -o StrictHostKeyChecking=no -i key.pem username@$PROD_SERVER_IP -p 6879 'docker stop projectcontainer || true && docker rm projectcontainer || true'
    - ssh -o StrictHostKeyChecking=no -i key.pem username@$PROD_SERVER_IP -p 6879 'docker pull $DOCKER_REGISTRY/project-name'
    - ssh -o StrictHostKeyChecking=no -i key.pem username@$PROD_SERVER_IP -p 6879 'docker run -p 3001:80 -d --name projectcontainer $DOCKER_REGISTRY/project-name'
  only:
    - master
```

배포 자동화의 단계는 크게 총 두단계이다. 빌드-배포.

#### 빌드

배포 스테이지에서 깃랩은 docker in docker를 실행시킨다. 그리고 깃랩에 등록한 러너가 sciprt: 부분을 실행시키기 전에 도커로 로그인한다.  
이후 러너는 script:에 적힌 순서대로 도커 명령어를 실행한다.

1. project-name이라는 이름의 도커 이미지를 생성한다
2. project-name 도커 이미지에 tag 이름으로 $DOCKER_REGISTRY/project-name를 붙여준다
3. 도커 레지스트리($DOCKER_REGISTRY)에 $DOCKER_REGISTRY/project-name tag 이름을 가진 도커 이미지를 푸시한다

> **dind secure error 443**  
> 도커 속 도커에서 도커 레지스트리로 이미지를 push하려는데 443 connect 에러가 떴다. 도커는 통신을 할 때 https 통신을 디폴트로 하는데 우리가 가진 도커 레지스트리가 https 통신 오픈이 되어있지 않았다. 그래서 \*\*도커 서비스의 커맨드 명령어에 '--insecure-registry=$DOCKER_REGISTRY' 이 옵션을 주어 해결.

#### 배포

빌드 스테이지에서 깃랩은 kroniak/ssh-client을 실행시킨다.  
이후 러너는 script:에 적힌 순서대로 도커 명령어를 실행한다.

1. ssh 접속을 위해 key.pem 파일을 lf 형식으로 바꾼 후 400 권한을 부여한다
2. key.pem 파일을 이용해 배포하고자하는 서버에 '우리가 실행시키고자하는 컨테이너가 있다면 스탑 후 제거한다' <- 컨테이너 중복 에러 방지
3. key.pem 파일을 이용해 배포하고자하는 서버에서 빌드 단계에서 push 했던 $DOCKER_REGISTRY/project-name 이미지를 가져온다
4. key.pem 파일을 이용해 배포하고자하는 서버에서 '가져온 이미지를 도커 컨테이너로 실행한다. 이때 호스트의 포트는 3001 포트이고 컨테이너의 포트는 80 포트를 이용해 연결한다'

> **ssh 명령어를 이용해 서버와 통신을 하기 위한 key 생성**  
> `ssh-keygen -m PEM -t rsa -b 4096 -C "email@co.kr"`  
> 위 명령어를 서버에서 실행하면 id_rsa, id_rsa.pub 키를 생성하고 전자의 키를 복사해 깃랩에서 $SSH_PRIVATE_KEY 환경변수로 지정 후 사용한다  
> [SSH key 생성하고, 서버에 등록해서 비밀번호 없이 접속하기](https://shanepark.tistory.com/195)

> **ssh denided 에러**  
> 에러구문: Permission denied (publickey, password)  
> 서버와 통신하기 위해 key 생성을 할 때 id_rsa를 복사한 authorized_keys 파일을 반드시 생성해야 깃랩에서 원격 서버로 접속 후 도커 실행하는 명령어가 통과한다(이유는 왜지?)

> **docker 권한 에러**  
> 에러구문: Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock  
> ssh 통신은 됐는데 docker 명령어를 사용할 때마다 권한 에러가 떴다. 이유는 현재 사용 중인 유저가 /var/run 내부에서 도커 실행 권한이 없기 때문에 생긴 일. /var/run 폴더에서

```
service docker restart
```

명령어를 실행하면 도커를 재실행하기 위해 권한을 설정시킬 유저 목록들이 나온다. 이후 sudosu > reboot 하여 서버 재시작.

### 3. 깃랩 러너 등록

- 공유 러너와 개별 러너, 차이점에 대해 공부하기

### 4. 그 외 기억할 것들

- \*ssh private key 복사할 때 인코딩이 LF인지 꼭 확인하자
