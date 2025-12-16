import request from '@/utils/request'

// 获取购物车列表
export function getCartList() {
  return request({
    url: '/trade/cart/list',
    method: 'get',
    showLoading: false
  })
}

// 添加购物车
export function addCart(data) {
  return request({
    url: '/trade/cart/add',
    method: 'post',
    data,
    showSuccess: true,
    successMsg: '已添加到购物车'
  })
}

// 更新购物车数量
export function updateCartCount(data) {
  return request({
    url: '/trade/cart/update-count',
    method: 'put',
    data
  })
}

// 更新购物车选中状态
export function updateCartSelected(data) {
  return request({
    url: '/trade/cart/update-selected',
    method: 'put',
    data
  })
}

// 删除购物车
export function deleteCart(ids) {
  return request({
    url: '/trade/cart/delete',
    method: 'delete',
    params: { ids },
    showSuccess: true,
    successMsg: '删除成功'
  })
}

