---
title: nginx 500 permission error
date: 2022-01-25
tags: []
publish: false
---

### 현상

nginx로 웹서버를 열었더니 500 에러가 뜬다.

### 해결

```
ls -l
```

index.html 권한 확인을 해보니 파일 권한이 ksy로 되어있었다.

/etc/nginx/nginx.conf 파일을 열고  
첫 줄의 루트 정보를 ksy로 변경

```
user ksy
```

nginx 재시작하면 웹서버가 정상 동작한다!

```
sudo systemctl restart nginx
```
