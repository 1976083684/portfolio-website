/* ============================================================
 *  前台页面渲染模块
 *
 *  职责：根据 cfg 数据渲染首页所有可见区块
 *
 *  函数：
 *  - renderAll(): 一次性渲染所有区块
 *  - renderHero(): Hero 区（姓名、头衔打字、简介、社交链接）
 *  - renderAbout(): 关于我（两段介绍 + 统计数字卡片）
 *  - renderProjects(): 作品区（筛选栏 + 卡片网格）
 *  - sortProjects(arr): 根据 cfg.sortMode 排序作品数组
 *  - renderProjGrid(f): 渲染指定筛选条件的作品卡片
 *  - openDetail(id) / closeDetail(): 作品详情弹框
 *  - renderSkills(): 技能分类 + 进度条
 *  - renderExperience(): 工作经历时间线
 *  - renderContact(): 联系方式列表
 *  - renderFooter(): 页脚版权 + 社交图标
 * ============================================================ */

/**
 * 渲染所有页面区块（调用各子渲染函数）
 */
function renderAll() {
  updateTitle();
  renderHero();
  renderAbout();
  renderProjects();
  renderSkills();
  renderExperience();
  renderContact();
  renderFooter();
}

/**
 * 渲染 Hero 区
 * - 设置姓名、Logo、简介
 * - 生成社交链接图标
 */
function renderHero() {
  const p = cfg.personal;
  document.getElementById('heroName').textContent = p.name;
  document.getElementById('navLogo').textContent = p.logo;
  document.getElementById('heroBio').textContent = p.bio;

  /* 社交链接 */
  let sh = [];
  if (p.github) sh.push(`<a href="${p.github}" target="_blank" class="social-lk" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>`);
  if (p.twitter) sh.push(`<a href="${p.twitter}" target="_blank" class="social-lk" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>`);
  if (p.linkedin) sh.push(`<a href="${p.linkedin}" target="_blank" class="social-lk" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>`);
  if (p.email) sh.push(`<a href="mailto:${p.email}" class="social-lk" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>`);
  document.getElementById('heroSocial').innerHTML = sh.join('');
}

/**
 * 渲染关于我区块
 * - 两段文字介绍
 * - 统计数字网格（年开发经验、完成项目等）
 */
function renderAbout() {
  const p = cfg.personal;
  document.getElementById('aboutT1').textContent = p.aboutText1;
  document.getElementById('aboutT2').textContent = p.aboutText2;
  document.getElementById('statsGrid').innerHTML = (p.stats || []).map(s => `
    <div class="card-b p-6 text-center"><div class="stat-num">${esc(s.value)}</div><p class="mt-2 text-sm" style="color:var(--txt2)">${esc(s.label)}</p></div>
  `).join('');
}

/**
 * 渲染作品区块
 * - 从所有作品中提取去重标签生成筛选栏
 * - 绑定筛选按钮点击事件
 * - 渲染作品卡片网格
 */
function renderProjects() {
  const allT = [...new Set(cfg.projects.flatMap(p => p.tags))];
  const fb = document.getElementById('filterBar');
  fb.innerHTML = `<button class="filter-btn active" data-f="all">全部</button>` + allT.map(t => `<button class="filter-btn" data-f="${t}">${t}</button>`).join('');
  /* 筛选按钮点击事件 */
  fb.querySelectorAll('.filter-btn').forEach(b => {
    b.addEventListener('click', () => {
      fb.querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      renderProjGrid(b.dataset.f);
    });
  });
  renderProjGrid('all');
}

/**
 * 根据当前排序模式排序作品数组
 * - 'star-desc': 按星级降序（高星在前）
 * - 'star-asc': 按星级升序（低星在前）
 * - 'manual': 按 order 字段升序（拖拽排序）
 * @param {Array} arr - 原始作品数组
 * @returns {Array} 排序后的新数组（不修改原数组）
 */
