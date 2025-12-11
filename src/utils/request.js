import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import { config } from '@/config'
import { useUserStore } from '@/stores/user'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: config.baseUrl + config.apiPath,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  }
})

let loadingInstance = null
let loadingCount = 0

// 显示loading
const showLoading = (message = '加载中...') => {
  if (loadingCount === 0) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: message,
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  loadingCount++
}

// 隐藏loading
const hideLoading = () => {
  loadingCount--
  if (loadingCount <= 0) {
    loadingCount = 0
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
  }
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    const token = userStore.token
    
    // 添加token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 添加租户ID
    config.headers['tenant-id'] = config.tenantId || '1'
    config.headers['terminal'] = 'H5'
    
    // 显示loading
    if (config.showLoading !== false) {
      showLoading(config.loadingMsg)
    }
    
    return config
  },
  error => {
    hideLoading()
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    hideLoading()
    
    const res = response.data
    
    // 登录相关接口，自动设置token
    if (response.config.url.includes('/member/auth/') && res.data?.accessToken) {
      const userStore = useUserStore()
      userStore.setToken(res.data.accessToken, res.data.refreshToken)
    }
    
    // 业务错误处理
    if (res.code !== 0) {
      // 401未授权，只有在已登录状态下才跳转登录（避免公开页面API返回401时强制跳转）
      if (res.code === 401) {
        const userStore = useUserStore()
        // 如果当前已登录，说明token过期，需要重新登录
        if (userStore.isLogin) {
          userStore.logout()
          // 避免在登录页或公开页面重复跳转
          if (router.currentRoute.value.path !== '/login') {
            router.push('/login')
          }
          ElMessage.error(res.msg || '登录已过期，请重新登录')
        }
        return Promise.reject(new Error(res.msg || '登录已过期'))
      }
      
      // 显示错误消息
      if (response.config.showError !== false) {
        ElMessage.error(res.msg || '请求失败')
      }
      
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    
    // 显示成功消息
    if (response.config.showSuccess && response.config.successMsg) {
      ElMessage.success(response.config.successMsg)
    }
    
    return res
  },
  error => {
    hideLoading()
    
    let message = '网络请求出错'
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求错误'
          break
        case 401:
          message = '未授权，请重新登录'
          const userStore = useUserStore()
          // 如果当前已登录，说明token过期，需要重新登录
          if (userStore.isLogin) {
            userStore.logout()
            // 避免在登录页或公开页面重复跳转
            if (router.currentRoute.value.path !== '/login') {
              router.push('/login')
            }
          }
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求出错'
          break
        case 500:
          message = '服务器错误'
          break
        default:
          message = `连接错误${error.response.status}`
      }
    } else if (error.request) {
      message = '网络连接失败'
    }
    
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service

