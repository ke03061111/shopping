<template>
  <div class="commission-ranking-page">
    <h2>佣金排行榜</h2>
    <el-card>
      <div class="time-filter">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
        />
      </div>
      <el-table :data="rankList" border v-loading="loading" style="margin-top: 20px;">
        <el-table-column type="index" label="排名" width="80" align="center">
          <template #default="{ $index }">
            <span v-if="$index < 3" class="rank-top">{{ $index + 1 }}</span>
            <span v-else>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="用户昵称" width="150" />
        <el-table-column prop="mobile" label="手机号" width="150" />
        <el-table-column label="累计佣金" width="150" align="center">
          <template #default="{ row }">
            <span class="highlight">¥{{ (row.totalPrice / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" />
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
import { getRankByPrice } from '@/api/brokerage'
import dayjs from 'dayjs'

const loading = ref(false)
const rankList = ref([])
const dateRange = ref([])
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchRank = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: pageNo.value,
      pageSize: pageSize.value
    }
    if (dateRange.value && dateRange.value.length === 2) {
      params.times = [
        dayjs(dateRange.value[0]).format('YYYY-MM-DD'),
        dayjs(dateRange.value[1]).format('YYYY-MM-DD')
      ]
    }
    const res = await getRankByPrice(params)
    if (res.code === 0) {
      rankList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取排行榜失败', error)
  } finally {
    loading.value = false
  }
}

const handleDateChange = () => {
  pageNo.value = 1
  fetchRank()
}

const handlePageChange = () => {
  fetchRank()
}

onMounted(() => {
  fetchRank()
})
</script>

<style scoped lang="scss">
.commission-ranking-page {
  h2 {
    margin-bottom: 20px;
  }

  .time-filter {
    margin-bottom: 20px;
  }

  .rank-top {
    color: #ff6b35;
    font-weight: bold;
    font-size: 18px;
  }

  .highlight {
    color: #ff6b35;
    font-weight: bold;
  }
}
</style>

