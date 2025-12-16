<template>
  <div class="setting-page">
    <div class="container">
      <h2 class="page-title">系统设置</h2>
      <el-card>
        <el-menu>
          <el-menu-item @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            <span>退出登录</span>
          </el-menu-item>
        </el-menu>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { SwitchButton } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      type: 'warning'
    })
    userStore.logout()
    router.push('/home')
  } catch (error) {
    // 用户取消
  }
}
</script>

<style scoped lang="scss">
.setting-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);
}
</style>

