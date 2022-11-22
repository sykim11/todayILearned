---
title: Javascript 작동 원리 2
date: 2022-11-21
tags: ["javascript"]
publish: false
image: "./javascript.jpg"
---

```js{numberLines: true}

function sum(c,b) {
    let result = a + b;
    return result;
}

let number = sum(1,2);

```

```js{numberLines: true}

function sum(c, d) {
    let sumResult = c + d;
    return sumResult;
}

function calc(a,b,expr) {
    let calcResult = expr(a,b);
    return calcResult;
}

let number = calc(1,2, sum);

```

```js{numberLines: true}
var arrayObjs = [];

console.log('전역 변수 i', i)
// 함수의 배열을 생성하는 for 루프의 i는 전역 변수를 참조한다
// 왜냐면 var 변수는 함수 스코프를 갖기 때문에 push 함수 내부에서 바로 위에 있는 for문의 i 변수를 참조하지 못하기 때문에 for문이 모두 돌고 난 후 전역에 저장된 i 값 3을 참조하게 된다.
for (var i = 0; i < 3; i++) {
  console.log('루프 함수 변수 i', i)
  arrayObjs.push(function() {
    console.log(i)
  })
}

console.log('arrayObjs', arrayObjs)

// 배열에서 함수를 꺼내어 호출한다.
for (var j = 0; j < 3; j++) {
  console.dir(arrayObjs[j]);
  arrayObjs[j]();
}

```

```js{numberLines: true}

const discount = 0.5;

function getDiscountedPrice(price) {
    let result = price * discount;
    return result;
}

let totalPrice = getDiscountedPrice(10);

```

```js{numberLines: true}

function calc() {
    let number = 0;
    function increase() {
        number += 1;
    }
    return increase;
}

let newCalc = calc();
newCalc();
newCalc();

```

```js{numberLines: true}
let fns = {
    getName() {
        return this.name;
    }
    addAge() {
        this.age += 1;
    }
};

function createPerson(name) {
    let newPerson = {};
    Object.setPrototypeOf(
        newPerson, fns
    );
    newPerson.name = name;
    newPerson.age = 0;
    return newPerson;
}

let suyoung = createPerson("suyoung");
suyoung.getName();
```

```js{numberLines: true}
function createPerson(name) {
    this.name = name;
    this.age = 0;
}

createPerson.prototype.getName = function () {
    return this.name
};
createPerson.prototype.addAge = function () {
    this.age += 1;
};
let suyoung = new createPerson('suyoung');
suyoung.getName();
```
