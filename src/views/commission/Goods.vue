<template>
  <div class="commission-goods-page">
    <h2>推广商品</h2>
    <el-card>
      <div class="filter-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索商品名称"
          style="width: 300px;"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
      <el-table :data="goodsList" border v-loading="loading">
        <el-table-column label="商品信息" min-width="300">
          <template #default="{ row }">
            <div class="goods-info">
              <img :src="row.picUrl" class="goods-image" />
              <div class="goods-details">
                <div class="goods-name" @click="goToDetail(row.id)">{{ row.name }}</div>
                <div class="goods-price">¥{{ (row.price / 100).toFixed(2) }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分销佣金" width="120" align="center">
          <template #default="{ row }">
            <span class="commission-price">¥{{ (row.brokeragePrice / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleShare(row.id)">分享推广</el-button>
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
import { getSpuPage } from '@/api/product'
import { getProductBrokeragePrice } from '@/api/brokerage'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const goodsList = ref([])
const searchKeyword = ref('')
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchGoods = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      name: searchKeyword.value || undefined
    }
    const res = await getSpuPage(params)
    if (res.code === 0) {
      goodsList.value = res.data.list || []
      total.value = res.data.total || 0
      // 获取每个商品的分销佣金
      for (const item of goodsList.value) {
        try {
          const brokerageRes = await getProductBrokeragePrice(item.id)
          if (brokerageRes.code === 0) {
            item.brokeragePrice = brokerageRes.data || 0
          }
        } catch (error) {
          item.brokeragePrice = 0
        }
      }
    }
  } catch (error) {
    console.error('获取商品列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pageNo.value = 1
  fetchGoods()
}

const handlePageChange = () => {
  fetchGoods()
}

const goToDetail = (spuId) => {
  router.push(`/goods/detail/${spuId}`)
}

const handleShare = (spuId) => {
  // 生成分享链接或二维码
  ElMessage.success('分享功能开发中')
}

onMounted(() => {
  fetchGoods()
})
</script>

<style scoped lang="scss">
.commission-goods-page {
  h2 {
    margin-bottom: 20px;
  }

  .filter-bar {
    margin-bottom: 15px;
  }

  .goods-info {
    display: flex;
    gap: 15px;
    align-items: center;

    .goods-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }

    .goods-details {
      flex: 1;

      .goods-name {
        font-size: 14px;
        margin-bottom: 5px;
        cursor: pointer;

        &:hover {
          color: #ff6b35;
        }
      }

      .goods-price {
        color: #ff6b35;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  .commission-price {
    color: #67c23a;
    font-weight: bold;
  }
}
</style>

