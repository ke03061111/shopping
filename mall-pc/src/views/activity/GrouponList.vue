<template>
  <div class="groupon-list-page">
    <div class="container">
      <h2 class="page-title">拼团活动</h2>
      <el-row :gutter="20" v-loading="loading">
        <el-col
          v-for="item in activityList"
          :key="item.id"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="6"
        >
          <el-card class="activity-card" @click="goToDetail(item.id)">
            <img :src="item.picUrl" class="activity-image" />
            <div class="activity-info">
              <div class="activity-name">{{ item.name }}</div>
              <div class="activity-price">
                <span class="price">¥{{ (item.price / 100).toFixed(2) }}</span>
                <span class="original-price">¥{{ (item.originalPrice / 100).toFixed(2) }}</span>
              </div>
              <div class="activity-progress">
                <span>已拼{{ item.combinationCount || 0 }}件</span>
                <el-progress
                  :percentage="getProgress(item)"
                  :stroke-width="6"
                  :show-text="false"
                />
              </div>
              <el-button type="primary" style="width: 100%; margin-top: 10px;" @click.stop="goToDetail(item.id)">
                立即参团
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
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
import { getCombinationActivityPage } from '@/api/activity'

const router = useRouter()
const loading = ref(false)
const activityList = ref([])
const pageNo = ref(1)
const pageSize = ref(12)
const total = ref(0)

const fetchActivities = async () => {
  loading.value = true
  try {
    const res = await getCombinationActivityPage({
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      status: 20 // 进行中
    })
    if (res.code === 0) {
      activityList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取拼团活动失败', error)
  } finally {
    loading.value = false
  }
}

const getProgress = (item) => {
  if (!item.quota || item.quota === 0) return 0
  return Math.min(100, Math.round((item.combinationCount / item.quota) * 100))
}

const goToDetail = (id) => {
  router.push(`/goods/groupon/${id}`)
}

const handlePageChange = () => {
  fetchActivities()
}

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped lang="scss">
.groupon-list-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .page-title {
    margin-bottom: 20px;
  }

  .activity-card {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .activity-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .activity-info {
      .activity-name {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .activity-price {
        margin-bottom: 10px;

        .price {
          color: #ff6b35;
          font-size: 20px;
          font-weight: bold;
          margin-right: 10px;
        }

        .original-price {
          color: #999;
          font-size: 14px;
          text-decoration: line-through;
        }
      }

      .activity-progress {
        font-size: 12px;
        color: #999;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
