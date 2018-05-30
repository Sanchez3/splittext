# 文字动画效果

[CodePen](https://codepen.io/sanchez3/full/MOJYXq/)

主要分为4种动画效果

- Filp、Scale、Words、Wave效果主要利用css `transform3d`， `perspective`，伪3d动画效果。
- Blur效果利用css `filter` 滤镜，模糊效果。
- Shine效果利用`text-shadow` 阴影，发光效果。
- 2D CANVAS效果利用`getImageData()` 像素数据，粒子效果。
- Explore Out消失效果 利用[贝塞尔曲线](https://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A) 模拟物理引擎运动（抛物线）



### 参考

- GreenSock的 [SplitText: Multiple Split Types](https://greensock.com/splittext-example)
- [HTML5像素文字爆炸重组动画特效DEMO演示](http://www.html5tricks.com/demo/html5-text-pixel/index.html)
- [TimelineMax：学习使用Bézier Tweening](https://www.w3cplus.com/css3/timelinemax-getting-a-handle-on-bezier-tweening.html)

