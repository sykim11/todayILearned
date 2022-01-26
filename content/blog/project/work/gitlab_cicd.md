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

### 어떻게 돌아가는 걸까
깃랩의 cicd는 도커에서 돌아간다. 그리고 연결된 쿠버네티스에 배포가 된다. (@.@? 쿠버네티스가 뭔지 모르겠지만 일단은 넘어가자) 깃랩의 cicd는 프로젝트의 루트 위치에 .gitlab-ci.yml이 있는 상태에서 새로운 푸시가 들어오면 yml에 작성된 명령어들이 일련의 묶음으로 연결되어 실행된다. 이것을 파이프라인이라고도 한다. 

### 1. 웹 어플리케이션으로 활용할 프로젝트 생성

나의 경우 create-react-app 명령어를 이용해 보일러 프로젝트로 간단하게만 만들어보았다.

### 2. 루트 위치에 yml 파일 생성

깃랩 cicd 파이프라인 기능을 사용하기 위해선 yml 파일을 작성해야 한다. 그리고 이 파일은 **프로젝트의 루트 폴더**에 위치해야 한다. (나의 경우 package.json과 동일한 위치에 해당 파일을 작성)

```
stages:
  - build
  - test
  
build:
  stage: build
  image: node:15
  script:
    - npm install
    - npm test
    - npm build
```

### 3. 깃랩 러너 등록

