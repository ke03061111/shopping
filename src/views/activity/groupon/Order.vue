<template>
  <div class="groupon-order-page">
    <div class="container">
      <h2 class="page-title">我的拼团</h2>
      <el-tabs v-model="activeStatus" @tab-change="handleStatusChange">
        <el-tab-pane label="全部" name=""></el-tab-pane>
        <el-tab-pane label="进行中" name="0"></el-tab-pane>
        <el-tab-pane label="成功" name="1"></el-tab-pane>
        <el-tab-pane label="失败" name="2"></el-tab-pane>
      </el-tabs>
      <div class="groupon-list" v-loading="loading">
        <div v-for="item in grouponList" :key="item.id" class="groupon-item">
          <div class="groupon-header">
            <div class="groupon-title">
              <span>拼团编号：{{ item.id }}</span>
              <el-tag :type="getStatusType(item.status)" style="margin-left: 10px;">
                {{ getStatusText(item.status) }}
              </el-tag>
            </div>
            <div class="groupon-time">{{ item.createTime }}</div>
          </div>
          <div class="groupon-goods">
            <img :src="item.spuPicUrl" class="goods-image" />
            <div class="goods-info">
              <div class="goods-name">{{ item.spuName }}</div>
              <div class="goods-price">
                <span class="current-price">拼团价：¥{{ (item.combinationPrice / 100).toFixed(2) }}</span>
                <span class="original-price">原价：¥{{ (item.originalPrice / 100).toFixed(2) }}</span>
              </div>
            </div>
            <div class="groupon-progress">
              <div class="progress-info">
                <span>已参团：{{ item.userCount }}/{{ item.peopleCount }}人</span>
                <el-progress
                  :percentage="(item.userCount / item.peopleCount) * 100"
                  :status="item.status === 1 ? 'success' : item.status === 2 ? 'exception' : ''"
                />
              </div>
            </div>
          </div>
          <div class="groupon-actions">
            <el-button @click="$router.push(`/activity/groupon/detail/${item.id}`)">查看详情</el-button>
            <el-button
              v-if="item.status === 0"
              type="primary"
              @click="handleShare(item.id)"
            >
              邀请好友
            </el-button>
          </div>
        </div>
        <el-empty v-if="grouponList.length === 0" description="暂无拼团记录" />
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
import { getCombinationRecordPage } from '@/api/activity'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const grouponList = ref([])
const activeStatus = ref('')
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

const getStatusText = (status) => {
  const statusMap = {
    0: '进行中',
    1: '成功',
    2: '失败'
  }
  return statusMap[status] || '未知'
}

const getStatusType = (status) => {
  const typeMap = {
    0: 'warning',
    1: 'success',
    2: 'danger'
  }
  return typeMap[status] || 'info'
}

const fetchGroupons = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      status: activeStatus.value ? Number(activeStatus.value) : undefined
    }
    const res = await getCombinationRecordPage(params)
    if (res.code === 0) {
      grouponList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取拼团列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleStatusChange = () => {
  pageNo.value = 1
  fetchGroupons()
}

const handlePageChange = () => {
  fetchGroupons()
}

const handleShare = (id) => {
  // 生成分享链接
  const shareUrl = `${window.location.origin}/activity/groupon/detail/${id}`
  ElMessage.success(`分享链接：${shareUrl}`)
  // 可以复制到剪贴板或生成二维码
}

onMounted(() => {
  fetchGroupons()
})
</script>

<style scoped lang="scss">
.groupon-order-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .groupon-list {
    margin-top: 20px;

    .groupon-item {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;

      .groupon-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 15px;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 15px;

        .groupon-title {
          display: flex;
          align-items: center;
        }

        .groupon-time {
          color: #999;
          font-size: 12px;
        }
      }

      .groupon-goods {
        display: flex;
        gap: 20px;
        margin-bottom: 15px;

        .goods-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 4px;
        }

        .goods-info {
          flex: 1;

          .goods-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .goods-price {
            .current-price {
              color: #ff6b35;
              font-size: 18px;
              font-weight: bold;
              margin-right: 15px;
            }

            .original-price {
              color: #999;
              text-decoration: line-through;
              font-size: 14px;
            }
          }
        }

        .groupon-progress {
          width: 200px;

          .progress-info {
            span {
              display: block;
              margin-bottom: 10px;
              font-size: 14px;
            }
          }
        }
      }

      .groupon-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }
    }
  }
}
</style>

