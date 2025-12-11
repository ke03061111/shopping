<template>
  <div class="aftersale-log-page">
    <div class="container">
      <h2 class="page-title">售后进度</h2>
      <el-card v-loading="loading">
        <div v-if="logList.length > 0">
          <el-timeline>
            <el-timeline-item
              v-for="(log, index) in logList"
              :key="index"
              :timestamp="log.createTime"
              placement="top"
            >
              <div class="log-content">
                <div class="log-type">{{ getTypeText(log.type) }}</div>
                <div class="log-text">{{ log.content }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
        <el-empty v-else description="暂无进度信息" />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAfterSaleLogList } from '@/api/afterSale'

const route = useRoute()
const loading = ref(false)
const logList = ref([])

const getTypeText = (type) => {
  const typeMap = {
    1: '申请售后',
    2: '商家审核',
    3: '退货中',
    4: '商家收货',
    5: '退款中',
    6: '已完成',
    7: '已取消'
  }
  return typeMap[type] || '未知'
}

const fetchLogs = async () => {
  loading.value = true
  try {
    const res = await getAfterSaleLogList(route.params.id)
    if (res.code === 0) {
      logList.value = res.data || []
    }
  } catch (error) {
    console.error('获取售后日志失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLogs()
})
</script>

<style scoped lang="scss">
.aftersale-log-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .log-content {
    .log-type {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .log-text {
      font-size: 14px;
      color: #666;
    }
  }
}
</style>

