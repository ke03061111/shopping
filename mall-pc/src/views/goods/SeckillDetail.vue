<template>
  <div class="seckill-goods-detail-page">
    <div class="container" v-loading="loading">
      <div v-if="goodsInfo && activityInfo" class="detail-content">
        <!-- 商品基本信息 -->
        <div class="goods-header">
          <div class="goods-images">
            <el-image
              :src="goodsInfo.picUrl"
              :preview-src-list="[goodsInfo.picUrl]"
              fit="cover"
              class="main-image"
            />
          </div>
          <div class="goods-info">
            <div class="activity-tag">
              <el-tag type="danger" size="large">秒杀活动</el-tag>
            </div>
            <h1 class="goods-name">{{ goodsInfo.name }}</h1>
            <div class="goods-price">
              <span class="current-price">秒杀价：¥{{ (activityInfo.seckillPrice / 100).toFixed(2) }}</span>
              <span class="original-price">原价：¥{{ (activityInfo.originalPrice / 100).toFixed(2) }}</span>
            </div>
            <div class="seckill-countdown">
              <div class="countdown-label">距离结束还有：</div>
              <div class="countdown-time">
                <span class="time-item">
                  <span class="time-value">{{ countdown.hours }}</span>
                  <span class="time-unit">时</span>
                </span>
                <span class="time-separator">:</span>
                <span class="time-item">
                  <span class="time-value">{{ countdown.minutes }}</span>
                  <span class="time-unit">分</span>
                </span>
                <span class="time-separator">:</span>
                <span class="time-item">
                  <span class="time-value">{{ countdown.seconds }}</span>
                  <span class="time-unit">秒</span>
                </span>
              </div>
            </div>
            <div class="seckill-info">
              <div class="info-item">
                <span class="label">活动时间：</span>
                <span class="value">{{ activityInfo.startTime }} 至 {{ activityInfo.endTime }}</span>
              </div>
              <div class="info-item">
                <span class="label">秒杀库存：</span>
                <span class="value">{{ activityInfo.stock }}件</span>
              </div>
              <div class="info-item">
                <span class="label">限购数量：</span>
                <span class="value">{{ activityInfo.limitCount || 1 }}件/人</span>
              </div>
            </div>
            <div class="action-buttons">
              <el-button
                type="primary"
                size="large"
                :disabled="!canBuy"
                @click="handleBuyNow"
              >
                {{ canBuy ? '立即秒杀' : '活动未开始' }}
              </el-button>
              <el-button
                type="default"
                size="large"
                @click="handleAddToCart"
              >
                加入购物车
              </el-button>
            </div>
          </div>
        </div>

        <!-- 商品详情 -->
        <el-tabs v-model="activeTab" style="margin-top: 30px;">
          <el-tab-pane label="商品详情" name="detail">
            <div v-html="goodsInfo.detailHtml" class="goods-detail-html"></div>
          </el-tab-pane>
          <el-tab-pane label="商品评价" name="comment">
            <div class="comment-header">
              <el-button type="primary" @click="$router.push(`/goods/comment/list/${goodsInfo.id}`)">
                查看全部评价
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSpuDetail } from '@/api/product'
import { getSeckillActivity, getSeckillActivityBySpuId } from '@/api/activity'
import { addCart } from '@/api/cart'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const goodsInfo = ref(null)
const activityInfo = ref(null)
const activeTab = ref('detail')
const countdown = ref({ hours: 0, minutes: 0, seconds: 0 })
let timer = null

const canBuy = computed(() => {
  if (!activityInfo.value) return false
  const now = new Date().getTime()
  const startTime = new Date(activityInfo.value.startTime).getTime()
  const endTime = new Date(activityInfo.value.endTime).getTime()
  return now >= startTime && now <= endTime && activityInfo.value.stock > 0
})

const updateCountdown = () => {
  if (!activityInfo.value) return
  const now = new Date().getTime()
  const endTime = new Date(activityInfo.value.endTime).getTime()
  const diff = Math.max(0, endTime - now)
  
  countdown.value.hours = Math.floor(diff / (1000 * 60 * 60))
  countdown.value.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  countdown.value.seconds = Math.floor((diff % (1000 * 60)) / 1000)
}

const fetchData = async () => {
  loading.value = true
  try {
    const spuId = route.params.id

    // 获取商品详情
    const goodsRes = await getSpuDetail(spuId)
    if (goodsRes.code === 0) {
      goodsInfo.value = goodsRes.data
    }

    // 获取秒杀活动详情（优先通过spuId获取，如果失败则通过活动ID）
    if (route.query.activityId) {
      const activityRes = await getSeckillActivity(route.query.activityId)
      if (activityRes.code === 0) {
        activityInfo.value = activityRes.data
        updateCountdown()
        timer = setInterval(updateCountdown, 1000)
      }
    } else {
      const activityRes = await getSeckillActivityBySpuId(spuId)
      if (activityRes.code === 0) {
        activityInfo.value = activityRes.data
        updateCountdown()
        timer = setInterval(updateCountdown, 1000)
      }
    }
  } catch (error) {
    console.error('获取商品详情失败', error)
  } finally {
    loading.value = false
  }
}

const handleBuyNow = () => {
  router.push({
    path: '/order/confirm',
    query: {
      skuId: goodsInfo.value.skuId || goodsInfo.value.id,
      count: 1,
      activityType: 'seckill',
      activityId: activityInfo.value.id
    }
  })
}

const handleAddToCart = async () => {
  if (!goodsInfo.value.skuId) {
    ElMessage.warning('请先选择商品规格')
    return
  }
  try {
    await addCart({
      skuId: goodsInfo.value.skuId,
      count: 1
    })
    ElMessage.success('已添加到购物车')
  } catch (error) {
    console.error('添加到购物车失败', error)
  }
}

onMounted(() => {
  fetchData()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped lang="scss">
.seckill-goods-detail-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .detail-content {
    .goods-header {
      display: flex;
      gap: 30px;
      background: #fff;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 20px;

      .goods-images {
        flex: 1;

        .main-image {
          width: 100%;
          height: 500px;
          border-radius: 8px;
        }
      }

      .goods-info {
        flex: 1;

        .activity-tag {
          margin-bottom: 15px;
        }

        .goods-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .goods-price {
          margin-bottom: 20px;

          .current-price {
            font-size: 32px;
            color: #ff6b35;
            font-weight: bold;
            margin-right: 15px;
          }

          .original-price {
            font-size: 18px;
            color: #999;
            text-decoration: line-through;
          }
        }

        .seckill-countdown {
          background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;

          .countdown-label {
            color: #fff;
            font-size: 16px;
            margin-bottom: 15px;
          }

          .countdown-time {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;

            .time-item {
              background: #fff;
              border-radius: 4px;
              padding: 10px 15px;
              display: flex;
              flex-direction: column;
              align-items: center;

              .time-value {
                font-size: 32px;
                font-weight: bold;
                color: #ff6b35;
              }

              .time-unit {
                font-size: 12px;
                color: #666;
              }
            }

            .time-separator {
              color: #fff;
              font-size: 24px;
              font-weight: bold;
            }
          }
        }

        .seckill-info {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;

          .info-item {
            margin-bottom: 10px;
            font-size: 14px;

            .label {
              color: #666;
            }

            .value {
              color: #333;
              font-weight: bold;
            }
          }
        }

        .action-buttons {
          display: flex;
          gap: 15px;
        }
      }
    }
  }
}
</style>

