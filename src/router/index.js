import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/Category.vue'),
        meta: { title: '商品分类' }
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/views/Search.vue'),
        meta: { title: '搜索' }
      },
      {
        path: 'goods/list',
        name: 'GoodsList',
        component: () => import('@/views/goods/List.vue'),
        meta: { title: '商品列表' }
      },
      {
        path: 'goods/detail/:id',
        name: 'GoodsDetail',
        component: () => import('@/views/goods/Detail.vue'),
        meta: { title: '商品详情' }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/Cart.vue'),
        meta: { title: '购物车', requiresAuth: true }
      },
      {
        path: 'order/confirm',
        name: 'OrderConfirm',
        component: () => import('@/views/order/Confirm.vue'),
        meta: { title: '确认订单', requiresAuth: true }
      },
      {
        path: 'order/list',
        name: 'OrderList',
        component: () => import('@/views/order/List.vue'),
        meta: { title: '我的订单', requiresAuth: true }
      },
      {
        path: 'order/detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/Detail.vue'),
        meta: { title: '订单详情', requiresAuth: true }
      },
      {
        path: 'order/aftersale/list',
        name: 'AftersaleList',
        component: () => import('@/views/order/aftersale/List.vue'),
        meta: { title: '售后列表', requiresAuth: true }
      },
      {
        path: 'order/aftersale/detail/:id',
        name: 'AftersaleDetail',
        component: () => import('@/views/order/aftersale/Detail.vue'),
        meta: { title: '售后详情', requiresAuth: true }
      },
      {
        path: 'order/aftersale/apply',
        name: 'AftersaleApply',
        component: () => import('@/views/order/aftersale/Apply.vue'),
        meta: { title: '申请售后', requiresAuth: true }
      },
      {
        path: 'order/aftersale/return-delivery/:id',
        name: 'ReturnDelivery',
        component: () => import('@/views/order/aftersale/ReturnDelivery.vue'),
        meta: { title: '退货物流', requiresAuth: true }
      },
      {
        path: 'order/aftersale/log/:id',
        name: 'AftersaleLog',
        component: () => import('@/views/order/aftersale/Log.vue'),
        meta: { title: '售后进度', requiresAuth: true }
      },
      {
        path: 'order/express/log/:id',
        name: 'ExpressLog',
        component: () => import('@/views/order/express/Log.vue'),
        meta: { title: '物流轨迹', requiresAuth: true }
      },
      {
        path: 'order/address-selection',
        name: 'AddressSelection',
        component: () => import('@/views/order/AddressSelection.vue'),
        meta: { title: '选择地址', requiresAuth: true }
      },
      {
        path: 'order/pickup-verify',
        name: 'PickUpVerify',
        component: () => import('@/views/order/PickUpVerify.vue'),
        meta: { title: '自提核销', requiresAuth: true }
      },
      {
        path: 'goods/comment/list/:id',
        name: 'CommentList',
        component: () => import('@/views/goods/comment/List.vue'),
        meta: { title: '商品评价' }
      },
      {
        path: 'goods/comment/add',
        name: 'CommentAdd',
        component: () => import('@/views/goods/comment/Add.vue'),
        meta: { title: '评价商品', requiresAuth: true }
      },
      {
        path: 'goods/groupon/:id',
        name: 'GrouponDetail',
        component: () => import('@/views/goods/Detail.vue'),
        meta: { title: '拼团商品' }
      },
      {
        path: 'goods/seckill/:id',
        name: 'SeckillDetail',
        component: () => import('@/views/goods/Detail.vue'),
        meta: { title: '秒杀商品' }
      },
      {
        path: 'goods/groupon/:id',
        name: 'GrouponGoodsDetail',
        component: () => import('@/views/goods/GrouponDetail.vue'),
        meta: { title: '拼团商品' }
      },
      {
        path: 'goods/seckill/:id',
        name: 'SeckillGoodsDetail',
        component: () => import('@/views/goods/SeckillDetail.vue'),
        meta: { title: '秒杀商品' }
      },
      {
        path: 'goods/point/:id',
        name: 'PointGoodsDetail',
        component: () => import('@/views/goods/PointDetail.vue'),
        meta: { title: '积分商品' }
      },
      {
        path: 'user',
        component: () => import('@/layouts/UserLayout.vue'),
        redirect: '/user/index',
        meta: { requiresAuth: true },
        children: [
          {
            path: 'index',
            name: 'UserIndex',
            component: () => import('@/views/user/Index.vue'),
            meta: { title: '个人中心' }
          },
          {
            path: 'info',
            name: 'UserInfo',
            component: () => import('@/views/user/Info.vue'),
            meta: { title: '个人信息' }
          },
          {
            path: 'address',
            name: 'UserAddress',
            component: () => import('@/views/user/Address.vue'),
            meta: { title: '收货地址' }
          },
          {
            path: 'favorite',
            name: 'UserFavorite',
            component: () => import('@/views/user/Favorite.vue'),
            meta: { title: '我的收藏' }
          },
          {
            path: 'history',
            name: 'UserHistory',
            component: () => import('@/views/user/History.vue'),
            meta: { title: '浏览记录' }
          },
          {
            path: 'wallet',
            name: 'UserWallet',
            component: () => import('@/views/user/Wallet.vue'),
            meta: { title: '我的钱包' }
          },
          {
            path: 'recharge-log',
            name: 'RechargeLog',
            component: () => import('@/views/pay/RechargeLog.vue'),
            meta: { title: '充值记录' }
          },
          {
            path: 'store',
            name: 'UserStore',
            component: () => import('@/views/user/Store.vue'),
            meta: { title: '自提门店' }
          },
          {
            path: 'points',
            name: 'UserPoints',
            component: () => import('@/views/user/Points.vue'),
            meta: { title: '我的积分' }
          }
        ]
      },
      {
        path: 'activity/groupon',
        name: 'GrouponList',
        component: () => import('@/views/activity/GrouponList.vue'),
        meta: { title: '拼团活动' }
      },
      {
        path: 'activity/seckill',
        name: 'SeckillList',
        component: () => import('@/views/activity/SeckillList.vue'),
        meta: { title: '秒杀活动' }
      },
      {
        path: 'activity/point',
        name: 'PointMall',
        component: () => import('@/views/activity/PointMall.vue'),
        meta: { title: '积分商城' }
      },
      {
        path: 'activity',
        name: 'ActivityIndex',
        component: () => import('@/views/activity/Index.vue'),
        meta: { title: '营销活动' }
      },
      {
        path: 'coupon',
        name: 'CouponList',
        component: () => import('@/views/coupon/List.vue'),
        meta: { title: '领券中心' }
      },
      {
        path: 'commission',
        name: 'Commission',
        component: () => import('@/views/commission/Index.vue'),
        meta: { title: '分销中心', requiresAuth: true }
      },
      {
        path: 'commission/goods',
        name: 'CommissionGoods',
        component: () => import('@/views/commission/Goods.vue'),
        meta: { title: '推广商品', requiresAuth: true }
      },
      {
        path: 'commission/order',
        name: 'CommissionOrder',
        component: () => import('@/views/commission/Order.vue'),
        meta: { title: '分销订单', requiresAuth: true }
      },
      {
        path: 'commission/team',
        name: 'CommissionTeam',
        component: () => import('@/views/commission/Team.vue'),
        meta: { title: '我的团队', requiresAuth: true }
      },
      {
        path: 'commission/withdraw',
        name: 'CommissionWithdraw',
        component: () => import('@/views/commission/Withdraw.vue'),
        meta: { title: '申请提现', requiresAuth: true }
      },
      {
        path: 'commission/promoter',
        name: 'CommissionPromoter',
        component: () => import('@/views/commission/Promoter.vue'),
        meta: { title: '推广人排行榜', requiresAuth: true }
      },
      {
        path: 'commission/ranking',
        name: 'CommissionRanking',
        component: () => import('@/views/commission/CommissionRanking.vue'),
        meta: { title: '佣金排行榜', requiresAuth: true }
      },
      {
        path: 'activity/groupon/detail/:id',
        name: 'GrouponDetail',
        component: () => import('@/views/activity/groupon/Detail.vue'),
        meta: { title: '拼团详情' }
      },
      {
        path: 'activity/groupon/order',
        name: 'GrouponOrder',
        component: () => import('@/views/activity/groupon/Order.vue'),
        meta: { title: '我的拼团', requiresAuth: true }
      },
      {
        path: 'coupon/detail/:id',
        name: 'CouponDetail',
        component: () => import('@/views/coupon/Detail.vue'),
        meta: { title: '优惠券详情' }
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/views/chat/Index.vue'),
        meta: { title: '在线客服', requiresAuth: true }
      },
      {
        path: 'sign',
        name: 'Sign',
        component: () => import('@/views/Sign.vue'),
        meta: { title: '签到中心', requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/pay',
    name: 'Pay',
    component: () => import('@/views/pay/Index.vue'),
    meta: { title: '收银台', requiresAuth: true }
  },
  {
    path: '/pay/result',
    name: 'PayResult',
    component: () => import('@/views/pay/Result.vue'),
    meta: { title: '支付结果' }
  },
  {
    path: '/pay/recharge',
    name: 'Recharge',
    component: () => import('@/views/pay/Recharge.vue'),
    meta: { title: '充值余额', requiresAuth: true }
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('@/views/public/Error.vue'),
    meta: { title: '错误页面' }
  },
  {
    path: '/richtext/:id',
    name: 'RichText',
    component: () => import('@/views/public/RichText.vue'),
    meta: { title: '文章详情' }
  },
  {
    path: '/webview',
    name: 'WebView',
    component: () => import('@/views/public/WebView.vue'),
    meta: { title: '网页视图' }
  },
  {
    path: '/page/:id',
    name: 'CustomPage',
    component: () => import('@/views/public/CustomPage.vue'),
    meta: { title: '自定义页面' }
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@/views/public/Setting.vue'),
    meta: { title: '系统设置', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 芋道商城`
  }
  
  // 登录页直接放行
  if (to.path === '/login') {
    next()
    return
  }
  
  // 只有明确标记 requiresAuth: true 的页面才需要登录
  // 首页、商品列表、商品详情等页面没有 requiresAuth，无需登录即可访问
  if (to.meta.requiresAuth === true) {
    // 需要登录的页面，检查登录状态
    if (!userStore.isLogin) {
      // 需要登录但未登录，跳转到登录页，并保存目标路径用于登录后跳转
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  // 不需要登录或已登录，直接放行
  next()
})

export default router

