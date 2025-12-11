<template>
  <div class="order-detail-page">
    <div class="container">
      <h2 class="page-title">订单详情</h2>
      <div v-if="orderInfo" class="order-detail-content">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>订单号：{{ orderInfo.no }}</span>
              <span class="order-status">{{ getStatusText(orderInfo.status) }}</span>
            </div>
          </template>
          <div class="order-info">
            <div class="info-section">
              <h3>收货信息</h3>
              <p>收货人：{{ orderInfo.receiverName }}</p>
              <p>联系电话：{{ orderInfo.receiverMobile }}</p>
              <p>收货地址：{{ orderInfo.receiverAreaName }} {{ orderInfo.receiverDetailAddress }}</p>
            </div>
            <div class="info-section">
              <h3>商品信息</h3>
              <div v-for="item in orderInfo.items" :key="item.id" class="goods-item">
                <img :src="item.spuPicUrl" class="goods-image" />
                <div class="goods-info">
                  <div class="goods-name">{{ item.spuName }}</div>
                  <div class="goods-sku">{{ item.skuProperties }}</div>
                </div>
                <div class="goods-price">¥{{ (item.price / 100).toFixed(2) }}</div>
                <div class="goods-count">x{{ item.count }}</div>
              </div>
            </div>
            <div class="info-section">
              <h3>订单信息</h3>
              <p>订单金额：¥{{ (orderInfo.payPrice / 100).toFixed(2) }}</p>
              <p>下单时间：{{ orderInfo.createTime }}</p>
            </div>
          </div>
          <div class="order-actions">
            <el-button v-if="orderInfo.status === 0" @click="handleCancel">取消订单</el-button>
            <el-button v-if="orderInfo.status === 0" type="primary" @click="handlePay">去支付</el-button>
            <el-button v-if="orderInfo.status === 2" type="primary" @click="handleReceive">确认收货</el-button>
            <el-button v-if="orderInfo.status === 2" @click="$router.push(`/order/express/log/${orderInfo.id}`)">查看物流</el-button>
            <el-button v-if="orderInfo.status === 4 && canApplyAfterSale" @click="handleApplyAfterSale">申请售后</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail, cancelOrder, receiveOrder } from '@/api/order'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const orderInfo = ref(null)

const getStatusText = (status) => {
  const statusMap = {
    0: '待付款',
    1: '待发货',
    2: '待收货',
    3: '待评价',
    4: '已完成',
    10: '已取消'
  }
  return statusMap[status] || '未知'
}

const fetchOrderDetail = async () => {
  try {
    const res = await getOrderDetail(route.params.id)
    if (res.code === 0) {
      orderInfo.value = res.data
    }
  } catch (error) {
    console.error('获取订单详情失败', error)
  }
}

const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('确定要取消这个订单吗？', '提示', {
      type: 'warning'
    })
    await cancelOrder(route.params.id)
    fetchOrderDetail()
  } catch (error) {
    // 用户取消
  }
}

const handleReceive = async () => {
  try {
    await ElMessageBox.confirm('确定已收到商品吗？', '提示', {
      type: 'warning'
    })
    await receiveOrder(route.params.id)
    fetchOrderDetail()
  } catch (error) {
    // 用户取消
  }
}

const handlePay = () => {
  router.push(`/pay?orderId=${route.params.id}`)
}

const canApplyAfterSale = computed(() => {
  return orderInfo.value?.status === 4
})

const handleApplyAfterSale = () => {
  router.push(`/order/aftersale/apply?orderId=${route.params.id}`)
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped lang="scss">
.order-detail-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .card-header {
    display: flex;
    justify-content: space-between;

    .order-status {
      color: #ff6b35;
      font-weight: bold;
    }
  }

  .order-info {
    .info-section {
      margin-bottom: 30px;

      h3 {
        font-size: 16px;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #f0f0f0;
      }

      .goods-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 0;
        border-bottom: 1px solid #f5f5f5;

        .goods-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
        }

        .goods-info {
          flex: 1;

          .goods-name {
            font-size: 14px;
            margin-bottom: 5px;
          }

          .goods-sku {
            font-size: 12px;
            color: #999;
          }
        }

        .goods-price {
          color: #ff6b35;
          font-weight: bold;
        }

        .goods-count {
          color: #999;
        }
      }
    }
  }

  .order-actions {
    margin-top: 20px;
    text-align: right;
  }
}
</style>

