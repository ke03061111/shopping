<template>
  <div class="commission-order-page">
    <h2>分销订单</h2>
    <el-card>
      <el-tabs v-model="activeStatus" @tab-change="handleStatusChange">
        <el-tab-pane label="全部" name=""></el-tab-pane>
        <el-tab-pane label="待结算" name="0"></el-tab-pane>
        <el-tab-pane label="已结算" name="1"></el-tab-pane>
      </el-tabs>
      <el-table :data="recordList" border v-loading="loading">
        <el-table-column prop="title" label="订单信息" min-width="200" />
        <el-table-column label="佣金" width="120" align="center">
          <template #default="{ row }">
            <span class="commission-price">+¥{{ (row.price / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
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
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBrokerageRecordPage } from '@/api/brokerage'

const loading = ref(false)
const recordList = ref([])
const activeStatus = ref('')
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchRecords = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      status: activeStatus.value ? Number(activeStatus.value) : undefined
    }
    const res = await getBrokerageRecordPage(params)
    if (res.code === 0) {
      recordList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取分销订单失败', error)
  } finally {
    loading.value = false
  }
}

const handleStatusChange = () => {
  pageNo.value = 1
  fetchRecords()
}

const handlePageChange = () => {
  fetchRecords()
}

onMounted(() => {
  fetchRecords()
})
</script>

<style scoped lang="scss">
.commission-order-page {
  h2 {
    margin-bottom: 20px;
  }

  .commission-price {
    color: #67c23a;
    font-weight: bold;
  }
}
</style>

