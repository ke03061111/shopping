<template>
  <div class="commission-promoter-page">
    <h2>推广人排行榜</h2>
    <el-card>
      <el-table :data="rankList" border v-loading="loading">
        <el-table-column type="index" label="排名" width="80" align="center">
          <template #default="{ $index }">
            <span v-if="$index < 3" class="rank-top">{{ $index + 1 }}</span>
            <span v-else>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="用户昵称" width="150" />
        <el-table-column prop="mobile" label="手机号" width="150" />
        <el-table-column label="推广人数" width="120" align="center">
          <template #default="{ row }">
            <span class="highlight">{{ row.userCount || 0 }}人</span>
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
import { getBrokerageUserRankPageByUserCount } from '@/api/brokerage'

const loading = ref(false)
const rankList = ref([])
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchRank = async () => {
  loading.value = true
  try {
    const res = await getBrokerageUserRankPageByUserCount({
      pageNo: pageNo.value,
      pageSize: pageSize.value
    })
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

const handlePageChange = () => {
  fetchRank()
}

onMounted(() => {
  fetchRank()
})
</script>

<style scoped lang="scss">
.commission-promoter-page {
  h2 {
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

