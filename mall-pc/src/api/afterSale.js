import request from '@/utils/request'

// 获取售后列表
export function getAfterSalePage(params) {
  return request({
    url: '/trade/after-sale/page',
    method: 'get',
    params,
    showLoading: false
  })
}

// 获取售后详情
export function getAfterSale(id) {
  return request({
    url: '/trade/after-sale/get',
    method: 'get',
    params: { id }
  })
}

// 创建售后
export function createAfterSale(data) {
  return request({
    url: '/trade/after-sale/create',
    method: 'post',
    data,
    showSuccess: true,
    successMsg: '申请成功'
  })
}

// 取消售后
export function cancelAfterSale(id) {
  return request({
    url: '/trade/after-sale/cancel',
    method: 'delete',
    params: { id },
    showSuccess: true,
    successMsg: '取消成功'
  })
}

// 获取售后日志
export function getAfterSaleLogList(afterSaleId) {
  return request({
    url: '/trade/after-sale-log/list',
    method: 'get',
    params: { afterSaleId }
  })
}

// 退回货物
export function deliveryAfterSale(data) {
  return request({
    url: '/trade/after-sale/delivery',
    method: 'put',
    data,
    showSuccess: true,
    successMsg: '提交成功'
  })
}

// 获取快递公司列表
export function getDeliveryExpressList() {
  return request({
    url: '/trade/delivery/express/list',
    method: 'get'
  })
}

