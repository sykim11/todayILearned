---
title: NextJS로 마이그레이션하기 - 개념
date: 2022-11-17
tags: [nextjs]
publish: true
image: "./nextjs.jpg"
---

기존에 개발된 프로젝트들이 모두 CRA(Create React App)를 이용한 리액트 라이브러리로 이루어져있고 배포를 위한 빌드 단계에서 긴 시간을 잡아먹는 게 불편하다는 생각이 들었다. 그래서 빌드 툴만 바꿀 생각으로 이런 저런 내용들을 찾아보았는데... 결국 NextJS로 다시 돌아왔다. 리액트 api들을 그대로 쓸 수 있다는 점에서 마이그레이션 기간이 짧을 것 같았고 (& 거대한 커뮤니티 = 물어볼 슨생님들이 많아보였다) NextJS 의 컴파일러가 SWC라는 점에서 채택을 하게 됐다. (*추후에 SWC로도 개발을 해 보고 SWC 도입 전후 웹앱 속도가 얼마나 빠른지 느껴보고 싶지만 우선은 조금 더 진입장벽이 낮아보이는 NextJS를 선택)   
현재까지 나온 NextJS의 버전은 13이고 버전 12부터 SWC 라는 컴파일러를 사용한다고 한다. (*SWC는 웹을 위해 나온 러스트 기반의 플랫폼이다)   

### NextJS란
> 리액트 라이브러리 + express + react-router-dom + ssr   

한 줄로 설명하자면 이렇게 되겠다. 정확히 expressjs, reac-router-dom을 가져다 쓰고 있다는 의미가 아닌, express의 기능을 갖추고 있고 리액트 프로젝트로 구성을 할 때 매번 따로 설치해줘야했던 라우터 설정이 이미 포함되어있다는 의미로 이렇게 표현한다.   

#### 단일 페이지 개발 기능
NextJS의 베이스에는 리액트 라이브러리가 존재한다. 즉, 리액트에서 사용하던 useEffect, useState 등 리액트에서 유용하게 활용하던 api 함수들을 모두 가져다 쓸 수 있다는 말이다. NextJS는 SPA 형식으로 웹 개발이 가능하고 NextJS에서 제공해 주는 api들을 통해 특정 페이지 범위, 혹은 전역 범위에서 서버사이드렌더링 개발이 별다른 설치 없이 이루어지도록 만들어진 프레임워크이다.   

