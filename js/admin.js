/* ============================================================
 *  管理面板模块
 *
 *  职责：管理面板的全部交互逻辑，包含 5 个 Tab 页
 *
 *  全局变量：
 *  - curTab: 当前激活的 Tab 名称
 *  - editPI: 当前编辑的作品索引（-1 表示新建）
 *  - editEI: 当前编辑的经历索引（-1 表示新建）
 *
 *  登录/退出：
 *  - openAdmin() / closeAdmin(): 打开/关闭管理面板
 *  - tryLogin(): 密码验证
 *  - closeLogin(): 关闭登录弹框
 *
 *  个人信息（personal）：
 *  - rPersonal(): 渲染表单
 *  - savePers(): 保存
 *  - addStat() / delStat(): 统计数字增删
 *
 *  作品管理（projects）：
 *  - rProjects(): 渲染列表 + 排序模式切换
 *  - setSortMode(): 切换排序模式
 *  - initProjSort(): 初始化拖拽
 *  - editProj() / saveProj() / delProj(): 编辑/保存/删除
 *  - pickS(): 星级选择
 *  - handleUpload() / resizeImg(): 图片上传
 *
 *  技能管理（skills）：
 *  - rSkills(): 渲染分类列表（可拖拽）
 *  - initSkillSort(): 初始化拖拽
 *  - addSC() / delSC(): 分类增删
 *  - addSI() / delSI(): 技能项增删
 *  - saveSk(): 保存
 *
 *  经历管理（experience）：
 *  - rExp(): 渲染列表
 *  - editE() / saveE() / delE(): 编辑/保存/删除
 *
 *  数据管理（data）：
 *  - rData(): 渲染面板
 *  - changePwd(): 修改密码（成功后退出登录）
 *  - expData() / impData(): 导出/导入
 *  - resetData(): 重置为默认
 * ============================================================ */

/* --- 当前 Tab / 编辑索引 --- */
let curTab = 'personal';
let editPI = -1;
let editEI = -1;

/* ============================================================
 *   登录 / 退出
 * ============================================================ */

/**
 * 打开管理面板（需要先通过密码验证）
 */
function openAdmin() {
  document.getElementById('adminOv').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderATab(curTab);
}

/** 关闭管理面板 */
function closeAdmin() {
  document.getElementById('adminOv').classList.remove('open');
  document.body.style.overflow = '';
}

/* 点击管理面板外部关闭 */
document.getElementById('adminOv').addEventListener('click', e => {
  if (e.target === document.getElementById('adminOv')) closeAdmin();
});

/**
 * 尝试密码登录
 * 验证成功则保存 token 并打开管理面板
 */
async function tryLogin() {
  const password = document.getElementById('loginPwd').value;
  try {
    const json = await api('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    if (json.success) {
      token = json.token;
      sessionStorage.setItem('auth_token', token);
      unlocked = true;
      document.getElementById('loginOv').classList.remove('open');
      openAdmin();
    } else {
      toast(json.message || '密码错误', 'err');
      document.getElementById('loginPwd').value = '';
      document.getElementById('loginPwd').focus();
    }
  } catch (e) {
    toast('服务器错误', 'err');
  }
}

/* 回车键触发登录 */
document.getElementById('loginPwd').addEventListener('keydown', e => {
  if (e.key === 'Enter') tryLogin();
});

/** 关闭登录弹框 */
function closeLogin() {
  document.getElementById('loginOv').classList.remove('open');
}

/* ============================================================
 *   Tab 切换
 * ============================================================ */

/* 绑定 Tab 按钮点击事件 */
document.querySelectorAll('.admin-tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    curTab = t.dataset.tab;
    renderATab(curTab);
  });
});

/**
 * 渲染指定 Tab 的内容
 * @param {string} tab - Tab 名称（personal/projects/skills/experience/data）
 */
function renderATab(tab) {
  const b = document.getElementById('adminBody');
  switch (tab) {
    case 'personal': rPersonal(b); break;
    case 'projects': rProjects(b); break;
    case 'skills': rSkills(b); break;
    case 'experience': rExp(b); break;
    case 'data': rData(b); break;
  }
}

/* ============================================================
 *   个人信息管理
 * ============================================================ */

/**
 * 渲染个人信息编辑表单
 * 包含：姓名、Logo、头衔、简介、关于我、联系方式、统计数字
 * @param {HTMLElement} b - 容器元素
 */
