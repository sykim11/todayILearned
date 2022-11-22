---
title: Javascript 작동 원리 1
date: 2022-11-21
tags: ["javascript"]
publish: false
image: "./javascript.jpg"
---

새로운 프레임워크가 유난히 빠르게 등장하는 프론트엔드 영역이지만 코어에는 여전히 자바스크립트가 있고 이에 대한 학습이 부족하다는 생각이 들어 짬이 난 김에 공부한 내용을 글로, 그림으로 정리해 보려고 한다.    
자바스크립트는 객체 기반의 프로그래밍을 가능하게 해 주는 언어로 주로 웹 브라우저에서 사용이 되고 NodeJS와 같은 자바스크립트 런타임 환경에서도 활용이 가능하다. 자바스크립트를 구동할 수 있는 가장 대중적인 자바스크립트 엔진으로 V8이 있는데 이 엔진은 구글 크롬, NodeJS에서 사용 중이다.   
자바스크립트 코드 동작의 근간이 되는 곳부터 시작하기 위해 실행 컨텍스트와 콜스택부터 이해해보자.

![실행컨택스트](https://user-images.githubusercontent.com/24996316/203189007-b73a4104-7b20-4d44-868a-87b6dee62901.png)

***
자바스크립트 엔진 = 콜스택 + 메모리로 이루어져있다
***

## 실행 컨텍스트

![Frame 33](https://user-images.githubusercontent.com/24996316/203189541-2bfe5764-88bd-42ab-8814-abdae71c9ae0.jpg)


> 💡 자바스크립트 코드가 진행되는 상황을 추적하는데 필요한 정보를 모아둔 영역으로 자바스크립트 엔진의 메모리에 필요한 정보들이 할당된다   

동작의 개념을 이해하기 위해 크게 두 영역이 있음을 기억하자.   
코드를 실행시키는 **실행 컨텍스트 영역**   
코드 실행을 위해 저장되는 **메모리 영역**   

```js{numberLines: true}

function sum(a, b) {
    let result = a + b;
    return result;
}

let number = sum(1,2);

```

위 코드가 실제로는 어떤 과정을 거쳐 numer 변수 3이 할당되는 걸까.   
 
![Group 7](https://user-images.githubusercontent.com/24996316/203006199-a0310b46-e42d-450b-8631-50ce30686340.png)

자바스크립트(이하 js)는 우선 전역 메모리에 sum이라는 이름을 가진 함수 정보와 numer라는 변수를 등록시킨다.   
  

![Group 9](https://user-images.githubusercontent.com/24996316/203006312-553d6baf-cf0a-4ddd-bb18-11ea6bf48743.png)

함수 sum(1, 2)의 호출을 통해 전역 실행 컨텍스트에서 sum 함수 실행 컨텍스트가 실행된다. 이 실행 컨텍스트도 위 그림 도식과 마찬가지로 컨텍스트 영역과 메모리 영역(이하 지역 메모리 영역)을 생성한다. 이 지역 메모리 영역에서는 함수가 받은 매개 변수와 연산값을 담을 result 변수를 등록시킨다. 다시 sum 함수 실행 컨택스트로 돌아와서 함수 내부 연산을 실행하면 result에 3이라는 값이 할당된다.   

![Group 10](https://user-images.githubusercontent.com/24996316/203008449-c5fd724d-7e95-4dc8-bab5-7494706e2ab8.png)

그리고 이 result 값을 함수가 반환하면 전역 메모리 변수인 number에 3이 할당된다.   

![Group 11](https://user-images.githubusercontent.com/24996316/203007793-a1df4016-f966-4b94-beec-76a08e1f69d0.png)

sum 함수가 종료되면 실행 컨텍스트에서 sum 함수 실행 컨텍스트가 사라진다.   


## 콜스택
> 💡 엔진은 콜스택을 통해 현재 실행 중인 실행 컨텍스트가 어떤 것인지 알 수 있다. (aka. 실행 컨텍스트 추적기)   

![Frame 35](https://user-images.githubusercontent.com/24996316/203189789-bccea3c1-5561-4c35-afc0-7359b4b21051.png)

비커처럼 생긴 콜스택이라는 구조체 바닥에 전역 컨텍스트가 있다고 가정하고 다시 다른 예시 코드를 보며 이해해 보자.   

```js{numberLines: true}

function sum(c, d) {
    let sumResult = c + d;
    return sumResult;
}

function calc(a, b, exterFn) {
    let calcResult = exterFn(a,b);
    return calcResult;
}

let number = calc(1,2, sum);

```

![Frame 48 (2)](https://user-images.githubusercontent.com/24996316/203241814-9deeff15-6b1f-4650-8604-67f17cc92655.png)

1. 해당 코드가 자바스크립트로 실행되면 전역 메모리에 sum 함수, calc 함수, number 변수가 등록된다.   
2. 그리고 calc () 호출을 통해 전역 실행 컨텍스트 내부에 calc 함수 실행 컨텍스트가 생성된다. 이때 calc 함수 실행 컨텍스트가 콜스택에 쌓인다.   
3. calc 함수 실행컨텍스트가 만들어질 때 해당 함수와 관련된 정보가 등록된 함수 및 변수들(a, b, exterFn)이 지역 메모리 안에 등록되는데 이때 exterFn 변수는 전역 메모리에 등록된 sum 함수 정보가 연결된다. 
4. 이후 exterFn 함수가 호출되면서 exterFn 함수 실행 컨텍스트가 콜스택에 쌓인다.    


![Frame 49](https://user-images.githubusercontent.com/24996316/203241781-08463a46-5c25-4869-8c96-6cb8ef2c5853.png)

이렇게 콜스택에 쌓여 대기 중인 실행 컨텍스트를 자바스크립트 엔진이 콜스택을 보고 위에서부터 차례로 실행하기 시작한다.   

1. sum 함수 내부 코드 연산을 통해 sumResult에 3이라는 값이 sum 함수 지역 메모리에 할당되고, sumResult가 반환되면서 calc 메모리의 calcResult 변수에 그 값이 할당된다.   
2. sum 함수가 반환됐기 때문에 여기에 연결되었던 exterFn 함수 실행 컨텍스트가 종료되며 콜스택에서도 삭제된다.   
3. 같은 원리로 calc 함수에서 calcResult 값이 반환되어 전역 메모리의 number 변수에 할당된다.   
4. calc 함수가 반환됐기 때문에 calc 함수 실행 컨텍스트가 종료되며 콜스택에서도 삭제된다.   


계속해서 나오는 전역 메모리, 지역 메모리에 변수라는 것이 등록되는데 자바스크립트 동작을 이해하기 위해서는 이 변수에 대해서도 조금 더 알아볼 필요가 있겠다.   


### var, let, const 그리고 스코프

![Frame 40](https://user-images.githubusercontent.com/24996316/203207706-c3a6854c-026e-4b83-a9a5-2e32f12e45ea.png)

자바스크립트 안에서 변수 선언은 세 키워드를 통해 가능하다.   
var, let, const   

ECMAScript6가 나오기 전까지는 var 키워드를 이용해서만 변수 할당이 가능했다. 다만 var 키워드가 가진 문제가 몇 가지 있는데 이를 보완하기 위해 let, const가 나왔다. 그리고 이 둘의 뚜렷한 차이점에 바로 스코프(어디까지 유효 범위를 가지는지)가 있다.   

> var 키워드 특징
> 1. 함수 레벨의 범위를 갖는다 (= 함수 이외에 선언된 변수들은 전역 변수로 남발될 가능성이 높다)
> 2. 키워드 생략 허용이 된다 (= 암묵적인 전역 변수 생성 가능성이 높다)
> 3. 변수 중복 선언 허용 (= 개발자가 의도하지 않은 변수 변경 가능성이 높다)
> 4. 변수 호이스팅 (= 변수 선언 이전에 값을 참조해 버려 의도하지 않은 값이 할당되는 경우가 생긴다)

|var|let|const|
|------|---|---|
|함수 범위|블록 범위|블록 범위|   

프론트 개발 신입 면접을 보던 당시 손코딩 면접에서 등장했던 for문 코드가 있는데 이 예시가 var, let 스코프 차이를 설명하기 적절한 것 같다.   

아래 코드에서 '전역 변수' 값이 콘솔창에 찍힐까?   
arrayObjs 배열에는 개발자가 의도한대로 console.log(0), console.log(1), console.log(2)를 찍는 함수들이 배열에 들어갈까?    

```js{numberLines: true}
var arrayObjs = [];

console.log('전역 변수 i', i)

for (var i = 0; i < 3; i++) {
    console.log('루프 함수 변수 i', i)
    arrayObjs.push(function () { 
        console.log(i); 
    });
}
```
![image](https://user-images.githubusercontent.com/24996316/203221963-d1350113-d018-41c5-9073-071eb401c4b9.png)

결과창을 보면 위와 같이 for문에 선언된 i 변수가 전역 변수 i로 3이 할당되어 찍힌다.

![image](https://user-images.githubusercontent.com/24996316/203222319-8e5d92b2-079b-4cd4-8079-67085500eeaf.png)   

arrayObjs에 push된 함수들을 실행시켜보면 for문의 i 값에 따라 순차적으로 함수가 저장된 게 아닌 i 값이 for문 전체를 돌고 난 후의 값인 console.log(3)을 담고 있는 함수들이 for문 개수만큼 들어가있다.   
의도치 않은 이런 결과가 나온 이유는 var 키워드가 함수 스코프를 갖고 있기 때문이다. for문{}은 함수가 아닌 블록이라서 for문 내부에 생성된 함수에서 i를 접근하려고 했을 때 바로 위에 있는 for문{} i 변수를 참조할 수 없어 for문이 모두 돌고난 후 전역으로 자동 저장된 i(3)를 참조하게 되는 것이다.   
즉, 3번 코드줄에서 콘솔로 i값에 접근했을 때 에러가 나지 않은 이유는 for문의 i 변수가 호이스팅되었기 때문이다.     

똑같은 코드를 let으로 바꿨을 때의 결과와 비교하면

```js{numberLines: true}
var arrayObjs = [];

console.log('전역 변수 i', i)

for (let i = 0; i < 3; i++) {
    console.log('루프 함수 변수 i', i)
    arrayObjs.push(function () { 
        console.log('i', i); 
    });
}
```
![image](https://user-images.githubusercontent.com/24996316/203224004-f8a209a9-b27f-4d8b-9c51-bef639b4f75f.png)   

전역 변수에 i 콘솔 로그를 찍은 부분에 에러가 뜬다. var 키워드로 for문을 작성했던 이전 코드와 달리 let 키워드를 사용한 for문은 let이 블록 스코프를 갖기 때문에 for문 블록에서 선언한 i를 블록의 바깥에서 접근하려 했기 때문에 참조 에러가 뜨는 것이다. 해당 콘솔 부분을 지우고 함수들을 push한 arrayObjs 배열을 조회해 보면 아래와 같은 결과가 나온다.    

![image](https://user-images.githubusercontent.com/24996316/203224733-e8767947-8927-49e3-aba3-3a07e474fd75.png)

let은 블록 범위에서 유효한 값을 유지하기 때문에 for문이 순차로 돌 때 i 값을 유지한 채로 arrayObjs 배열에 함수를 push한 것이다.   
const는 let과 비교했을 때 한 번 const 변수로 선언하면 이후에 재할당이 불가능하다는 점 이외에는 모두 같다. 즉, const는 불변의 상수 값을 변수로 할당시킬 때 사용하는 키워드라 보면 된다.      



#### 스코프 체인

자바스크립트 코드에 익숙한 사람들이 아래 코드로 결과값을 유추해 보라고 한다면 익숙하게 5라는 답을 줄 것이다. 실제로는 어떤 흐름을 통해서 getDiscountedPrice 함수가 바깥에 선언된 discount에 접근할 수 있었던 걸까?

```js{numberLines: true}
const discount = 0.5;

function getDiscountedPrice(price) {
    let result = price * discount;
    return result;
}

let totalPrice = getDiscountedPrice(10);
```
getDiscountedPrice 함수에서 연산하기 위해 필요한 discount 변수는 함수 바깥에 선언되어있고 let은 블록 스코프를 갖고 있어 제약없이 함수 스코프에 필요한 참조값이 없으면 그 위 단계에서 참조값을 찾아 연산한 것이다.      
만일 아래처럼 discount가 선언되었다면 참조 에러가 떴을 것이다.   

```js{numberLines: true}
{
    const discount = 0.5;
}

function getDiscountedPrice(price) {
    let result = price * discount;
    return result;
}

let totalPrice = getDiscountedPrice(10);
```


### 호이스팅 

![Frame 41](https://user-images.githubusercontent.com/24996316/203231155-60bb345b-8e1a-457e-9f29-0223ee2c9aa5.png)   

호이스팅이란 실행문이 선언문보다 앞에 있음에도 마치 선언문이 실행문보다 선두에 위치된 것처럼 동작하는 걸 말한다.   
또한 헷갈리기 쉬운 개념인데 호이스팅은 전역 변수 빌런 var 키워드에서만 일어나는 게 아닌 let, const, function class 모든 선언에서 호이스팅이 일어난다.   

```js{numberLines: true}
console.log(test1); // undefined
var test1;

console.log(test2); // Error: Uncaught ReferenceError
let test2;
```
위와 같이 var 키워드와 달리 let 키워드는 선언 이전의 변수를 실행시켰을 때 참조 에러를 띄운다. 하지만 참조 에러를 띄웠다는 게 호이스팅이 일어나지 않았다는 의미는 아니다. 이를 설명하기 위해서는 자바스크립트가 변수를 생성하는 단계를 알아야한다. 변수는 총 세 단계에 거쳐 생성된다.     

> 1. 선언 단계   
> 변수를 실행 컨텍스트의 변수 객체에 등록한다. 이 변수 객체는 스코프가 참조하는 대상이 된다.

> 2. 초기화 단계   
> 변수 객체에 등록된 변수를 위한 공간을 메모리에 확보한다. 이 단계에서 변수는 undefined로 초기화된다.

> 3. 할당 단계   
> undefined로 초기화된 변수에 실제 값을 할당한다.



```js{numberLines: true}
console.log(test1); // 변수 등록도 하고 undefined 할당되어 있음
var test1;
```
var 키워드는 선언과 동시에 해당 값을 초기화시킨다. 스코프의 선두에 변수를 등록하는 동시에 undefined 라는 초기값이 할당되어있기 때문에 변수 선언문 이전에 변수를 에러없이 참조할 수 있었던 것이다.   


```js{numberLines: true}
console.log(test1); // 변수 등록은 했는데 초기화가 안 되어있다 -> 일시적 사각지대(에 들어감
let test1; // 변수 선언문 코드까지 와야 undefined 할당시킴
```
let 키워드는 선언과 초기화 단계가 분리되어 진행된다. 스코프의 선두에 변수를 등록은 시키나(1. 선언 단계는 완료했으나) 변수 선언문까지 와야 초기화 값을 할당(2. 초기화 단계)시킨다. 따라서 값이 없는 변수를 콘솔로 찍으려고 하니 참조 에러가 떴던 것이다. 1. 선언 단계(스코프 시작 지점부터)부터 2. 초기화 단계 직전까지의 구간을 일시적 사각지대(Temporal Dead Zone = TDZ)라 부른다.


 
### 참고한 글

[nhn 2021 포럼](https://forward.nhn.com/2021/sessions/17)
[es6-block-scope](https://poiemaweb.com/es6-block-scope)   
[are-variables-declared-with-let-or-const-hoisted?](https://stackoverflow.com/questions/31219420/are-variables-declared-with-let-or-const-hoisted)
 