#### 자체 API 기능
NextJS에서 express에 해당하는 기능으로는 웹 api 기능을 자체적으로 지원하는 부분에서 유사하다.      
NextJS를 처음 설치를 하고 폴더를 확인해 보면 pages/api/* 하위 경로에 아래와 같은 소스가 보인다.   
```js{numberLines: true}
export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
```
위 파일의 이름이 hello.js라면 브라우저에 http://localhost:3000/api/hello 접속 시, 일반 웹 화면이 아닌 json 결과 값이 보인다. NextJS 문서에 따르면 /page/api/* 하위에 해당하는 파일들은 서버 측 전용 번들에 포함되므로 클라이언트 측 번들 크기를 늘리지 않는다고 한다. 이 기능을 본 프로젝트(리액트 프로젝트)를 마이그레이션할 때 사용할 것 같지는 않지만 일단 지금은 이런 기능이 있구나 하고 넘어가자.   

#### 페이지 단위 라우팅 기능
package.json 과 같은 경로에서 npm run build 명령어로 NextJS 프레임워크를 빌드해 보면 .next 폴더가 생긴다. 그리고 이 폴더의 내부를 살펴보면 /static 하위에 페이지별로 js 파일들이 나뉘어서 들어가있는 걸 확인할 수 있다.   
페이지 별로 uri를 라우팅시키는 개발 방식 또한 굉장히 간단하다.   
http://localhost:3000/main -> /page/main/index.ts   
http://localhost:3000/detail/1 (동적 페이지) -> /page/detail/[id].ts


#### 서버사이드렌더링
NextJS를 도입하는 대부분의 이유 중 하나가 SSR 개발 기능이 무척 편하다는 점이다. 관련 글들을 SSR, SSG, CSR 요 세 개의 단어가 마치 한 세트처럼 같이 비교 설명되어 있는 글들이 많아서 간단하게 각각의 차이가 뭔지 알아보았다.    

SSG(Static Site Generation)   
NextJS에서 사용하는 pre-render 방식이다. 특징으로는 **빌드 시에 html이 생성되고 매 요청마다 html을 만들어주는 것이 아니라 재사용한다.** 관련된NextJS API로는 `getStaticProps`, `getStaticPaths`가 있다. 지금 보고 있는 블로그는 정적 페이지 생성기로 사용되는 gatsby를 이용해 개발되었는데 gatsby가 아마 SSG에 해당되지 않을까?   

SSR(Server Side Rendering)   
NextJS에서 사용하는 pre-render 방식이다. 리액트와 같은 SPA 웹앱이 나오기 전 옛날 사이트들은 대부분 SSR 형식으로 이루어져있다고 알고 있다. SSR은 **매 요청마다 HTML을 생성한다**     
> 브라우저가 렌더링 과정 한 줄 👉 서버로부터 완성된 html을 받아 브라우저가 html 돔트리, CCS 돔트리를 결합해 화면에 배치시키는 Render 트리를 만들어 주고, 페인팅 과정을 거쳐 사용자 눈에 완성된 페이지가 보인다. 이후 자바스크립트가 실행되면서 동적인 기능이 등록되는데 이때는 이미 ui는 완성된 상태이다.

CSR(Client Side Rendering)   
NextJS에서 사용하는 SPA 방식이다. 처음에 웹 서버에 요청을 할 때 몽땅 빈 HTML을 받아온다. 이후에 브라우저 단에서 렌더링을 위한 자바스크립트 코드가 실행되어 동적으로 html 태그들과 스타일을 생성해 완성된 페이지를 채워준다. 첫 화면 로딩 때 빈 html을 받는 것 말고 페이지 렌더링을 위한 별도의 HTTP 통신이 필요없고 이후 사용자의 동작에 따라 Ajax를 통해 필요한 데이터만 주고 받으며 웹앱이 동작한다. 웹 서버에 처음 요청할 때 몽땅 빈 HTML이기 때문에 SEO(Search Engine Optimization) 이슈가 생긴다. 웹 크롤러들은 웹 사이트의 html을 읽어서 이게 어떤 페이지구나 파악을 하는데 리액트로 개발된 사이트를 크롤러가 가져갔을 땐 빈 html만 결과값으로 나오기 때문에 검색에 빈번하게 노출되어야하는 페이지인 경우 따로 SSR 처리를 해줘야한다. 그리고 바로 이 부분이 NextJS에서 쉽게 작업이 된다는 점이다.

> 브라우저가 렌더링 과정 한 줄 👉 서버로부터 빈 html을 받아 브라우저가 html 돔트리, CCS 돔트리를 결합해 화면에 배치시키는 Render 트리를 만들어 주고, 페인팅 과정을 거쳐 사용자 눈에 완성된 페이지가 보인다. 이후 자바스크립트(리액트.js)가 실제 돔의 구조를 분석해 실행되는데 이 자바스크립트 안에서 ui를 완성시키는 코드들이 동적으로 생성되고 동적인 기능도 함께 등록된다.

### root html이 없는 nextjs
NextJS를 빌드한 결과물은 다음과 같다.   
![image](https://user-images.githubusercontent.com/24996316/202131938-87e20156-8380-484e-8338-093227c268e7.png)   
ReactJS를 빌드했던 결과물과 비교했을 때 가장 어색한 부분은 아마 root(뼈대 html)에 해당하는 html 파일이 없다는 것이다.   
![image](https://user-images.githubusercontent.com/24996316/202132315-c0ef4078-55fb-40de-8b2f-0b178abbe68d.png)   
NextJS에서 뼈대 html에 해당하는 파일은 _app.tsx 파일이 역할을 하는데 나는 이 말에도 구현 방식이 확 닿지 않아서 express를 살펴보니 아하... 싶은 개념이 떠올랐다. 잠깐 express 기반의 웹 구동 방식을 살펴보면 얼핏 유사하다. express 모듈을 설치하고 app.js 파일을 아래와 같이 기재 후 node app.js로 실행을 하면   
```js
var express = requeire('express') // node_modules에 있는 express 관련 파일 임포트
var app = express() // express 함수의 결과값을 app으로 지정
app.listen(3000, function() {}) // 3000 포트로 서버 열기

app.get('/', function(req, res) { // "/" 라우트로 접속 시 작성된 태그를 반환하여 브라우저에 노출
  res.send("<h1>i am root content</h1>")
})
```
이렇게 뿅... 내가 접근한 라우팅 페이지에 들어가면 작성했던 html 태그가 반환되어 정상적인 페이지를 그려준다. 정적 페이지 정도는 js 모듈들만으로도 만들어지는 신기한 세상...   
![image](https://user-images.githubusercontent.com/24996316/202136308-1b88e877-5840-4941-bbcb-40d2051f2159.png)   


간단하게 NextJS가 뭔지 어떤 기능을 활용할 수 있는지 알아보았다.   
다음 작업은 NextJS, NGINX를 도커라이징하여 배포를 준비해 보자.   