function rPersonal(b) {
  const p = cfg.personal;
  b.innerHTML = `
    <div class="af"><label>姓名</label><input id="ap_name" value="${esc(p.name)}"></div>
    <div class="af"><label>Logo 文字</label><input id="ap_logo" value="${esc(p.logo)}"></div>
    <div class="af"><label>头衔（每行一个）</label><textarea id="ap_titles" rows="4">${p.titles.join('\n')}</textarea></div>
    <div class="af"><label>一句话简介</label><input id="ap_bio" value="${esc(p.bio)}"></div>
    <div class="af"><label>关于我 - 第一段</label><textarea id="ap_a1" rows="3">${esc(p.aboutText1)}</textarea></div>
    <div class="af"><label>关于我 - 第二段</label><textarea id="ap_a2" rows="3">${esc(p.aboutText2)}</textarea></div>
    <div class="grid grid-cols-2 gap-4">
      <div class="af"><label>所在地</label><input id="ap_loc" value="${esc(p.location)}"></div>
      <div class="af"><label>邮箱</label><input id="ap_em" type="email" value="${esc(p.email)}"></div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="af"><label>GitHub</label><input id="ap_gh" value="${esc(p.github)}"></div>
      <div class="af"><label>Twitter</label><input id="ap_tw" value="${esc(p.twitter)}"></div>
    </div>
    <div class="af"><label>LinkedIn</label><input id="ap_li" value="${esc(p.linkedin)}"></div>
    <h4 class="font-semibold mb-3 mt-4" style="color:var(--pri);font-family:'Space Grotesk'">统计数字</h4>
    <div id="stList">${(p.stats || []).map((s, i) => `
      <div class="a-item">
        <div class="flex gap-3 flex-1" style="min-width:0">
          <input class="st-v" data-i="${i}" value="${esc(s.value)}" placeholder="数值" style="width:80px;padding:6px 10px;background:var(--bg);border:1px solid var(--bdr);border-radius:8px;color:var(--txt);font-size:.85rem;text-align:center">
          <input class="st-l" data-i="${i}" value="${esc(s.label)}" placeholder="标签" style="flex:1;padding:6px 10px;background:var(--bg);border:1px solid var(--bdr);border-radius:8px;color:var(--txt);font-size:.85rem">
        </div>
        <button class="btn-o btn-sm btn-danger" style="padding:4px 8px" onclick="delStat(${i})"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `).join('')}</div>
    <button class="btn-o btn-sm mb-6" onclick="addStat()"><i class="fa-solid fa-plus"></i> 添加统计</button><br>
    <button class="btn-p" onclick="savePers()"><i class="fa-solid fa-check"></i> 保存个人信息</button>
  `;
}

/** 添加一个新的统计数字项 */
function addStat() {
  cfg.personal.stats.push({ id: gid(), label: '新统计', value: '0' });
  saveCfg();
  renderATab('personal');
}

/**
 * 删除统计数字（带确认弹框）
 * @param {number} i - 统计项索引
 */
async function delStat(i) {
  const ok = await cfm(`确定删除统计「${cfg.personal.stats[i].label}」？`);
  if (ok) {
    cfg.personal.stats.splice(i, 1);
    saveCfg();
    renderAll();
    renderATab('personal');
    toast('统计已删除');
  }
}

/** 保存个人信息（从表单读取所有字段并更新 cfg） */
function savePers() {
  const p = cfg.personal;
  p.name = document.getElementById('ap_name').value.trim() || p.name;
  p.logo = document.getElementById('ap_logo').value.trim() || p.logo;
  p.titles = document.getElementById('ap_titles').value.split('\n').map(s => s.trim()).filter(Boolean);
  p.bio = document.getElementById('ap_bio').value.trim();
  p.aboutText1 = document.getElementById('ap_a1').value.trim();
  p.aboutText2 = document.getElementById('ap_a2').value.trim();
  p.location = document.getElementById('ap_loc').value.trim();
  p.email = document.getElementById('ap_em').value.trim();
  p.github = document.getElementById('ap_gh').value.trim();
  p.twitter = document.getElementById('ap_tw').value.trim();
  p.linkedin = document.getElementById('ap_li').value.trim();
  /* 读取统计数字 */
  document.querySelectorAll('.st-v').forEach(inp => { const i = +inp.dataset.i; if (p.stats[i]) p.stats[i].value = inp.value.trim(); });
  document.querySelectorAll('.st-l').forEach(inp => { const i = +inp.dataset.i; if (p.stats[i]) p.stats[i].label = inp.value.trim(); });
  saveCfg();
  renderAll();
  startTyping();
  toast('个人信息已保存');
}

/* ============================================================
 *   作品管理
 * ============================================================ */

/**
 * 渲染作品管理列表
 * - 顶部：作品计数 + 添加按钮
 * - 排序模式切换栏（手动/星级降序/星级升序）
 * - 作品列表（手动模式显示拖拽手柄）
 * @param {HTMLElement} b - 容器元素
 */
