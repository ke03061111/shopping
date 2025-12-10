<template>
  <div class="commission-page">
    <h2>分销中心</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">累计佣金</div>
            <div class="stat-value">¥{{ (summary.totalPrice / 100).toFixed(2) }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">可提现佣金</div>
            <div class="stat-value">¥{{ (summary.settlementPrice / 100).toFixed(2) }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">已提现佣金</div>
            <div class="stat-value">¥{{ (summary.withdrawPrice / 100).toFixed(2) }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">推广人数</div>
            <div class="stat-value">{{ summary.userCount || 0 }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px;">
      <div class="commission-actions" style="margin-bottom: 20px;">
        <el-button type="primary" @click="$router.push('/commission/goods')">推广商品</el-button>
        <el-button @click="$router.push('/commission/order')">分销订单</el-button>
        <el-button @click="$router.push('/commission/team')">我的团队</el-button>
        <el-button @click="$router.push('/commission/promoter')">推广人排行</el-button>
        <el-button @click="$router.push('/commission/ranking')">佣金排行</el-button>
        <el-button type="success" @click="$router.push('/commission/withdraw')">申请提现</el-button>
      </div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="佣金明细" name="record">
          <el-table :data="recordList" border v-loading="loading">
            <el-table-column prop="title" label="类型" width="150" />
            <el-table-column label="佣金" width="120">
              <template #default="{ row }">
                <span class="income">+¥{{ (row.price / 100).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'info'">
                  {{ row.status === 1 ? '已结算' : '待结算' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" width="180" />
          </el-table>
          <el-pagination
            v-model:current-page="pageNo"
            v-model:page-size="pageSize"
            :total="total"
            layout="total, prev, pager, next"
            @current-change="handlePageChange"
            style="margin-top: 20px; justify-content: center;"
          />
        </el-tab-pane>
        <el-tab-pane label="提现记录" name="withdraw">
          <el-table :data="withdrawList" border v-loading="loading">
            <el-table-column label="提现金额" width="120">
              <template #default="{ row }">
                ¥{{ (row.price / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getWithdrawStatusType(row.status)">
                  {{ getWithdrawStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="申请时间" width="180" />
            <el-table-column prop="auditTime" label="审核时间" width="180" />
          </el-table>
          <el-pagination
            v-model:current-page="withdrawPageNo"
            v-model:page-size="withdrawPageSize"
            :total="withdrawTotal"
            layout="total, prev, pager, next"
            @current-change="handleWithdrawPageChange"
            style="margin-top: 20px; justify-content: center;"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  getBrokerageUserSummary,
  getBrokerageRecordPage,
  getBrokerageWithdrawPage
} from '@/api/brokerage'

const loading = ref(false)
const activeTab = ref('record')
const summary = reactive({
  totalPrice: 0,
  settlementPrice: 0,
  withdrawPrice: 0,
  userCount: 0
})
const recordList = ref([])
const withdrawList = ref([])
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)
const withdrawPageNo = ref(1)
const withdrawPageSize = ref(10)
const withdrawTotal = ref(0)

const fetchSummary = async () => {
  try {
    const res = await getBrokerageUserSummary()
    if (res.code === 0) {
      Object.assign(summary, res.data || {})
    }
  } catch (error) {
    console.error('获取分销统计失败', error)
  }
}

const fetchRecords = async () => {
  loading.value = true
  try {
    const res = await getBrokerageRecordPage({
      pageNo: pageNo.value,
      pageSize: pageSize.value
    })
    if (res.code === 0) {
      recordList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取佣金明细失败', error)
  } finally {
    loading.value = false
  }
}

const fetchWithdraws = async () => {
  loading.value = true
  try {
    const res = await getBrokerageWithdrawPage({
      pageNo: withdrawPageNo.value,
      pageSize: withdrawPageSize.value
    })
    if (res.code === 0) {
      withdrawList.value = res.data.list || []
      withdrawTotal.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取提现记录失败', error)
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tab) => {
  if (tab === 'record') {
    fetchRecords()
  } else if (tab === 'withdraw') {
    fetchWithdraws()
  }
}

const getWithdrawStatusText = (status) => {
  const statusMap = {
    10: '待审核',
    20: '审核通过',
    30: '审核不通过',
    40: '已打款'
  }
  return statusMap[status] || '未知'
}

const getWithdrawStatusType = (status) => {
  const typeMap = {
    10: 'warning',
    20: 'success',
    30: 'danger',
    40: 'success'
  }
  return typeMap[status] || 'info'
}

const handlePageChange = () => {
  fetchRecords()
}

const handleWithdrawPageChange = () => {
  fetchWithdraws()
}

onMounted(() => {
  fetchSummary()
  fetchRecords()
})
</script>

<style scoped lang="scss">
.commission-page {
  h2 {
    margin-bottom: 20px;
  }

  .stat-card {
    .stat-item {
      text-align: center;

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

  .income {
    color: #67c23a;
    font-weight: bold;
  }
}
</style>
