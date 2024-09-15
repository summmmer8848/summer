'use strict';

// 这个函数为传入的元素数组添加事件监听器。
// elements: 要添加事件监听器的元素数组。
// eventType: 事件类型，如 "click" 或 "mouseover"。
// callback: 事件触发时调用的回调函数。




//loading





//顶部动画效果c+

// 确保动画在页面加载完成后执行
window.addEventListener("load", function () {
  gsap.registerEffect({
    name: 'randomFade',
    extendTimeline: true,
    defaults: {
      x: 0,
      y: 0,
      duration: 1,
      ease: 'power1',
      scale: 1,
      direction: 'in'
    },
    effect: (targets, config) => {
      let tl = gsap.timeline();//定义的一条时间线
      if (config.direction === 'in') {
        tl.from(targets, {
          opacity: 0,
          duration: config.duration,
          ease: config.ease,
          x: config.x,
          y: config.y,
          scale: config.scale,
          stagger: { each: 0.05, from: 'random' }
        })
      } else {
        tl.to(targets, {
          opacity: 0,
          duration: 0.5,
          ease: config.ease,
          x: config.x,
          y: config.y,
          scale: config.scale,
          stagger: { each: 0.05, from: 'center' }
        })
      }
      return tl;
    }
  });


  const lists = document.querySelectorAll('.logohuai');
  let animation = gsap.timeline({ repeat: -1 });

  lists.forEach(ele => {
    let myTexts = splitText(ele);
    animation.randomFade(myTexts, { y: 50, duration: 1.5 }).randomFade(myTexts, { y: -50, direction: 'out' }, '>2');
  });

  function splitText(ele, split = '') {
    let splitChars = ele.innerHTML
      .split(split)
      .map((v) => {
        return `<span class="inline-block">${v}</span>`;
      })
      .join("");
    ele.innerHTML = splitChars;
    let chars = ele.querySelectorAll("span");
    return chars;
  }

});



function disableHorizontalScroll() {
  document.body.style.overflowX = 'hidden';
}

function enableHorizontalScroll() {
  document.body.style.overflowX = ''; // 这将重置 overflowX 属性
}


//nav 
const tl = gsap.timeline({ paused: true });

try {
  let path = document.querySelector(".overlay svg path");
  let spanBefore = CSSRulePlugin.getRule("#hamburger span::before");

  gsap.set(spanBefore, { background: "#000" });
  gsap.set(".menu", { visibility: "hidden" });

  function revealMenu() {
    revealMenuItems();

    const hamburger = document.getElementById("hamburger");
    const toggleBtn = document.getElementById("toggle-btn");
    const overlay = document.querySelector(".overlay");

    toggleBtn.onclick = function (e) {
      hamburger.classList.toggle("active");

      if (tl.reversed()) {
        tl.play();
        overlay.classList.remove("hidden");
        overlay.style.pointerEvents = "auto"; // 允许交互
        isMenuOpen = true;
        disableHorizontalScroll();
      } else {
        tl.reverse().then(() => {
          overlay.style.pointerEvents = "none"; // 禁止交互
          isMenuOpen = false;
          enableHorizontalScroll();
        });
      }
    };

    document.querySelectorAll(".menu-item > a").forEach(item => {
      item.onclick = () => {
        tl.reverse().then(() => {
          overlay.style.opacity = 0;
          overlay.style.pointerEvents = "none";
          isMenuOpen = false;
          enableHorizontalScroll();
          document.body.style.overflow = '';
        });
      };
    });
  }

  revealMenu();

  function revealMenuItems() {
    const start = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
    const end = "M0,1005S175,955,500,995s500,5,500,5V0H0Z";

    const power2 = "power2.inOut";
    const power4 = "power4.inOut";
    const power5 = "Power2.easeIn";
    const power6 = "Power2.easeOut";

    tl.to("#hamburger", 1.25, {
      marginTop: "-5px",
      x: -40,
      y: 40,
      ease: power4
    });

    tl.to("#hamburger span", 1, {
      background: "#e2e2dc",
      ease: power2,
    }, "<");

    tl.to(spanBefore, 1, {
      background: "#e2e2dc",
      ease: power2,
    }, "<");

    tl.to(".btn .btn-outline", 1.25, {
      x: -40,
      y: 40,
      width: "140px",
      height: "140px",
      border: "1px solid #e2e2dc",
      ease: power4,
    }, "<");

    tl.to(path, 0.8, {
      attr: {
        d: start,
      },
      ease: power5
    }, "<").to(path, 0.8, {
      attr: {
        d: end,
      },
      ease: power6,
    }, ">");

    tl.to(".menu", 0.8, {
      visibility: "visible",
    }, "-=0.5");

    tl.to(".menu-item > a", 1, {
      top: 0,
      ease: "power3.out",
      stagger: {
        amount: 0.5
      },
    }, "-=1").reverse();
  }
} catch (error) {
  console.error("Error accessing CSS rules:", error);
}







