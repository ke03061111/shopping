<template>
  <div class="store-page">
    <h2>自提门店</h2>
    <el-card>
      <div class="store-list" v-loading="loading">
        <div v-for="item in storeList" :key="item.id" class="store-item">
          <div class="store-info">
            <div class="store-name">{{ item.name }}</div>
            <div class="store-address">
              <el-icon><Location /></el-icon>
              <span>{{ item.address }}</span>
            </div>
            <div class="store-contact">
              <el-icon><Phone /></el-icon>
              <span>{{ item.phone }}</span>
            </div>
            <div class="store-hours" v-if="item.openingHours">
              <el-icon><Clock /></el-icon>
              <span>{{ item.openingHours }}</span>
            </div>
          </div>
          <div class="store-actions">
            <el-button type="primary" @click="handleSelect(item)">选择此门店</el-button>
            <el-button @click="handleViewMap(item)">查看地图</el-button>
          </div>
        </div>
        <el-empty v-if="storeList.length === 0" description="暂无自提门店" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPickUpStoreList } from '@/api/order'
import { Location, Phone, Clock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const storeList = ref([])

const fetchStores = async () => {
  loading.value = true
  try {
    const res = await getPickUpStoreList()
    if (res.code === 0) {
      storeList.value = res.data || []
    }
  } catch (error) {
    console.error('获取自提门店失败', error)
  } finally {
    loading.value = false
  }
}

const handleSelect = (store) => {
  // 将门店信息存储到localStorage或通过路由参数传递
  localStorage.setItem('selectedStore', JSON.stringify(store))
  ElMessage.success('已选择门店：' + store.name)
  router.back()
}

const handleViewMap = (store) => {
  // 打开地图，可以使用百度地图、高德地图等
  if (store.longitude && store.latitude) {
    const mapUrl = `https://map.baidu.com/?q=${store.latitude},${store.longitude}`
    window.open(mapUrl, '_blank')
  } else {
    ElMessage.warning('该门店暂无位置信息')
  }
}

onMounted(() => {
  fetchStores()
})
</script>

<style scoped lang="scss">
.store-page {
  h2 {
    margin-bottom: 20px;
  }

  .store-list {
    .store-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      margin-bottom: 15px;
      transition: all 0.3s;

      &:hover {
        border-color: #ff6b35;
        box-shadow: 0 2px 8px rgba(255, 107, 53, 0.1);
      }

      .store-info {
        flex: 1;

        .store-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }

        .store-address,
        .store-contact,
        .store-hours {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          color: #666;
          font-size: 14px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      .store-actions {
        display: flex;
        gap: 10px;
      }
    }
  }
}
</style>

