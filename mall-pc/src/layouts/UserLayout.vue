<template>
  <div class="user-layout">
    <div class="container">
      <div class="user-content">
        <!-- 侧边栏 -->
        <aside class="user-sidebar">
          <el-menu
            :default-active="activeMenu"
            router
            class="user-menu"
          >
            <el-menu-item index="/user/index">
              <el-icon><House /></el-icon>
              <span>个人中心</span>
            </el-menu-item>
            <el-menu-item index="/user/info">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="/user/address">
              <el-icon><Location /></el-icon>
              <span>收货地址</span>
            </el-menu-item>
            <el-menu-item index="/user/favorite">
              <el-icon><Star /></el-icon>
              <span>我的收藏</span>
            </el-menu-item>
            <el-menu-item index="/user/history">
              <el-icon><Clock /></el-icon>
              <span>浏览记录</span>
            </el-menu-item>
            <el-menu-item index="/user/wallet">
              <el-icon><Wallet /></el-icon>
              <span>我的钱包</span>
            </el-menu-item>
            <el-menu-item index="/user/points">
              <el-icon><Coin /></el-icon>
              <span>我的积分</span>
            </el-menu-item>
            <el-menu-item index="/user/store">
              <el-icon><Shop /></el-icon>
              <span>自提门店</span>
            </el-menu-item>
            <el-menu-item index="/order/list">
              <el-icon><Document /></el-icon>
              <span>我的订单</span>
            </el-menu-item>
            <el-menu-item index="/order/aftersale/list">
              <el-icon><Box /></el-icon>
              <span>售后订单</span>
            </el-menu-item>
            <el-menu-item index="/commission">
              <el-icon><Share /></el-icon>
              <span>分销中心</span>
            </el-menu-item>
            <el-menu-item index="/sign">
              <el-icon><Calendar /></el-icon>
              <span>签到中心</span>
            </el-menu-item>
          </el-menu>
        </aside>

        <!-- 主内容区 -->
        <main class="user-main">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  House,
  User,
  Location,
  Star,
  Clock,
  Wallet,
  Coin,
  Document,
  Share,
  Calendar,
  Box,
  Shop
} from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped lang="scss">
.user-layout {
  min-height: calc(100vh - 200px);
  padding: 20px 0;
  background: #f5f5f5;
}

.user-content {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.user-sidebar {
  width: 200px;
  background: #fff;
  border-radius: 8px;
  padding: 20px 0;

  .user-menu {
    border: none;
  }
}

.user-main {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  min-height: 600px;
}
</style>

