let targetY = 0, animY = 0, currentY = 0, ease = 0.1;

const isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
const isChrome = navigator.userAgent.indexOf("Chrome") > -1;

const colors = {
    white: '0xffffff',
    black: '0x000000',
    trans : 'transparent',
    darkWhite : '0xfefefe'
}
function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}
function getTranslate(el) {
    const translate = {}
    if (!window.getComputedStyle) return;

    const style = getComputedStyle(el);
    const transform = style.transform || style.webkitTransform || style.mozTransform;

    let mat = transform.match(/^matrix3d\((.+)\)$/);
    if (mat) return parseFloat(mat[1].split(', ')[13]);

    mat = transform.match(/^matrix\((.+)\)$/);
    translate.x = mat ? parseFloat(mat[1].split(', ')[4]) : 0;
    translate.y = mat ? parseFloat(mat[1].split(', ')[5]) : 0;

    return translate;
}
const getMousePos = (ev) => {
    let posx = 0;
    let posy = 0;
    if (!ev) ev = window.event;
    if (ev.pageX || ev.pageY) {
        posx = ev.pageX;
        posy = ev.pageY;
    }
    else if (ev.clientX || ev.clientY) {
        posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
        posy = ev.clientY + body.scrollTop + docEl.scrollTop;
    }
    return { x: posx, y: posy };
}
//variables

const main = document.querySelector('.main');
const content = document.querySelector('.scroll-content');

const limit = main.getBoundingClientRect().height - window.innerHeight;
function initHome() {
    document.body.classList.add('loading');
    anime.set(main, { overflow: 'hidden'});
    anime.set(content, { overflow: 'hidden' });
    
    console.log('init-home');
    setTimeout(() => {
        document.body.classList.remove('loading');
        initEverything();
    }, 2000);
}
function initEverything(){
    document.addEventListener('wheel', initScroll)
    const works = document.querySelectorAll('.item');
    works.forEach((el, i) => {
        el.firstElementChild.setAttribute('data-work', i + 1)
        el.firstElementChild.nextElementSibling.setAttribute('data-work', i + 1)
        el.firstElementChild.addEventListener('mouseenter', workMouseEnterFn);
        el.firstElementChild.addEventListener('mouseleave', workMouseLeaveFn);
    });
    function workMouseEnterFn(e) {
        let g = e.target.getAttribute('data-work');

    }
    function workMouseLeaveFn(e) {
        let g = e.target.getAttribute('data-work');

    }
//pixi-webgl things

    const app = new PIXI.Application(window.innerWidth,window.innerHeight,{
        transparent : true,
        resolution : 2,
        antialias : false,
        autoResize: true
    });
    app.view.setAttribute('id','canvas');
    main.appendChild(app.view);

    var cont = new PIXI.Container();
    app.stage.addChild(cont);

    var scrolltxt = new PIXI.Text('scroll',{
        fontFamily : 'league',
        fontSize : 50,
        fontWeight : 700,
        fill : colors.black
    })
    scrolltxt.anchor.set(0.5,0.5);
    scrolltxt.x = window.innerWidth/2;
    scrolltxt.y = window.innerHeight/2;
    cont.addChild(scrolltxt);

    var bgOne = new PIXI.Graphics;
    bgOne.beginFill(colors.black);
    bgOne.drawRect(0,0,window.innerWidth,window.innerHeight);
    cont.addChild(bgOne);

    // var mask_1 = new PIXI.Graphics;
    // mask_1.beginFill(colors.black);
    // mask_1.drawRect(0,0,window.innerWidth,window.innerHeight);
    // cont.addChild(mask_1);

    var txt_1 = new PIXI.Text('Creative',{
        fontFamily : 'league',
        fontSize : 200,
        fontWeight : 900,
        fill : colors.darkWhite,
        // stroke : colors.black,
        // strokeThickness : 1.5
    })
    txt_1.anchor.set(0.5,0.5);
    txt_1.x = 0;
    txt_1.y = window.innerHeight/3;
    cont.addChild(txt_1);

    var txt_2 = new PIXI.Text('Developer',{
        fontFamily : 'league',
        fontSize : 200,
        fontWeight : 900,
        fill : colors.darkWhite,
        // stroke : colors.black,
        // strokeThickness : 1.5
    })
    txt_2.anchor.set(0.5,0.5);
    txt_2.x = 0;
    txt_2.y = window.innerHeight/1.5;
    cont.addChild(txt_2);

    
    var bgTwo = new PIXI.Graphics;
    bgTwo.beginFill(colors.darkWhite);
    bgTwo.drawRect(0,0,window.innerWidth,window.innerHeight*8);
    cont.addChild(bgTwo);


    var tl = anime.timeline({
        loop: false,
        autoplay: false,
        delay : 0,
    });
    tl.add({
        targets : bgOne,
        x : [window.innerWidth,0],
        easing : 'easeOutQuart',
        duration:1000
    })
    tl.add({
        targets : scrolltxt,
        alpha : [1,0],
        easing : 'easeOutQuart',
        duration:1000
    })
    tl.add({
        targets : txt_1,
        x : [-window.innerWidth*1.5,window.innerWidth/2],
        easing : 'easeOutQuart',
        duration:2000
    },2000)
    tl.add({
        targets : txt_2,
        x : [window.innerWidth*1.5,window.innerWidth/2],
        easing : 'easeOutQuart',
        duration:2000
    },2000)
    tl.add({
        targets : bgOne,
        x : [0,-window.innerWidth],
        easing : 'easeOutQuad',
        duration:3000
    })
    tl.add({
        targets : bgTwo,
        y : [window.innerHeight*1.5,-window.innerHeight],
        easing : 'easeOutQuad',
        duration:3000
    })
    
    
    
    function initScroll(e) {

        if (e.deltaY < 0) { this.direction = 'down' } else { this.direction = 'up' }
        if (isFirefox && e.deltaMode == 1) {
            e.deltaX *= 15;
            e.deltaY *= 15;
        }
        targetY += e.deltaY * -10;
        targetY = Math.max((limit) * -1, targetY);
        targetY = Math.min(0.0001, targetY);
        animY = (targetY / 30);
    }

    update();

    function update() {
        requestAnimationFrame(update);
        let p = 0;
        currentY += (targetY - currentY) * ease;
        transform(content, 0, currentY, 0.2)
       tl.seek((currentY / -1000) * tl.duration);
    }

    function transform(element, x, y, delay) {
        var transform;

        if (!delay) {
            transform = "matrix(1,0,0,1,".concat(x, ",").concat(y, ")");
        } else {
            var start = getTranslate(element);
            var lerpX = lerp(start.x, x, delay);
            var lerpY = lerp(start.y, y, delay);
            transform = "matrix(1,0,0,1,".concat(lerpX, ",").concat(lerpY, ")");
        }

        element.style.webkitTransform = transform;
        element.style.msTransform = transform;
        element.style.transform = transform;
    }
}
    





window.addEventListener('load', initHome);