function rProjects(b) {
  const sm = cfg.sortMode || 'star-desc';
  const isManual = sm === 'manual';
  const sorted = sortProjects(cfg.projects);
  const modeLabel = { manual: '手动排序', 'star-desc': '按星级降序', 'star-asc': '按星级升序' }[sm];

  let h = `<div class="flex items-center justify-between mb-3"><span style="color:var(--txt2)">共 ${cfg.projects.length} 个作品</span><button class="btn-p btn-sm" onclick="editProj(-1)"><i class="fa-solid fa-plus"></i> 添加作品</button></div>`;

  /* 排序模式切换栏 */
  h += `<div class="sort-bar mb-4"><span style="font-size:.82rem;color:var(--txt3);margin-right:4px">排序:</span>`;
  h += `<button class="sort-btn ${sm === 'manual' ? 'active' : ''}" onclick="setSortMode('manual')"><i class="fa-solid fa-grip-vertical"></i> 手动</button>`;
  h += `<button class="sort-btn ${sm === 'star-desc' ? 'active' : ''}" onclick="setSortMode('star-desc')"><i class="fa-solid fa-arrow-down-wide-short"></i> 星级降序</button>`;
  h += `<button class="sort-btn ${sm === 'star-asc' ? 'active' : ''}" onclick="setSortMode('star-asc')"><i class="fa-solid fa-arrow-up-wide-short"></i> 星级升序</button>`;
  h += `</div>`;

  /* 作品列表 */
  h += `<div id="projSortList">`;
  h += sorted.map(p => {
    const ri = cfg.projects.findIndex(x => x.id === p.id);
    const handle = isManual ? `<span class="drag-handle" title="拖拽排序"><i class="fa-solid fa-grip-vertical"></i></span>` : '';
    return `<div class="a-item" data-id="${p.id}">${handle}<div class="flex items-center gap-3" style="min-width:0;flex:1"><img src="${p.image}" style="width:48px;height:36px;border-radius:6px;object-fit:cover;flex-shrink:0" onerror="this.style.display='none'"><div style="min-width:0"><div class="font-medium text-sm truncate">${esc(p.title)} ${starsH(p.star || 0)}</div><div class="text-xs truncate" style="color:var(--txt3)">${p.tags.join(', ')}</div></div></div><div class="a-item-act"><button class="btn-o btn-sm" onclick="editProj(${ri})"><i class="fa-solid fa-pen"></i></button><button class="btn-o btn-sm btn-danger" onclick="delProj(${ri})"><i class="fa-solid fa-trash"></i></button></div></div>`;
  }).join('');
  h += `</div><div id="pfC"></div>`;
  b.innerHTML = h;

  /* 手动模式下初始化拖拽 */
  if (isManual) initProjSort();
}

/**
 * 切换作品排序模式
 * 切换前先将当前显示顺序同步到 order 字段
 * @param {string} mode - 'manual' / 'star-desc' / 'star-asc'
 */
function setSortMode(mode) {
  const sorted = sortProjects(cfg.projects);
  sorted.forEach((p, i) => {
    const orig = cfg.projects.find(x => x.id === p.id);
    if (orig) orig.order = i;
  });
  cfg.sortMode = mode;
  saveCfg();
  renderATab('projects');
}

/**
 * 初始化作品拖拽排序（使用 SortableJS）
 * 拖拽结束后自动更新 order 字段并保存
 */
function initProjSort() {
  const el = document.getElementById('projSortList');
  if (!el) return;
  new Sortable(el, {
    animation: 180, handle: '.drag-handle', ghostClass: 'sortable-ghost', chosenClass: 'sortable-chosen',
    onEnd: function (evt) {
      const items = el.querySelectorAll('.a-item');
      items.forEach((item, i) => {
        const pid = +item.dataset.id || item.dataset.id;
        const proj = cfg.projects.find(p => String(p.id) === String(pid));
        if (proj) proj.order = i;
      });
      saveCfg();
    }
  });
}

/**
 * 打开作品编辑表单（新建或编辑）
 * @param {number} idx - 作品在 cfg.projects 中的索引，-1 表示新建
 */
