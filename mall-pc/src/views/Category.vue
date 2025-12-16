<template>
  <div class="category-page">
    <div class="container">
      <div class="category-content">
        <!-- 分类侧边栏 -->
        <aside class="category-sidebar">
          <el-menu
            :default-active="activeCategory"
            @select="handleCategorySelect"
          >
            <el-menu-item
              v-for="item in categories"
              :key="item.id"
              :index="String(item.id)"
            >
              {{ item.name }}
            </el-menu-item>
          </el-menu>
        </aside>

        <!-- 商品列表 -->
        <main class="category-main">
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
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCategoryList } from '@/api/product'
import { getSpuPage } from '@/api/product'
import GoodsCard from '@/components/GoodsCard.vue'

const route = useRoute()
const categories = ref([])
const goodsList = ref([])
const loading = ref(false)
const activeCategory = ref('')
const sortField = ref('salesCount')
const pageNo = ref(1)
const pageSize = ref(20)
const total = ref(0)

const fetchCategories = async () => {
  try {
    const res = await getCategoryList()
    if (res.code === 0) {
      categories.value = res.data || []
      if (categories.value.length > 0) {
        activeCategory.value = String(categories.value[0].id)
        fetchGoods()
      }
    }
  } catch (error) {
    console.error('获取分类失败', error)
  }
}

const fetchGoods = async () => {
  loading.value = true
  try {
    const params = {
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      categoryId: activeCategory.value ? Number(activeCategory.value) : undefined,
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

const handleCategorySelect = (categoryId) => {
  activeCategory.value = categoryId
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
  fetchCategories()
})
</script>

<style scoped lang="scss">
.category-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);
}

.category-content {
  display: flex;
  gap: 20px;
}

.category-sidebar {
  width: 200px;
  background: #fff;
  border-radius: 8px;
  padding: 10px 0;
}

.category-main {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 20px;

  .filter-bar {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
  }
}
</style>

