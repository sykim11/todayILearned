---
title: Javascript 기본-객체와 메서드, 그리고 this
date: 2022-11-25
tags: ["javascript"]
publish: true
image: "./javascript.jpg"
---

![Frame 41 (2)](https://user-images.githubusercontent.com/24996316/203472502-a8534622-8fd4-4a12-98e8-e4385213fb06.png)

### 객체

자바스크립트를 설명하는 위키의 설명글에 따르면 아래와 같다.

> 자바스크립트는 객체 기반의 프로그래밍을 가능하게 해 주는 언어이다.

객체란 사람, 블로그, 토끼 등 실존하는 개체를 표현할 때 사용하는 단어로 이 실존 개체들을 자바스크립트를 통해 프로그래밍으로써 표현이 가능하다는 의미이기도 하다. 또한 개체는 특정한 행위를 하는데 이런 동적인 개념을 자바스크립트에선 메서드로서 표현이 가능하다.

### 메서드

개체에 행위를 부여하기위해선 메서드는 개체에 접근할 수단이 필요하다. 그리고 그 수단으로 this가 있다.  
**리터럴 객체 속 메서드의 this는 객체를 가리킨다**

```js{numberLines: true}
let user = {
    name: "ksy",
    studyJS() {
        console.log(`${this.name}가 공부를 합니다.`);
    }
};

user.studyJS(); // ksy가 공부를 합니다.
```

user라는 객체에 studyJS 메서드를 만들어 user객체가 해당 메서드를 호출했을 때 "ksy가 공부를 합니다"라는 행위를 하게 한다. 그리고 studyJS 메서드 내부에서 this를 이용해 user 객체의 정보 중 name 값을 가져오는 걸 확인할 수 있다.

### 함수 안의 this

그렇다면 함수 안에서의 this도 마찬가지일까?  
함수와 메서드의 용어에 혼동이 와서 많이 헷갈렸는데 this를 설명할 때만큼은 분명하게 짚고 넘어가야 편하다.

객체 > 함수 > 메서드 (> 포괄의 의미)

메서드는 리터럴 객체{...}에 포함되어 있는 함수이고  
더 큰 개념의 함수는 자바스크립트에서 작업을 수행하는 구성 블록, 혹은 독립적인 코드 조각이다.  
그리고 함수에서 더 큰 개념에 바로 객체가 있다.

자바스크립트에선 모든 함수에 this를 사용할 수 있다. 그리고 this가 나온 자바스크립트 코드를 이해할 때 헷갈리지 말아야할 부분이 있는데 다른 프로그래밍과 다르게 **자바스크립트의 this는 런타임에서 결정된다.** 호출한 주체가 누구냐에 따라 값이 달라진다.

```js{numberLines: true}
let picka = {name: "피카츄"};
let kobugi = {name: "꼬부기"};

function skill() {
    console.log(`${this.name}가 공격한다`);
};

picka.attack = skill;
kobugi.attack = skill;

picka.attack();
kobugi.attack();
```

동일한 함수 skill을 다른 객체 정보를 갖고 있는 pick와 kobugi에게 각각 attack이라는 프로퍼티에 동일한 함수 skill을 연결해줬다. 하지만 결과값은 각 객체의 정보에 따라 다르게 나온다. this가 런타임 단계에서 호출한 주체 정보에 따라 달라진 것이다.

#### 길을 잃은 this

```js{numberLines: true}
function makeUser() {
    return {
        name: "ksy",
        ref: this
    }
};

let user = makeUser();
console.log(user.ref) // <- 뭐가 찍힐까?
```

위 코드의 마지막 줄 콘솔에는 어떤 값이 찍힐까?

답은 undefined이다. (실행 환경 nodejs)

8번 줄에서 makeUser()호출할 당시의 리턴된 this는 호출의 주체가 함수였기 때문에 makeUser를 가르키지 못하고 makeUser 바깥으로 나와 참조할 대상을 찾는다. 이때 'user strict' 엄격모드에서 자바스크립트를 실행하면 대상이 없다고 판단해 undefined를 줄 것이고 엄격모드가 아닌 경우에는 실행 컨텍스트에 따라 값이 달라진다. 브라우저에서는 전역값인 window를 줄 것이고 nodejs에서는 전역값인 global을 준다.

길을 잃어버린 이 this가 원래 의도대로 makeUser를 가리키게하려면 어떻게 해야할까?

```js{numberLines: true}
function makeUser() {
    return {
        name: "ksy",
        ref() {
            return this // 👈
        }
    }
};

let user = makeUser();
console.log(user.ref())
```

**함수를 객체 프로퍼티에 저장해 object.method() 형태로 호출하면 this는 object를 참조한다.** 따라서 해당 코드는 콘솔에 본래 의도했던대로 makerUser 함수에 대한 정보가 찍힌다.

```sh
{ name: 'John', ref: [Function: ref] }
```

#### setTimeout과 this

이런 경우는 어떨까? setTimeout에 객체의 메서드를 콜백으로 전달해도 this가 호출한 객체를 기억할까?

```js{numberLines: true}
function makeUser() {
    return {
        name: "ksy",
        hi() {
            console.log(`${this.name} 안녕!`)
        }
    }
};

let user = makeUser();
setTimeout(user.hi, 1000); // ?
```

결과는 undefined다.  
user.hi 메서드가 setTimeout으로 전달될 때 user 객체에서 분리된 채로 전달되어 name이라는 정보를 잃어버리기 때문이다. 이는 setTimeout만이 가진 특별한 동작 방식 때문인데, setTimeout은 인수로 전달받은 함수를 호출할 때 this에 window를 할당한다. 위 코드에선 window.name 값은 미리 지정하지 않았으니 당연히 undefined가 떴던 것이다.

**방법1: 래핑 함수로 this 잡아두기**

```js{numberLines: true}
function makeUser() {
    return {
        name: "ksy",
        hi() {
            console.log(`${this.name} 안녕!`)
        }
    }
};

let user = makeUser();
setTimeout(() => { user.hi() }, 1000); // () => {} 래핑!
```

위와 같이 전달한 메서드 위에 함수를 한겹 씌워서 호출하면 메서드 내부 this가 참조하는 값은 () => {} 함수 블록에 걸리게 되고 user 값을 찾 user 안의 name 정보를 가져와 올바른 결과값이 나온다.

**방법2: bind 메서드로 this 붙여놓기**

```js{numberLines: true}
function makeUser() {
    return {
        name: "ksy",
        hi() {
            console.log(`${this.name} 안녕!`)
        }
    }
};

let user = makeUser();
setTimeout(user.hi.bind(user), 1000); // bind!
```

**모든 함수는 this를 수정하게 해주는 내장 메서드 bind를 제공한다** this가 바라봤으면 하는 객체를 대상 함수 뒤에 bind 메서드로 붙여놓으면 원하는 결과값이 나온다.


#### 헷갈리기 쉬운 예시 코드들 Test!

예시 코드들의 답을 유추해 보자.   

```js{numberLines: true}
let test = {
  name: "tester",
  sy: {
    name2: "test2",
    play: function () {
      console.log(`${this.name} ${this.name2} play!`);
    },
  },
};

test.sy.play();
```
<details>
    <summary> 정답 </summary>
<!-- empty line -->
    this는 호출한 당시의 주체를 가리키기 때문에 roto를 가리키고 roto 안에 name 값이 없기 때문에 undefined test2 play! 가 찍힌다
</details>
<!-- empty line -->


```js{numberLines: true}
let test = {
  name: "tester",
  sy: {
    name2: "test2",
    play: () => {
      console.log(`${this.name} ${this.name2} play!`);
    },
  },
};

test.sy.play();
```
<details>
    <summary> 정답 </summary>
<!-- empty line -->
    this는 호출한 당시의 주체를 가리키는데 화살표 함수는 this 값이 존재하지 않으므로 undefined undefined play!가 찍힌다
</details>
<!-- empty line -->


```js{numberLines: true}
function makeUser() {
  return {
    name: "John",
    ref: this,
  };
}

let user = makeUser();

alert(user.ref.name);
```
<details>
    <summary> 정답 </summary>
<!-- empty line -->
    this는 호출한 당시의 주체를 가리키는데 makeUser 호출 시 this가 객체의 메서드로 호출된게 아니라서 this는 undefined가 되므로 name 값을 찾을 수 없다고 찍힌다.
</details>
<!-- empty line -->


```js{numberLines: true}
function makeUser() {
  return {
    name: "John",
    ref() {
      return this;
    },
  };
}

let user = makeUser();

alert(user.ref().name);
```
<details>
    <summary> 정답 </summary>
<!-- empty line -->
    this는 호출한 당시의 주체를 가리키는데 this는 객체의 메서드 ref()로 호출되었으므로 . 앞에 있는 주체인 user를 가리킨다. 그러므로 user를 가리키는 this는 name 값을 찾을 수 있게 된다.
</details>
<!-- empty line -->


```js{numberLines: true}
function RockBand(members) {
  this.members = members;
  this.perform = function () {
    setTimeout(function () {
      this.members.forEach(function (member) {
        member.perform();
      });
    }, 1000);
  };
}

var theOralCigarettes = new RockBand([
  {
    name: "takuya",
    perform: function () {
      console.log("a e u i a e u i");
    },
  },
]);

theOralCigarettes.perform();
```
<details>
    <summary> 정답 </summary>
<!-- empty line -->
    setTimeout은 인수로 전달받은 함수를 호출할 때 this를 window에 할당한다. this가 RockBand를 가리키고 있지 않기 때문에 this.members가 undefined가 뜬다.
</details>
<!-- empty line -->



```js{numberLines: true}
function RockBand(members) {
  let that = this;
  this.members = members;
  this.perform = function () {
    setTimeout(function () {
      that.members.forEach(function (member) {
        member.perform();
      });
    }, 1000);
  };
}

var theOralCigarettes = new RockBand([
  {
    name: "takuya",
    perform: function () {
      console.log("a e u i a e u i");
    },
  },
]);

theOralCigarettes.perform();
```
<details>
    <summary> 해결법1 - 클로저 </summary>
<!-- empty line -->
    자바스크립트에서는 함수가 함수를 반환할 때 당시의 환경정보를 기억한다.
    this.perform 함수를 호출할 때 that 정보를 기억하고 this 값이 할당된 that은 Rockband 객체를 가리키고 있어서 Rockband 내부에 members 값을 읽을 수 있으므로 정상 값이 출력된다.
</details>
<!-- empty line -->


```js{numberLines: true}
function RockBand(members) {
  this.members = members;
  this.perform = function () {
    setTimeout(function () {
      this.members.forEach(function (member) {
        member.perform();
      });
    }.bind(this), 1000);
  };
}

var theOralCigarettes = new RockBand([
  {
    name: "takuya",
    perform: function () {
      console.log("a e u i a e u i");
    },
  },
]);

theOralCigarettes.perform();
```
<details>
    <summary> 해결법2 - bind </summary>
<!-- empty line -->
    모든 함수는 this를 수정시켜주는 bind를 제공한다.
    setTimeout은 인수로 전달받은 함수를 호출할 때 this를 window에 할당하는데 이때 this를 RockBand로 바라보도록 수정한다.
</details>
<!-- empty line -->



### 참고한 글

[메서드와 this](https://ko.javascript.info/object-methods)