function editProj(idx) {
  editPI = idx;
  const p = idx >= 0 ? cfg.projects[idx] : { id: Date.now(), title: '', description: '', tags: [], image: '', link: '', github: '', star: 3, showPreview: true, showSource: true, showDetail: true };
  const c = document.getElementById('pfC');
  c.innerHTML = `
    <div class="card-b p-5 mt-4" style="border-color:var(--bdr-h)">
      <h4 class="font-semibold mb-4" style="font-family:'Space Grotesk'">${idx >= 0 ? '编辑' : '添加'}作品</h4>
      <div class="af"><label>标题</label><input id="pf_t" value="${esc(p.title)}"></div>
      <div class="af"><label>描述</label><textarea id="pf_d" rows="4">${esc(p.description)}</textarea></div>
      <div class="af"><label>标签（逗号分隔）</label><input id="pf_tg" value="${p.tags.join(', ')}"></div>
      <div class="af">
        <label>封面图片</label>
        <div class="flex gap-2 items-center flex-wrap">
          <input id="pf_img" value="${esc(p.image)}" placeholder="输入图片URL" style="flex:1;padding:10px 14px;background:var(--bg);border:1px solid var(--bdr);border-radius:10px;color:var(--txt);font-size:.9rem">
          <button class="btn-o btn-sm" onclick="document.getElementById('pf_file').click()"><i class="fa-solid fa-upload"></i> 上传</button>
          <input type="file" id="pf_file" accept="image/*" style="display:none" onchange="handleUpload(this)">
        </div>
        <div id="pf_iprev">${p.image && p.image.startsWith('data:') ? `<img src="${p.image}" class="img-prev" alt="预览">` : ''}</div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="af"><label>预览链接</label><input id="pf_lk" value="${esc(p.link)}"></div>
        <div class="af"><label>GitHub 链接</label><input id="pf_gh" value="${esc(p.github)}"></div>
      </div>
      <div class="af">
        <label>星级（点击设置）</label>
        <div class="star-pick" id="sPick">${[1, 2, 3, 4, 5].map(i => `<i class="fa-${i <= p.star ? 'solid' : 'regular'} fa-star ${i <= p.star ? 'on' : ''}" onclick="pickS(${i})"></i>`).join('')}</div>
        <input type="hidden" id="pf_star" value="${p.star}">
      </div>
      <div class="af">
        <label>首页显示控制</label>
        <div class="flex flex-col gap-3 mt-1">
          <div class="flex items-center justify-between" style="padding:8px 12px;background:var(--bg);border-radius:8px">
            <span class="text-sm">显示「预览」按钮</span>
            <label class="sw"><input type="checkbox" id="pf_sp" ${p.showPreview !== false ? 'checked' : ''}><span class="sl"></span></label>
          </div>
          <div class="flex items-center justify-between" style="padding:8px 12px;background:var(--bg);border-radius:8px">
            <span class="text-sm">显示「源码」按钮</span>
            <label class="sw"><input type="checkbox" id="pf_ss" ${p.showSource !== false ? 'checked' : ''}><span class="sl"></span></label>
          </div>
          <div class="flex items-center justify-between" style="padding:8px 12px;background:var(--bg);border-radius:8px">
            <span class="text-sm">显示「详情」按钮</span>
            <label class="sw"><input type="checkbox" id="pf_sd" ${p.showDetail !== false ? 'checked' : ''}><span class="sl"></span></label>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <button class="btn-p btn-sm" onclick="saveProj()"><i class="fa-solid fa-check"></i> 保存</button>
        <button class="btn-o btn-sm" onclick="document.getElementById('pfC').innerHTML=''">取消</button>
      </div>
    </div>`;
  c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * 星级选择器点击
 * @param {number} n - 选中的星级（1-5）
 */
function pickS(n) {
  document.getElementById('pf_star').value = n;
  document.querySelectorAll('#sPick i').forEach((el, i) => {
    el.className = `fa-${i < n ? 'solid' : 'regular'} fa-star${i < n ? ' on' : ''}`;
  });
}

/**
 * 处理图片上传（选择文件后）
 * 读取文件 → 压缩 → 转 Base64 → 填入 URL 输入框 + 预览
 * @param {HTMLInputElement} inp - file 输入框元素
 */
async function handleUpload(inp) {
  const file = inp.files[0];
  if (!file) return;
  try {
    const b64 = await resizeImg(file, 800);
    document.getElementById('pf_img').value = b64;
    document.getElementById('pf_iprev').innerHTML = `<img src="${b64}" class="img-prev" alt="预览">`;
    toast('图片已上传');
  } catch (e) {
    toast('图片处理失败', 'err');
  }
  inp.value = '';
}

/**
 * 压缩图片为 Base64（限制最大宽度）
 * @param {File} file - 图片文件
 * @param {number} maxW - 最大宽度（默认 800px）
 * @returns {Promise<string>} Base64 数据 URL
 */
function resizeImg(file, maxW = 800) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = rej;
    r.onload = e => {
      const img = new Image();
      img.onerror = rej;
      img.onload = () => {
        const cv = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(maxW / w * h); w = maxW; }
        cv.width = w; cv.height = h;
        cv.getContext('2d').drawImage(img, 0, 0, w, h);
        res(cv.toDataURL('image/jpeg', 0.75));
      };
      img.src = e.target.result;
    };
    r.readAsDataURL(file);
  });
}

