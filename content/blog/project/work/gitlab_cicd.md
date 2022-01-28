---
title: 깃랩 cicd
date: 2022-01-22
tags: []
output:
  html_document:
    css: "./assets/css/style.css"
---

### 목표

웹서버에 올릴 프론트 파일을 깃랩을 이용해 자동 배포하도록 설정해 본다.

### 어떻게 돌아가는 걸까 & 시나리오
깃랩의 cicd는 도커에서 돌아간다. 그리고 연결된 쿠버네티스에 배포가 된다. (@.@? 쿠버네티스가 뭔지 모르겠지만 일단은 넘어가자) 깃랩의 cicd는 프로젝트의 루트 위치에 .gitlab-ci.yml이 있는 상태에서 새로운 푸시가 들어오면 yml에 작성된 명령어들이 일련의 묶음으로 연결되어 실행된다. 이것을 파이프라인이라고도 한다.   
내가 하고픈 cicd의 전반적인 그림은 아래와 같다.   
1. 우선 로컬 피시에서 리액트 코드를 작성하고 master 브랜치에 커밋하면
2. 깃랩의 러너가 변화를 감지해 작성해둔 .gitlab-ci.yml 파일의 스테이지 단계대로 실행한다
3. yml 파일은 크게 도커 빌드 단계, 배포 단계로 구성했다.
4. 빌드 단계에서 docker in docker 이미지를 받아와 도커 안의 도커에서 이미지를 만들어 도커 레지스트리(a.k.a 팀 내부용 도커 허브)에 등록한다.
5. 배포 단계에서 kroniak/ssh-client 이미지를 받아와 ssh 연결을 통해 배포 서버에서 도커 레지스트리에서 이미지를 당겨와 배포한다.

### 1. 웹 어플리케이션으로 활용할 프로젝트 생성

나의 경우 create-react-app 명령어를 이용해 보일러 프로젝트로 간단하게만 만들어보았다.

### 2. 루트 위치에 yml 파일 생성

깃랩 cicd 파이프라인 기능을 사용하기 위해선 yml 파일을 작성해야 한다. 그리고 이 파일은 **프로젝트의 루트 폴더**에 위치해야 한다. (나의 경우 package.json과 동일한 위치에 해당 파일을 작성)

```
cache:
  paths:
    - node_modules/

stages:
  - build
  - docker-build

build:
  stage: build
  tags:
    - kisa-ci
  image: node:16-alpine
  before_script:
    - GENERATE_SOURCEMAP=false
  script:
    - npm install
    - CI=false npm run build
  artifacts:
    expire_in: 1 hour
    paths:
      - ./build

docker-build:
  stage: docker-build
  tags:
    - kisa-ci
  image: docker:latest
  services:
    - name: docker:19.03.8-dind
  before_script:
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" $CI_REGISTRY
  script:
    - docker build --pull -t "$CI_REGISTRY_IMAGE" .
    - docker push "$CI_REGISTRY_IMAGE"
    - echo "Registry image:" $CI_REGISTRY_IMAGE
```

### 3. 깃랩 러너 등록
- 공유 러너와 개별 러너, 차이점에 대해 공부하기

### 4. 배포 스테이지

```docker
deploy:
  stage: deploy
  tags:
    - kisa-ci
  image: kroniak/ssh-client
  before_script:
    - echo "deploying app"
  script:
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' > key.pem
    - chmod 400 key.pem
    - ssh -o StrictHostKeyChecking=no -i key.pem <username>@$PROD_SERVER_IP -p 6879 'docker stop <containername> || true && docker rm <containername> || true'
    - ssh -o StrictHostKeyChecking=no -i key.pem <username>@$PROD_SERVER_IP -p 6879 'docker run -p 3001:80 -d --name <containername> <imagename>'
```
- ssh private key 복사할 때 인코딩이 LF인지 꼭 확인하자
- 
