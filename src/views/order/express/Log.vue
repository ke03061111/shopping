<template>
  <div class="express-log-page">
    <div class="container">
      <h2 class="page-title">物流轨迹</h2>
      <el-card v-loading="loading">
        <div v-if="orderInfo" class="express-content">
          <div class="order-info">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="订单号">{{ orderInfo.no }}</el-descriptions-item>
              <el-descriptions-item label="物流公司">{{ orderInfo.logisticsName || '暂无' }}</el-descriptions-item>
              <el-descriptions-item label="物流单号">{{ orderInfo.logisticsNo || '暂无' }}</el-descriptions-item>
              <el-descriptions-item label="收货地址">
                {{ orderInfo.receiverAreaName }} {{ orderInfo.receiverDetailAddress }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="track-list" v-if="trackList.length > 0">
            <h3>物流信息</h3>
            <el-timeline>
              <el-timeline-item
                v-for="(track, index) in trackList"
                :key="index"
                :timestamp="track.time"
                placement="top"
              >
                <div class="track-content">{{ track.content }}</div>
              </el-timeline-item>
            </el-timeline>
          </div>
          <el-empty v-else description="暂无物流信息" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderDetail, getOrderExpressTrackList } from '@/api/order'

const route = useRoute()
const loading = ref(false)
const orderInfo = ref(null)
const trackList = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const [orderRes, trackRes] = await Promise.all([
      getOrderDetail(route.params.id),
      getOrderExpressTrackList(route.params.id)
    ])
    if (orderRes.code === 0) {
      orderInfo.value = orderRes.data
    }
    if (trackRes.code === 0) {
      trackList.value = trackRes.data || []
    }
  } catch (error) {
    console.error('获取物流信息失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.express-log-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .express-content {
    .order-info {
      margin-bottom: 30px;
    }

    .track-list {
      h3 {
        font-size: 18px;
        margin-bottom: 20px;
      }

      .track-content {
        font-size: 14px;
        color: #333;
      }
    }
  }
}
</style>

