import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCartList, updateCartSelected, deleteCart } from '@/api/cart'

export const useCartStore = defineStore('cart', () => {
  const list = ref([])
  const validList = ref([])
  const invalidList = ref([])
  const selectedIds = ref([])

  // 计算属性
  const totalCount = computed(() => {
    return validList.value.reduce((sum, item) => sum + item.count, 0)
  })

  const totalPrice = computed(() => {
    return validList.value
      .filter(item => selectedIds.value.includes(item.id))
      .reduce((sum, item) => sum + item.count * item.sku.price, 0)
  })

  const isAllSelected = computed(() => {
    return validList.value.length > 0 && 
           validList.value.every(item => selectedIds.value.includes(item.id))
  })

  // 获取购物车列表
  async function fetchCartList() {
    try {
      const res = await getCartList()
      if (res.code === 0) {
        list.value = [...res.data.validList, ...res.data.invalidList]
        validList.value = res.data.validList
        invalidList.value = res.data.invalidList
        // 初始化选中状态
        selectedIds.value = validList.value
          .filter(item => item.selected)
          .map(item => item.id)
      }
    } catch (error) {
      console.error('获取购物车失败', error)
    }
  }

  // 切换选中状态
  async function toggleSelect(id) {
    const isSelected = selectedIds.value.includes(id)
    try {
      await updateCartSelected({
        ids: [id],
        selected: !isSelected
      })
      if (isSelected) {
        selectedIds.value = selectedIds.value.filter(item => item !== id)
      } else {
        selectedIds.value.push(id)
      }
    } catch (error) {
      console.error('更新选中状态失败', error)
    }
  }

  // 全选/取消全选
  async function toggleSelectAll(selected) {
    try {
      await updateCartSelected({
        ids: validList.value.map(item => item.id),
        selected
      })
      if (selected) {
        selectedIds.value = validList.value.map(item => item.id)
      } else {
        selectedIds.value = []
      }
    } catch (error) {
      console.error('全选操作失败', error)
    }
  }

  // 删除购物车商品
  async function removeCartItem(ids) {
    try {
      await deleteCart(Array.isArray(ids) ? ids.join(',') : ids)
      await fetchCartList()
    } catch (error) {
      console.error('删除购物车商品失败', error)
    }
  }

  return {
    list,
    validList,
    invalidList,
    selectedIds,
    totalCount,
    totalPrice,
    isAllSelected,
    fetchCartList,
    toggleSelect,
    toggleSelectAll,
    removeCartItem
  }
})

