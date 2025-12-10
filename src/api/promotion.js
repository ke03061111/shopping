import request from '@/utils/request'

// 获取文章详情
export function getArticle(id) {
  return request({
    url: '/promotion/article/get',
    method: 'get',
    params: { id }
  })
}

// 获取DIY页面详情
export function getDiyPage(id) {
  return request({
    url: '/promotion/diy-page/get',
    method: 'get',
    params: { id }
  })
}

// 获取使用的装修模板
export function getUsedDiyTemplate() {
  return request({
    url: '/promotion/diy-template/used',
    method: 'get'
  })
}

// 获取装修模板详情
export function getDiyTemplate(id) {
  return request({
    url: '/promotion/diy-template/get',
    method: 'get',
    params: { id }
  })
}

