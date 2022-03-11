---
title: CRA react 프로젝트에서 proxy 설정 방법
date: 2022-03-11
tags: []
---

### 현상
크로스 도메인 이슈로 개발 환경인 localhost:3000 리액트 웹서버에서 다른 도메인을 가진 api 요청을 못하고 있다.

### 해결
![image](https://user-images.githubusercontent.com/24996316/157851425-d746b9a9-d0bb-48f9-8fa4-1345a46d1e56.png)

```
//package.json
{
  ...,
  "proxy": "http://apiserver.com:5000/",
  ...,
}
```
browser에서 React dev server(http://localhost:3000)으로 요청을 보낸다.   
React dev server가 해당 요청을 api server(http://apiserver.com:5000/)에 보낸다.   
api server가 response를 react dev server에게 전달한다.   
React dev server는 이 response를 그대로 browser에게 전달해준다.   
이때, browser 입장에서는 api server가 아닌, React dev server가 응답한 것 처럼 보이게 된다.   

[참고](https://velog.io/@tw4204/React-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C%EC%9D%98-CORS%EB%A5%BC-%EC%9C%84%ED%95%9C-proxy-%EC%84%A4%EC%A0%95)
