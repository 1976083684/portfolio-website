/* ============================================================
 *  应用初始化与特效模块
 *
 *  职责：页面加载入口、打字动画、Canvas 背景、鼠标光效、
 *        滚动动画、导航高亮、移动端菜单、联系表单、键盘事件
 *
 *  全局变量：
 *  - tTimer: 打字动画定时器引用
 *
 *  函数：
 *  - startTyping(): 头衔轮播打字动画
 *  - initBg(): Hero 区 Canvas 流动光斑 + 微粒子
 *  - initCursor(): 鼠标跟随光效
 *  - initReveal(): IntersectionObserver 滚动入场动画
 *  - initNav(): 导航栏高亮联动
 *  - closeMM(): 关闭移动端菜单
 * ============================================================ */

/* --- 打字动画定时器 --- */
let tTimer = null;

/* ============================================================
 *   打字效果 — 头衔轮播
 * ============================================================ */

/**
 * 启动头衔打字动画
 * 逐字显示 → 停顿 → 逐字删除 → 切换下一个头衔 → 循环
 */
function startTyping() {
  if (tTimer) clearTimeout(tTimer);
  const el = document.getElementById('typingText');
  if (!el) return;
  const ts = cfg.personal.titles;
  if (!ts.length) return;
  let ti = 0, ci = 0, del = false;

  function tick() {
    const cur = ts[ti];
    if (!del) {
      el.textContent = cur.slice(0, ci + 1);
      ci++;
      if (ci >= cur.length) { del = true; tTimer = setTimeout(tick, 2000); return; }
      tTimer = setTimeout(tick, 80);
    } else {
      el.textContent = cur.slice(0, ci - 1);
      ci--;
      if (ci <= 0) { del = false; ti = (ti + 1) % ts.length; tTimer = setTimeout(tick, 400); return; }
      tTimer = setTimeout(tick, 40);
    }
  }
  tick();
}

/* ============================================================
 *   背景动画 — Canvas 流动光斑 + 微粒子
 * ============================================================ */

/**
 * 初始化 Hero 区 Canvas 背景动画
 * - 4 个缓慢漂移的径向渐变光斑
 * - 100 个微弱发光粒子 + 少量连线
 * - 鼠标位置对光斑有微弱影响
 */