/** 保存作品（新建或更新） */
function saveProj() {
  const d = {
    id: editPI >= 0 ? cfg.projects[editPI].id : Date.now(),
    title: document.getElementById('pf_t').value.trim(),
    description: document.getElementById('pf_d').value.trim(),
    tags: document.getElementById('pf_tg').value.split(',').map(s => s.trim()).filter(Boolean),
    image: document.getElementById('pf_img').value.trim() || `https://picsum.photos/seed/p${Date.now()}/600/400.jpg`,
    link: document.getElementById('pf_lk').value.trim(),
    github: document.getElementById('pf_gh').value.trim(),
    star: parseInt(document.getElementById('pf_star').value) || 3,
    order: editPI >= 0 ? cfg.projects[editPI].order : (Math.max(0, ...cfg.projects.map(p => p.order || 0)) + 1),
    showPreview: document.getElementById('pf_sp').checked,
    showSource: document.getElementById('pf_ss').checked,
    showDetail: document.getElementById('pf_sd').checked
  };
  if (!d.title) { toast('请填写标题', 'err'); return; }
  if (editPI >= 0) cfg.projects[editPI] = d; else cfg.projects.push(d);
  saveCfg();
  renderAll();
  renderATab('projects');
  toast(editPI >= 0 ? '作品已更新' : '作品已添加');
}

/**
 * 删除作品（带确认弹框）
 * @param {number} i - 作品索引
 */
async function delProj(i) {
  const ok = await cfm(`确定删除「${cfg.projects[i].title}」？`);
  if (ok) {
    cfg.projects.splice(i, 1);
    saveCfg();
    renderAll();
    renderATab('projects');
    toast('作品已删除');
  }
}

/* ============================================================
 *   技能管理
 * ============================================================ */

/**
 * 渲染技能管理列表
 * - 分类间可拖拽排序
 * - 分类内技能项可拖拽排序
 * @param {HTMLElement} b - 容器元素
 */
function rSkills(b) {
  let h = `<div class="flex items-center justify-between mb-4"><span style="color:var(--txt2)">共 ${cfg.skills.length} 个分类（可拖拽排序）</span><button class="btn-p btn-sm" onclick="addSC()"><i class="fa-solid fa-plus"></i> 添加分类</button></div>`;
  h += `<div id="skillCatList">`;
  cfg.skills.forEach((g, gi) => {
    h += `<div class="card-b p-4 mb-4 skill-drag" data-gi="${gi}"><div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2"><span class="drag-handle" title="拖拽排序"><i class="fa-solid fa-grip-vertical"></i></span><input class="sc-n" data-g="${gi}" value="${esc(g.category)}" style="background:transparent;border:none;color:var(--pri);font-weight:600;font-size:1rem;font-family:'Space Grotesk';width:200px"></div>
      <div class="flex gap-2"><button class="btn-o btn-sm" onclick="addSI(${gi})"><i class="fa-solid fa-plus"></i> 添加技能</button><button class="btn-o btn-sm btn-danger" onclick="delSC(${gi})"><i class="fa-solid fa-trash"></i></button></div>
    </div>`;
    h += `<div class="skill-items-list" data-gi="${gi}">`;
    g.items.forEach((s, si) => {
      h += `<div class="flex items-center gap-3 mb-2 skill-drag" data-si="${si}"><span class="drag-handle" title="拖拽排序"><i class="fa-solid fa-grip-vertical"></i></span>
        <input class="si-n" data-g="${gi}" data-s="${si}" value="${esc(s.name)}" style="flex:1;padding:6px 10px;background:var(--bg);border:1px solid var(--bdr);border-radius:8px;color:var(--txt);font-size:.85rem">
        <input class="si-l" data-g="${gi}" data-s="${si}" type="number" min="0" max="100" value="${s.level}" style="width:70px;padding:6px 10px;background:var(--bg);border:1px solid var(--bdr);border-radius:8px;color:var(--txt);font-size:.85rem;text-align:center">
        <button class="btn-o btn-sm btn-danger" style="padding:4px 8px" onclick="delSI(${gi},${si})"><i class="fa-solid fa-xmark"></i></button>
      </div>`;
    });
    h += `</div></div>`;
  });
  h += `</div><button class="btn-p" onclick="saveSk()"><i class="fa-solid fa-check"></i> 保存技能</button>`;
  b.innerHTML = h;
  initSkillSort();
}

