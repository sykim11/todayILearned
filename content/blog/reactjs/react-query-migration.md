---
title: Redux에서 React-Query로 마이그레이션
date: 2022-12-22T00:00
tags: [react-query, reactjs]
publish: true
image: "./reactjs.jpg"
---

현재 작업 중인 사이드 프로젝트는 도메인별로 나뉘어 상태관리 도구를 이용해 개발되어있다. 그리고 비동기가 필요한 곳에서는 `redux-toolkit`에서 제공해 주는 `createAsyncThunk` 함수를 이용해 api를 호출한다.
프로젝트의 기능이 몇 개 안 되면 리덕스만 사용해도 큰 불편함은 없겠지만 프로젝트가 점점 커지고 호출하는 api들이 늘어나는 경우 리덕스 코드 또한 불필요하게 길어질 것이다. 실제로 현업에서 이 부분이 마이그레이션 대상 코드들이고 코드량을 줄이고자하는 이유로 개선 중에 있다.  
그런데 이 리덕스를 순수하게 상태만 관리하는 역할로 개선할 수 있는 방법을 찾게 되었다!

## 1. React-Query 적용 이유

나는 React-Query를 아래와 같은 이유로 적용했다.

1. fetching, updating을 위한 비동기 API로 활용해 리덕스에서 api 호출부 제거
2. 동일한 데이터에 대한 중복 요청을 제거하고 한 번만 요청해 api 리소스 절약
3. 데이터에 변경점이 있는 경우에만 클라이언트단을 리렌더링
4. 서버의 상태에 의존하는 상태들은 서버에서 가져오는 방식으로 변경

## 2. React-Query 동작 방식

React-Query는 앱상에서 어떻게 동작할까?  
공식문서와 설치 과정에서 알아낸 것들을 정리해 보았다.

