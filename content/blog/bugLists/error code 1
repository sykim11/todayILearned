---
title: npm 빌드 중 erroe code 1
date: 2022-03-14

---

npm 환경에서 빌드 중 error code 1을 맞이했다.   
원인은 개발 도중 npm 을 이용해 설치시킨 특정 라이브러리의 버전과 package.json이 맞지 않아 빌드 도중 버전 에러가 나서 생긴 문제얐다.   
노드모듈만 아무리 삭제해도 이미 남아있는 캐시를 npm이 바라보고 설치하기 때문에 캐시 자체를 날려줘야한다.   

npm cache clean --force
package-lock.json 파일 삭제
npm install 다시 해 보기
