/**
 * Created by sanchez 
 */
'use strict';

//check the environment
// if (process.env.NODE_ENV !== 'production') {
//     console.log('Looks like we are in development mode!');
// }


// import CSS
// import animate_css from 'animate.css/animate.min.css';

// require('createjs');
import css from '../css/css.css';



// var Segment = require('segment');

var textFormed;
var textPixels;
var circles;
var text;
var textStage;


window.h5 = {
    first: -1,
    initPixijs: function() {
        var that = this;
        var form, input;
        var offsetX, offsetY;
        var app;
        var tctx;
        var colors = ['0xFFFFFF', '0xFFFFFF', '0xFFFFFF', '0xFFFFFF', '0xFFFFFF'];

        function init() {
            addCanvas();
            initEvent();
            initText();
            initCircles();
            // animate();

        }

        function addCanvas() {
            var c1 = document.createElement('canvas');
            c1.id = 'text';
            // c1.style.opacity = 0;
            document.getElementById('container').appendChild(c1);
            offsetX = (window.innerWidth - 600) / 2;
            offsetY = (window.innerHeight - 300) / 2;
            //.width 与.style.width效果不一样
            c1.width = 600;
            c1.height = 300;
            c1.style.top = offsetY + 'px';
            c1.style.left = offsetX + 'px';

            app = new PIXI.Application(window.innerWidth, window.innerHeight, { backgroundColor: 0x79a8ae });
            document.getElementById('container').appendChild(app.view);
            document.getElementById('container').getElementsByTagName('canvas')[1].style.top = 0;
            document.getElementById('container').getElementsByTagName('canvas')[1].style.left = 0;


            var a1 = document.createElement('a');
            a1.style.position = 'absolute';
            a1.id = 'next-btn';
            a1.style.width = '100px';
            a1.style.height = '40px';
            a1.style.backgroundColor = 'rgba(206,206,206,0.8)';
            a1.style.bottom = '100px';
            a1.style.left = 0;
            a1.style.right = 0;
            a1.style.cursor = 'pointer';
            a1.style.margin = 'auto';
            a1.innerHTML = 'NEXT';
            document.getElementById('container').appendChild(a1);

        }

        // Init Canvas


        function initEvent() {
            document.getElementById('next-btn').addEventListener('click', function() {
                var v = word.value[that.first % 11];
                if (textFormed) {
                    explode();
                    if (v !== '') {
                        createText(v); //v.toUpperCase()
                    } else {
                        textFormed = false;
                    }
                } else {
                    createText(v);
                }

            });
        }

        function initText() {

            tctx = document.getElementById('text').getContext('2d');
            tctx.font = '80px "Source Sans Pro"';
            tctx.fillStyle = '0xeee';
            tctx.textAlign = "center";
            tctx.fillText('', 0, 0);
        }

        function createText(t) {

            tctx.clearRect(0, 0, 600, 300);
            var fontSize = 860 / (t.length);
            if (fontSize > 160)
                fontSize = 160;
            tctx.font = "" + fontSize + "px 'Source Sans Pro'";
            // tctx.textAlign = 'center';
            tctx.fillStyle = '#eee';
            tctx.fillText(t, 300, (200 + fontSize) / 2);
            that.first++;



            var pix = tctx.getImageData(0, 0, 600, 300).data;
            textPixels = [];
            for (var i = pix.length; i >= 0; i -= 4) {
                if (pix[i] !== 0) {
                    var x = (i / 4) % 600;
                    var y = Math.floor(Math.floor(i / 600) / 4);

                    if ((x && x % 8 === 0) && (y && y % 8 === 0))
                        textPixels.push({
                            x: x,
                            y: y
                        });
                }
            }

            formText();

        }

        function initCircles() {
            circles = [];
            for (var i = 0; i < 600; i++) {
                var circle = new PIXI.Graphics();
                var r = 7;
                var x = window.innerWidth * Math.random();
                var y = window.innerHeight * Math.random();
                var color = colors[Math.floor(i % colors.length)];
                var alpha = 0.2 + Math.random() * 0.5;
                circle.alpha = alpha;
                circle.radius = r;
                circle.beginFill(color);
                circle.drawCircle(0, 0, r);
                circle.endFill();
                circle.x = x;
                circle.y = y;
                circles.push(circle);
                app.stage.addChild(circle);
                circle.movement = 'float';
                tweenCircle(circle);
            }
        }

        // animating circles
        function animate() {
            requestAnimationFrame(animate);
        }

        function tweenCircle(c, dir) {
            if (c.tween)
                c.tween.kill();
            if (dir == 'in') {
                c.tween = TweenMax.to(c, 0.2, {
                    ease: Quad.easeInOut,
                    alpha: 0.2 + Math.random() * 0.5,
                    onComplete: function() {
                        TweenMax.to(c, 0.3, {
                            x: c.originX,
                            y: c.originY,
                            ease: Quad.easeInOut,
                            alpha: 1,
                            onComplete: function() {
                                c.movement = 'jiggle';
                                tweenCircle(c);
                            }
                        });
                    }
                });
                var sr = 0.5 * Math.random();
                c.tweenscale = TweenMax.to(c.scale, 0.2, {
                    x: 1.2 + sr,
                    y: 1.2 + sr,
                    ease: Quad.easeInOut,
                    onComplete: function() {
                        TweenMax.to(c.scale, 0.3, {
                            x: 0.6,
                            y: 0.6,
                            ease: Quad.easeInOut
                        });
                    }
                });
            } else if (dir == 'out') {
                c.tween = TweenMax.to(c, 0.8, {
                    x: window.innerWidth * Math.random(),
                    y: window.innerHeight * Math.random(),
                    ease: Quad.easeInOut,
                    alpha: 0.2 + Math.random() * 0.5,
                    onComplete: function() {
                        c.movement = 'float';
                        tweenCircle(c);
                    }
                });
                var sr = 1 * Math.random();
                c.tweenscale = TweenMax.to(c.scale, 0.6, {
                    x: 1.2 + sr,
                    y: 1.2 + sr,
                    ease: Quad.easeInOut,
                    onComplete: function() {
                        TweenMax.to(c.scale, 0.2, {
                            x: 1,
                            y: 1,
                            ease: Quad.easeInOut
                        });
                    }
                });
            } else {
                if (c.movement == 'float') {
                    c.tween = TweenMax.to(c, 5 + Math.random() * 3.5, {
                        x: c.x + -100 + Math.random() * 200,
                        y: c.y + -100 + Math.random() * 200,
                        ease: Quad.easeInOut,
                        alpha: 0.1,
                        // repeat:-1,yoyo:true
                        onComplete: function() {
                            tweenCircle(c,'float');
                        }
                    });
                } else {
                    c.tween = TweenMax.to(c, 0.05, {
                        x: c.originX + Math.random() * 3,
                        y: c.originY + Math.random() * 3,
                        ease: Quad.easeInOut,
                        onComplete: function() {
                            tweenCircle(c);
                        }
                    });
                }
            }
        }

        function formText() {
            for (var i = 0, l = textPixels.length; i < l; i++) {
                circles[i].originX = offsetX + textPixels[i].x;
                circles[i].originY = offsetY + textPixels[i].y;
                tweenCircle(circles[i], 'in');
            }
            textFormed = true;
            if (textPixels.length < circles.length) {
                for (var j = textPixels.length; j < circles.length; j++) {
                    circles[j].tween = TweenMax.to(circles[j], 0.4, {
                        alpha: 0.1
                    });
                }
            }
        }

        function explode() {
            for (var i = 0, l = textPixels.length; i < l; i++) {
                tweenCircle(circles[i], 'out');
            }
            if (textPixels.length < circles.length) {
                for (var j = textPixels.length; j < circles.length; j++) {
                    circles[j].tween = TweenMax.to(circles[j], 0.4, {
                        alpha: 1
                    });
                }
            }
        }
        var word = { value: ['即使', '你', '没', '去过', '南极', '你', '的', '生活', '仍然', '很', '精彩'] };

        if (that.first === -1) {
            document.getElementById('container').innerHTML = '';
            document.getElementById('container').style.perspective = 'none';
            that.first++;
            init();

        }
    },
    initCreatejs: function() {
        var that = this;
        var stage, form, input;
        var offsetX, offsetY;
        var colors = ['#B2949D', '#FFF578', '#FF5F8D', '#37A9CC', '#188EB2'];

        function init() {
            addCanvas();
            initStages();
            initEvent();
            initText();
            initCircles();
            animate();

        }

        function addCanvas() {
            var c1 = document.createElement('canvas');
            c1.id = 'text';
            // c1.style.opacity = 0;
            document.getElementById('container').appendChild(c1);


            var c2 = document.createElement('canvas');
            c2.style.position = 'absolute';
            c2.id = 'stage';
            c2.style.top = 0;
            c2.style.left = 0;
            document.getElementById('container').appendChild(c2);


            var a1 = document.createElement('a');
            a1.style.position = 'absolute';
            a1.id = 'next-btn';
            a1.style.width = '100px';
            a1.style.height = '40px';
            a1.style.backgroundColor = 'rgba(206,206,206,0.8)';
            a1.style.bottom = '100px';
            a1.style.left = 0;
            a1.style.right = 0;
            a1.style.cursor = 'pointer';
            a1.style.margin = 'auto';
            a1.innerHTML = 'NEXT';
            document.getElementById('container').appendChild(a1);

        }

        // Init Canvas
        function initStages() {
            offsetX = (window.innerWidth - 600) / 2;
            offsetY = (window.innerHeight - 300) / 2;
            textStage = new createjs.Stage("text");
            textStage.canvas.width = 600;
            textStage.canvas.height = 200;

            stage = new createjs.Stage("stage");
            stage.canvas.width = window.innerWidth;
            stage.canvas.height = window.innerHeight;
        }

        function initEvent() {
            document.getElementById('next-btn').addEventListener('click', function() {
                var v = word.value[that.first % 11];
                if (textFormed) {
                    explode();
                    if (v !== '') {
                        createText(v); //v.toUpperCase()
                    } else {
                        textFormed = false;
                    }
                } else {
                    createText(v);
                }

            });
        }

        function initText() {
            text = new createjs.Text("t", "80px 'Source Sans Pro'", "#eee");
            text.textAlign = 'center';
            text.x = 300;
        }

        function initCircles() {
            circles = [];
            for (var i = 0; i < 600; i++) {
                var circle = new createjs.Shape();
                var r = 7;
                var x = window.innerWidth * Math.random();
                var y = window.innerHeight * Math.random();
                var color = colors[Math.floor(i % colors.length)];
                var alpha = 0.2 + Math.random() * 0.5;
                circle.alpha = alpha;
                circle.radius = r;
                circle.graphics.beginFill(color).drawCircle(0, 0, r);
                circle.x = x;
                circle.y = y;
                circles.push(circle);
                stage.addChild(circle);
                circle.movement = 'float';
                tweenCircle(circle);
            }
        }

        // animating circles
        function animate() {
            stage.update();
            requestAnimationFrame(animate);
        }

        function tweenCircle(c, dir) {
            if (c.tween)
                c.tween.kill();
            if (dir == 'in') {
                c.tween = TweenMax.to(c, 0.4, {
                    x: c.originX,
                    y: c.originY,
                    ease: Quad.easeInOut,
                    alpha: 1,
                    radius: 5,
                    onComplete: function() {
                        c.movement = 'jiggle';
                        tweenCircle(c);
                    }
                });
                c.tweenscale = TweenMax.to(c.scale, 0.4, {
                    x: 0.4,
                    y: 0.4,
                    ease: Quad.easeInOut
                });


            } else if (dir == 'out') {
                c.tween = TweenMax.to(c, 0.8, {
                    x: window.innerWidth * Math.random(),
                    y: window.innerHeight * Math.random(),
                    ease: Quad.easeInOut,
                    alpha: 0.2 + Math.random() * 0.5,
                    scale: { x: 1, y: 1 },
                    onComplete: function() {
                        c.movement = 'float';
                        tweenCircle(c);
                    }
                });
            } else {
                if (c.movement == 'float') {
                    c.tween = TweenMax.to(c, 5 + Math.random() * 3.5, {
                        x: c.x + -100 + Math.random() * 200,
                        y: c.y + -100 + Math.random() * 200,
                        ease: Quad.easeInOut,
                        alpha: 0.2 + Math.random() * 0.5,
                        onComplete: function() {
                            tweenCircle(c);
                        }
                    });
                } else {
                    c.tween = TweenMax.to(c, 0.05, {
                        x: c.originX + Math.random() * 3,
                        y: c.originY + Math.random() * 3,
                        ease: Quad.easeInOut,
                        onComplete: function() {
                            tweenCircle(c);
                        }
                    });
                }
            }
        }

        function formText() {
            for (var i = 0, l = textPixels.length; i < l; i++) {
                circles[i].originX = offsetX + textPixels[i].x;
                circles[i].originY = offsetY + textPixels[i].y;
                tweenCircle(circles[i], 'in');
            }
            textFormed = true;
            if (textPixels.length < circles.length) {
                for (var j = textPixels.length; j < circles.length; j++) {
                    circles[j].tween = TweenMax.to(circles[j], 0.4, {
                        alpha: 0.1
                    });
                }
            }
        }

        function explode() {
            for (var i = 0, l = textPixels.length; i < l; i++) {
                tweenCircle(circles[i], 'out');
            }
            if (textPixels.length < circles.length) {
                for (var j = textPixels.length; j < circles.length; j++) {
                    circles[j].tween = TweenMax.to(circles[j], 0.4, {
                        alpha: 1
                    });
                }
            }
        }
        var word = { value: ['即使', '你', '没', '去过', '南极', '你', '的', '生活', '仍然', '很', '精彩'] };

        function createText(t) {
            if (!that.first) {
                var fontSize = 860 / (t.length);
                if (fontSize > 160)
                    fontSize = 160;
                text.text = t;
                text.font = "900 " + fontSize + "px 'Source Sans Pro'";
                text.textAlign = 'center';
                text.x = 300;
                text.y = (172 - fontSize) / 2;
                textStage.addChild(text);
                textStage.update();
            } else {
                text.text = t;
                textStage.update();
            }
            that.first++;


            var ctx = document.getElementById('text').getContext('2d');
            var pix = ctx.getImageData(0, 0, 600, 200).data;
            textPixels = [];
            for (var i = pix.length; i >= 0; i -= 4) {
                if (pix[i] != 0) {
                    var x = (i / 4) % 600;
                    var y = Math.floor(Math.floor(i / 600) / 4);

                    if ((x && x % 8 == 0) && (y && y % 8 == 0))
                        textPixels.push({
                            x: x,
                            y: y
                        });
                }
            }

            formText();

        }
        if (that.first === -1) {
            document.getElementById('container').innerHTML = '';
            document.getElementById('container').style.perspective = 'none';
            that.first++;
            init();

        }
    },
    addDivChars: function(t) {
        var fs = document.createElement('div');
        fs.style.position = 'relative';
        fs.style.display = 'inline-block';
        // fs.style.opacity = 0;
        fs.style.visibility = 'hidden';
        fs.dataset.char = t;
        var tn = document.createTextNode(t);
        fs.appendChild(tn);
        document.getElementById('container').appendChild(fs);
    },

    addDivLines: function(t) {
        var fs = document.createElement('div');
        fs.style.position = 'relative';
        fs.style.display = 'inline-block';
        // fs.style.opacity = 0;
        // fs.style.display = 'none';
        fs.style.visibility = 'hidden';
        fs.style.width = '100%';
        var tn = document.createTextNode(t);
        fs.appendChild(tn);
        document.getElementById('container').appendChild(fs);
    },
    renderRandom: function(_text) {
        var that = this;

        function randomChinese() {
            //\u4E00-\u9FA5
            var b = new Array();
            b.push(String.fromCharCode(Math.round(Math.random() * 20927) + 19968));
            var s = b.join("");
            return s;
        }

        function randomColor() {
            return 'rgb(' + Math.round(255 * Math.random()) + ',' + Math.round(255 * Math.random()) + ',' + Math.round(255 * Math.random()) + ')';
        }
        var c = document.getElementById('container');
        c.innerHTML = '';
        var array = that.splitTextChars(_text);
        for (var i = 0; i < array.length; i++) {
            that.addDivChars(array[i]);
        }
        TweenMax.set(c.children, { autoAlpha: 1 });
        for (var j = 0; j < array.length; j++) {
            (function(j) {
                var r = { t: 5 };
                var w = c.children[j];
                TweenMax.fromTo(r, 1 + j * 0.05, { t: 3 }, {
                    t: 0,
                    onUpdate: function() {
                        w.style.color = randomColor();
                        w.innerHTML = randomChinese();
                    },
                    onComplete: function() {
                        w.innerHTML = array[j];
                        w.style.color = '#000';
                    }
                });
            })(j);
        }
    },
    splitTextLines: function(_text) {
        return _text.split('，');
    },
    renderLines: function(_text) {
        var that = this;
        document.getElementById('container').innerHTML = '';
        var array = that.splitTextLines(_text);
        for (var i = 0; i < array.length; i++) {
            that.addDivLines(array[i]);
        }
        // for (var j = 0; j < array.length; j++) {
        //     var b = document.getElementById('container').children[j];
        //     TweenMax.fromTo(b, 0.3, { autoAlpha: 0, rotationX: -120}, { rotationX: 0,autoAlpha: 1, transformOrigin:'center top -150',ease:'',force3D:true,delay: 0.1 + j * 0.2 });
        // }
        TweenMax.staggerFrom(document.getElementById('container').children, 0.5, {
            rotationX: -120,
            autoAlpha: 0,
            transformOrigin: 'top center -150',
            force3D: true
        }, 0.1);
    },
    renderWords1: function(_text) {
        var that = this;
        document.getElementById('container').innerHTML = '';
        var array = that.splitTextWords(_text);
        for (var i = 0; i < array.length; i++) {
            that.addDivChars(array[i]);
        }
        for (var j = 0; j < array.length; j++) {
            var b = document.getElementById('container').children[j];
            TweenMax.from(b, 0.6, {
                autoAlpha: 0,
                force3D: true
            }, j * 0.01);
            TweenMax.from(b, 0.6, {
                scale: j % 2 === 0 ? 0 : 2,
                delay: j * 0.01,
                ease: Back.easeOut
            });
        }
    },
    renderWords2: function(_text) {
        var that = this;
        document.getElementById('container').innerHTML = '';
        var array = that.splitTextWords(_text);
        for (var i = 0; i < array.length; i++) {
            that.addDivChars(array[i]);
        }
        for (var j = 0; j < array.length; j++) {
            var b = document.getElementById('container').children[j];
            TweenMax.from(b, 0.4, {
                autoAlpha: 0,
                force3D: true
            }, j * 0.01);
            TweenMax.from(b, 0.4, {
                scale: j % 2 === 0 ? 0 : 2,
                delay: j * 0.01
            });
        }
    },
    splitTextWords: function(_text) {
        // var segment = new Segment();
        // segment.useDefault();
        // var words = segment.doSegment(_text, { simple: true });
        // console.log(words);
        var words = ['即使', '你', '没', '去过', '南极', '你', '的', '生活', '仍然', '很', '精彩'];
        return words;
    },
    splitTextChars: function(_text) {
        var array = _text.split('');
        return array;
    },
    renderChars1: function(_text) {
        var that = this;
        document.getElementById('container').innerHTML = '';
        document.getElementById('container').style.perspective = '400px';
        var array = that.splitTextChars(_text);

        for (var i = 0; i < array.length; i++) {
            that.addDivChars(array[i]);
        }
        // for (var j = 0; j < array.length; j++) {
        //     var b = document.getElementById('container').children[j];
        //     TweenMax.to(b, 0.3, { opacity: 1, delay: 0.1 + j * 0.2 });
        // }
        TweenMax.staggerFrom(document.getElementById('container').children, 0.6, {
            autoAlpha: 0,
            scale: 3,
            rotationX: -180,
            transformOrigin: '100% 50%',
            // ease: Back.easeOut
        }, 0.02);
    },
    renderChars2: function(_text) {
        var that = this;
        document.getElementById('container').innerHTML = '';
        document.getElementById('container').style.perspective = '400px';
        var array = that.splitTextChars(_text);
        for (var i = 0; i < array.length; i++) {
            that.addDivChars(array[i]);
        }
        TweenMax.staggerFrom(document.getElementById('container').children, 0.2, {
            autoAlpha: 0,
            scale: 4,
            force3D: true
        }, 0.02);
    },
    renderChars3: function(_text) {
        var that = this;
        document.getElementById('container').innerHTML = '';
        document.getElementById('container').style.perspective = '400px';
        var array = that.splitTextChars(_text);
        for (var i = 0; i < array.length; i++) {
            that.addDivChars(array[i]);
        }
        TweenMax.staggerFrom(document.getElementById('container').children, 1, {
            autoAlpha: 0,
            y: function() {
                return -150 * Math.random();
            },
            ease: Power3.easeOut
        }, 0.2);
        for (var j = 0; j < array.length; j++) {
            (function(j) {
                var c = document.getElementById('container').children[j];
                var blur = { n: 4 };
                TweenMax.fromTo(blur, 1, { n: 4 }, {
                    n: 0,
                    onUpdate: function(n) {
                        var f = 'blur(' + blur.n.toFixed(2) + 'px)';
                        TweenMax.set(c, { filter: f });
                    },

                    ease: Power3.easeOut,
                    delay: j * 0.2
                });
            })(j);
        }
    },
    renderChars3Out: function() {
        TweenMax.staggerTo(document.getElementById('container').children, 1, {
            autoAlpha: 0,
            y: function() {
                return 100 * Math.random();
            },
            ease: Power2.easeIn
        });
        for (var j = 0; j < document.getElementById('container').children.length; j++) {
            (function(j) {
                var c = document.getElementById('container').children[j];
                var blur = { n: 4 };
                TweenMax.fromTo(blur, 1, { n: 0 }, {
                    n: 4,
                    onUpdate: function() {
                        var f = 'blur(' + blur.n.toFixed(2) + 'px)';
                        TweenMax.set(c, { filter: f });
                    },
                    onComplete: function() {
                        document.getElementById('container').innerHTML = '';
                    },
                    ease: Power2.easeIn,
                    delay: function() {
                        return Math.random() * 0.01
                    }
                });
            })(j);
        }

    },
    renderChars4: function(_text) {
        var that = this;
        document.getElementById('container').innerHTML = '';
        document.getElementById('container').style.perspective = '400px';
        var array = that.splitTextChars(_text);
        for (var i = 0; i < array.length; i++) {
            that.addDivChars(array[i]);
        }

        for (var j = 0; j < array.length; j++) {
            (function(j) {
                var c = document.getElementById('container').children[j];
                var blur = { n: 4 };
                TweenMax.fromTo(blur, 0.4, { n: 4 }, {
                    n: 0,
                    onUpdate: function(n) {
                        var f = 'blur(' + blur.n.toFixed(2) + 'px)';
                        TweenMax.set(c, { filter: f });
                    },
                    delay: j * 0.2
                });
            })(j);
        }

        TweenMax.staggerFrom(document.getElementById('container').children, 0.4, {
            autoAlpha: 0
        }, 0.2);
    },
    renderShine: function(_text) {
        var that = this;
        document.getElementById('container').innerHTML = '';
        document.getElementById('container').style.perspective = 'none';
        var array = that.splitTextChars(_text);
        for (var i = 0; i < array.length; i++) {
            that.addDivChars(array[i]);
        }
        // TweenMax.set(document.getElementById('container').children, {  });
        TweenMax.staggerFromTo(document.getElementById('container').children, 0.4, { autoAlpha: 0, color: '#FFF', padding: '5px' }, {
            autoAlpha: 1,
            textShadow: ' 0 0 5px #fff,0 0 10px #fff, 0 0 15px #fff, 0 0 20px #228DFF,0 0 35px #228DFF, 0 0 40px #228DFF,  0 0 50px #228DFF,   0 0 75px #228DFF'
        }, 0.2);


        // for (var j = 0; j < array.length; j++) {
        //     (function(j) {

        //         var c = document.getElementById('container').children[j];
        //         var blur = { n: 4 };
        //         TweenMax.fromTo(blur, 0.4, { n: 4 }, {
        //             n: 0,
        //             onUpdate: function(n) {
        //                 var f = 'blur(' + blur.n.toFixed(2) + 'px)';
        //                 TweenMax.set(c, { filter: f });
        //             },
        //             delay: j * 0.2
        //         });
        //     })(j);
        // }
    },
    renderFlod: function(_text) {
        var that = this;
        var c = document.getElementById('container');
        c.innerHTML = '';
        c.style.perspective = 'none';
        var array = that.splitTextChars(_text);
        for (var i = 0; i < array.length; i++) {
            that.addDivChars(array[i]);
        }

        for (var j = 0; j < c.children.length; j++) {
            c.children[j].classList.add('char');
        }

        TweenMax.staggerFromTo(c.children, 0.4, { autoAlpha: 0 }, {
            autoAlpha: 1
        }, 0.2);

    },
    rootResize2: function() {
        //orientation landscape width=1334px
        var wFsize;
        var wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width :
            window.innerWidth : window.innerWidth;
        var wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ?
            screen.height : window.innerHeight : window.innerHeight;
        if (wWidth > wHeight) {
            wHeight = wWidth;
        }
        wFsize = wHeight / 13.34;
        document.getElementsByTagName('html')[0].style.fontSize = wFsize + 'px';
    },
    rootResize1: function() {
        //orientation landscape width=1334px
        var that = this;
        var Dpr = 1,
            uAgent = window.navigator.userAgent;
        var isIOS = uAgent.match(/iphone/i);
        var isYIXIN = uAgent.match(/yixin/i);
        var is2345 = uAgent.match(/Mb2345/i);
        var ishaosou = uAgent.match(/mso_app/i);
        var isSogou = uAgent.match(/sogoumobilebrowser/ig);
        var isLiebao = uAgent.match(/liebaofast/i);
        var isGnbr = uAgent.match(/GNBR/i);
        var isWeixin = uAgent.match(/MicroMessenger/i);
        var wFsize;
        var wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width :
            window.innerWidth : window.innerWidth;
        var wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ?
            screen.height : window.innerHeight : window.innerHeight;
        if (isIOS) {
            wWidth = screen.width;
            wHeight = screen.height;
        }
        if (wWidth > wHeight) {
            wHeight = wWidth;
        }
        wFsize = wHeight / 13.34;
        if (isYIXIN || is2345 || ishaosou || isSogou || isLiebao || isGnbr || isWeixin) { //YIXIN 和 2345 这里有个刚调用系统浏览器时候的bug，需要一点延迟来获取
            setTimeout(function() {
                wHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                wWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                if (wWidth > wHeight) {
                    wHeight = wWidth;
                }
                wFsize = wHeight / 13.34;
                // wFsize = wFsize > 32 ? wFsize : 32;
                document.getElementsByTagName('html')[0].style.fontSize = wFsize + 'px';
            }, 500);
        } else {
            document.getElementsByTagName('html')[0].style.fontSize = wFsize + 'px';
        }

        return that;

    },
    eventInit: function() {
        var that = this;
        document.addEventListener('touchstart', function(e) {}, false);
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);
        var c2d = document.getElementById('c2d');
        c2d.addEventListener('click', function() {
            // that.initCreatejs();
            that.initPixijs()
        });


        var chars1 = document.getElementById('chars1');
        chars1.addEventListener('click', function() {
            that.renderChars1('即使你没去过南极，你的生活仍然很精彩');
        });
        var chars2 = document.getElementById('chars2');
        chars2.addEventListener('click', function() {
            that.renderChars2('即使你没去过南极，你的生活仍然很精彩');
        });
        var chars3 = document.getElementById('chars3');
        chars3.addEventListener('click', function() {
            that.renderChars3('即使你没去过南极，你的生活仍然很精彩');
        });

        var chars3out = document.getElementById('chars3out');
        chars3out.addEventListener('click', function() {
            that.renderChars3Out();
        });
        var chars4 = document.getElementById('chars4');
        chars4.addEventListener('click', function() {
            that.renderChars4('即使你没去过南极，你的生活仍然很精彩');
        });
        var lines = document.getElementById('lines');
        lines.addEventListener('click', function() {
            that.renderLines('即使你没去过南极，你的生活仍然很精彩');
        });
        var words1 = document.getElementById('words1');
        words1.addEventListener('click', function() {
            //分词器
            that.renderWords1('即使你没去过南极，你的生活仍然很精彩');
        });
        var words2 = document.getElementById('words2');
        words2.addEventListener('click', function() {
            //分词器
            that.renderWords2('即使你没去过南极，你的生活仍然很精彩');
        });

        var random = document.getElementById('random');
        random.addEventListener('click', function() {
            that.renderRandom('即使你没去过南极，你的生活仍然很精彩');
        });

        var shine = document.getElementById('shine');
        shine.addEventListener('click', function() {
            that.renderShine('即使你没去过南极，你的生活仍然很精彩');
        });

        var flod = document.getElementById('flod');
        flod.addEventListener('click', function() {
            that.renderFlod('即使你没去过南极，你的生活仍然很精彩');
        });

        return that;
    },
    cssInit: function() {
        var that = this;
        /*
        that.rootResize1();
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
            if (window.orientation == 90 || window.orientation == -90) {
                //横屏
                //_.renderShuping();
                that.rootResize();
            } else {
                //竖屏
                //_.closeShuping();
            }
        }, false);
        */
        var noChangeCountToEnd = 100,
            noEndTimeout = 1000;
        that.rootResize2();
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
            var interval,
                timeout,
                end,
                lastInnerWidth,
                lastInnerHeight,
                noChangeCount;
            end = function() {
                // "orientationchangeend"
                clearInterval(interval);
                clearTimeout(timeout);
                interval = null;
                timeout = null;
                that.rootResize1();
            };
            interval = setInterval(function() {
                if (window.innerWidth === lastInnerWidth && window.innerHeight === lastInnerHeight) {
                    noChangeCount++;
                    if (noChangeCount === noChangeCountToEnd) {
                        // The interval resolved the issue first.
                        end();
                    }
                } else {
                    lastInnerWidth = window.innerWidth;
                    lastInnerHeight = window.innerHeight;
                    noChangeCount = 0;
                }
            });
            timeout = setTimeout(function() {
                // The timeout happened first.
                end();
            }, noEndTimeout);
        });

        return that;
    }
};

window.onload = function() {
    window.h5.cssInit().eventInit();
};


function showStats() {
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    var fs = document.createElement('div');
    fs.style.position = 'absolute';
    fs.style.left = 0;
    fs.style.top = 0;
    fs.style.zIndex = 999;
    fs.appendChild(stats.domElement);
    document.body.appendChild(fs);

    function animate() {
        stats.begin();
        // monitored code goes here
        stats.end();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}
showStats();