//
gsap.registerPlugin(ScrollTrigger);

let target = 0;
let current = 0;
let ease = 0.1;

const slider = document.querySelector(".slider");
const sliderWrapper = document.querySelector(".slider-wrapper");
const slides = document.querySelectorAll(".slide");

let maxScroll = (sliderWrapper.offsetWidth - window.innerWidth - 2/3*(window.innerWidth));

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function updateScaleAndPosition() {
  const sliderCenter = window.innerWidth / 2; // 在函数内部计算滑块中心位置

  slides.forEach((slide) => {
    const rect = slide.getBoundingClientRect(); // 保留实时获取 rect
    const centerPosition = (rect.left + rect.right) / 2;
    const distanceFromCenter = centerPosition - sliderCenter;

    let scale, offsetX;
    if (distanceFromCenter > 0) {
      scale = Math.min(1.75, 1 + distanceFromCenter / window.innerWidth);
      offsetX = (scale - 1) * 300;
    } else {
      scale = Math.max(
        0.5,
        1 - Math.abs(distanceFromCenter) / window.innerWidth
      );
      offsetX = 0;
    }

    gsap.set(slide, {
      scale: scale,
      x: offsetX,
    });
  });
}

function update() {
  current = lerp(current, target, ease);
  gsap.set(".slider-wrapper", {
    x: -current,
    force3D: true,
  });

  updateScaleAndPosition();
  requestAnimationFrame(update);
}

// Scroll behavior management
let verticalScrollEnabled = false;
let isMenuOpen = false;
let touchStartY = 0;

function handleScroll(e) {
  if (!isMenuOpen) {
    if (!verticalScrollEnabled) {
      target += e.deltaY;
      target = Math.max(0, target);
      target = Math.min(maxScroll, target);

      if (target >= maxScroll && e.deltaY > 0) {
        verticalScrollEnabled = true;
        document.body.style.overflowY = 'auto';
      } else if (target < maxScroll) {
        e.preventDefault();
      }
    } else {
      if (window.scrollY === 0 && e.deltaY < 0) {
        verticalScrollEnabled = false;
        document.body.style.overflowY = 'hidden';
        e.preventDefault();
      }
    }
  }
}

function handleTouchMove(e) {
  if (!isMenuOpen && !verticalScrollEnabled) {
    const touchDeltaY = touchStartY - e.touches[0].clientY;

    if (touchDeltaY > 0) {
      target += touchDeltaY;
      target = Math.max(0, target);
      target = Math.min(maxScroll, target);

      if (target >= maxScroll) {
        verticalScrollEnabled = true;
        document.body.style.overflowY = 'auto';
      }
      e.preventDefault();
    }
  }
}

window.addEventListener("wheel", handleScroll, { passive: false });

window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
});

window.addEventListener("touchmove", handleTouchMove, { passive: false });

requestAnimationFrame(update);







