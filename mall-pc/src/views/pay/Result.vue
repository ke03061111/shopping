<template>
  <div class="pay-result-page">
    <div class="container">
      <el-card>
        <div class="result-content">
          <div v-if="payStatus === 'success'" class="result-success">
            <el-icon :size="80" color="#67c23a"><CircleCheckFilled /></el-icon>
            <h2>支付成功</h2>
            <p>订单号：{{ orderInfo?.merchantOrderId }}</p>
            <div class="result-actions">
              <el-button type="primary" @click="$router.push('/order/list')">查看订单</el-button>
              <el-button @click="$router.push('/home')">返回首页</el-button>
            </div>
          </div>
          <div v-else-if="payStatus === 'fail'" class="result-fail">
            <el-icon :size="80" color="#f56c6c"><CircleCloseFilled /></el-icon>
            <h2>支付失败</h2>
            <p>{{ errorMessage || '支付过程中出现错误，请重试' }}</p>
            <div class="result-actions">
              <el-button type="primary" @click="$router.push('/pay?orderId=' + orderId)">重新支付</el-button>
              <el-button @click="$router.push('/order/list')">查看订单</el-button>
            </div>
          </div>
          <div v-else class="result-loading">
            <el-icon class="is-loading" :size="80"><Loading /></el-icon>
            <h2>支付处理中...</h2>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPayOrder } from '@/api/payment'
import { CircleCheckFilled, CircleCloseFilled, Loading } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const orderId = ref(route.query.orderId || '')
const payStatus = ref('loading') // loading, success, fail
const orderInfo = ref(null)
const errorMessage = ref('')

const checkPayStatus = async () => {
  if (!orderId.value) {
    payStatus.value = 'fail'
    errorMessage.value = '订单号不存在'
    return
  }
  try {
    const res = await getPayOrder(orderId.value, true)
    if (res.code === 0) {
      orderInfo.value = res.data
      if (res.data.status === 20) {
        payStatus.value = 'success'
      } else if (res.data.status === 30) {
        payStatus.value = 'fail'
        errorMessage.value = '支付已取消'
      } else {
        // 继续轮询
        setTimeout(() => {
          checkPayStatus()
        }, 2000)
      }
    }
  } catch (error) {
    payStatus.value = 'fail'
    errorMessage.value = '查询支付状态失败'
  }
}

onMounted(() => {
  checkPayStatus()
})
</script>

<style scoped lang="scss">
.pay-result-page {
  padding: 40px 0;
  min-height: calc(100vh - 200px);

  .result-content {
    text-align: center;
    padding: 40px 0;

    h2 {
      margin: 20px 0 15px;
      font-size: 24px;
    }

    p {
      color: #666;
      margin-bottom: 30px;
    }

    .result-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .is-loading {
      animation: rotating 2s linear infinite;
    }
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
