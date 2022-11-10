---
title: NextJS API 공부 - 동적 페이지 서버사이드 렌더링 작업 (getStaticPaths, getStaticProps)
date: 2022-08-25
tags: [nextjs]
publish: true
---

리액트로 작업 중 서버사이드 렌더링이 필요한 페이지가 생겨 공부하기 시작한 NextJS 의 API 중 두 개만 우선 정리해 보자.  
NextJS를 활용하면 리액트만 사용했을 때보다 편리하게 정적인 사이트 생성이 가능하다.

가장 많은 예시로는 동적 파라미터를 갖고 있는 상세페이지들이 해당 예시에 적합하겠다.

예를 들어 아래와 같은 주소를 갖는 포스팅 수정 페이지가 있다고 해 보자.  
http://localhost:3000/review/edit/2

위와 같은 페이지는 10 개가 될수도 있고 100 개가 될 수 있다. 이런 경우 /edit/ 뒤에 존재하는 동적인 id 값을 nextjs 서버로부터 받아올 수 있는 함수를 사용해야 한다.

### getStaticPaths

> getStaticPaths : 동적인 데이터에 따라 미리 렌더링할 페이지의 동적인 경로를 지정하게 해 주는 함수

```ts
;/review/deit / [id].tsx

export const getStaticPaths = async () => {
  const res = await fetch("http://localhost:8000/review/list") // 포스팅 리스트들을 가져오는 백엔드 API
  const reviewList = await res.json() // 응답 결과를 json 형태로 변환
  const paths = reviewList.map((post: any) => ({
    params: { id: `${post.id}` },
  })) // json 배열 결과를 [ { params: { id: 1} }, { params: { id: 2} }, ... ] 형태로 변환
  return {
    paths,
    fallback: true,
  }
}
```

getStaticPaths 함수를 사용해 동적 페이지로 활용될 수 있는 리스트의 id 값들을 `[ { params: { id: 1} }, { params: { id: 2} }, ... ]` 형태로 paths 값에 넣어 리턴시켜준다. 이것만으로 동적 파라미터 경로 준비는 완료가 된다.

### getStaticProps

> getStaticProps : nextjs 서버에서 페이지를 빌드할 때 데이터를 패치시켜주는 함수

```ts
;/review/deit / [id].tsx

export const getStaticPaths = async () => {
  const res = await fetch("http://localhost:8000/review/list") // 포스팅 리스트들을 가져오는 백엔드 API
  const reviewList = await res.json() // 응답 결과를 json 형태로 변환
  const paths = reviewList.map((post: any) => ({
    params: { id: `${post.id}` },
  })) // json 배열 결과를 [ { params: { id: 1} }, { params: { id: 2} }, ... ] 형태로 변환
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const res = await fetch(`http://localhost:8000/review/${params.id}`) // 페이지에서 받아온 parmas의 id
  const post = await res.json()
  return {
    props: { post }, // 해당 페이지 컴포넌트에 상위 props로 주입
  }
}
```

getStaticProps 함수를 활용해 해당 페이지 경로의 params 값을 받아와서 id를 통해 적절한 API 호출을 시켜줄 수 있다.  
1번 페이지는 id = 1 데이터에 맞는 상세 api 호출, 2번 페이지는 id = 2 데이터에 맞는 상세 api 호출 등등...

위 두 개의 NextJS API 흐름을 가장 보기 쉽게 그린 그림은 아래와 같다.

![image](https://user-images.githubusercontent.com/24996316/186604363-637cd4af-75bd-4d20-8bcd-ffeebc4425ba.png)
