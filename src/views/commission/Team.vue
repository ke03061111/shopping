<template>
  <div class="commission-team-page">
    <h2>我的团队</h2>
    <el-card>
      <div class="team-stats">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="stat-item">
              <div class="stat-label">一级团队</div>
              <div class="stat-value">{{ summary.firstCount || 0 }}人</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-item">
              <div class="stat-label">二级团队</div>
              <div class="stat-value">{{ summary.secondCount || 0 }}人</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-item">
              <div class="stat-label">团队总人数</div>
              <div class="stat-value">{{ summary.totalCount || 0 }}人</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table :data="teamList" border v-loading="loading" style="margin-top: 20px;">
        <el-table-column prop="nickname" label="用户昵称" width="150" />
        <el-table-column prop="mobile" label="手机号" width="150" />
        <el-table-column label="团队等级" width="120" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.level === 1 ? '一级' : '二级' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="累计佣金" width="120" align="center">
          <template #default="{ row }">
            ¥{{ (row.totalPrice / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="加入时间" width="180" />
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
        style="margin-top: 20px; justify-content: center;"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getBrokerageUserChildSummaryPage, getBrokerageUserSummary } from '@/api/brokerage'

const loading = ref(false)
const teamList = ref([])
const summary = reactive({
  firstCount: 0,
  secondCount: 0,
  totalCount: 0
})
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchSummary = async () => {
  try {
    const res = await getBrokerageUserSummary()
    if (res.code === 0) {
      Object.assign(summary, res.data || {})
    }
  } catch (error) {
    console.error('获取团队统计失败', error)
  }
}

const fetchTeam = async () => {
  loading.value = true
  try {
    const res = await getBrokerageUserChildSummaryPage({
      pageNo: pageNo.value,
      pageSize: pageSize.value
    })
    if (res.code === 0) {
      teamList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取团队列表失败', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = () => {
  fetchTeam()
}

onMounted(() => {
  fetchSummary()
  fetchTeam()
})
</script>

<style scoped lang="scss">
.commission-team-page {
  h2 {
    margin-bottom: 20px;
  }

  .team-stats {
    .stat-item {
      text-align: center;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;

      .stat-label {
        font-size: 14px;
        color: #999;
        margin-bottom: 10px;
      }

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #ff6b35;
      }
    }
  }
}
</style>