function sortProjects(arr) {
  const a = [...arr];
  if (cfg.sortMode === 'star-asc') return a.sort((x, y) => (x.star || 0) - (y.star || 0));
  if (cfg.sortMode === 'star-desc') return a.sort((x, y) => (y.star || 0) - (x.star || 0));
  return a.sort((x, y) => (x.order || 0) - (y.order || 0));
}

/**
 * 渲染作品卡片网格
 * @param {string} f - 筛选条件（'all' 或具体标签名）
 */
function renderProjGrid(f) {
  const g = document.getElementById('projGrid');
  const sorted = sortProjects(cfg.projects);
  const list = f === 'all' ? sorted : sorted.filter(p => p.tags.includes(f));

  g.innerHTML = list.map(p => {
    /* 构建 hover overlay 中的按钮 */
    let ovBtns = [];
    if (p.showPreview !== false && p.link) ovBtns.push(`<a href="${p.link}" target="_blank" style="background:var(--pri);color:var(--bg)"><i class="fa-solid fa-arrow-up-right-from-square"></i> 预览</a>`);
    if (p.showSource !== false && p.github) ovBtns.push(`<a href="${p.github}" target="_blank" style="background:transparent;color:var(--pri);border:1px solid rgba(0,229,160,0.4)"><i class="fa-brands fa-github"></i> 源码</a>`);
    if (p.showDetail !== false) ovBtns.push(`<button onclick="openDetail(${p.id})" style="background:var(--pri-d);color:var(--pri);border:1px solid rgba(0,229,160,0.3)"><i class="fa-solid fa-expand"></i> 详情</button>`);

    return `<article class="proj-card card-b relative overflow-hidden" data-id="${p.id}">
      <img src="${p.image}" alt="${esc(p.title)}" class="proj-img" loading="lazy" onerror="this.src='https://picsum.photos/seed/fb${p.id}/600/400.jpg'">
      <div class="p-5">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold" style="font-family:'Space Grotesk'">${esc(p.title)}</h3>
          ${starsH(p.star || 0)}
        </div>
        <p class="proj-desc text-sm mb-3 leading-relaxed" style="color:var(--txt2)">${esc(p.description)}</p>
        <div class="flex flex-wrap gap-2">${p.tags.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
      <div class="overlay"><div class="overlay-btns">${ovBtns.join('')}</div></div>
    </article>`;
  }).join('');
}

/**
 * 打开作品详情弹框
 * @param {number} id - 作品 ID
 */
