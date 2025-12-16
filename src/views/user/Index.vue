<template>
  <div class="user-index-page">
    <h2>个人中心</h2>
    <el-row :gutter="20">
      <!-- 用户信息卡片 -->
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-card>
          <div class="user-header">
            <el-avatar :src="userInfo.avatar" :size="80">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="user-details">
              <div class="user-name">{{ userInfo.nickname || '未设置昵称' }}</div>
              <div class="user-mobile">{{ userInfo.mobile || '未绑定手机' }}</div>
            </div>
            <el-button type="primary" @click="$router.push('/user/info')">编辑资料</el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 订单统计 -->
      <el-col :span="24" style="margin-bottom: 20px;">
        <el-card>
          <h3>我的订单</h3>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-item" @click="$router.push('/order/list?status=0')">
                <div class="stat-icon" style="color: #ff6b35;">
                  <el-icon :size="40"><Money /></el-icon>
                </div>
                <div class="stat-value">{{ orderCount.pendingPay || 0 }}</div>
                <div class="stat-label">待付款</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item" @click="$router.push('/order/list?status=1')">
                <div class="stat-icon" style="color: #409eff;">
                  <el-icon :size="40"><Box /></el-icon>
                </div>
                <div class="stat-value">{{ orderCount.pendingDelivery || 0 }}</div>
                <div class="stat-label">待发货</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item" @click="$router.push('/order/list?status=2')">
                <div class="stat-icon" style="color: #67c23a;">
                  <el-icon :size="40"><Truck /></el-icon>
                </div>
                <div class="stat-value">{{ orderCount.pendingReceive || 0 }}</div>
                <div class="stat-label">待收货</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item" @click="$router.push('/order/list?status=3')">
                <div class="stat-icon" style="color: #e6a23c;">
                  <el-icon :size="40"><Star /></el-icon>
                </div>
                <div class="stat-value">{{ orderCount.pendingComment || 0 }}</div>
                <div class="stat-label">待评价</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 资产统计 -->
      <el-col :span="12" style="margin-bottom: 20px;">
        <el-card>
          <h3>我的资产</h3>
          <div class="asset-list">
            <div class="asset-item" @click="$router.push('/user/wallet')">
              <div class="asset-icon" style="color: #ff6b35;">
                <el-icon :size="30"><Wallet /></el-icon>
              </div>
              <div class="asset-info">
                <div class="asset-label">余额</div>
                <div class="asset-value">¥{{ (walletInfo.balance / 100).toFixed(2) }}</div>
              </div>
              <el-icon><ArrowRight /></el-icon>
            </div>
            <div class="asset-item" @click="$router.push('/user/points')">
              <div class="asset-icon" style="color: #e6a23c;">
                <el-icon :size="30"><Coin /></el-icon>
              </div>
              <div class="asset-info">
                <div class="asset-label">积分</div>
                <div class="asset-value">{{ userInfo.point || 0 }}</div>
              </div>
              <el-icon><ArrowRight /></el-icon>
            </div>
            <div class="asset-item" @click="$router.push('/coupon')">
              <div class="asset-icon" style="color: #67c23a;">
                <el-icon :size="30"><Ticket /></el-icon>
              </div>
              <div class="asset-info">
                <div class="asset-label">优惠券</div>
                <div class="asset-value">{{ couponCount || 0 }}张</div>
              </div>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 快捷功能 -->
      <el-col :span="12" style="margin-bottom: 20px;">
        <el-card>
          <h3>快捷功能</h3>
          <div class="quick-menu">
            <div class="menu-item" @click="$router.push('/user/favorite')">
              <el-icon :size="24"><Star /></el-icon>
              <span>我的收藏</span>
            </div>
            <div class="menu-item" @click="$router.push('/user/history')">
              <el-icon :size="24"><Clock /></el-icon>
              <span>浏览记录</span>
            </div>
            <div class="menu-item" @click="$router.push('/user/address')">
              <el-icon :size="24"><Location /></el-icon>
              <span>收货地址</span>
            </div>
            <div class="menu-item" @click="$router.push('/order/aftersale/list')">
              <el-icon :size="24"><Box /></el-icon>
              <span>售后订单</span>
            </div>
            <div class="menu-item" @click="$router.push('/activity/groupon/order')">
              <el-icon :size="24"><UserFilled /></el-icon>
              <span>我的拼团</span>
            </div>
            <div class="menu-item" @click="$router.push('/commission')">
              <el-icon :size="24"><Share /></el-icon>
              <span>分销中心</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getOrderCount } from '@/api/order'
import { getUnusedCouponCount } from '@/api/coupon'
import {
  User,
  Money,
  Box,
  Truck,
  Star,
  Wallet,
  Coin,
  Ticket,
  Clock,
  Location,
  UserFilled,
  Share,
  ArrowRight
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const userInfo = reactive({
  nickname: '',
  mobile: '',
  avatar: '',
  point: 0
})
const walletInfo = reactive({
  balance: 0
})
const orderCount = reactive({
  pendingPay: 0,
  pendingDelivery: 0,
  pendingReceive: 0,
  pendingComment: 0
})
const couponCount = ref(0)

const fetchData = async () => {
  if (!userStore.isLogin) {
    router.push('/login')
    return
  }

  try {
    // 获取用户信息
    await userStore.getInfo()
    Object.assign(userInfo, userStore.userInfo || {})

    // 获取钱包信息
    await userStore.fetchWallet()
    walletInfo.balance = userStore.wallet?.balance || 0

    // 获取订单统计
    const orderRes = await getOrderCount()
    if (orderRes.code === 0) {
      Object.assign(orderCount, orderRes.data || {})
    }

    // 获取优惠券数量
    const couponRes = await getUnusedCouponCount()
    if (couponRes.code === 0) {
      couponCount.value = couponRes.data || 0
    }
  } catch (error) {
    console.error('获取数据失败', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.user-index-page {
  h2 {
    margin-bottom: 20px;
  }

  h3 {
    font-size: 18px;
    margin-bottom: 20px;
  }

  .user-header {
    display: flex;
    align-items: center;
    gap: 20px;

    .user-details {
      flex: 1;

      .user-name {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .user-mobile {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .stat-item {
    text-align: center;
    cursor: pointer;
    padding: 20px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      margin-bottom: 10px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
    }
  }

  .asset-list {
    .asset-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px 0;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: all 0.3s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        padding-left: 10px;
      }

      .asset-icon {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        border-radius: 50%;
      }

      .asset-info {
        flex: 1;

        .asset-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }

        .asset-value {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
      }
    }
  }

  .quick-menu {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    .menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #ff6b35;
        transform: translateY(-5px);
        box-shadow: 0 2px 8px rgba(255, 107, 53, 0.1);
      }

      span {
        font-size: 14px;
        color: #333;
      }
    }
  }
}
</style>

