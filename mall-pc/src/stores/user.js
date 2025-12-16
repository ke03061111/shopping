import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUserInfo, getWallet } from '@/api/user'
import { getOrderCount } from '@/api/order'
import { getUnusedCouponCount } from '@/api/coupon'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const refreshToken = ref(localStorage.getItem('refreshToken') || '')
  const userInfo = ref(null)
  const wallet = ref(null)
  const orderCount = ref({
    allCount: 0,
    unpaidCount: 0,
    undeliveredCount: 0,
    deliveredCount: 0,
    uncommentedCount: 0,
    afterSaleCount: 0
  })
  const unusedCouponCount = ref(0)

  const isLogin = computed(() => !!token.value)

  // 设置token
  function setToken(accessToken, refresh) {
    token.value = accessToken
    refreshToken.value = refresh || ''
    if (accessToken) {
      localStorage.setItem('token', accessToken)
      if (refresh) {
        localStorage.setItem('refreshToken', refresh)
      }
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  }

  // 获取用户信息
  async function fetchUserInfo() {
    if (!isLogin.value) return
    try {
      const res = await getUserInfo()
      if (res.code === 0) {
        userInfo.value = res.data
      }
    } catch (error) {
      console.error('获取用户信息失败', error)
    }
  }

  // 获取钱包信息
  async function fetchWallet() {
    if (!isLogin.value) return
    try {
      const res = await getWallet()
      if (res.code === 0) {
        wallet.value = res.data
      }
    } catch (error) {
      console.error('获取钱包信息失败', error)
    }
  }

  // 获取订单统计
  async function fetchOrderCount() {
    if (!isLogin.value) return
    try {
      const res = await getOrderCount()
      if (res.code === 0) {
        orderCount.value = res.data
      }
    } catch (error) {
      console.error('获取订单统计失败', error)
    }
  }

  // 获取优惠券统计
  async function fetchCouponCount() {
    if (!isLogin.value) return
    try {
      const res = await getUnusedCouponCount()
      if (res.code === 0) {
        unusedCouponCount.value = res.data || 0
      }
    } catch (error) {
      console.error('获取优惠券统计失败', error)
    }
  }

  // 更新用户数据
  async function updateUserData() {
    if (!isLogin.value) return
    await Promise.all([
      fetchUserInfo(),
      fetchWallet(),
      fetchOrderCount(),
      fetchCouponCount()
    ])
  }

  // 登出
  function logout() {
    setToken('', '')
    userInfo.value = null
    wallet.value = null
    orderCount.value = {
      allCount: 0,
      unpaidCount: 0,
      undeliveredCount: 0,
      deliveredCount: 0,
      uncommentedCount: 0,
      afterSaleCount: 0
    }
    unusedCouponCount.value = 0
  }

  return {
    token,
    refreshToken,
    userInfo,
    wallet,
    orderCount,
    unusedCouponCount,
    isLogin,
    setToken,
    fetchUserInfo,
    fetchWallet,
    fetchOrderCount,
    fetchCouponCount,
    updateUserData,
    logout
  }
})

