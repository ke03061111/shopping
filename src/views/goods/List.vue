<template>
  <div class="goods-list-page">
    <div class="container">
      <div class="filter-bar">
        <el-radio-group v-model="sortField" @change="handleSortChange">
          <el-radio-button label="salesCount">销量</el-radio-button>
          <el-radio-button label="price">价格</el-radio-button>
          <el-radio-button label="createTime">最新</el-radio-button>
        </el-radio-group>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSpuPage } from '@/api/product'
import GoodsCard from '@/components/GoodsCard.vue'

const route = useRoute()
const goodsList = ref([])
const loading = ref(false)
const sortField = ref('salesCount')
const pageNo = ref(1)
const pageSize = ref(20)
const total = ref(0)

const fetchGoods = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      ...route.query,
      sortField: sortField.value,
      sortAsc: sortField.value === 'price' ? true : false
    }
    const res = await getSpuPage(params)
    if (res.code === 0) {
      goodsList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取商品失败', error)
  } finally {
    loading.value = false
  }
}

const handleSortChange = () => {
  pageNo.value = 1
  fetchGoods()
}

const handlePageChange = () => {
  fetchGoods()
}

onMounted(() => {
  fetchGoods()
})
</script>

<style scoped lang="scss">
.goods-list-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .filter-bar {
    background: #fff;
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
}
</style>