/** 添加新技能分类 */
function addSC() {
  cfg.skills.push({ category: '新分类', items: [] });
  saveCfg();
  renderATab('skills');
}

/**
 * 在指定分类下添加新技能项
 * @param {number} g - 分类索引
 */
function addSI(g) {
  cfg.skills[g].items.push({ name: '新技能', level: 50 });
  saveCfg();
  renderATab('skills');
}

/**
 * 删除技能项（带确认弹框）
 * @param {number} g - 分类索引
 * @param {number} s - 技能项索引
 */
async function delSI(g, s) {
  const ok = await cfm(`确定删除技能「${cfg.skills[g].items[s].name}」？`);
  if (ok) {
    cfg.skills[g].items.splice(s, 1);
    saveCfg();
    renderATab('skills');
    toast('技能已删除');
  }
}

/**
 * 删除技能分类（带确认弹框，会同时删除分类下所有技能）
 * @param {number} g - 分类索引
 */
async function delSC(g) {
  const ok = await cfm(`确定删除分类「${cfg.skills[g].category}」？`);
  if (ok) {
    cfg.skills.splice(g, 1);
    saveCfg();
    renderAll();
    renderATab('skills');
    toast('分类已删除');
  }
}

/** 保存技能（从输入框读取所有分类名、技能名、技能等级） */
function saveSk() {
  document.querySelectorAll('.sc-n').forEach(i => { cfg.skills[+i.dataset.g].category = i.value.trim() || '未命名'; });
  document.querySelectorAll('.si-n').forEach(i => { cfg.skills[+i.dataset.g].items[+i.dataset.s].name = i.value.trim() || '未命名'; });
  document.querySelectorAll('.si-l').forEach(i => { cfg.skills[+i.dataset.g].items[+i.dataset.s].level = Math.min(100, Math.max(0, +i.value || 0)); });
  saveCfg();
  renderAll();
  toast('技能已保存');
}

/**
 * 初始化技能拖拽排序（分类间 + 分类内）
 * 使用 SortableJS，拖拽结束后自动更新 cfg 并保存
 */
function initSkillSort() {
  const catEl = document.getElementById('skillCatList');
  if (!catEl) return;

  /* 分类间拖拽 */
  new Sortable(catEl, {
    animation: 180, handle: '.drag-handle', ghostClass: 'sortable-ghost', chosenClass: 'sortable-chosen',
    draggable: '.skill-drag.card-b',
    onEnd: function (evt) {
      const arr = cfg.skills.splice(evt.oldIndex, 1)[0];
      cfg.skills.splice(evt.newIndex, 0, arr);
      saveCfg();
    }
  });

  /* 分类内技能项拖拽 */
  catEl.querySelectorAll('.skill-items-list').forEach(list => {
    const gi = +list.dataset.gi;
    new Sortable(list, {
      animation: 180, handle: '.drag-handle', ghostClass: 'sortable-ghost', chosenClass: 'sortable-chosen',
      onEnd: function (evt) {
        const arr = cfg.skills[gi].items.splice(evt.oldIndex, 1)[0];
        cfg.skills[gi].items.splice(evt.newIndex, 0, arr);
        saveCfg();
      }
    });
  });
}

/* ============================================================
 *   经历管理
 * ============================================================ */

/**
 * 渲染经历管理列表
 * @param {HTMLElement} b - 容器元素
 */
function rExp(b) {
  let h = `<div class="flex items-center justify-between mb-4"><span style="color:var(--txt2)">共 ${cfg.experiences.length} 段经历</span><button class="btn-p btn-sm" onclick="editE(-1)"><i class="fa-solid fa-plus"></i> 添加经历</button></div>`;
  h += cfg.experiences.map((e, i) => `<div class="a-item"><div style="min-width:0;flex:1"><div class="font-medium text-sm">${esc(e.role)}</div><div class="text-xs" style="color:var(--txt3)">${esc(e.company)} · ${esc(e.period)}</div></div><div class="a-item-act"><button class="btn-o btn-sm" onclick="editE(${i})"><i class="fa-solid fa-pen"></i></button><button class="btn-o btn-sm btn-danger" onclick="delE(${i})"><i class="fa-solid fa-trash"></i></button></div></div>`).join('');
  h += `<div id="efC"></div>`;
  b.innerHTML = h;
}

/**
 * 打开经历编辑表单（新建或编辑）
 * @param {number} idx - 经历索引，-1 表示新建
 */
