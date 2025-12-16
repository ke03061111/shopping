<template>
  <div class="user-points-page">
    <h2>我的积分</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="points-card">
          <div class="points-info">
            <div class="label">当前积分</div>
            <div class="amount">{{ userStore.userInfo?.point || 0 }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px;">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="全部" name="all">
          <el-table :data="pointList" border v-loading="loading">
            <el-table-column prop="title" label="积分类型" width="150" />
            <el-table-column label="积分" width="120">
              <template #default="{ row }">
                <span :class="row.point > 0 ? 'income' : 'expense'">
                  {{ row.point > 0 ? '+' : '' }}{{ row.point }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" width="180" />
            <el-table-column prop="title" label="备注" />
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
        <el-tab-pane label="收入" name="income">
          <el-table :data="pointList" border v-loading="loading">
            <el-table-column prop="title" label="积分类型" width="150" />
            <el-table-column label="积分" width="120">
              <template #default="{ row }">
                <span class="income">+{{ row.point }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" width="180" />
            <el-table-column prop="title" label="备注" />
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
        <el-tab-pane label="支出" name="expense">
          <el-table :data="pointList" border v-loading="loading">
            <el-table-column prop="title" label="积分类型" width="150" />
            <el-table-column label="积分" width="120">
              <template #default="{ row }">
                <span class="expense">{{ row.point }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" width="180" />
            <el-table-column prop="title" label="备注" />
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
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getPointRecordPage } from '@/api/user'

const userStore = useUserStore()
const loading = ref(false)
const activeTab = ref('all')
const pointList = ref([])
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchPoints = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: pageNo.value,
      pageSize: pageSize.value
    }
    if (activeTab.value === 'income') {
      params.addStatus = true
    } else if (activeTab.value === 'expense') {
      params.addStatus = false
    }
    const res = await getPointRecordPage(params)
    if (res.code === 0) {
      pointList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取积分记录失败', error)
  } finally {
    loading.value = false
  }
}

const handleTabChange = () => {
  pageNo.value = 1
  fetchPoints()
}

const handlePageChange = () => {
  fetchPoints()
}

onMounted(() => {
  userStore.fetchUserInfo()
  fetchPoints()
})
</script>

<style scoped lang="scss">
.user-points-page {
  h2 {
    margin-bottom: 20px;
  }

  .points-card {
    .points-info {
      text-align: center;

      .label {
        font-size: 14px;
        color: #999;
        margin-bottom: 15px;
      }

      .amount {
        font-size: 32px;
        font-weight: bold;
        color: #ff6b35;
      }
    }
  }

  .income {
    color: #67c23a;
  }

  .expense {
    color: #f56c6c;
  }
}
</style>
