<template>
  <div class="user-history-page">
    <h2>浏览记录</h2>
    <el-card>
      <div class="toolbar">
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除
        </el-button>
        <el-button type="danger" @click="handleCleanAll">清空全部</el-button>
      </div>
      <el-table
        :data="historyList"
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品信息" min-width="300">
          <template #default="{ row }">
            <div class="goods-info">
              <img :src="row.spuPicUrl" class="goods-image" @click="goToDetail(row.spuId)" />
              <div class="goods-details">
                <div class="goods-name" @click="goToDetail(row.spuId)">{{ row.spuName }}</div>
                <div class="goods-price">¥{{ (row.spuPrice / 100).toFixed(2) }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="browseTime" label="浏览时间" width="180" />
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button type="danger" link @click="handleDelete(row.spuId)">删除</el-button>
          </template>
        </el-table-column>
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
import { useRouter } from 'vue-router'
import { getBrowseHistoryPage, deleteBrowseHistory, cleanBrowseHistory } from '@/api/product'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const historyList = ref([])
const selectedIds = ref([])
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchHistory = async () => {
  loading.value = true
  try {
    const res = await getBrowseHistoryPage({
      pageNo: pageNo.value,
      pageSize: pageSize.value
    })
    if (res.code === 0) {
      historyList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取浏览记录失败', error)
  } finally {
    loading.value = false
  }
}

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.spuId)
}

const handleDelete = async (spuId) => {
  try {
    await deleteBrowseHistory([spuId])
    ElMessage.success('删除成功')
    await fetchHistory()
  } catch (error) {
    console.error('删除失败', error)
  }
}

const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要删除的商品')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条记录吗？`, '提示', {
      type: 'warning'
    })
    await deleteBrowseHistory(selectedIds.value)
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    await fetchHistory()
  } catch (error) {
    // 用户取消
  }
}

const handleCleanAll = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有浏览记录吗？', '提示', {
      type: 'warning'
    })
    await cleanBrowseHistory()
    ElMessage.success('清空成功')
    await fetchHistory()
  } catch (error) {
    // 用户取消
  }
}

const goToDetail = (spuId) => {
  router.push(`/goods/detail/${spuId}`)
}

const handlePageChange = () => {
  fetchHistory()
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped lang="scss">
.user-history-page {
  h2 {
    margin-bottom: 20px;
  }

  .toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }

  .goods-info {
    display: flex;
    gap: 15px;
    align-items: center;

    .goods-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
    }

    .goods-details {
      flex: 1;

      .goods-name {
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
        cursor: pointer;

        &:hover {
          color: #ff6b35;
        }
      }

      .goods-price {
        color: #ff6b35;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
</style>
