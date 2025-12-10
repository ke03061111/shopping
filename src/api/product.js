import request from '@/utils/request'

// 获取商品详情
export function getSpuDetail(id) {
  return request({
    url: '/product/spu/get-detail',
    method: 'get',
    params: { id },
    showLoading: false
  })
}

// 获取商品列表
export function getSpuPage(params) {
  return request({
    url: '/product/spu/page',
    method: 'get',
    params,
    showLoading: false
  })
}

// 根据ID列表获取商品
export function getSpuListByIds(ids) {
  return request({
    url: '/product/spu/list-by-ids',
    method: 'get',
    params: { ids },
    showLoading: false
  })
}

// 获取商品结算信息
export function getSettlementProduct(spuIds) {
  return request({
    url: '/trade/order/settlement-product',
    method: 'get',
    params: { spuIds },
    showLoading: false
  })
}

// 获取分类列表
export function getCategoryList() {
  return request({
    url: '/product/category/list',
    method: 'get'
  })
}

// 获取商品评价
export function getCommentPage(spuId, pageNo = 1, pageSize = 10, type) {
  return request({
    url: '/product/comment/page',
    method: 'get',
    params: { spuId, pageNo, pageSize, type },
    showLoading: false
  })
}

// 检查是否收藏
export function isFavoriteExists(spuId) {
  return request({
    url: '/product/favorite/exits',
    method: 'get',
    params: { spuId },
    showLoading: false
  })
}

// 添加收藏
export function createFavorite(spuId) {
  return request({
    url: '/product/favorite/create',
    method: 'post',
    data: { spuId },
    showSuccess: true,
    successMsg: '收藏成功'
  })
}

// 取消收藏
export function deleteFavorite(spuId) {
  return request({
    url: '/product/favorite/delete',
    method: 'delete',
    data: { spuId },
    showSuccess: true,
    successMsg: '取消成功'
  })
}

// 获取收藏列表
export function getFavoritePage(params) {
  return request({
    url: '/product/favorite/page',
    method: 'get',
    params
  })
}

// 获取浏览记录
export function getBrowseHistoryPage(params) {
  return request({
    url: '/product/browse-history/page',
    method: 'get',
    params,
    showLoading: false
  })
}

// 删除浏览记录
export function deleteBrowseHistory(spuIds) {
  return request({
    url: '/product/browse-history/delete',
    method: 'delete',
    data: { spuIds },
    showSuccess: true,
    successMsg: '删除成功'
  })
}

// 清空浏览记录
export function cleanBrowseHistory() {
  return request({
    url: '/product/browse-history/clean',
    method: 'delete',
    showSuccess: true,
    successMsg: '清空成功'
  })
}

