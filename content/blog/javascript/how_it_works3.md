---
title: Javascript 작동 원리 2
date: 2022-11-21
tags: ["javascript"]
publish: false
image: "./javascript.jpg"
---

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