function editE(idx) {
  editEI = idx;
  const e = idx >= 0 ? cfg.experiences[idx] : { company: '', role: '', period: '', description: '' };
  document.getElementById('efC').innerHTML = `
    <div class="card-b p-5 mt-4" style="border-color:var(--bdr-h)">
      <h4 class="font-semibold mb-4" style="font-family:'Space Grotesk'">${idx >= 0 ? '编辑' : '添加'}经历</h4>
      <div class="grid grid-cols-2 gap-4"><div class="af"><label>公司</label><input id="ef_c" value="${esc(e.company)}"></div><div class="af"><label>职位</label><input id="ef_r" value="${esc(e.role)}"></div></div>
      <div class="af"><label>时间段</label><input id="ef_p" value="${esc(e.period)}" placeholder="如：2022 - 至今"></div>
      <div class="af"><label>描述</label><textarea id="ef_d" rows="3">${esc(e.description)}</textarea></div>
      <div class="flex gap-3"><button class="btn-p btn-sm" onclick="saveE()"><i class="fa-solid fa-check"></i> 保存</button><button class="btn-o btn-sm" onclick="document.getElementById('efC').innerHTML=''">取消</button></div>
    </div>`;
}

/** 保存经历（新建或更新） */
function saveE() {
  const d = {
    company: document.getElementById('ef_c').value.trim(),
    role: document.getElementById('ef_r').value.trim(),
    period: document.getElementById('ef_p').value.trim(),
    description: document.getElementById('ef_d').value.trim()
  };
  if (!d.company || !d.role) { toast('请填写公司和职位', 'err'); return; }
  if (editEI >= 0) cfg.experiences[editEI] = d; else cfg.experiences.push(d);
  saveCfg();
  renderAll();
  renderATab('experience');
  toast(editEI >= 0 ? '经历已更新' : '经历已添加');
}

/**
 * 删除经历（带确认弹框）
 * @param {number} i - 经历索引
 */
async function delE(i) {
  const ok = await cfm(`确定删除「${cfg.experiences[i].company}」？`);
  if (ok) {
    cfg.experiences.splice(i, 1);
    saveCfg();
    renderAll();
    renderATab('experience');
    toast('经历已删除');
  }
}

/* ============================================================
 *   数据管理
 * ============================================================ */

/**
 * 渲染数据管理面板
 * 包含：修改密码、导出数据、导入数据、重置数据、部署说明
 * @param {HTMLElement} b - 容器元素
 */
