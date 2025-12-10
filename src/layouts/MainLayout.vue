<template>
  <div class="main-layout">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo" @click="$router.push('/home')">
            <h1>XX商城</h1>
          </div>
          <div class="nav-menu">
            <el-menu
              :default-active="activeMenu"
              mode="horizontal"
              @select="handleMenuSelect"
            >
              <el-menu-item index="/home">首页</el-menu-item>
              <el-menu-item index="/category">分类</el-menu-item>
              <el-menu-item index="/activity/groupon">拼团</el-menu-item>
              <el-menu-item index="/activity/seckill">秒杀</el-menu-item>
              <el-menu-item index="/coupon">优惠券</el-menu-item>
            </el-menu>
          </div>
          <div class="header-right">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索商品"
              class="search-input"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <div class="user-actions">
              <el-badge :value="cartCount" :hidden="cartCount === 0" class="cart-badge">
                <el-button
                  :icon="ShoppingCart"
                  circle
                  @click="$router.push('/cart')"
                />
              </el-badge>
              <el-dropdown v-if="userStore.isLogin" @command="handleUserCommand">
                <span class="user-info">
                  <el-avatar :src="userStore.userInfo?.avatar" :size="32">
                    <el-icon><User /></el-icon>
                  </el-avatar>
                  <span class="username">{{ userStore.userInfo?.nickname || '用户' }}</span>
                  <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="user">个人中心</el-dropdown-item>
                    <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                    <el-dropdown-item command="aftersale">售后订单</el-dropdown-item>
                    <el-dropdown-item command="groupon">我的拼团</el-dropdown-item>
                    <el-dropdown-item command="chat">在线客服</el-dropdown-item>
                    <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button v-else type="primary" @click="$router.push('/login')">
                登录
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-item">
            <h3>关于我们</h3>
            <p>XX商城</p>
          </div>
          <div class="footer-item">
            <h3>服务支持</h3>
            <p>客服热线：400-xxx-xxxx</p>
          </div>
          <div class="footer-item">
            <h3>关注我们</h3>
            <p>微信公众号</p>
          </div>
        </div>
        <div class="footer-copyright">
          <p>Copyright © 2025 XX商城 All Rights Reserved</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { Search, ShoppingCart, User, ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

const searchKeyword = ref('')
const activeMenu = computed(() => route.path)

const cartCount = computed(() => cartStore.totalCount)

const handleMenuSelect = (index) => {
  router.push(index)
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { keyword: searchKeyword.value }
    })
  }
}

const handleUserCommand = (command) => {
  if (command === 'user') {
    router.push('/user/info')
  } else if (command === 'orders') {
    router.push('/order/list')
  } else if (command === 'aftersale') {
    router.push('/order/aftersale/list')
  } else if (command === 'groupon') {
    router.push('/activity/groupon/order')
  } else if (command === 'chat') {
    router.push('/chat')
  } else if (command === 'logout') {
    userStore.logout()
    router.push('/home')
  }
}

onMounted(() => {
  if (userStore.isLogin) {
    userStore.updateUserData()
  }
  cartStore.fetchCartList()
})
</script>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
  }

  .logo {
    cursor: pointer;
    h1 {
      color: #ff6b35;
      font-size: 24px;
      margin: 0;
    }
  }

  .nav-menu {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .search-input {
      width: 300px;
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 15px;

      .cart-badge {
        cursor: pointer;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 20px;
        transition: background 0.3s;

        &:hover {
          background: #f5f5f5;
        }

        .username {
          font-size: 14px;
        }
      }
    }
  }
}

.main-content {
  flex: 1;
  min-height: calc(100vh - 200px);
}

.footer {
  background: #2c3e50;
  color: #fff;
  padding: 40px 0 20px;
  margin-top: 50px;

  .footer-content {
    display: flex;
    justify-content: space-around;
    margin-bottom: 30px;

    .footer-item {
      h3 {
        margin-bottom: 15px;
        font-size: 16px;
      }

      p {
        color: #bdc3c7;
        font-size: 14px;
      }
    }
  }

  .footer-copyright {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #34495e;
    color: #95a5a6;
    font-size: 12px;
  }
}
</style>

