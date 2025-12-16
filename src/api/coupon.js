import request from '@/utils/request'

// 获取优惠券模板列表
export function getCouponTemplateList(spuId, productScope, count) {
  return request({
    url: '/promotion/coupon-template/list',
    method: 'get',
    params: { spuId, productScope, count }
  })
}

// 获取优惠券模板分页
export function getCouponTemplatePage(params) {
  return request({
    url: '/promotion/coupon-template/page',
    method: 'get',
    params
  })
}

// 获取优惠券模板
export function getCouponTemplate(id) {
  return request({
    url: '/promotion/coupon-template/get',
    method: 'get',
    params: { id }
  })
}

// 领取优惠券
export function takeCoupon(templateId) {
  return request({
    url: '/promotion/coupon/take',
    method: 'post',
    data: { templateId },
    showSuccess: true,
    successMsg: '领取成功'
  })
}

// 获取我的优惠券列表
export function getCouponPage(params) {
  return request({
    url: '/promotion/coupon/page',
    method: 'get',
    params
  })
}

// 获取优惠券详情
export function getCoupon(id) {
  return request({
    url: '/promotion/coupon/get',
    method: 'get',
    params: { id }
  })
}

// 获取未使用优惠券数量
export function getUnusedCouponCount() {
  return request({
    url: '/promotion/coupon/get-unused-count',
    method: 'get',
    showLoading: false
  })
}

