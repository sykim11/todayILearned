---
title: 빅오 표기법
date: 2022-02-20
tags: [base]
publish: false
image: "./base.jpg"
---

이번 방통대 학기부터 알고리즘을 듣게 되었는데 우연히 유데미에서 저렴한 가격으로 자바스크립트를 이용해 알고리즘 강의가 풀린 걸 발견했다. 🥰  
학기 강의만 들으면 어려울 것 같았는데 나에게 익숙한 언어로 다른 강의도 함께 병행하면 도움이 될 것 같다.

### 빅오 표기법이란

알고리즘의 효율성을 표기해주는 표기법이다. 알고리즘의 효율성은 데이터 개수(n)가 주어졌을 때 덧셈, 뺄셈, 곱셈 같은 기본 연산의 횟수를 의미한다.  
빅오 표기법은 알고리즘의 시간 복잡도와 공간 복잡도를 나타내는데 주로 사용된다.  
(시간 복잡도는 알고리즘의 시간 효율성을 의미하고, 공간 복잡도는 알고리즘의 공간(메모리) 효율성을 의미한다.)

![image](https://user-images.githubusercontent.com/24996316/154831296-dc1994da-af15-4c35-bc02-57e48279714b.png)

### 시간 복잡도

- 시간의 효율성

- O(n) : 실행 비율이 1:1로 늘어나는 것.

  가장 쉬운 예로 변수 n 값을 받았을 때 1부터 n까지를 더하는 루프 함수가 있다면 이 경우 빅O(n) 효율성을 가진 시간 복잡도를 의미한다.

- O(n^2) : 실행 시간이 n^2으로 늘어나는 것.  
   ![image](https://user-images.githubusercontent.com/24996316/154831345-12c37cef-5606-4e56-bed5-0e37a104a85a.png)

  루프문의 중첩된 함수의 경우 빅오 n^2(제곱) 효율성을 가진 시간 복잡도를 의미한다.

- O(log n) : 실행 시간이 로그형으로 늘어나는 것.  
   데이터양이 많아져도 시간이 조금씩 늘어나며 시간 복잡도에서 O(log n)이 나오면 좋은 시간 효율성을 가졌다고 본다.

### 공간 복잡도

- 공간의 효율성
- undefined, boolean, number : 입력의 크기와 상관 없이 불변의 공간을 갖는다.
- string, 객체, 배열: o(n) 공간 복잡도를 갖는다.

공간 복잡도의 예시를 보자.

예시1

```
function logUpTo(n) {
    for (var i = 1; i <= n; i++) {
        console.log(i);
    }
}
```

위 코드의 공간 복잡도는 o(1)이 된다. 이유는 루프문을 몇번을 돌아도 함수 내부에 할당된 변수인 var 공간이 변하지 않기 때문이다.

예시2

```
function onlyElementsAtEvenIndex(array) {
    var newArray = Array(Math.ceil(array.length / 2));
    for (var i = 0; i < array.length; i++) {
        if (i % 2 === 0) {
            newArray[i / 2] = array[i];
        }
    }
    return newArray;
}
```

위 코드의 공간 복잡도는 o(n)이 된다. 이유는 루프문을 돌 때마다 배열에 할당된 공간이 매개변수에 맞게 늘어나기 때문이다.

예시3

```
function subtotals(array) {
    var subtotalArray = Array(array.length);
    for (var i = 0; i < array.length; i++) {
        var subtotal = 0;
        for (var j = 0; j <= i; j++) {
            subtotal += array[j];
        }
        subtotalArray[i] = subtotal;
    }
    return subtotalArray;
}
```

위 코드의 공간 복잡도는 o(n)이 된다. 함수 내부에 할당된 변수는 i, j가 이중 루프문으로 배열을 증가시키지만 어쨌든 리턴되는 결과값은 이중으로 돌고 나온 하나의 배열이기 때문이다.
