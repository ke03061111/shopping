<template>
  <div class="pay-page">
    <div class="container">
      <h2 class="page-title">收银台</h2>
      <el-card v-loading="loading">
        <div v-if="orderInfo" class="pay-content">
          <div class="order-info">
            <div class="order-amount">
              <span class="label">订单金额：</span>
              <span class="amount">¥{{ (orderInfo.price / 100).toFixed(2) }}</span>
            </div>
            <div class="order-no">订单号：{{ orderInfo.merchantOrderId }}</div>
          </div>

          <div class="payment-methods">
            <h3>选择支付方式</h3>
            <el-radio-group v-model="selectedChannel">
              <el-radio
                v-for="channel in channelList"
                :key="channel.code"
                :label="channel.code"
                class="payment-option"
              >
                <div class="payment-item">
                  <img :src="channel.logo" class="payment-logo" v-if="channel.logo" />
                  <span>{{ channel.name }}</span>
                </div>
              </el-radio>
            </el-radio-group>
          </div>

          <div class="pay-actions">
            <el-button type="primary" size="large" @click="handlePay" :loading="paying">
              立即支付
            </el-button>
            <el-button @click="$router.push('/order/list')">取消</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPayOrder, getEnableChannelCodeList, submitPayOrder } from '@/api/payment'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const paying = ref(false)
const orderInfo = ref(null)
const channelList = ref([])
const selectedChannel = ref('')

const fetchOrder = async () => {
  loading.value = true
  try {
    const orderId = route.query.orderId
    const rechargeId = route.query.rechargeId
    if (orderId) {
      const res = await getPayOrder(orderId, true)
      if (res.code === 0) {
        orderInfo.value = res.data
        await fetchChannels(res.data.appId)
      }
    } else if (rechargeId) {
      // 处理充值订单
      const res = await getPayOrder(rechargeId, true)
      if (res.code === 0) {
        orderInfo.value = res.data
        await fetchChannels(res.data.appId)
      }
    }
  } catch (error) {
    console.error('获取订单失败', error)
  } finally {
    loading.value = false
  }
}

const fetchChannels = async (appId) => {
  try {
    const res = await getEnableChannelCodeList(appId)
    if (res.code === 0) {
      channelList.value = res.data || []
      if (channelList.value.length > 0) {
        selectedChannel.value = channelList.value[0].code
      }
    }
  } catch (error) {
    console.error('获取支付渠道失败', error)
  }
}

const handlePay = async () => {
  if (!selectedChannel.value) {
    ElMessage.warning('请选择支付方式')
    return
  }
  paying.value = true
  try {
    const res = await submitPayOrder({
      id: orderInfo.value.id,
      channelCode: selectedChannel.value
    })
    if (res.code === 0) {
      // 根据支付渠道跳转或处理支付
      if (res.data.invokeResponse) {
        // 处理支付响应
        window.location.href = res.data.invokeResponse
      } else {
        router.push(`/pay/result?orderId=${orderInfo.value.id}`)
      }
    }
  } catch (error) {
    console.error('支付失败', error)
  } finally {
    paying.value = false
  }
}

onMounted(() => {
  fetchOrder()
})
</script>

<style scoped lang="scss">
.pay-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .page-title {
    margin-bottom: 20px;
  }

  .pay-content {
    max-width: 600px;
    margin: 0 auto;

    .order-info {
      text-align: center;
      padding: 30px 0;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 30px;

      .order-amount {
        margin-bottom: 15px;

        .label {
          font-size: 16px;
          color: #666;
        }

        .amount {
          font-size: 32px;
          font-weight: bold;
          color: #ff6b35;
          margin-left: 10px;
        }
      }

      .order-no {
        font-size: 14px;
        color: #999;
      }
    }

    .payment-methods {
      margin-bottom: 30px;

      h3 {
        margin-bottom: 20px;
        font-size: 18px;
      }

      .payment-option {
        display: block;
        margin-bottom: 15px;
        padding: 15px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        transition: all 0.3s;

        &:hover {
          border-color: #ff6b35;
        }

        .payment-item {
          display: flex;
          align-items: center;
          gap: 10px;

          .payment-logo {
            width: 30px;
            height: 30px;
          }
        }
      }
    }

    .pay-actions {
      text-align: center;
      display: flex;
      gap: 15px;
      justify-content: center;
    }
  }
}
</style>
