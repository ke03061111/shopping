<template>
  <div class="order-list-page">
    <div class="container">
      <h2 class="page-title">我的订单</h2>
      <el-tabs v-model="activeStatus" @tab-change="handleStatusChange">
        <el-tab-pane label="全部" name=""></el-tab-pane>
        <el-tab-pane label="待付款" name="0"></el-tab-pane>
        <el-tab-pane label="待发货" name="1"></el-tab-pane>
        <el-tab-pane label="待收货" name="2"></el-tab-pane>
        <el-tab-pane label="待评价" name="3"></el-tab-pane>
      </el-tabs>
      <div class="order-list" v-loading="loading">
        <div v-for="item in orderList" :key="item.id" class="order-item">
          <div class="order-header">
            <span>订单号：{{ item.no }}</span>
            <span class="order-status">{{ getStatusText(item.status) }}</span>
          </div>
          <div class="order-goods">
            <div v-for="orderItem in item.items" :key="orderItem.id" class="goods-item">
              <img :src="orderItem.spuPicUrl" class="goods-image" />
              <div class="goods-info">
                <div class="goods-name">{{ orderItem.spuName }}</div>
                <div class="goods-sku">{{ orderItem.skuProperties }}</div>
              </div>
              <div class="goods-price">¥{{ (orderItem.price / 100).toFixed(2) }}</div>
              <div class="goods-count">x{{ orderItem.count }}</div>
            </div>
          </div>
          <div class="order-footer">
            <div class="order-total">
              共{{ item.items.length }}件商品，合计：<span class="price">¥{{ (item.payPrice / 100).toFixed(2) }}</span>
            </div>
            <div class="order-actions">
              <el-button v-if="item.status === 0" @click="handleCancel(item.id)">取消订单</el-button>
              <el-button v-if="item.status === 0" type="primary" @click="handlePay(item.id)">去支付</el-button>
              <el-button v-if="item.status === 2" type="primary" @click="handleReceive(item.id)">确认收货</el-button>
              <el-button v-if="item.status === 2" @click="$router.push(`/order/express/log/${item.id}`)">查看物流</el-button>
              <el-button v-if="item.status === 4 && canApplyAfterSale(item)" @click="handleApplyAfterSale(item.id)">申请售后</el-button>
              <el-button @click="$router.push(`/order/detail/${item.id}`)">查看详情</el-button>
            </div>
          </div>
        </div>
        <el-empty v-if="orderList.length === 0" description="暂无订单" />
      </div>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
        style="margin-top: 20px; justify-content: center;"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrderPage, cancelOrder, receiveOrder } from '@/api/order'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const orderList = ref([])
const loading = ref(false)
const activeStatus = ref('')
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

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

const fetchOrders = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      status: activeStatus.value ? Number(activeStatus.value) : undefined
    }
    const res = await getOrderPage(params)
    if (res.code === 0) {
      orderList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取订单失败', error)
  } finally {
    loading.value = false
  }
}

const handleStatusChange = () => {
  pageNo.value = 1
  fetchOrders()
}

const handlePageChange = () => {
  fetchOrders()
}

const handleCancel = async (id) => {
  try {
    await ElMessageBox.confirm('确定要取消这个订单吗？', '提示', {
      type: 'warning'
    })
    await cancelOrder(id)
    fetchOrders()
  } catch (error) {
    // 用户取消
  }
}

const handleReceive = async (id) => {
  try {
    await ElMessageBox.confirm('确定已收到商品吗？', '提示', {
      type: 'warning'
    })
    await receiveOrder(id)
    fetchOrders()
  } catch (error) {
    // 用户取消
  }
}

const handlePay = (id) => {
  router.push(`/pay?orderId=${id}`)
}

const canApplyAfterSale = (order) => {
  // 判断是否可以申请售后（已完成订单且未超过售后期限）
  return order.status === 4
}

const handleApplyAfterSale = (orderId) => {
  router.push(`/order/aftersale/apply?orderId=${orderId}`)
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped lang="scss">
.order-list-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .order-list {
    margin-top: 20px;

    .order-item {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;

      .order-header {
        display: flex;
        justify-content: space-between;
        padding-bottom: 15px;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 15px;

        .order-status {
          color: #ff6b35;
          font-weight: bold;
        }
      }

      .order-goods {
        .goods-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #f5f5f5;

          &:last-child {
            border-bottom: none;
          }

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
              color: #333;
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

      .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #f0f0f0;

        .order-total {
          .price {
            color: #ff6b35;
            font-size: 18px;
            font-weight: bold;
          }
        }

        .order-actions {
          display: flex;
          gap: 10px;
        }
      }
    }
  }
}
</style>

