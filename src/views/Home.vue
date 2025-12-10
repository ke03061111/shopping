<template>
  <div class="home">
    <!-- DIY装修页面 -->
    <div v-if="useDiy && diyPageData" class="diy-page" v-html="diyPageData.content"></div>

    <!-- 默认首页布局 -->
    <template v-else>
      <!-- 轮播图 -->
      <div class="banner-container">
        <el-carousel height="600px" :interval="5000" arrow="hover" indicator-position="outside">
          <el-carousel-item v-for="(item, index) in banners" :key="index">
            <div class="banner-item">
              <img 
                :src="item.image" 
                :alt="item.title" 
                class="banner-image"
              />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 快捷入口 -->
      <div class="container">
      <div class="quick-access">
        <div class="access-item" @click="$router.push('/activity/groupon')">
          <el-icon :size="40"><UserFilled /></el-icon>
          <span>拼团</span>
        </div>
        <div class="access-item" @click="$router.push('/activity/seckill')">
          <el-icon :size="40"><Timer /></el-icon>
          <span>秒杀</span>
        </div>
        <div class="access-item" @click="$router.push('/coupon')">
          <el-icon :size="40"><Ticket /></el-icon>
          <span>优惠券</span>
        </div>
        <div class="access-item" @click="$router.push('/sign')">
          <el-icon :size="40"><Calendar /></el-icon>
          <span>签到</span>
        </div>
      </div>

      <!-- 商品推荐 -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">热门商品</h2>
          <span class="section-subtitle">精选好物，热销推荐</span>
        </div>
        <div v-loading="loading" class="goods-container">
          <el-row :gutter="20" v-if="hotGoods.length > 0">
            <el-col
              v-for="item in hotGoods"
              :key="item.id"
              :xs="12"
              :sm="12"
              :md="6"
              :lg="6"
              :xl="6"
            >
              <GoodsCard :goods="item" />
            </el-col>
          </el-row>
          <el-empty v-else-if="!loading" description="暂无热门商品" />
        </div>
      </div>

      <!-- 新品上架 -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">新品上架</h2>
          <span class="section-subtitle">最新商品，抢先体验</span>
        </div>
        <div v-loading="loading" class="goods-container">
          <el-row :gutter="20" v-if="newGoods.length > 0">
            <el-col
              v-for="item in newGoods"
              :key="item.id"
              :xs="12"
              :sm="12"
              :md="6"
              :lg="6"
              :xl="6"
            >
              <GoodsCard :goods="item" />
            </el-col>
          </el-row>
          <el-empty v-else-if="!loading" description="暂无新品" />
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSpuPage } from '@/api/product'
import { getUsedDiyTemplate, getDiyPage } from '@/api/promotion'
import GoodsCard from '@/components/GoodsCard.vue'
import { UserFilled, Timer, Ticket, Calendar } from '@element-plus/icons-vue'

const banners = ref([
  { image: '/banner1.png', title: '双12 囤货攻略' },
  { image: '/banner2.png', title: '双12闺蜜拼团季' },
  { image: '/banner3.png', title: '双12全球狂欢节' },
  { image: '/banner4.png', title: '12.12购物节' },
  { image: '/banner5.png', title: '双12 年终盛典' }
])

const hotGoods = ref([])
const newGoods = ref([])
const diyPageData = ref(null)
const useDiy = ref(false)
const loading = ref(false)

const fetchDiyPage = async () => {
  try {
    // 尝试获取DIY装修页面
    const templateRes = await getUsedDiyTemplate()
    if (templateRes.code === 0 && templateRes.data && templateRes.data.pageId) {
      const pageRes = await getDiyPage(templateRes.data.pageId)
      if (pageRes.code === 0 && pageRes.data) {
        diyPageData.value = pageRes.data
        useDiy.value = true
        return true
      }
    }
  } catch (error) {
    // DIY页面加载失败，使用默认布局
    console.error('获取DIY页面失败', error)
  }
  return false
}

const fetchGoods = async () => {
  loading.value = true
  try {
    // 并行请求热门商品和新品
    const [hotRes, newRes] = await Promise.all([
      // 通过 /product/spu/page 接口获取热门商品（按销量降序）
      getSpuPage({
        pageNo: 1,
        pageSize: 8,
        sortField: 'salesCount',
        sortAsc: false
      }),
      // 通过 /product/spu/page 接口获取新品（按创建时间降序）
      getSpuPage({
        pageNo: 1,
        pageSize: 8,
        sortField: 'createTime',
        sortAsc: false
      })
    ])

    if (hotRes.code === 0 && hotRes.data) {
      hotGoods.value = hotRes.data.list || []
      console.log('热门商品加载成功，数量:', hotGoods.value.length)
    } else {
      console.warn('获取热门商品失败:', hotRes.msg || '未知错误')
      hotGoods.value = []
    }

    if (newRes.code === 0 && newRes.data) {
      newGoods.value = newRes.data.list || []
      console.log('新品加载成功，数量:', newGoods.value.length)
    } else {
      console.warn('获取新品失败:', newRes.msg || '未知错误')
      newGoods.value = []
    }
  } catch (error) {
    console.error('获取商品失败', error)
    // 即使出错也显示空列表，避免页面空白
    hotGoods.value = []
    newGoods.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // 先尝试加载DIY页面，如果没有则使用默认布局
  const hasDiy = await fetchDiyPage()
  if (!hasDiy) {
    // 确保使用默认布局时加载商品数据
    useDiy.value = false
    await fetchGoods()
  }
})
</script>

<style scoped lang="scss">
.home {
  .banner-container {
    width: 100%;
    margin-bottom: 20px;
    overflow: hidden;

    .banner-item {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }

    .banner-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
  }

  .quick-access {
    display: flex;
    justify-content: space-around;
    padding: 40px 0;
    background: #fff;
    margin: 20px 0;
    border-radius: 8px;

    .access-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      span {
        font-size: 14px;
        color: #333;
      }
    }
  }

  .section {
    margin: 50px 0;

    .section-header {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 24px;

      .section-title {
        font-size: 28px;
        font-weight: bold;
        color: #333;
        margin: 0;
        position: relative;
        padding-left: 16px;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 24px;
          background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
          border-radius: 2px;
        }
      }

      .section-subtitle {
        font-size: 14px;
        color: #999;
        font-weight: normal;
      }
    }

    .goods-container {
      min-height: 300px;
    }
  }

  .diy-page {
    :deep(img) {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>

