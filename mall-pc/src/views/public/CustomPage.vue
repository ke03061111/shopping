<template>
  <div class="custom-page">
    <div class="container" v-loading="loading">
      <div v-if="pageInfo" class="page-content" v-html="pageInfo.content"></div>
      <el-empty v-else description="页面不存在" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDiyPage } from '@/api/promotion'

const route = useRoute()
const loading = ref(false)
const pageInfo = ref(null)

const fetchPage = async () => {
  loading.value = true
  try {
    const id = route.params.id
    const res = await getDiyPage(id)
    if (res.code === 0) {
      pageInfo.value = res.data
    }
  } catch (error) {
    console.error('获取页面失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPage()
})
</script>

<style scoped lang="scss">
.custom-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .page-content {
    :deep(img) {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>

