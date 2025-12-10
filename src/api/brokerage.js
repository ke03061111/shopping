import request from '@/utils/request'

// 获取个人分销信息
export function getBrokerageUser() {
  return request({
    url: '/trade/brokerage-user/get',
    method: 'get'
  })
}

// 获取个人分销统计
export function getBrokerageUserSummary() {
  return request({
    url: '/trade/brokerage-user/get-summary',
    method: 'get'
  })
}

// 绑定分销用户
export function bindBrokerageUser(data) {
  return request({
    url: '/trade/brokerage-user/bind',
    method: 'put',
    data,
    showSuccess: true,
    successMsg: '绑定成功'
  })
}

// 获取分销记录
export function getBrokerageRecordPage(params) {
  return request({
    url: '/trade/brokerage-record/page',
    method: 'get',
    params
  })
}

// 获取商品分销金额
export function getProductBrokeragePrice(spuId) {
  return request({
    url: '/trade/brokerage-record/get-product-brokerage-price',
    method: 'get',
    params: { spuId }
  })
}

// 创建分销提现
export function createBrokerageWithdraw(data) {
  return request({
    url: '/trade/brokerage-withdraw/create',
    method: 'post',
    data,
    showSuccess: true,
    successMsg: '申请成功'
  })
}

// 获取分销提现列表
export function getBrokerageWithdrawPage(params) {
  return request({
    url: '/trade/brokerage-withdraw/page',
    method: 'get',
    params
  })
}

// 获取分销提现详情
export function getBrokerageWithdraw(id) {
  return request({
    url: '/trade/brokerage-withdraw/get',
    method: 'get',
    params: { id }
  })
}

// 获取下级分销统计
export function getBrokerageUserChildSummaryPage(params) {
  return request({
    url: '/trade/brokerage-user/child-summary-page',
    method: 'get',
    params
  })
}

// 获取佣金排行榜
export function getRankByPrice(params) {
  return request({
    url: '/trade/brokerage-user/get-rank-by-price',
    method: 'get',
    params
  })
}

// 获取推广人排行榜
export function getBrokerageUserRankPageByUserCount(params) {
  return request({
    url: '/trade/brokerage-user/rank-page-by-user-count',
    method: 'get',
    params
  })
}

