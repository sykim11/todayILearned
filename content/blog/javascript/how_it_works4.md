---
title: Javascript 기본-프로토타입
date: 2022-11-28
tags: ["javascript"]
publish: true
image: "./javascript.jpg"
---

![Frame 55](https://user-images.githubusercontent.com/24996316/203940809-40ff5208-ed46-46ba-8568-4ff0237c59da.png)

개체를 표현하기 위해 객체라는 개념이 있고 이 객체의 행위를 위해 메서드 함수를 사용하며 메서드 함수가 객체에 접근하기 위해 this라는 개념이 있다는 것까지 정리되었다.  
그런데 이 객체가 아주 많은 케이스를 개발해야하는 상황이 온다면 이 모든 객체들을 어떻게 만들어줘야할까? 단순히 백 개의 객체를 만들어야한다고 해서 100번의 복붙 작업이 이루어지지는 않을 것이다.  
객체들끼리의 상관관계를 따져서 최대한 비슷한 기능을 가진 추상적인 객체를 만들어 재활용 가능한 객체를 만든다면 훨씬 더 유용하다. 바로 프로토타입이 존재하는 이유가 여기서 나온다.

![프로토타입1](https://user-images.githubusercontent.com/24996316/204169773-427758f8-0f66-4cdb-8026-1d884034689c.JPG)

test라는 함수를 만든 뒤 이 함수를 `console.dir(test)`로 찍어서 보면 위와 같은 결과가 나온다.

### [[Prototype]]

자바스크립트에서의 객체들은 모두 숨김 프로퍼티를 갖는다. 이 숨김 프로퍼티의 값은 부모 참조값을 누굴 갖냐에 따라 null이 될수도 있고 다른 대상을 참조하는 값으로 가질 수도 있다. (부모를 참조하는 값 = 프로토타입) 자바스크립트에서 프로토타입의 동작은 참 편리하게 작동한다. 특정 객체의 프로퍼티를 읽으려했을 때 값이 없는 경우 자동으로 프로토타입에서 프로퍼티가 있는지 찾아준다. 예시가 조금 그렇지만 사람으로 따지면 마치 자식에게 돈이 없으면 이 자식의 부모를 알아서 찾아내 돈을 뽑아내는 느낌이다. 자유로운 자바스크립트는 또한 이런 프로토타입의 값을 개발자가 수정하도록 해 주는 함수를 제공해 준다.

> ❗ [[Prototype]]의 값을 추가하거나 가져오는 게터세터의 역할로 **proto**가 있고 근래에는 Object.getPrototypeOf, Object.setPrototypeOf 함수를 많이 쓴다고 한다

#### 리터럴 객체의 프로토타입

```js{numberLines: true}
let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};
rabbit.__proto__ = animal; //
console.dir(rabbit);
```

rabbit 리터럴 객체의 프로토타입에 animal 리터럴 객체 값을 부여했다. 결과를 확인해 보면 rabbit 리터럴 객체의 프로토타입에 eats라는 프로퍼티가 추가됐다.

![image](https://user-images.githubusercontent.com/24996316/204171239-8bf227c0-3698-4189-ad3e-156e48b702c3.png)

#### 생성자 함수의 프로토타입

```js{numberLines: true}
function Rabbit(name) {
  this.name = name;
}

let rabbit = new Rabbit("그냥 흰 토끼");

console.dir(rabbit);
```

![image](https://user-images.githubusercontent.com/24996316/204172352-c9dba09e-34d1-49ed-8c3f-5f9d95baf35f.png)

자바스크립트에서는 리터럴 객체 말고도 new 생성자 함수를 이용해 객체를 만들 수 있다.

```js{numberLines: true}
let animal = {
  eats: true
};
function Rabbit(name) {
  this.name = name;
};
Rabbit.prototype = animal;
let rabbit = new Rabbit("먹는 흰 토끼");

console.dir(rabbit);
```

![image](https://user-images.githubusercontent.com/24996316/204172527-d4a1c6ca-47f0-415d-b189-8eb8b11c7379.png)

그리고 생성자 함수에서 프로토타입 정보를 접근하는 방법은 **함수 객체 내에 기본으로 존재하는 prototype 프로퍼티를 통해 가능하다.**

prototype 프로퍼티를 이용해 Rabbit 함수 프로토타입에 값을 추가하기 전의 new 생성자 Rabbit 함수로 만들어진 rabbit의 형태를 먼저 살펴보면 아래와 같이 생겼다.

![프로토타입4](https://user-images.githubusercontent.com/24996316/204172881-d5c3bb1e-3a11-427e-a2f1-c65068129619.JPG)

rabbit은 생성자 함수(constructor function)를 통해 만들어진 변수 객체이다. 자바스크립트 생성자의 특징 중 하나로, 생성자 함수는 new 키워드를 통해 만들어질 때 빈 객체를 만들어 this를 할당시킨다. 그러고나서 해당 함수 본문을 실행하는데 위 코드의 Rabbit을 예로 들자면 this에 name이라는 프로퍼티를 추가한 상태가 된다. 그리고 런타임에서 this를 반환하기 때문에 rabbit.name의 결과값이 "그냥 흰 토끼"가 되는 것이다.

```js{numberLines: true}
function Rabbit(name) {
  this.name = name;
}
let rabbit = new Rabbit("그냥 흰 토끼");
```

사실 이 코드의 동작과

```js{numberLines: true}
let rabbit = {
  name: "그냥 흰 토끼"
};
```

이 코드는 동일하게 동작한다. 다만 new 생성자 함수를 사용한다면 리터럴 객체보다 쉽게 다른 이름을 가진 Rabbit 객체를 만들 수 있게 된다.

#### 생성자 함수 객체와 일반 함수의 차이

```js{numberLines: true}
function Rabbit(name) {
  this.name = name;
}
console.dir(Rabbit);
```

![image](https://user-images.githubusercontent.com/24996316/204173581-881d0663-78a0-4219-af31-73e97e8a150e.png)

함수 자체를 조회해 보면 [[Prototype]] 는 f 함수를 가리키고 있고 함수도 결국은 객체이기에 f 함수의 [[Prototype]] 은 Object를 가리키고 있다.
하지만 이 Rabbit을 생성자로 함수로 만들어 해당 함수의 인스턴스인 rabbit을 조회해 보면

![image](https://user-images.githubusercontent.com/24996316/204173760-7f1de34b-ea2e-4af1-8db6-9c0f7d9b9ed9.png)

인스턴스는 객체이기에 당연히 부모를 참조하는 [[Prototype]] 은 Object를 가리키고 있다.  
또한 prototype 프로퍼티는 함수에만 존재한다는 사실을 다시 확인해 볼 수 있다.

### 함수 prototype 프로퍼티 의도대로 사용하기

다시 아까의 예시로 돌아가서 Rabbit이라는 함수로 new 생성자를 이용해 각각 다른 이름을 가진 토끼 객체를 만들려고 한다. 그런데 이 토끼 객체의 부모 참조값에 eat:true 속성을 공통으로 부여하고 싶다.

![프로토타입5](https://user-images.githubusercontent.com/24996316/204174411-20d4ce0d-da2e-402c-ad31-a884ec1fdff7.JPG)

위와 같이 Rabbit 함수의 prototype에 eats:true 객체 리터럴을 부여하고 rabbit 인스턴스를 조회해보면 의도한 것처럼 콘솔 결과가 잘 나온다. 그런데 Rabbit 함수 자체를 조회해 보면 일반 함수와 뭔가 다른 점이 보인다.

![image](https://user-images.githubusercontent.com/24996316/204175107-2ff3a7c7-665a-4ebf-aca0-43e9b171fcb3.png) ![image](https://user-images.githubusercontent.com/24996316/204173581-881d0663-78a0-4219-af31-73e97e8a150e.png)

함수의 prototype에 생성자 역할을 하는 constructor가 존재하지 않게 되었다.

![프로토타입6](https://user-images.githubusercontent.com/24996316/204175270-f81f5f92-5ba8-4d29-a01a-7361322f5595.JPG)

Rabbit 함수는 생성자 함수가 없는 객체가 되어 당연히 위와 같이 다른 이름을 가진 토끼를 만들 수 없다.  
이런 상황을 방지하기 위해 함수의 propertype 속성을 건드릴 때는 객체를 부여하는 식의 덮어쓰기 말고 **Rabbit.prototype.eats = true 식으로 프로퍼티를 추가해야한다.**

### [[Prototype]] 최적화

대개는 객체를 생성할 때만 [[Prototype]]을 설정하고 이후엔 수정하지 않는 걸 권장한다. 위 코드들의 예시를 들자면 rabbit이 animal을 상속받도록 설정하고 난 이후엔 상속 관계를 변경하지 않는 게 좋다는 뜻이다. 왜냐면 자바스크립트 엔진은 설정된 상속 시나리오를 토대로 최적화가 되어있기 때문에 Object.setPrototypeOf나 obj.proto=를 써서 프로토타입을 그때그때 바꾸는 연산은 객체 프로퍼티 접근과 관련된 최적화를 망치기 때문에 성능에 나쁜 영향을 미친다. [[Prototype]]을 수정했을 때 다음 결과가 정확한 경우, 혹은 속도가 중요하지 않은 경우가 아니라면 [[Prototype]]의 잦은 수정은 지양해야한다.

### 참고한 글

[함수의 prototype 프로퍼티](https://ko.javascript.info/function-prototype)
