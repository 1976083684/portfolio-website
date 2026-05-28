/* ============================================================
 *  通用 UI 组件模块
 *
 *  职责：Toast 消息提示、确认弹框、页面标题、密码可见性切换、星级 HTML
 *
 *  全局变量：
 *  - cfmR: 确认弹框的 Promise resolve 函数（内部使用）
 *
 *  函数：
 *  - toast(msg, type): 显示消息提示（'ok' 成功 / 'err' 错误）
 *  - cfm(msg, btnText): 显示确认弹框，返回 Promise<boolean>
 *  - updateTitle(): 根据 cfg.personal 动态更新页面标题
 *  - togglePwdVis(inputId, btn): 切换密码输入框的明文/密文
 *  - starsH(n): 生成 1-5 星的 HTML 字符串
 * ============================================================ */

/* --- 确认弹框 Promise resolve 引用 --- */
let cfmR = null;

/**
 * 显示 Toast 消息提示
 * @param {string} msg - 提示文本
 * @param {string} type - 'ok' 成功（绿色）/ 'err' 错误（红色）
 */
function toast(msg, type = 'ok') {
  const c = document.getElementById('toastC');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<i class="fa-solid ${type === 'ok' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${msg}`;
  c.appendChild(t);
  /* 2.6秒后开始淡出 */
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(100%)';
    t.style.transition = 'all .4s';
  }, 2600);
  /* 3秒后移除 DOM */
  setTimeout(() => t.remove(), 3000);
}

/**
 * 显示确认删除弹框（Promise 化）
 * @param {string} msg - 确认描述文本
 * @param {string} btnText - 确认按钮文字（默认"确认删除"）
 * @returns {Promise<boolean>} 用户点击确认返回 true，取消返回 false
 */
function cfm(msg, btnText = '确认删除') {
  return new Promise(r => {
    cfmR = r;
    document.getElementById('cfmMsg').textContent = msg;
    document.getElementById('cfmYes').textContent = btnText;
    document.getElementById('cfmDlg').classList.add('open');
  });
}

/* --- 确认弹框按钮事件绑定 --- */
document.getElementById('cfmYes').onclick = () => {
  document.getElementById('cfmDlg').classList.remove('open');
  if (cfmR) cfmR(true);
};
document.getElementById('cfmNo').onclick = () => {
  document.getElementById('cfmDlg').classList.remove('open');
  if (cfmR) cfmR(false);
};
/* 点击弹框外部关闭 */
document.getElementById('cfmDlg').addEventListener('click', e => {
  if (e.target === e.currentTarget) {
    e.currentTarget.classList.remove('open');
    if (cfmR) cfmR(false);
  }
});

/**
 * 动态更新页面标题（标签页标题）
 * 格式：姓名 | 第一个头衔
 */
function updateTitle() {
  const p = cfg.personal;
  const title = p.titles && p.titles.length ? p.titles[0] : '';
  document.getElementById('pageTitle').textContent = `${p.name} | ${title}`;
  document.title = `${p.name} | ${title}`;
}

/**
 * 切换密码输入框的可见性（明文/密文）
 * @param {string} inputId - 密码输入框的 ID
 * @param {HTMLElement} btn - 切换按钮（内含 i 图标）
 */
function togglePwdVis(inputId, btn) {
  const inp = document.getElementById(inputId);
  const icon = btn.querySelector('i');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.className = 'fa-solid fa-eye-slash';
  } else {
    inp.type = 'password';
    icon.className = 'fa-solid fa-eye';
  }
}

/**
 * 生成星级评分 HTML
 * @param {number} n - 星级数（0-5）
 * @returns {string} 星级 HTML 字符串
 */
function starsH(n) {
  return `<span class="stars">${[1, 2, 3, 4, 5].map(i =>
    `<i class="fa-${i <= n ? 'solid' : 'regular'} fa-star"></i>`
  ).join('')}</span>`;
}
