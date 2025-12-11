<template>
  <div class="aftersale-list-page">
    <div class="container">
      <h2 class="page-title">售后列表</h2>
      <el-tabs v-model="activeStatus" @tab-change="handleStatusChange">
        <el-tab-pane label="全部" name=""></el-tab-pane>
        <el-tab-pane label="待处理" name="10"></el-tab-pane>
        <el-tab-pane label="处理中" name="20"></el-tab-pane>
        <el-tab-pane label="已完成" name="30"></el-tab-pane>
        <el-tab-pane label="已取消" name="40"></el-tab-pane>
      </el-tabs>
      <div class="aftersale-list" v-loading="loading">
        <div v-for="item in aftersaleList" :key="item.id" class="aftersale-item">
          <div class="aftersale-header">
            <span>售后单号：{{ item.no }}</span>
            <span class="aftersale-status">{{ getStatusText(item.status) }}</span>
          </div>
          <div class="aftersale-goods">
            <div v-for="orderItem in item.orderItems" :key="orderItem.id" class="goods-item">
              <img :src="orderItem.spuPicUrl" class="goods-image" />
              <div class="goods-info">
                <div class="goods-name">{{ orderItem.spuName }}</div>
                <div class="goods-sku">{{ orderItem.skuProperties }}</div>
              </div>
              <div class="goods-count">x{{ orderItem.count }}</div>
            </div>
          </div>
          <div class="aftersale-info">
            <div class="info-row">
              <span>售后类型：</span>
              <span>{{ getTypeText(item.type) }}</span>
            </div>
            <div class="info-row">
              <span>申请原因：</span>
              <span>{{ item.reason }}</span>
            </div>
            <div class="info-row">
              <span>申请时间：</span>
              <span>{{ item.createTime }}</span>
            </div>
          </div>
          <div class="aftersale-actions">
            <el-button @click="$router.push(`/order/aftersale/detail/${item.id}`)">查看详情</el-button>
            <el-button
              v-if="item.status === 10"
              type="danger"
              @click="handleCancel(item.id)"
            >
              取消售后
            </el-button>
          </div>
        </div>
        <el-empty v-if="aftersaleList.length === 0" description="暂无售后记录" />
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
import { getAfterSalePage, cancelAfterSale } from '@/api/afterSale'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const aftersaleList = ref([])
const activeStatus = ref('')
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

const getStatusText = (status) => {
  const statusMap = {
    10: '待处理',
    20: '处理中',
    30: '已完成',
    40: '已取消'
  }
  return statusMap[status] || '未知'
}

const getTypeText = (type) => {
  const typeMap = {
    10: '退货退款',
    20: '换货',
    30: '仅退款'
  }
  return typeMap[type] || '未知'
}

const fetchAftersales = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      status: activeStatus.value ? Number(activeStatus.value) : undefined
    }
    const res = await getAfterSalePage(params)
    if (res.code === 0) {
      aftersaleList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取售后列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleStatusChange = () => {
  pageNo.value = 1
  fetchAftersales()
}

const handlePageChange = () => {
  fetchAftersales()
}

const handleCancel = async (id) => {
  try {
    await ElMessageBox.confirm('确定要取消这个售后申请吗？', '提示', {
      type: 'warning'
    })
    await cancelAfterSale(id)
    await fetchAftersales()
  } catch (error) {
    // 用户取消
  }
}

onMounted(() => {
  fetchAftersales()
})
</script>

<style scoped lang="scss">
.aftersale-list-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .aftersale-list {
    margin-top: 20px;

    .aftersale-item {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;

      .aftersale-header {
        display: flex;
        justify-content: space-between;
        padding-bottom: 15px;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 15px;

        .aftersale-status {
          color: #ff6b35;
          font-weight: bold;
        }
      }

      .aftersale-goods {
        margin-bottom: 15px;

        .goods-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 10px 0;

          .goods-image {
            width: 60px;
            height: 60px;
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

      .aftersale-info {
        background: #f9f9f9;
        padding: 15px;
        border-radius: 4px;
        margin-bottom: 15px;

        .info-row {
          display: flex;
          margin-bottom: 8px;
          font-size: 14px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      .aftersale-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }
    }
  }
}
</style>

