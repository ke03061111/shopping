<template>
  <div class="webview-page">
    <iframe
      :src="url"
      frameborder="0"
      class="webview-frame"
      @load="handleLoad"
    ></iframe>
    <div v-if="loading" class="loading-mask">
      <el-icon class="is-loading" :size="40"><Loading /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Loading } from '@element-plus/icons-vue'

const route = useRoute()
const url = ref('')
const loading = ref(true)

const handleLoad = () => {
  loading.value = false
}

onMounted(() => {
  url.value = route.query.url || route.params.url || ''
  if (!url.value) {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.webview-page {
  position: relative;
  width: 100%;
  height: calc(100vh - 60px);

  .webview-frame {
    width: 100%;
    height: 100%;
    border: none;
  }

  .loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
  }
}
</style>

