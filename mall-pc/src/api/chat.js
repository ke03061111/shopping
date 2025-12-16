import request from '@/utils/request'

// 获取客服消息列表
export function getKefuMessageList() {
  return request({
    url: '/promotion/kefu-message/list',
    method: 'get',
    showLoading: false
  })
}

// 发送客服消息
export function sendKefuMessage(data) {
  return request({
    url: '/promotion/kefu-message/send',
    method: 'post',
    data
  })
}

