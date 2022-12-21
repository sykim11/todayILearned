---
title: Nextjs+Typescript+Django(feat.React-query)
date: 2022-12-20T00:00
tags: [nextjs]
publish: false
image: "."
---

Redux에서 React-query로 마이그레이션

 현재 작업 중인 사이드 프로젝트는 도메인별로 나뉘어 상태관리 도구를 이용해 개발되어있다. 그리고 비동기가 필요한 곳에서는 redux-toolkit에서 제공해 주는 createAsyncThunk 함수를 이용해 api를 호출한다.
 프로젝트의 기능이 몇 개 안 되면 리덕스만 사용해도 큰 불편함은 없겠지만 프로젝트가 점점 커지고 호출하는 api들이 늘어나는 경우 리덕스 코드 또한 불필요하게 길어질 것이다. 실제로 현업에서 이 부분이 마이그레이션 대상 코드들이고 이런 이유로 개선 중에 있다.
그런데 이 리덕스를 순수하게 상태만 관리하는 역할로 개선할 수 있는 방법을 찾게 되었다!

#React-Query

나는 React-Query를 아래와 같은 이유로 적용했다.
1. fetching, updating을 위한 비동기 API로 활용해 리덕스에서 api 호출부 제거
2. 동일한 데이터에 대한 중복 요청을 제거하고 한 번만 요청해 api 리소스 절약
3. 데이터에 변경점이 있는 경우에 클라이언트단을 리렌더링
4. 서버의 상태에 의존하는 상태들은 서버에서 가져오는 방식으로 변경

#React-Query 비동기 동작 방식
<이미지>
React-Query는 크게 다섯 가지의 상태를 유지한다.
Fetch : 초기 상태로 백엔드로부터 api를 호출하는 동작을 의미한다
Fresh : Fetch가 완료되면 클라이언트단과 서버단의 데이터가 동일하게 유지되는 상태를 의미한다.
Stale : Fresh 이후의 데이터로 오래된 데이터 상태를 의미한다.
Inactive : Fetch에서 받아온 서버 상태들 중 클라이언트단에서 사용하고 있지 않은 데이터의 상태를 의미한다. 이 데이터들은 React-Query가 브라우저 캐시를 관리하는 가비지 컬렉터를 이용해 삭제한다.
Deleted : Inactive 상태의 데이터가 캐시에서 삭제된 상태를 의미한다.

#React-Query 세팅
> index.tsx
```
import { QueryClient, QueryClientProvider } from "react-query";
...

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

구동할 App을 QueryClientProvider로 감싼 뒤 props에 QueryClient 클래스의 인스턴스를 전달한다.

QueryClient 클래스 소스를 열어보면 Cache 값을 담는 변수들과 앞서 말한 다섯가지 상태들에 관여하는 메서드들이 존재하는데 이 중 isFetching 메서드를 통해 동작 방식을 유추해 보았다.

isFetching 메서드는 queryKey라는 것과 filters를 인자로 받는다. 
- queryKey 
string 혹은 배열로 지정되고 이 queryKey를 React-Query가 생성된 쿼리들 중 해당 키값을 갖는 쿼리가 어떤 쿼리인지 판단할 수 있는 식별자 역할을 한다.
- filters 
queryKey 값을 갖는 쿼리가 정확히 매칭되는지 판단을 하고,
queryKey 값을 갖는 쿼리의 fetching값이 true라면 fetching 쿼리에 넣어주는 역할,
queryKey 값을 갖는 쿼리의 acitve 값이 true라면 acitve 쿼리에 넣어주는 역할, 
queryKey 값을 갖는 쿼리의 inactive 값이 true라면 inactive 쿼리에 넣어주는 역할, 
queryKey 값을 갖는 쿼리의 stale 값이 true라면 state 쿼리에 넣어주는 역할을 한다.

isFetching 메서드 외에도 queryKey 값을 이용해 패칭된 쿼리 데이터를 가져오는 메서드, 쿼리 데이터를 세팅해 주는 메서드, 쿼리를 삭제하거나 취소하는 메서드, 유효하지 않은 쿼리로 설정하는 메서드 등 아주 많은데 이 모든 메서드들은 queryKey 값을 이용한다는 공통점이 있다.

#리덕스에서 useQuery로 호출부를 분리하기

> companies.tsx
before
```
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

