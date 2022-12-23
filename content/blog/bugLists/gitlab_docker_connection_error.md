---
title: docker daemon 커넥션 에러
date: 2022-02-25
tags: [버그리포트]
publish: true
image: "./bugreport.jpg"
---

## 에러 환경

## 에러 현상

![image](https://user-images.githubusercontent.com/24996316/155658590-bf6a9f17-8dbd-4851-a889-63f9a2409ea9.png)

자체 호스팅된 Gitlab 및 Runner를 사용하고 있고 dind를 사용하여 CI/CD 빌드를 실행하려고 했는데 위와 같은 에러가 떴다.

## 에러 원인

프론트 소스를 Dockerfile을 이용해 이미지로 만든 후 팀 내부 도커 레지스트리에 배포하는 job을 수행하도록 의도했다. 그런데 Gitlab이 도커를 실행하지 못하는 상황이다.

```yml
docker-build:
  stage: build
  tags:
    - front-ci
  image: docker:stable
  services:
    - name: docker:dind
      command: ['--tls=false', '--insecure-registry=${DOCKER_REGISTRY}']
  variables:
    DOCKER_HOST: tcp://docker:2375/
    DOCKER_DRIVER: overlay2
    DOCKER_TLS_CERTDIR: ''
  before_script:
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" $CI_REGISTRY
    ...
```

dind 에서 사용하는 도커 이미지 버전 문제일까 싶어서 Gitlab이 올릴 도커를 제대로 인식시켜주기 위해 image 버전과 services의 이름명, DOCKER_HOST를 맞춰주면 될까하여 시도해봤으나 이 문제는 아니었다.  
다만 이 방법으로 알게된 사실은 `--tls=false` 명령어 실행을 통해 tls를 비활성화 시켜서 도커 빌드 전에 도커를 먼저 올리는 작업이 가능하다는 걸 알게 되었다.

> SSL(TLS) : Secure Socket Layer의 약자로 웹서버와 웹 브라우저 간의 암호화 통신을 위하여 응용계층과 TCP/IP 계층에서 동작하는 프로토콜

## 해결 방법

여러가지의 삽질과 구글링 끝에 사용 중인 깃랩 러너의 **privileged** 옵션값을 **true**로 수정하니 문제가 해결됐다.

```json
[runners.docker]
    tls_verify = false
    image = "alpine"
    privileged = true //
```

이해하기로는 깃랩이 도커 컨테이너 러너를 이용해 도커 이미지를 만들 도커를 조작하는 것인데 내부 도커까지 권한이 내려가지 못한 것이었다.

## 참고한 글

[참고 링크](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/27300)  
[참고 링크](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/1986)
