---
title: 그라파나 iframe deny 에러
date: 2022-05-04

---

개발 환경 : 쿠버네티스에 그라파나와 웹서버인 nginx가 있고 리액트 어플리케이션 서버인 http://localhost:3000은 https://${쿠버네티스 배포용 ip}:{쿠버네티스 배포용 port}로 프록시 서버가 연결되어 있다.

이슈 : 쿠버네티스에 올라가 있는 그라파나 대시보드 화면 URL을 웹에서 iframe 태그에 삽입하니 에러가 뜬다.    
원인 : X-Frame-Options DENY 설정 때문에 iframe을 통해 접근할 수 없는 문제.   
해결 : 그라파나의 설정 파일 중 grafana.ini 파일이 있는데 거기서 allow_embedding = true 로 설정.

또 다른 이슈 : X-Frame-Options는 해결됐는데 이번엔 외부에서 접속할 수 있는 그라파나 주소가 필요했다. 당시엔 localhost:{port}로, 그라파나가 로컬에만 떠있는 상태.     
해결 : nginx 설정에서 /grafana/ 주소로 웹에서 요청시 쿠버네티스의 그라파나 주소로 연결되도록 프록시 설정.   

또 다른 이슈 : 웹에서 프록시로 설정된 그라파나 주소가 뜨긴 뜨는데 계속 로그인창만 뜬다.   
원인 : 그라파나 자체 내에서 로그인된 사용자만 그라파나 대시보드를 보도록 리다이렉트 시키는 중.   
해결 : grafana.ini 파일에서 [auth.anonymous] enabled = true 로 설정하여 익명의 사용자도 해당 url에 접근 가능하도록 설정.   

