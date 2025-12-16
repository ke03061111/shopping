import request from '@/utils/request'

// 获取支付订单
export function getPayOrder(id, sync, no) {
  const params = {}
  if (id) params.id = id
  if (no) params.no = no
  if (sync !== undefined) params.sync = sync
  return request({
    url: '/pay/order/get',
    method: 'get',
    params
  })
}

// 提交支付订单
export function submitPayOrder(data) {
  return request({
    url: '/pay/order/submit',
    method: 'post',
    data
  })
}

// 获取支付渠道列表
export function getEnableChannelCodeList(appId) {
  return request({
    url: '/pay/channel/get-enable-code-list',
    method: 'get',
    params: { appId }
  })
}

// 获取钱包充值套餐
export function getWalletRechargePackageList() {
  return request({
    url: '/pay/wallet-recharge-package/list',
    method: 'get',
    showLoading: false
  })
}

// 创建钱包充值
export function createWalletRecharge(data) {
  return request({
    url: '/pay/wallet-recharge/create',
    method: 'post',
    data
  })
}

// 获取钱包充值记录
export function getWalletRechargePage(params) {
  return request({
    url: '/pay/wallet-recharge/page',
    method: 'get',
    params,
    showLoading: false
  })
}

