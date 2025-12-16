<template>
  <div class="user-favorite-page">
    <h2>我的收藏</h2>
    <el-card>
      <div class="toolbar">
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除
        </el-button>
      </div>
      <el-table
        :data="favoriteList"
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
        <el-table-column prop="createTime" label="收藏时间" width="180" />
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
import { getFavoritePage, deleteFavorite } from '@/api/product'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const favoriteList = ref([])
const selectedIds = ref([])
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchFavorites = async () => {
  loading.value = true
  try {
    const res = await getFavoritePage({
      pageNo: pageNo.value,
      pageSize: pageSize.value
    })
    if (res.code === 0) {
      favoriteList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取收藏列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.spuId)
}

const handleDelete = async (spuId) => {
  try {
    await ElMessageBox.confirm('确定要取消收藏吗？', '提示', {
      type: 'warning'
    })
    await deleteFavorite(spuId)
    ElMessage.success('取消收藏成功')
    await fetchFavorites()
  } catch (error) {
    // 用户取消
  }
}

const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要删除的商品')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要取消收藏选中的 ${selectedIds.value.length} 件商品吗？`, '提示', {
      type: 'warning'
    })
    await Promise.all(selectedIds.value.map(id => deleteFavorite(id)))
    ElMessage.success('批量取消收藏成功')
    selectedIds.value = []
    await fetchFavorites()
  } catch (error) {
    // 用户取消
  }
}

const goToDetail = (spuId) => {
  router.push(`/goods/detail/${spuId}`)
}

const handlePageChange = () => {
  fetchFavorites()
}

onMounted(() => {
  fetchFavorites()
})
</script>

<style scoped lang="scss">
.user-favorite-page {
  h2 {
    margin-bottom: 20px;
  }

  .toolbar {
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
