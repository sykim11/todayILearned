// ! 객체 내의 메서드에서의 this는 객체를 가리킴

// function makeUser() {
//   return {
//     name: "John",
//     ref: this, // 함수로 호출된 this
//   }
// }

// let user = makeUser()
// console.log(user.ref.name)

function makeUser() {
  return this // 실행시킨 주체를 가리킨다 nodejs에서는 global, 브라우저에서는 window
}

// global에는 name 프로퍼티가 없어서 undefined
// console.log(makeUser().name)

function makeUser_this() {
  return {
    name: "John",
    ref() {
      return this // makeUser_this
    },
  }
}

let user = makeUser_this()

console.log(user.ref()) // { name: 'John', ref: [Function: ref] }

// 체이닝
let ladder = {
  step: 0,
  up() {
    this.step++
    return this
  },
  down() {
    this.step--
    return this
  },
  showStep: function () {
    // 사다리에서 몇 번째 단에 올라와 있는지 보여줌
    console.log(this.step)
    return this
  },
}

// ladder.up().down().up().showStep()

let test = ladder.up()
console.log(test)

// 함수로써 호출되었을 때 참조하는 this가 존재하지 않으면(undefined면) 엄격 모드가 아닌 경우에는 전역 객체인 window를 자동으로 바라보게 된다고 합니다. (언어 설계상의 오류)
// 하지만, 엄격모드에서는 this는 그대로 undefined을 가지게됩니다.
