<template>
  <div class="groupon-detail-page">
    <div class="container">
      <el-card v-loading="loading">
        <div v-if="grouponInfo" class="groupon-content">
          <div class="groupon-header">
            <h2>{{ grouponInfo.activity?.name || '拼团活动' }}</h2>
            <el-tag :type="getStatusType(grouponInfo.status)">
              {{ getStatusText(grouponInfo.status) }}
            </el-tag>
          </div>

          <div class="groupon-info">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="拼团人数">
                {{ grouponInfo.activity?.peopleCount || 0 }}人
              </el-descriptions-item>
              <el-descriptions-item label="已参团">
                {{ grouponInfo.userCount || 0 }}人
              </el-descriptions-item>
              <el-descriptions-item label="拼团价">
                ¥{{ (grouponInfo.activity?.combinationPrice / 100).toFixed(2) }}
              </el-descriptions-item>
              <el-descriptions-item label="原价">
                <span style="text-decoration: line-through; color: #999;">
                  ¥{{ (grouponInfo.activity?.originalPrice / 100).toFixed(2) }}
                </span>
              </el-descriptions-item>
              <el-descriptions-item label="开始时间">
                {{ grouponInfo.activity?.startTime }}
              </el-descriptions-item>
              <el-descriptions-item label="结束时间">
                {{ grouponInfo.activity?.endTime }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <div class="groupon-members" v-if="grouponInfo.users && grouponInfo.users.length > 0">
            <h3>参团成员</h3>
            <div class="members-list">
              <div
                v-for="user in grouponInfo.users"
                :key="user.id"
                class="member-item"
              >
                <el-avatar :src="user.avatar" :size="50">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <div class="member-info">
                  <div class="member-name">{{ user.nickname || '匿名用户' }}</div>
                  <div class="member-time">{{ user.createTime }}</div>
                </div>
                <el-tag v-if="user.headId === grouponInfo.headId" type="success">团长</el-tag>
              </div>
            </div>
          </div>

          <div class="groupon-actions">
            <el-button
              v-if="grouponInfo.status === 0"
              type="primary"
              size="large"
              @click="handleJoin"
            >
              立即参团
            </el-button>
            <el-button @click="$router.push('/activity/groupon')">返回列表</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCombinationRecordDetail } from '@/api/activity'
import { User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const grouponInfo = ref(null)

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

const fetchDetail = async () => {
  loading.value = true
  try {
    const res = await getCombinationRecordDetail(route.params.id)
    if (res.code === 0) {
      grouponInfo.value = res.data
    }
  } catch (error) {
    console.error('获取拼团详情失败', error)
  } finally {
    loading.value = false
  }
}

const handleJoin = () => {
  if (grouponInfo.value?.activity?.spuId) {
    router.push(`/goods/groupon/${grouponInfo.value.activity.spuId}?recordId=${route.params.id}`)
  } else {
    ElMessage.warning('商品信息不存在')
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped lang="scss">
.groupon-detail-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .groupon-content {
    .groupon-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h2 {
        margin: 0;
        font-size: 24px;
      }
    }

    .groupon-info {
      margin-bottom: 30px;
    }

    .groupon-members {
      margin-bottom: 30px;

      h3 {
        font-size: 18px;
        margin-bottom: 15px;
      }

      .members-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;

        .member-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          min-width: 200px;

          .member-info {
            flex: 1;

            .member-name {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 5px;
            }

            .member-time {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }

    .groupon-actions {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #f0f0f0;
    }
  }
}
</style>