> 📢 React-Query는 "전역 상태"를 건드리지 않고 React 및 React Native 애플리케이션에서 데이터를 가져오고 캐시하고 업데이트합니다. [공식문서](https://react-query-v3.tanstack.com/overview)

React-Query는 크게 다섯 가지의 상태를 유지하며 동작한다.

**Fetch** : 초기 상태로 백엔드로부터 api를 호출하는 상태  
**Fresh** : Fetch가 완료되면 클라이언트단과 서버단의 데이터가 동일하게 유지되는 상태  
**Stale** : Fresh 이후의 데이터로 오래된 데이터라는 상태.  
**Inactive** : Fetch에서 받아온 서버 상태들 중 클라이언트단에서 사용하고 있지 않은 데이터의 상태로, 이 데이터들은 가비지 컬렉터를 이용해 삭제된다. (자바스크립트는 객체가 생성되었을 때 자동으로 메모리를 할당하고 더 이상 필요하지 않을 때 자동으로 해제함)  
**Deleted** : Inactive 상태의 데이터가 캐시에서 삭제된 상태

웹상에서 서버를 호출할 때 필요한 몇 가지 상태를 나눠놓고 리턴시켜 개발자가 호출에 관련된 복잡한 예외케이스를 핸들링하지 않아도 되게끔 도와주는 라이브러리 같다는 느낌을 받았다.  
리액트에서 호출에 관련된 상태값을 처리할 때 고민해야될 사항들이 아래와 같다면

'캐싱 처리해야지... (이미지와 같은 정적 리소스를 제외하고 브라우저에게 맡기는 편...)'  
'동일한 데이터를 연속 호출할 때 단일 요청으로 중복 제거해야지...'  
'데이터 갱신해줄 시간이 됐네? 업데이트해야지... (근데 마구 쓰긴 또 무섭다 setInterval)'  
'오래된 데이터는 파기해 줘야하니 시작 시간 알아내야지... (구찮은 로컬스토리지 관리)'  
'호출 로딩 오래걸리면 로딩 상태값 또 따로 만들어줘야지...'  
'로딩 끝났어? 이제 성공인지 실패인지 또 거기에 따른 분기 작업해줘야지...'

이런 복잡다산한 주변머리들을 React-Query가 서버를 상태화시켜 프론트에게 내려준다.

직접 설치해 보며 React-Query가 어떤식으로 동작하는지 알아보자.

```tsx{numberLines: true}
import { QueryClient, QueryClientProvider } from "react-query";
...

const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
    <ReactQueryDevtools />
  </QueryClientProvider>,
  document.getElementById("root")
);
```

공식문서에 따르면 React-Query를 사용하기 위해선 리액트 프로젝트의 root에 해당하는 파일을 `QueryClientProvider`라는 객체로 감싼 뒤 props에 `QueryClient라는 클래스의 인스턴스`를 전달해야한다고 한다.  
`QueryClient` 객체를 앱에 주입시켜야 root 하위에 있는 자식 컴포넌트에서 쿼리로 api를 호출할 수 있고, 앞서 말한 서버 상태를 가질 수 있게 된다.

> Nextjs 프로젝트에서는 서버사이드렌더링 처리를 하는 페이지에서 `QueryClient`를 다시 불러오는 경우도 있는데 이렇게 되면 새로운 `QueryClient` 객체가 생기게 되므로 이전에 캐싱시켜둔 쿼리들을 기억하지 못하게 된다. 다행히 React-Query는 서버사이드렌더링도 지원하므로 루트에서 만든 `QueryClient` 객체를 각 페이지마다 이전 쿼리도 hydrate 시킬 수 있는 기능을 제공해 주고 있다.
> [Nextjs에서 React-Query 사용법](https://react-query-v3.tanstack.com/guides/ssr)

`QueryClient` 클래스 타입을 열어보면 Cache 값을 담는 변수들과 앞서 말한 다섯가지 상태들에 관여하는 메서드들이 존재하는데 이 중 `isFetching` 메서드를 통해 동작 방식을 유추해 보았다.

`isFetching` 메서드는 **queryKey** 라는 것과 **filters**를 인자로 받는다.

```ts{numberLines: true}
// queryClient.d.ts

isFetching(queryKey?: QueryKey, filters?: QueryFilters): number;
```

**_queryKey_**  
string 혹은 배열로 지정되고 이 queryKey를 React-Query가 생성된 쿼리들 중 해당 키값을 갖는 쿼리가 어떤 쿼리인지 판단할 수 있는 식별자 역할을 한다.

**_filters_**  
queryKey 값을 갖는 쿼리가 정확히 매칭되는지 판단을 하고,  
queryKey 값을 갖는 쿼리의 fetching값이 true라면 fetching 쿼리에 넣어주는 역할,  
queryKey 값을 갖는 쿼리의 acitve 값이 true라면 acitve 쿼리에 넣어주는 역할,  
queryKey 값을 갖는 쿼리의 inactive 값이 true라면 inactive 쿼리에 넣어주는 역할,  
queryKey 값을 갖는 쿼리의 stale 값이 true라면 state 쿼리에 넣어주는 역할을 한다.

`isFetching` 메서드 외에도 **queryKey** 값을 이용해 패칭된 쿼리 데이터를 가져오는 메서드, 쿼리 데이터를 세팅해 주는 메서드, 쿼리를 삭제하거나 취소하는 메서드, 유효하지 않은 쿼리로 설정하는 메서드 등 아주 많은데 이 모든 메서드들은 **queryKey** 값을 이용한다는 공통점이 있다. 말그대로 React-Query에서 쿼리를 관리하는 키 역할인 셈이다.

## 3. 리덕스에서 useQuery로 호출부를 분리하기

**queryKey**를 이용해 쿼리로 api를 호출하는 방식은 크게 두 가지이다.  
데이터를 가져올 때 사용하는 `useQuery` 메서드  
데이터를 업데이트할 때 사용하는 `useMutation` 메서드

```tsx{numberLines: true}
// before
// companies.tsx

...

  useEffect(() => {
    let pageNumber = 1;
    dispatch(
      companiesActions.getList({
        limit: perPage,
        page: _Pagination.currentPage,
      })
    );
  }, []);
```

업체 리스트를 전역 상태로 불러오는 코드이다.
useEffect 함수를 사용해 해당 컴포넌트 페이지가 마운트되면 useEffect 내부 소스가 동작하고 업체 리스트를 가져오는 액션이 dispatch 되어 전역 상태에 호출된 데이터 리스트들이 담긴다.  
소스의 일부만을 가져와서 코드가 짧은데 이 코드를 사용하기 위해선 비동기 호출을 도와주는 Thunk 코드를 작성해야하고 호출 전후에 대한 상태값을 리듀서에 기재해 줘야한다. 그리고 전역에 담긴 호출 결과 데이터를 불러오기 위해 useSelector 함수도 필요하고 액션을 호출하기 위해 useDispatch 함수도 불러와야한다.

```tsx{numberLines: true}
// after
// companies.tsx

import { useQuery } from "react-query";

  const { data, isLoading, refetch } = useQuery<
    IGetCompaniesRes,
    IErrorResponse
  >([KEY_COMPANY_LIST], () =>
    apis.companiesApi.list({ limit, page })
  );
```

useEffect를 지우고 페이지 컴포넌트 내부에 `useQuery` 함수를 불러왔다. 프론트에서 사용할 비동기 데이터 호출은 정말... 이게 끝이다.  
`useQuery` 함수는 아래와 같이 생겼다.

```ts{numberLines: true}
// useQuery.d.ts
function useQuery(queryKey, queryFn, options): UseQueryResult;
```

**첫번째 인자에 사용자 지정 queryKey**를 넣어주고 **두번째 인자에 api를 불러오는 함수**를 넣어준다. **세번째 인자는 쿼리를 불러올 때 옵션**을 설정해 줄 수 있는데 QueryObserverOptions 인터페이스 타입으로 조회가 가능하다. `useQuery` 함수로 호출한 결과 값은 아래와 같다.

**UseQueryResult**  
data: api 호출 성공 시 성공 응답 결과  
error: api 호출 실패 시 실패 응답 결과  
isError: api 호출 실패 시 서버 데이터 상태값 (디폴트값 : false)  
isSuccess: api 호출 성공 시 서버 데이터 상태값 (디폴트값 : false)  
isLoading: api 호출 성공 로딩 시 서버 데이터 상태값 (디폴트값 : false)  
isLoadingError: api 호출 실패 로딩 시 서버 데이터 상태값 (디폴트값 : false)  
isRefetchError: api 재호출 실패 시 서버 데이터 상태값 (디폴트값 : false, 조건 : 쿼리 옵션 enabled: false)  
isIdle: 쿼리가 fetch되기 시작할 때 쿼리 상태값(디폴트값 : true, 조건 : 쿼리 옵션 enabled: true)  
status: 쿼리 상태값 (디폴트값 : isIdle)

```tsx{numberLines: true}
// before
// 리덕스 썽크 호출부

export const getList = createAsyncThunk("company/getList", async (data) => {
  const result = await apis.companyApi.getList(data);
  return result.data;
});
```

```tsx{numberLines: true}
// after
// 리덕스 썽크 호출부 (삭제)


```

서버 데이터는 React-Query를 이용하므로 더이상 리덕스 썽크 호출부는 필요없어졌다.

```tsx{numberLines: true}
// before
// api 호출부

list(data) {
  return socialApiClient.get(
    `/company/list?limit=${data.limit || 30}&page=${data.page || 1}`
  );
},
```

```tsx{numberLines: true}
// after
// api 호출부

async getList(data) {
  const res = await socialApiClient?.get(
    `/filetracker/Filetotal?limit=${data.limit || 30}&page=${
      data.page || 1
    }`
  );
  return res.data;
},
```

호출부는 호출 결과값을 전달하는 역할만 한다. 크게 달라진 부분은 없고 모든 호출의 결과에 대한 타입 지정을 동일하게 맞추고 싶어서 리턴값으로 호출의 data만 넘겨줬다.

## 4. useQuery 데이터가 클라이언트단에 적용되는 시기

쿼리를 불러오는 시기는 페이지 컴포넌트가 새로 만들어질 때 호출되고 페이지 컴포넌트가 리턴되어 UI를 그려줄 때 해당 데이터가 반영된다. (클래스형 컴포넌트로 예시를 들면 constructor() 단계에서 쿼리 호출, render() 함수에서 데이터 반영)

```tsx{numberLines: true}
const { data, isLoading, refetch } = useQuery<
  IGetCompaniesRes,
  IErrorResponse
>([KEY_COMPANY_LIST], () =>
  apis.companiesApi.list({ limit, page })
);

useEffect(() => {
  console.log("data?", data); // undefined
}, []);
```

`useQuery`로 불러온 데이터는 더이상 클라이언트 생명주기에 의존하지 않기 때문에 componentDidMount 생명주기에서 해당 서버 데이터를 읽어올 수 없다. 추가적인 클라이언트단 기능 개발을 위해 useEffect와 같은 클라이언트 생명주기에서 데이터를 읽어오려면 아래와 같이 의존성 데이터를 추가해 접근이 가능하다.  
여기서 isLoading은 `useQuery`의 서버 상태값이다.

```tsx{numberLines: true}
useEffect(() => {
  console.log("data?", data); // { ... }
}, [isLoading]);
```

## 5. 요약

- React-Query를 이용해 Redux를 순수한 상태관리자로 만들 수 있다.
- 서버의 상태와 클라이언트 상태를 분리해 관리할 수 있으면서도 프론트-백 데이터 동기화가 간편하게 이루어진다.
- 간단한 옵션 추가로 네트워크 호출 제어가 가능하다.
- Redux에서 호출부를 떼어내는 과정 또한 오래 걸리지 않는다. (단기간에 마이그레이션 계획이 있다면 시도해 볼만 하다)

다만 우려가 되는 점도 발견했다.  
 위 예시와 같이 컴포넌트에 Query 관련 로직을 직접 사용하는 경우 작은 프로젝트일 때는 어디에 어떤 호출을 했는지 기억할 수 있지만 규모가 큰 프로젝트에서는 중복 소스가 발생할 수 있고 옵션값이 enable:false가 아닌 이상 원치 않는 호출이 부모 자식 컴포넌트간에 발생할 수 있을 것 같다.  
 리덕스 폴더를 따로 만들어 관리했던 것처럼 useQuery 관련 훅 폴더를 따로 만들어 도메인별로 묶어서 관리하는 방향을 찾아보자.
