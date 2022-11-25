// filter array
let arr = [1, 2, 3, 4, 5, 6, 7]

function inBetween(a, b) {
  return function (item) {
    if (item >= a && item <= b) return true
  }
}

function inArray(array) {
  return function (item) {
    return array.includes(item)
  }
}

let test = arr.filter(inBetween(3, 6))
let test2 = arr.filter(inArray([1, 2, 3]))

// sort array
let users = [
  { name: "John", age: 20, surname: "Johnson" },
  { name: "Pete", age: 18, surname: "Peterson" },
  { name: "Ann", age: 19, surname: "Hathaway" },
]

function byField(name) {
  return function (a, b) {
    return a[name] > b[name] ? 1 : -1
  }
}

let result1 = users.sort(byField("name"))

// 함수를 사용해 군대 만들기
function makeArmy() {
  let shooters = []

  for (let i = 0; i < 10; i++) {
    let shooter = function () {
      // shooter 함수
      alert(i) // 몇 번째 shooter인지 출력해줘야 함
    }
    shooters.push(shooter)
  }

  return shooters
}

let army = makeArmy()
console.log(army)

army[0]() // 0번째 shooter가 10을 출력함
army[5]() // 5번째 shooter 역시 10을 출력함
