// Liquid Glass UI Effects - JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // 创建浮动气泡背景
  createBubbles();
  
  // 添加滚动动画
  initScrollAnimations();
  
  // 添加鼠标视差效果
  initParallaxEffect();
});

// 创建浮动气泡
function createBubbles() {
  const bubblesContainer = document.createElement('div');
  bubblesContainer.className = 'liquid-bubbles';
  document.body.appendChild(bubblesContainer);
  
  const bubbleCount = 8;
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'liquid-bubble';
    
    // 随机大小
    const size = Math.random() * 80 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // 随机位置
    bubble.style.left = `${Math.random() * 100}%`;
    
    // 随机延迟和持续时间
    bubble.style.animationDelay = `${Math.random() * 15}s`;
    bubble.style.animationDuration = `${Math.random() * 10 + 15}s`;
    
    bubblesContainer.appendChild(bubble);
  }
}

// 滚动动画初始化
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // 观察所有卡片和项目元素
  document.querySelectorAll('.liquid-card, article, .group').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// 添加 animate-in 类样式
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// 鼠标视差效果
function initParallaxEffect() {
  const cards = document.querySelectorAll('.liquid-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// 导航栏滚动效果
let lastScrollY = window.scrollY;
const nav = document.querySelector('header');

window.addEventListener('scroll', () => {
  if (nav) {
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
  }
});
