/* ============================================================
 *  API 请求与认证模块
 *
 *  职责：管理认证令牌、封装带鉴权的 fetch 请求
 *
 *  全局变量：
 *  - token: 当前认证令牌（同步存入 sessionStorage 持久化）
 *  - unlocked: 是否已通过密码验证
 *
 *  函数：
 *  - api(url, opts): 带 Bearer token 的 fetch 封装
 *    · 自动注入 Authorization 头
 *    · 遇到 401 自动清除登录状态并提示重新登录
 * ============================================================ */

/* --- 认证令牌（从 sessionStorage 恢复） --- */
let token = sessionStorage.getItem('auth_token');

/* --- 是否已解锁管理面板 --- */
let unlocked = !!token;

/**
 * 带认证的 fetch 请求封装
 * @param {string} url - 请求地址
 * @param {object} opts - fetch 选项
 * @returns {Promise<object>} 响应 JSON
 */
async function api(url, opts = {}) {
  if (token) opts.headers = { ...opts.headers, 'Authorization': 'Bearer ' + token };
  const res = await fetch(url, opts);
  const json = await res.json();
  /* 401 时自动清除登录状态 */
  if (!res.ok && res.status === 401) {
    unlocked = false;
    token = null;
    sessionStorage.removeItem('auth_token');
    closeAdmin();
    toast('会话已过期，请重新登录', 'err');
  }
  return json;
}