function openDetail(id) {
  const p = cfg.projects.find(x => x.id === id);
  if (!p) return;
  const b = document.getElementById('detailBox');
  b.innerHTML = `
    <img src="${p.image}" alt="${esc(p.title)}" onerror="this.src='https://picsum.photos/seed/fb${p.id}/600/400.jpg'">
    <div class="p-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-2xl font-bold" style="font-family:'Space Grotesk'">${esc(p.title)}</h2>
        ${starsH(p.star || 0)}
      </div>
      <p class="leading-relaxed mb-4" style="color:var(--txt2)">${esc(p.description)}</p>
      <div class="flex flex-wrap gap-2 mb-5">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <div class="flex gap-3">
        ${p.link ? `<a href="${p.link}" target="_blank" class="btn-p btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> 在线预览</a>` : ''}
        ${p.github ? `<a href="${p.github}" target="_blank" class="btn-o btn-sm"><i class="fa-brands fa-github"></i> 查看源码</a>` : ''}
      </div>
    </div>
    <button onclick="closeDetail()" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.6);border:none;color:white;cursor:pointer;font-size:1rem;backdrop-filter:blur(4px)" aria-label="关闭"><i class="fa-solid fa-xmark"></i></button>
  `;
  document.getElementById('detailOv').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** 关闭作品详情弹框 */
function closeDetail() {
  document.getElementById('detailOv').classList.remove('open');
  document.body.style.overflow = '';
}
/* 点击弹框外部关闭 */
document.getElementById('detailOv').addEventListener('click', e => {
  if (e.target === document.getElementById('detailOv')) closeDetail();
});

/**
 * 渲染技能区块
 * - 每个分类一张卡片
 * - 每个技能显示名称、百分比、进度条
 */
function renderSkills() {
  document.getElementById('skillsC').innerHTML = cfg.skills.map(g => `
    <div class="card-b p-6">
      <h3 class="text-lg font-semibold mb-5" style="color:var(--pri)">${esc(g.category)}</h3>
      <div class="space-y-4">${g.items.map(s => `
        <div><div class="flex justify-between mb-2"><span class="text-sm font-medium">${esc(s.name)}</span><span class="text-sm" style="color:var(--txt3)">${s.level}%</span></div><div class="skill-bg"><div class="skill-fill" style="width:${s.level}%"></div></div></div>
      `).join('')}</div>
    </div>
  `).join('');
}

/**
 * 渲染工作经历时间线
 * - 每段经历一个时间线节点
 * - 包含职位、公司、时间段、描述
 */
function renderExperience() {
  document.getElementById('timeline').innerHTML = cfg.experiences.map((exp, i) => `
    <div class="tl-item">
      <div class="tl-marker"><div class="tl-dot"></div>${i < cfg.experiences.length - 1 ? '<div class="tl-line"></div>' : ''}</div>
      <div class="tl-content">
        <div class="card-b p-5" style="margin-bottom:0">
          <div class="flex flex-wrap items-center gap-3 mb-2"><h3 class="font-semibold" style="font-family:'Space Grotesk'">${esc(exp.role)}</h3><span class="tag">${esc(exp.period)}</span></div>
          <p class="text-sm mb-2 font-medium" style="color:var(--pri)">${esc(exp.company)}</p>
          <p class="text-sm leading-relaxed" style="color:var(--txt2)">${esc(exp.description)}</p>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * 渲染联系区块
 * - 固定提示文字
 * - 邮箱、所在地、GitHub 链接
 */
function renderContact() {
  const p = cfg.personal;
  document.getElementById('contactT').textContent = '无论是项目合作、技术交流，还是任何想法，都欢迎联系我。我会尽快回复你的消息。';
  let h = '';
  if (p.email) h += `<div class="flex items-center gap-3"><i class="fa-solid fa-envelope" style="color:var(--pri)"></i><span style="color:var(--txt2)">${esc(p.email)}</span></div>`;
  if (p.location) h += `<div class="flex items-center gap-3"><i class="fa-solid fa-location-dot" style="color:var(--pri)"></i><span style="color:var(--txt2)">${esc(p.location)}</span></div>`;
  if (p.github) h += `<div class="flex items-center gap-3"><i class="fa-brands fa-github" style="color:var(--pri)"></i><a href="${p.github}" target="_blank" style="color:var(--txt2);text-decoration:none">GitHub</a></div>`;
  document.getElementById('contactI').innerHTML = h;
}

/**
 * 渲染页脚
 * - 版权信息（动态年份 + 姓名）
 * - 社交图标链接
 */
function renderFooter() {
  const p = cfg.personal;
  document.getElementById('footerT').innerHTML = `&copy; ${new Date().getFullYear()} ${esc(p.name)}. All rights reserved.`;
  let h = '';
  if (p.github) h += `<a href="${p.github}" target="_blank" style="color:var(--txt3);transition:color .3s" onmouseover="this.style.color='var(--pri)'" onmouseout="this.style.color='var(--txt3)'"><i class="fa-brands fa-github"></i></a>`;
  if (p.twitter) h += `<a href="${p.twitter}" target="_blank" style="color:var(--txt3);transition:color .3s" onmouseover="this.style.color='var(--pri)'" onmouseout="this.style.color='var(--txt3)'"><i class="fa-brands fa-twitter"></i></a>`;
  if (p.linkedin) h += `<a href="${p.linkedin}" target="_blank" style="color:var(--txt3);transition:color .3s" onmouseover="this.style.color='var(--pri)'" onmouseout="this.style.color='var(--txt3)'"><i class="fa-brands fa-linkedin-in"></i></a>`;
  document.getElementById('footerS').innerHTML = h;
}
