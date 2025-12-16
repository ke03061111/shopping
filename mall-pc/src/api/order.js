import request from '@/utils/request'

// 获取订单分页列表
export function getOrderPage(params) {
  return request({
    url: '/trade/order/page',
    method: 'get',
    params
  })
}

// 获取订单详情
export function getOrderDetail(id) {
  return request({
    url: '/trade/order/get-detail',
    method: 'get',
    params: { id }
  })
}

// 创建订单
export function createOrder(data) {
  return request({
    url: '/trade/order/create',
    method: 'post',
    data,
    showSuccess: true,
    successMsg: '订单创建成功'
  })
}

// 取消订单
export function cancelOrder(id) {
  return request({
    url: '/trade/order/cancel',
    method: 'post',
    data: { id },
    showSuccess: true,
    successMsg: '订单已取消'
  })
}

// 确认收货
export function receiveOrder(id) {
  return request({
    url: '/trade/order/receive',
    method: 'post',
    data: { id },
    showSuccess: true,
    successMsg: '确认收货成功'
  })
}

// 删除订单
export function deleteOrder(id) {
  return request({
    url: '/trade/order/delete',
    method: 'delete',
    params: { id },
    showSuccess: true,
    successMsg: '订单已删除'
  })
}

// 计算订单信息
export function settlementOrder(data) {
  return request({
    url: '/trade/order/settlement',
    method: 'post',
    data
  })
}

// 获取订单物流轨迹列表
export function getOrderExpressTrackList(id) {
  return request({
    url: '/trade/order/get-express-track-list',
    method: 'get',
    params: { id }
  })
}

// 获取自提门店列表
export function getPickUpStoreList() {
  return request({
    url: '/trade/delivery/pick-up-store/list',
    method: 'get'
  })
}

// 获取自提门店信息
export function getPickUpStore(id) {
  return request({
    url: '/trade/delivery/pick-up-store/get',
    method: 'get',
    params: { id }
  })
}

// 自提订单核销
export function verifyPickUpOrder(data) {
  return request({
    url: '/trade/delivery/pick-up-store/verify',
    method: 'post',
    data,
    showSuccess: true,
    successMsg: '核销成功'
  })
}

// 获取自提核销记录
export function getPickUpVerifyList() {
  return request({
    url: '/trade/delivery/pick-up-store/verify-list',
    method: 'get'
  })
}

// 创建订单商品评价
export function createOrderItemComment(data) {
  return request({
    url: '/trade/order/item/create-comment',
    method: 'post',
    data,
    showSuccess: true,
    successMsg: '评价成功'
  })
}

// 获取订单数量统计
export function getOrderCount() {
  return request({
    url: '/trade/order/get-count',
    method: 'get',
    showLoading: false
  })
}
