---
title: react-chartjs 에서 라인에 glow 효과 주는 법
date: 2022-01-07
tags: [reactjs]
publish: false
image: "./reactjs.jpg"
---

### 개발 환경

chart.js 3.7 버전  
react-chartjs-2 4.0 버전 환경

리액트에서 그래프 작업을 할 때 주로 chart.js 라이브러리를 사용하고 있다.  
선 그래프 작업을 할 때 라인에 glow 효과를 주고 싶어 구글신에 검색을 해보았는데  
예제 코드를 적용하기만 하면 line을 찾을 수 없다며 뜨는 undefined 에러... 😥  
왜 그런지 콘솔을 찍어가며 확인해 보니 chart.js 3 버전에서 line 프로토타입을 찾아내는 경로가 조금 달라졌다.

### 소스코드

1. chart.js 임포트

```js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
```

[react-chartjs 공식문서](https://react-chartjs-2.netlify.app/examples/line-chart)에 나와있는대로 원하는 차트 컴포넌트를 사용할 때는 리액트에서 불러오는 방식대로 해당 라이브러리를 임포트한다.

2. ChartJS.registry 하위를 따라 line 프로토타입 찾기

```js
let draw = ChartJS.registry.controllers.items.line.prototype.draw

ChartJS.registry.controllers.items.line.prototype.draw = function () {
  let chart = this.chart
  let ctx = chart.ctx
  let _stroke = ctx.stroke
  ctx.stroke = function () {
    ctx.save()
    ctx.shadowColor = ctx.strokeStyle
    ctx.shadowBlur = 5
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 4
    _stroke.apply(this, arguments)
    ctx.restore()
  }
  draw.apply(this, arguments)
  ctx.stroke = _stroke
}
```
