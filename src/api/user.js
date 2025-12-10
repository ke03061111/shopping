import request from '@/utils/request'

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/member/user/get',
    method: 'get',
    showLoading: false
  })
}

// 更新用户信息
export function updateUser(data) {
  return request({
    url: '/member/user/update',
    method: 'put',
    data,
    showSuccess: true,
    successMsg: '更新成功'
  })
}

// 修改手机号
export function updateUserMobile(data) {
  return request({
    url: '/member/user/update-mobile',
    method: 'put',
    data,
    showSuccess: true,
    successMsg: '修改成功'
  })
}

// 修改密码
export function updateUserPassword(data) {
  return request({
    url: '/member/user/update-password',
    method: 'put',
    data,
    showSuccess: true,
    successMsg: '修改成功'
  })
}

// 获取钱包信息
export function getWallet() {
  return request({
    url: '/pay/wallet/get',
    method: 'get',
    showLoading: false
  })
}

// 获取积分记录
export function getPointRecordPage(params) {
  return request({
    url: '/member/point/record/page',
    method: 'get',
    params
  })
}

// 获取钱包流水
export function getWalletTransactionPage(params) {
  return request({
    url: '/pay/wallet-transaction/page',
    method: 'get',
    params
  })
}

// 获取钱包流水统计
export function getWalletTransactionSummary(params) {
  return request({
    url: '/pay/wallet-transaction/get-summary',
    method: 'get',
    params
  })
}

