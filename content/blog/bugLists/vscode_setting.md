---
title: vscode에서 crlf 파일들을 일괄로 lf파일로 변환하는 법
date: 2022-01-06
tags: [버그리포트]
publish: true
image: "./bugreport.jpg"
---

파일 형상 관리를 git을 이용해 하고 있다.  
그런데 가끔가다 브랜치 이동을 하면 몇몇 파일들이 crlf로 변환된 채로 코드상 빨간 줄을 뿜고 있는데... 이걸 파일 하나하나 바꿔주다보니 갑갑해서 일괄 수정할 수 있는 방법을 찾아냈다.

![lf](./lf.png)

1. 터미널창에 아래 명령어 수행

```js
git config core.autocrlf false
git rm --cached -r .
git reset --hard
```
