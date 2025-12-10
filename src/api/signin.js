import request from '@/utils/request'

// 获取签到规则列表
export function getSignInConfigList() {
  return request({
    url: '/member/sign-in/config/list',
    method: 'get'
  })
}

// 获取个人签到统计
export function getSignInRecordSummary() {
  return request({
    url: '/member/sign-in/record/get-summary',
    method: 'get'
  })
}

// 签到
export function createSignInRecord() {
  return request({
    url: '/member/sign-in/record/create',
    method: 'post',
    showSuccess: true,
    successMsg: '签到成功'
  })
}

// 获取签到记录
export function getSignRecordPage(params) {
  return request({
    url: '/member/sign-in/record/page',
    method: 'get',
    params
  })
}

