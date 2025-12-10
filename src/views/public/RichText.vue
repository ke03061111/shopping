<template>
  <div class="richtext-page">
    <div class="container">
      <el-card v-loading="loading">
        <div v-if="articleInfo" class="article-content">
          <h1 class="article-title">{{ articleInfo.title }}</h1>
          <div class="article-meta">
            <span>发布时间：{{ articleInfo.createTime }}</span>
            <span v-if="articleInfo.author">作者：{{ articleInfo.author }}</span>
          </div>
          <div class="article-body" v-html="articleInfo.content"></div>
        </div>
        <el-empty v-else description="内容不存在" />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getArticle } from '@/api/promotion'

const route = useRoute()
const loading = ref(false)
const articleInfo = ref(null)

const fetchArticle = async () => {
  loading.value = true
  try {
    const id = route.params.id || route.query.id
    const res = await getArticle(id)
    if (res.code === 0) {
      articleInfo.value = res.data
    }
  } catch (error) {
    console.error('获取文章失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticle()
})
</script>

<style scoped lang="scss">
.richtext-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .article-content {
    .article-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
      text-align: center;
    }

    .article-meta {
      display: flex;
      justify-content: center;
      gap: 20px;
      color: #999;
      font-size: 14px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f0f0f0;
    }

    .article-body {
      line-height: 1.8;
      font-size: 16px;
      color: #333;

      :deep(img) {
        max-width: 100%;
        height: auto;
      }

      :deep(p) {
        margin-bottom: 15px;
      }
    }
  }
}
</style>