after
```
import { useQuery } from "react-query";

  const { data, isLoading, refetch } = useQuery<
    IGetCompaniesRes,
    IErrorResponse
  >([KEY_COMPANY_LIST], () =>
    apis.companiesApi.list({ limit, page })
  );
```
useEffect를 지우고 페이지 컴포넌트 내부에 useQuery 함수를 불러왔다.
useQuery 함수는 아래와 같이 생겼다.

function useQuery(queryKey, queryFn, options): UseQueryResult;

첫번째 인자에 사용자 지정 queryKey를 넣어주고 두번째 인자에 api를 불러오는 함수를 넣어준다. 세번째 인자는 쿼리를 불러올 때 옵션을 설정해 줄 수 있는데 QueryObserverOptions 인터페이스 타입으로 조회가 가능하다. useQuery 함수로 호출한 결과 값은 아래와 같다.

UseQueryResult 
    data: api 호출 성공 시 성공 응답 결과
    error: api 호출 실패 시 실패 응답 결과
    isError: api 호출 실패 시 서버 데이터 상태값 (디폴트값 : false)
    isSuccess: api 호출 성공 시 서버 데이터 상태값 (디폴트값 : false)
    isIdle: 쿼리가 fetch되기 시작할 때 쿼리 상태값(디폴트값 : true, 조건 : 쿼리 옵션 enabled: true)
    isLoading: api 호출 성공 로딩 시 서버 데이터 상태값 (디폴트값 : false)
    isLoadingError: api 호출 실패 로딩 시 서버 데이터 상태값 (디폴트값 : false)
    isRefetchError: api 재호출 실패 시 서버 데이터 상태값 (디폴트값 : false, 조건 : 쿼리 옵션 enabled: false)
    status: 쿼리 상태값 (디폴트값 : isIdle)


> 리덕스 썽크 호출부
before
```
export const getList = createAsyncThunk("company/getList", async (data) => {
  const result = await apis.companyApi.getList(data);
  return result.data;
});
```
after (삭제)

서버 데이터는 React-Query를 이용하므로 더이상 리덕스 썽크 호출부는 필요없어졌다.

> api 호출부

before
```
  list(data) {
    return socialApiClient.get(
      `/company/list?limit=${data.limit || 30}&page=${data.page || 1}`
    );
  },
```
after
```
  async getList(data) {
    try {
      const res = await socialApiClient?.get(
        `/filetracker/Filetotal?limit=${data.limit || 30}&page=${
          data.page || 1
        }`
      );
      return res?.data;
    } catch {
      return {
        message: "리스트를 불러올 수 없습니다",
      };
    }
  },
```
호출부는 결과값을 전달하는 역할만 한다. 성공시 서버 데이터를, 실패시 실패한 메세지가 담긴 데이터를 전달하도록 변경했다.



#useQuery 데이터가 클라이언트데 적용되는 시기

쿼리를 불러오는 시기는 페이지 컴포넌트가 새로 만들어질 때 호출되고 페이지 컴포넌트가 리턴되어 UI를 그려줄 때 해당 데이터가 반영된다. (클래스형 컴포넌트로 예시를 들면 constructor() 단계에서 쿼리 호출, render() 함수에서 데이터 반영)

```
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

useQuery로 불러온 데이터는 더이상 클라이언트 생명주기에 의존하지 않기 때문에 componentDidMount 생명주기에서 해당 서버 데이터를 읽어올 수 없다. 추가적인 클라이언트단 기능 개발을 위해 useEffect와 같은 클라이언트 생명주기에서 데이터를 읽어오려면 아래와 같이 의존성 데이터를 추가해 접근이 가능하다.

```
  useEffect(() => {
    console.log("data?", data); // { ... }
  }, [isLoading]);
```


# 정리

컴포넌트에 Query관련 로직을 직접 사용한다면 앱이 커질 경우 개별 컴포넌트에 숨겨져 있을 수 있는 비동기 요청을 잘 못찾는 경우도 생길 수 있을 것 같다. 커스텀 훅으로 여러 query 호출을 분류해 묶어서 관리한다던지 등의 방법으로 비즈니스 로직을 UI로직과 분리하기 위해 팀에서 React Query를 어떻게 사용해야 할지에 대한 이야기를 꼭 해야하지 않을까 싶다.
