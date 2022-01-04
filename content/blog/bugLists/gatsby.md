---
title: gatsby 배포시 prefix 설정
date: 2022-01-04
output:
  html_document:
    css: "./assets/css/style.css"
---

배포 환경에서 레파지토리명이 url 시작부에 붙어서 나오지 않는 문제로 페이지간의 에러가 발생했다.

1. package.json deploy 명령어 수정

```js
"deploy": "gatsby build --prefix-paths && gh-pages -d public"
```

개츠비로 빌드를 할 때 prefix-paths를 지정하여 빌드하겠다고 지정해 준다.

2. gatsby-config.js 파일에서 pathPrefix 명을 지정

```js
module.exports = {
  pathPrefix: "/todayILearned",
```

해당하는 prefix-paths의 값을 개츠비 설정 파일에서 지정해 준다.

3. cache 파일 삭제 후 다시 배포 해보면 의도했던 대로 prefix가 붙어서 배포된다

```
npm run clean
```
