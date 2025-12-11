<template>
  <div class="aftersale-detail-page">
    <div class="container">
      <h2 class="page-title">售后详情</h2>
      <el-card v-loading="loading">
        <div v-if="aftersaleInfo" class="aftersale-detail">
          <div class="detail-section">
            <h3>售后信息</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="售后单号">{{ aftersaleInfo.no }}</el-descriptions-item>
              <el-descriptions-item label="售后状态">
                <el-tag :type="getStatusType(aftersaleInfo.status)">
                  {{ getStatusText(aftersaleInfo.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="售后类型">{{ getTypeText(aftersaleInfo.type) }}</el-descriptions-item>
              <el-descriptions-item label="申请时间">{{ aftersaleInfo.createTime }}</el-descriptions-item>
              <el-descriptions-item label="申请原因" :span="2">{{ aftersaleInfo.reason }}</el-descriptions-item>
              <el-descriptions-item label="问题描述" :span="2">{{ aftersaleInfo.description || '无' }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="detail-section">
            <h3>商品信息</h3>
            <div class="goods-list">
              <div v-for="item in aftersaleInfo.orderItems" :key="item.id" class="goods-item">
                <img :src="item.spuPicUrl" class="goods-image" />
                <div class="goods-info">
                  <div class="goods-name">{{ item.spuName }}</div>
                  <div class="goods-sku">{{ item.skuProperties }}</div>
                </div>
                <div class="goods-count">x{{ item.count }}</div>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3>售后进度</h3>
            <el-timeline>
              <el-timeline-item
                v-for="(log, index) in logList"
                :key="index"
                :timestamp="log.createTime"
              >
                {{ log.content }}
              </el-timeline-item>
            </el-timeline>
          </div>

          <div class="detail-actions">
            <el-button
              v-if="aftersaleInfo.status === 10"
              type="danger"
              @click="handleCancel"
            >
              取消售后
            </el-button>
            <el-button @click="$router.push(`/order/aftersale/log/${aftersaleInfo.id}`)">查看进度</el-button>
            <el-button @click="$router.push('/order/aftersale/list')">返回列表</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAfterSale, cancelAfterSale, getAfterSaleLogList } from '@/api/afterSale'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const aftersaleInfo = ref(null)
const logList = ref([])

const getStatusText = (status) => {
  const statusMap = {
    10: '待处理',
    20: '处理中',
    30: '已完成',
    40: '已取消'
  }
  return statusMap[status] || '未知'
}

const getStatusType = (status) => {
  const typeMap = {
    10: 'warning',
    20: 'info',
    30: 'success',
    40: 'danger'
  }
  return typeMap[status] || 'info'
}

const getTypeText = (type) => {
  const typeMap = {
    10: '退货退款',
    20: '换货',
    30: '仅退款'
  }
  return typeMap[type] || '未知'
}

const fetchDetail = async () => {
  loading.value = true
  try {
    const [detailRes, logRes] = await Promise.all([
      getAfterSale(route.params.id),
      getAfterSaleLogList(route.params.id)
    ])
    if (detailRes.code === 0) {
      aftersaleInfo.value = detailRes.data
    }
    if (logRes.code === 0) {
      logList.value = logRes.data || []
    }
  } catch (error) {
    console.error('获取售后详情失败', error)
  } finally {
    loading.value = false
  }
}

const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('确定要取消这个售后申请吗？', '提示', {
      type: 'warning'
    })
    await cancelAfterSale(route.params.id)
    await fetchDetail()
  } catch (error) {
    // 用户取消
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped lang="scss">
.aftersale-detail-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .detail-section {
    margin-bottom: 30px;

    h3 {
      font-size: 18px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #f0f0f0;
    }

    .goods-list {
      .goods-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        margin-bottom: 10px;

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
      }
    }
  }

  .detail-actions {
    margin-top: 30px;
    text-align: right;
  }
}
</style>

