<template>
  <div class="search-page">
    <div class="container">
      <div class="search-header">
        <el-input
          v-model="keyword"
          placeholder="请输入搜索关键词"
          size="large"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
      <div v-if="keyword" class="search-content">
        <div class="filter-bar">
          <el-radio-group v-model="sortField" @change="handleSortChange">
            <el-radio-button label="salesCount">销量</el-radio-button>
            <el-radio-button label="price">价格</el-radio-button>
            <el-radio-button label="createTime">最新</el-radio-button>
          </el-radio-group>
          <div class="result-info">
            找到 <span class="highlight">{{ total }}</span> 件商品
          </div>
        </div>
        <el-row :gutter="20" v-loading="loading">
          <el-col
            v-for="item in goodsList"
            :key="item.id"
            :xs="12"
            :sm="8"
            :md="6"
            :lg="6"
          >
            <GoodsCard :goods="item" />
          </el-col>
        </el-row>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
          style="margin-top: 20px; justify-content: center;"
        />
      </div>
      <div v-else class="empty-search">
        <el-empty description="请输入搜索关键词" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSpuPage } from '@/api/product'
import GoodsCard from '@/components/GoodsCard.vue'

const route = useRoute()
const keyword = ref('')
const goodsList = ref([])
const loading = ref(false)
const sortField = ref('salesCount')
const pageNo = ref(1)
const pageSize = ref(20)
const total = ref(0)

const fetchGoods = async () => {
  if (!keyword.value.trim()) return
  loading.value = true
  try {
    const params = {
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      name: keyword.value,
      sortField: sortField.value,
      sortAsc: sortField.value === 'price' ? true : false
    }
    const res = await getSpuPage(params)
    if (res.code === 0) {
      goodsList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('搜索失败', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pageNo.value = 1
  fetchGoods()
}

const handleSortChange = () => {
  pageNo.value = 1
  fetchGoods()
}

const handlePageChange = () => {
  fetchGoods()
}

onMounted(() => {
  if (route.query.keyword) {
    keyword.value = route.query.keyword
    fetchGoods()
  }
})
</script>

<style scoped lang="scss">
.search-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);
}

.search-header {
  margin-bottom: 20px;
  max-width: 800px;
  margin: 0 auto 30px;
}

.search-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px;

  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;

    .result-info {
      .highlight {
        color: #ff6b35;
        font-weight: bold;
      }
    }
  }
}

.empty-search {
  padding: 100px 0;
  text-align: center;
}
</style>

