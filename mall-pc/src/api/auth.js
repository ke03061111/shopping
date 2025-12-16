import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/member/auth/login',
    method: 'post',
    data,
    showSuccess: true,
    successMsg: '登录成功'
  })
}

// 短信登录
export function smsLogin(data) {
  return request({
    url: '/member/auth/sms-login',
    method: 'post',
    data,
    showSuccess: true,
    successMsg: '登录成功'
  })
}

// 发送验证码
export function sendSmsCode(mobile, scene) {
  return request({
    url: '/member/auth/send-sms-code',
    method: 'post',
    data: { mobile, scene },
    showSuccess: true,
    successMsg: '发送成功'
  })
}

// 登出
export function logout() {
  return request({
    url: '/member/auth/logout',
    method: 'post'
  })
}

// 刷新token
export function refreshToken(refreshToken) {
  return request({
    url: '/member/auth/refresh-token',
    method: 'post',
    params: { refreshToken },
    showLoading: false,
    showError: false
  })
}

