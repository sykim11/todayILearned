---
title: Javascript 면접 주제
date: 2022-01-09
tags: ["javascript"]
publish: false
image: "./javascript.jpg"
---

## 1. prototype이란?
### 1.1 Function.bind 되는 이유?
- 자바스크립트에서 객체는 모두 숨김 프로퍼티 [[Prototype]] 를 갖고 있다. 함수도 객체이므로 마찬가지이다. 다만 함수 객체 내에는 기본적으로 prototype이라는 프로퍼티가 존재하고 이 프로퍼티 내부에 bind라는 메서드가 존재한다. 따라서 Function.bind가 실행 가능하다.

### 1.2 prototype을 이용해 상속 구현해 보기
```js
// 외부에서 받은 name 인자값을 name 프로퍼티로 갖는 함수 객체
function Rabbit(name){
  this.name = name;
}
// 함수 객체의 상위 프로퍼티에 eat=true 속성을 부여시킨다
Rabbit.prototype.eats=true;
// 함수 객체를 new 생성자로 호출하면 빈 객체를 만들어 this를 할당시킨다
// 해당 함수 객체의 인스턴스 객체는 this.name 값을 외부에서 받은 name 값으로 할당시키므로 this.name은 토끼1이 된다.
const rabbit = new Rabbit("토끼1");
// 해당 함수 객체의 인스턴스 객체는 상위 프로퍼티에 eat=true값이 존재하므로 아래와 같이 접근이 가능하다
console.log(rabbit.eats);
```

2. this?
-언제 결정?
-arrow function this?
-this 변경시키려면? call, apply

3. debugging
-버그 문제를 어떻게 해결?
-디버깅 방식은?
-call stack?
-network 오류 상황 어떻게 확인?

4. 클로저
-클로저 정의한다면?
-클로저를 활용한 구현경험?
-커링이란?
-고차함수란?

5. FP
-배열의 고차함수 어떤걸 사용?
-reduce 한번 구현해보기
-합성은 상속과 어떤 장점이 있는지?
-immutable? 이것의 단점도 있는지?

6. oop
-es classes 상속 경험이 있는가?
-객체를 나누는 단위는?
-어플리케이션 의존성을 낮추는 방법은?

7. 비동기
- promise, async/await 차이는?
- promise 패턴 설명
- setTimout에 promise를 적용한다면?
- 동시에 여러개의 관계없는 요청을 한다면?
- task queue? micro task queue?

8. 객체
- 객체 표현 방식 중 자주 사용하는 것은?
- class, prototype, literal 차이?
- 자주 사용하는 메서드는?
- JSON 데이터 파싱 시 가장 신경쓰는 것은?

9. 기타
- generator란?
- es next 관심있는 문법은?
- 정규표현식은 언제 써봤나?
