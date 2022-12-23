---
title: 그라파나 iframe deny 에러
date: 2022-05-04
tags: [버그리포트]
publish: false
image: "./bugreport.jpg"
---

개발 환경 : 쿠버네티스에 그라파나와 웹서버인 nginx가 있고 리액트 어플리케이션 서버인 http://localhost:3000은 https://${쿠버네티스 배포용 ip}:{쿠버네티스 배포용 port}로 프록시 서버가 연결되어 있다.

이슈 : 쿠버네티스에 올라가 있는 그라파나 대시보드 화면 URL을 웹에서 iframe 태그에 삽입하니 에러가 뜬다.  
원인 : X-Frame-Options DENY 설정 때문에 iframe을 통해 접근할 수 없는 문제.  
해결 : 그라파나의 설정 파일 중 grafana.ini 파일이 있는데 거기서 `allow_embedding = true` 로 설정.

또 다른 이슈 : X-Frame-Options는 해결됐는데 이번엔 외부에서 접속할 수 있는 그라파나 주소가 필요했다. 당시엔 localhost:{port}로, 그라파나가 로컬에만 떠있는 상태.  
해결1-1 : grafana 설정에서 루트 url뒤에 /grafana/ 주소 설정하여 프록시가 읽어들일 수 있는 엔트리포인트 주기.  
해결1-1 : nginx 설정에서 /grafana/ 주소로 웹에서 요청시 쿠버네티스의 그라파나 주소로 연결되도록 프록시 설정.  
해결1-2 : 쿠버네티스에서 그라파나를 재시작할 때마다 대시보드 주소가 바뀌기 때문에 여기에 맞춰서 nginx가 바라보고 있는 그라파나 프록시 주소도 함께 업데이트가 되어야 한다. 그걸 간과하고 그라파나만 백날 올렸다 내렸다하니... 프록시가 제대로 먹힐리 없었다.

grafana.yml

```yml{numberLines: true}
root_url = %(protocol)s://%(domain)s:%(http_port)s/grafana/
serve_from_sub_path = true
```

nginx.yml

```yml{numberLines: true}
location /grafana/ {
proxy_set_header Host $http_host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_pass         http://grafana; // 상단에서 stream 설정되어 있음
}
```

또 다른 이슈 : 웹에서 프록시로 설정된 그라파나 주소가 뜨긴 뜨는데 계속 로그인창만 뜬다.  
원인 : 그라파나 자체 내에서 로그인된 사용자만 그라파나 대시보드를 보도록 리다이렉트 시키는 중.  
해결 : grafana.ini 파일에서 [auth.anonymous] `enabled = true` 로 설정하여 익명의 사용자도 해당 url에 접근 가능하도록 설정.

결론 프록시 서버에 대한 이해가 부족했다...
