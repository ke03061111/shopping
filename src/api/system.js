import request from '@/utils/request'

// 根据字典类型查询字典数据
export function getDictDataListByType(type) {
  return request({
    url: '/system/dict-data/type',
    method: 'get',
    params: { type }
  })
}