function rData(b) {
  b.innerHTML = `
    <div class="space-y-6">
      <div class="card-b p-5">
        <h4 class="font-semibold mb-3" style="font-family:'Space Grotesk'">修改密码</h4>
        <div class="af"><label>当前密码</label><div class="pwd-wrap"><input type="password" id="pw_o" placeholder="输入当前密码" class="c-input" style="padding-right:44px"><button class="pwd-toggle" onclick="togglePwdVis('pw_o',this)" aria-label="显示密码"><i class="fa-solid fa-eye"></i></button></div></div>
        <div class="af"><label>新密码</label><div class="pwd-wrap"><input type="password" id="pw_n" placeholder="输入新密码" class="c-input" style="padding-right:44px"><button class="pwd-toggle" onclick="togglePwdVis('pw_n',this)" aria-label="显示密码"><i class="fa-solid fa-eye"></i></button></div></div>
        <div class="af"><label>确认新密码</label><div class="pwd-wrap"><input type="password" id="pw_c" placeholder="再次输入新密码" class="c-input" style="padding-right:44px"><button class="pwd-toggle" onclick="togglePwdVis('pw_c',this)" aria-label="显示密码"><i class="fa-solid fa-eye"></i></button></div></div>
        <button class="btn-p btn-sm" onclick="changePwd()"><i class="fa-solid fa-key"></i> 修改密码</button>
      </div>
      <div class="card-b p-5">
        <h4 class="font-semibold mb-3" style="font-family:'Space Grotesk'">导出数据</h4>
        <p class="text-sm mb-4" style="color:var(--txt2)">将当前所有配置导出为 JSON 文件。</p>
        <button class="btn-p btn-sm" onclick="expData()"><i class="fa-solid fa-download"></i> 导出数据</button>
      </div>
      <div class="card-b p-5">
        <h4 class="font-semibold mb-3" style="font-family:'Space Grotesk'">导入数据</h4>
        <p class="text-sm mb-4" style="color:var(--txt2)">从 JSON 文件导入配置，将覆盖当前所有内容。</p>
        <input type="file" id="impF" accept=".json" style="display:none" onchange="impData(event)">
        <button class="btn-o btn-sm" onclick="document.getElementById('impF').click()"><i class="fa-solid fa-upload"></i> 选择文件导入</button>
      </div>
      <div class="card-b p-5" style="border-color:rgba(255,60,60,0.18)">
        <h4 class="font-semibold mb-3" style="color:#ff5555;font-family:'Space Grotesk'">重置数据</h4>
        <p class="text-sm mb-4" style="color:var(--txt2)">恢复为代码中的默认配置。</p>
        <button class="btn-o btn-sm btn-danger" onclick="resetData()"><i class="fa-solid fa-rotate-left"></i> 重置为默认</button>
      </div>
      <div class="card-b p-5">
        <h4 class="font-semibold mb-3" style="font-family:'Space Grotesk'">部署说明</h4>
        <div class="text-sm leading-relaxed" style="color:var(--txt2)">
          <p class="mb-2">本站基于 Node.js + Express 后端，数据通过 JSON 文件持久化。</p>
          <p class="mb-1"><strong style="color:var(--txt)">启动服务</strong> — <code style="color:var(--pri)">npm start</code> 或 <code style="color:var(--pri)">node server.js</code>，支持 <code style="color:var(--pri)">start.bat</code>（Windows）/<code style="color:var(--pri)">start.sh</code>（Linux）一键启动</p>
          <p class="mb-1"><strong style="color:var(--txt)">环境配置</strong> — 在项目根目录 <code style="color:var(--pri)">.env</code> 文件中配置：<code style="color:var(--pri)">PORT</code>（端口）和 <code style="color:var(--pri)">NODE_ENV</code>（<code>dev</code> 开发 / <code>prod</code> 生产）</p>
          <p class="mb-1"><strong style="color:var(--txt)">数据存储</strong> — 开发环境数据保存在 <code style="color:var(--pri)">data/local/</code>，生产环境保存在 <code style="color:var(--pri)">data/prod/</code>，互不干扰</p>
          <p class="mb-1"><strong style="color:var(--txt)">默认密码</strong> — admin，登录后可在「数据管理」中修改。忘记密码可删除 <code style="color:var(--pri)">data/local/.pwd</code> 恢复默认</p>
          <p class="mb-1"><strong style="color:var(--txt)">导出/导入</strong> — 支持 JSON 格式一键导出和导入，方便迁移数据</p>
          <p class="mt-3" style="color:var(--pri)"><em>.env 文件已加入 .gitignore 不会提交；上传图片以 Base64 存储；修改 server.js 中的 DEFAULT_DATA 可变更默认内容。</em></p>
        </div>
      </div>
    </div>`;
}

/**
 * 修改密码
 * 成功后清除 token、退出管理面板、提示重新登录
 */
async function changePwd() {
  const o = document.getElementById('pw_o').value;
  const n = document.getElementById('pw_n').value;
  const c = document.getElementById('pw_c').value;
  if (!o || !n || !c) { toast('请填写所有字段', 'err'); return; }
  if (n.length < 3) { toast('新密码至少3位', 'err'); return; }
  if (n !== c) { toast('两次输入的新密码不一致', 'err'); return; }
  try {
    const json = await api('/api/change-pwd', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ oldPassword: o, newPassword: n }) });
    if (json.success) {
      token = null;
      unlocked = false;
      sessionStorage.removeItem('auth_token');
      closeAdmin();
      toast('密码已修改，请使用新密码重新登录');
    } else {
      toast(json.message || '修改失败', 'err');
    }
  } catch (e) {
    toast('服务器错误', 'err');
  }
}

/** 导出当前配置为 JSON 文件下载 */
function expData() {
  const bl = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(bl);
  a.download = 'portfolio_data.json';
  a.click();
  URL.revokeObjectURL(a.href);
  toast('数据已导出');
}

/**
 * 导入 JSON 数据文件
 * @param {Event} ev - file input 的 change 事件
 */
async function impData(ev) {
  const f = ev.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = async e => {
    try {
      const d = JSON.parse(e.target.result);
      const ok = await cfm('导入将覆盖当前所有数据，确定？');
      if (ok) {
        cfg = migrate(d);
        await saveCfg();
        renderAll();
        startTyping();
        renderATab('data');
        toast('数据已导入');
      }
    } catch { toast('文件格式错误', 'err'); }
  };
  r.readAsText(f);
  ev.target.value = '';
}

/** 重置为默认配置（带确认弹框） */
async function resetData() {
  const ok = await cfm('确定重置为默认配置？所有修改将丢失。');
  if (ok) {
    cfg = JSON.parse(JSON.stringify(DEF_CFG));
    await saveCfg();
    renderAll();
    startTyping();
    renderATab('data');
    toast('已重置为默认配置');
  }
}
