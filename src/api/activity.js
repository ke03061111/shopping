import request from '@/utils/request'

// 获取拼团活动列表
export function getCombinationActivityPage(params) {
  return request({
    url: '/promotion/combination-activity/page',
    method: 'get',
    params
  })
}

// 获取拼团活动详情
export function getCombinationActivity(id) {
  return request({
    url: '/promotion/combination-activity/get-detail',
    method: 'get',
    params: { id }
  })
}

// 获取我的拼团记录
export function getCombinationRecordPage(params) {
  return request({
    url: '/promotion/combination-record/page',
    method: 'get',
    params
  })
}

// 获取拼团记录详情
export function getCombinationRecordDetail(id) {
  return request({
    url: '/promotion/combination-record/get-detail',
    method: 'get',
    params: { id }
  })
}

// 获取拼团记录概要
export function getCombinationRecordSummary() {
  return request({
    url: '/promotion/combination-record/get-summary',
    method: 'get'
  })
}

// 获取秒杀时间段列表
export function getSeckillConfigList() {
  return request({
    url: '/promotion/seckill-config/list',
    method: 'get'
  })
}

// 获取当前秒杀活动
export function getNowSeckillActivity() {
  return request({
    url: '/promotion/seckill-activity/get-now',
    method: 'get'
  })
}

// 获取秒杀活动列表
export function getSeckillActivityPage(params) {
  return request({
    url: '/promotion/seckill-activity/page',
    method: 'get',
    params
  })
}

// 获取秒杀活动详情
export function getSeckillActivity(id) {
  return request({
    url: '/promotion/seckill-activity/get-detail',
    method: 'get',
    params: { id }
  })
}

// 获取积分商城活动列表
export function getPointActivityPage(params) {
  return request({
    url: '/promotion/point-activity/page',
    method: 'get',
    params
  })
}

// 获取积分商城活动详情
export function getPointActivity(id) {
  return request({
    url: '/promotion/point-activity/get-detail',
    method: 'get',
    params: { id }
  })
}

// 获取商品活动信息
export function getActivityListBySpuId(spuId) {
  return request({
    url: '/promotion/activity/list-by-spu-id',
    method: 'get',
    params: { spuId }
  })
}

// 通过spuId获取拼团活动详情
export function getCombinationActivityBySpuId(spuId) {
  return request({
    url: '/promotion/combination-activity/get-detail',
    method: 'get',
    params: { spuId }
  })
}

// 通过spuId获取秒杀活动详情
export function getSeckillActivityBySpuId(spuId) {
  return request({
    url: '/promotion/seckill-activity/get-detail',
    method: 'get',
    params: { spuId }
  })
}

// 通过spuId获取积分活动详情
export function getPointActivityBySpuId(spuId) {
  return request({
    url: '/promotion/point-activity/get-detail',
    method: 'get',
    params: { spuId }
  })
}

// 获取满减送活动
export function getRewardActivity(id) {
  return request({
    url: '/promotion/reward-activity/get',
    method: 'get',
    params: { id }
  })
}

