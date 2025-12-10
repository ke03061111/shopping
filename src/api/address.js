import request from '@/utils/request'

// 获取地址列表
export function getAddressList() {
  return request({
    url: '/member/address/list',
    method: 'get'
  })
}

// 获取地址详情
export function getAddress(id) {
  return request({
    url: '/member/address/get',
    method: 'get',
    params: { id }
  })
}

// 创建地址
export function createAddress(data) {
  return request({
    url: '/member/address/create',
    method: 'post',
    data,
    showSuccess: true,
    successMsg: '保存成功'
  })
}

// 更新地址
export function updateAddress(data) {
  return request({
    url: '/member/address/update',
    method: 'put',
    data,
    showSuccess: true,
    successMsg: '更新成功'
  })
}

// 删除地址
export function deleteAddress(id) {
  return request({
    url: '/member/address/delete',
    method: 'delete',
    params: { id },
    showSuccess: true,
    successMsg: '删除成功'
  })
}

// 获取地区树
export function getAreaTree() {
  return request({
    url: '/system/area/tree',
    method: 'get'
  })
}