window.addEventListener("load", function () {
  // 延迟执行，确保所有内容加载完毕后再重置滚动
  setTimeout(() => {
    // 重置Y轴滚动到顶部
    window.scrollTo(0, 0);

    // 重置X轴的滑动到初始位置
    target = 0;
    current = 0;

    // 使用GSAP将滑动位置重置到初始位置
    gsap.set(".slider-wrapper", {
      x: -current,
      force3D: true,
    });
  }, 100); // 延迟100毫秒
});




const demoText = document.querySelector('.demo-text');
const introduction = document.querySelector(".introduction");
const splitTypes = document.querySelectorAll('.reveal-type');


// 创建 IntersectionObserver
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 根据不同的条件触发不同的动画,
      if (entry.target.classList.contains('demo-text')) {
        const sections = gsap.utils.toArray('section');
        sections.forEach((section, index) => {
          const wrapper = section.querySelector('.wrapper');
          if (wrapper) {
            const [x, xEnd] = (index != 0) ? [wrapper.scrollWidth * -1.5, 0.5] : ['150%', (wrapper.scrollWidth - section.offsetWidth) * -0.5];
            gsap.fromTo(wrapper, { x }, {
              x: xEnd,
              scrollTrigger: {
                trigger: section,
                scrub: 0.5,
              }
            });
          }
        });
      }

      // 停止观察，确保动画只触发一次
      observer.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: "0px",
  threshold: 0.1 // 在元素进入视口10%时触发
});

// 监控不同的元素
// const introduction = document.querySelector('.introduction');


observer.observe(demoText);







splitTypes.forEach((char, i) => {

  const bg = char.dataset.bgColor
  const fg = char.dataset.fgColor

  // 手动将文本分割为字符并包裹在 <span> 标签中
  const text = char.innerText
  char.innerHTML = '' // 清空原有内容

  // 将每个字符包裹在 <span> 中并添加回元素
  text.split('').forEach(letter => {
    const span = document.createElement('span')
    span.textContent = letter
    char.appendChild(span)
  })

  // 获取所有字符的 span 标签
  const chars = char.querySelectorAll('span')

  gsap.fromTo(chars,
    {
      opacity: 1,
      color: bg,
    },
    {
      opacity: 0,
      duration: 0.3,
      stagger: 0.02,
      scrollTrigger: {
        trigger: char,
        start: 'top 40%',
        end: 'top 10%',
        scrub: true,
        markers: false,
        toggleActions: 'play play reverse reverse'
      }
    })
})





const ballTL = gsap.timeline({ repeat: -1, defaults: { duration: 2, ease: 'none' } })
  .to('#b1', {
    scale: 0.75,
    motionPath: {
      path: "#b1Path",
      align: "#b1Path",
      start: 0.25,
      end: 0.75
    }
  }, 0)
  .add(() => document.querySelector('.mg-back').append(document.querySelector('#b1')), 1)
  .to('#b1', {
    scale: 1,
    motionPath: {
      path: "#b1Path",
      align: "#b1Path",
      start: 0.75,
      end: 1.25
    }
  }, 2)
  .add(() => document.querySelector('.mg-front').append(document.querySelector('#b1')), 3)
  .to('#b1-dark', { scaleY: 0.8, ease: 'sine.inOut', transformOrigin: '88% 80%', yoyo: true, repeat: 1 }, 0)
  .to('#b1 ellipse', { scale: 0.6, ease: 'sine.inOut', transformOrigin: '0 50%', yoyo: true, repeat: 1 }, 0)
  .timeScale(0.25)

window.onclick = () => ballTL.isActive() ? ballTL.pause() : ballTL.play() //toggle play on click

gsap.timeline({
  scrollTrigger: {
    trigger: '#s1',
    start: 'bottom bottom',
    endTrigger: '#s2',
    end: '0 0',
    scrub: 0.1
  }
})
  .to('.ring2', { y: 99, scaleY: 1.08 }, 0)
  .fromTo('.ring1', { y: 2 }, { y: 60, skewY: 3 }, 0)
// .from('svg', {attr:{viewBox:'1 0 999 200'}}, 0)