function initBg() {
  const cv = document.getElementById('heroCanvas');
  const ctx = cv.getContext('2d');
  let w, h, mx = 0.5, my = 0.5;

  /** 响应窗口尺寸变化 */
  function resize() {
    const r = cv.getBoundingClientRect();
    w = cv.width = r.width;
    h = cv.height = r.height;
  }
  resize();
  window.addEventListener('resize', resize);

  /* 光斑配置（位置、半径、速度、颜色、透明度） */
  const blobs = [
    { x: 0.3, y: 0.4, r: 0.35, vx: 0.00012, vy: 0.00008, color: [0, 229, 160], op: 0.06 },
    { x: 0.7, y: 0.6, r: 0.30, vx: -0.00010, vy: 0.00006, color: [0, 180, 220], op: 0.05 },
    { x: 0.5, y: 0.3, r: 0.28, vx: 0.00008, vy: -0.00010, color: [60, 255, 200], op: 0.04 },
    { x: 0.2, y: 0.7, r: 0.25, vx: -0.00006, vy: 0.00009, color: [0, 200, 170], op: 0.035 },
  ];

  /* 微粒子初始化（100个随机分布） */
  const pts = [];
  for (let i = 0; i < 100; i++) {
    pts.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.0002,
      vy: (Math.random() - 0.5) * 0.0002,
      a: Math.random() * 0.4 + 0.15,
      ph: Math.random() * Math.PI * 2
    });
  }

  /**
   * 每帧绘制（requestAnimationFrame 循环）
   * @param {number} now - 时间戳
   */
  function draw(now) {
    ctx.clearRect(0, 0, w, h);

    /* 绘制光斑 */
    blobs.forEach(b => {
      b.x += b.vx; b.y += b.vy;
      /* 边界反弹 */
      if (b.x < 0.1 || b.x > 0.9) b.vx *= -1;
      if (b.y < 0.1 || b.y > 0.9) b.vy *= -1;
      /* 鼠标微弱影响 */
      b.x += (mx - 0.5) * 0.00003;
      b.y += (my - 0.5) * 0.00003;

      const cx = b.x * w, cy = b.y * h;
      const rad = Math.max(1, b.r * Math.min(w, h));
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      grd.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},${b.op})`);
      grd.addColorStop(0.5, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},${b.op * 0.4})`);
      grd.addColorStop(1, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0)`);
      ctx.fillStyle = grd;
      ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
    });

    /* 绘制微粒子 */
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.ph += 0.012;
      if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      const a = p.a * (0.5 + 0.5 * Math.sin(p.ph));
      const px = p.x * w, py = p.y * h;

      /* 柔和光晕 */
      const g2 = ctx.createRadialGradient(px, py, 0, px, py, Math.max(0.1, p.r * 5));
      g2.addColorStop(0, `rgba(0,229,160,${a * 0.5})`);
      g2.addColorStop(1, `rgba(0,229,160,0)`);
      ctx.fillStyle = g2;
      ctx.fillRect(px - p.r * 5, py - p.r * 5, p.r * 10, p.r * 10);

      ctx.beginPath(); ctx.arc(px, py, Math.max(0.1, p.r), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,255,240,${a})`; ctx.fill();
    });

    /* 极少量连线（距离 < 0.15 的粒子对） */
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.15) {
          ctx.beginPath(); ctx.moveTo(pts[i].x * w, pts[i].y * h); ctx.lineTo(pts[j].x * w, pts[j].y * h);
          ctx.strokeStyle = `rgba(0,229,160,${0.05 * (1 - d / 0.15)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  /* 鼠标事件 — 影响光斑漂移方向 */
  cv.addEventListener('mousemove', e => {
    const r = cv.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width;
    my = (e.clientY - r.top) / r.height;
  });
  cv.addEventListener('mouseleave', () => { mx = 0.5; my = 0.5; });

  requestAnimationFrame(draw);
}

/* ============================================================
 *   鼠标光效
 * ============================================================ */

/**
 * 初始化鼠标跟随光效
 * 光效 div 跟随鼠标移动（通过 CSS transform）
 */
function initCursor() {
  const g = document.getElementById('cursorGlow');
  document.addEventListener('mousemove', e => {
    g.style.left = e.clientX + 'px';
    g.style.top = e.clientY + 'px';
  });
}

/* ============================================================
 *   滚动入场动画
 * ============================================================ */

/**
 * 初始化 IntersectionObserver 滚动动画
 * 元素进入视口时添加 .visible 类触发 CSS transition
 * 技能进度条延迟 200ms 触发填充动画
 */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        en.target.querySelectorAll('.skill-fill').forEach(b => {
          setTimeout(() => b.classList.add('anim'), 200);
        });
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ============================================================
 *   导航高亮
 * ============================================================ */

/**
 * 初始化导航栏高亮联动
 * 滚动到对应区块时自动高亮导航链接
 */
function initNav() {
  const ids = ['about', 'projects', 'skills', 'experience', 'contact'];
  const lks = document.querySelectorAll('#deskNav .nav-link');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        lks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { threshold: 0.3 });
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
}

/* ============================================================
 *   移动端菜单
 * ============================================================ */

/** 关闭移动端全屏菜单 */
function closeMM() {
  document.getElementById('mobMenu').classList.remove('open');
}

/* 汉堡菜单点击切换 */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobMenu').classList.toggle('open');
});

/* ============================================================
 *   联系表单
 * ============================================================ */

/* 表单提交（前端校验 + Toast 提示） */
document.getElementById('cForm').addEventListener('submit', function (e) {
  e.preventDefault();
  let v = true;
  this.querySelectorAll('input, textarea').forEach(i => { if (!i.value.trim()) v = false; });
  if (v) {
    toast('消息已发送，感谢你的联系！');
    this.reset();
  } else {
    toast('请填写所有字段', 'err');
  }
});

/* ============================================================
 *   键盘快捷键
 * ============================================================ */

/* ESC 关闭所有弹窗 */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeAdmin();
    closeMM();
    closeDetail();
    closeLogin();
  }
});

/* ============================================================
 *   登录触发器（右下角齿轮按钮）
 * ============================================================ */

document.getElementById('adminTrigger').addEventListener('click', () => {
  if (unlocked) { openAdmin(); return; }
  /* 未登录 → 显示登录弹框 */
  document.getElementById('loginPwd').value = '';
  document.getElementById('loginPwd').type = 'password';
  const icon = document.querySelector('#loginOv .pwd-toggle i');
  if (icon) icon.className = 'fa-solid fa-eye';
  document.getElementById('loginOv').classList.add('open');
  setTimeout(() => document.getElementById('loginPwd').focus(), 100);
});

/* ============================================================
 *   应用入口 — DOMContentLoaded
 * ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  /* 加载配置 */
  cfg = await loadCfg();
  /* 渲染页面 */
  renderAll();
  /* 启动特效 */
  startTyping();
  initBg();
  initCursor();
  initReveal();
  initNav();
});
