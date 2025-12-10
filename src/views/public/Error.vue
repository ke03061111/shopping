<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">{{ errorCode }}</div>
      <div class="error-message">{{ errorMessage }}</div>
      <div class="error-actions">
        <el-button type="primary" @click="handleGoHome">返回首页</el-button>
        <el-button @click="handleGoBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const errorCode = ref('404')
const errorMessage = ref('页面不存在')

onMounted(() => {
  const code = route.query.code || '404'
  errorCode.value = code
  
  const messageMap = {
    '404': '页面不存在',
    '403': '没有权限访问',
    '500': '服务器错误',
    '503': '服务不可用'
  }
  errorMessage.value = messageMap[code] || '未知错误'
})

const handleGoHome = () => {
  router.push('/home')
}

const handleGoBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  background: #f5f5f5;

  .error-content {
    text-align: center;

    .error-code {
      font-size: 120px;
      font-weight: bold;
      color: #ff6b35;
      line-height: 1;
      margin-bottom: 20px;
    }

    .error-message {
      font-size: 24px;
      color: #666;
      margin-bottom: 40px;
    }

    .error-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
    }
  }
}
</style>

