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
