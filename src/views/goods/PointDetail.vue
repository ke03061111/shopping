<template>
  <div class="point-goods-detail-page">
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
              <el-tag type="warning" size="large">积分商城</el-tag>
            </div>
            <h1 class="goods-name">{{ goodsInfo.name }}</h1>
            <div class="goods-price">
              <div class="point-price">
                <span class="point-value">{{ activityInfo.point }}积分</span>
                <span v-if="activityInfo.price > 0" class="cash-price">
                  +¥{{ (activityInfo.price / 100).toFixed(2) }}
                </span>
              </div>
              <div class="original-price" v-if="activityInfo.originalPrice > 0">
                原价：¥{{ (activityInfo.originalPrice / 100).toFixed(2) }}
              </div>
            </div>
            <div class="point-info">
              <div class="info-item">
                <span class="label">活动时间：</span>
                <span class="value">{{ activityInfo.startTime }} 至 {{ activityInfo.endTime }}</span>
              </div>
              <div class="info-item">
                <span class="label">库存：</span>
                <span class="value">{{ activityInfo.stock }}件</span>
              </div>
              <div class="info-item">
                <span class="label">限兑数量：</span>
                <span class="value">{{ activityInfo.limitCount || 1 }}件/人</span>
              </div>
            </div>
            <div class="user-points" v-if="userPoints !== null">
              <div class="points-label">我的积分：</div>
              <div class="points-value">{{ userPoints }}积分</div>
            </div>
            <div class="action-buttons">
              <el-button
                type="primary"
                size="large"
                :disabled="!canExchange"
                @click="handleExchange"
              >
                {{ canExchange ? '立即兑换' : '积分不足或库存不足' }}
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSpuDetail } from '@/api/product'
import { getPointActivity, getPointActivityBySpuId } from '@/api/activity'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const goodsInfo = ref(null)
const activityInfo = ref(null)
const userPoints = ref(null)
const activeTab = ref('detail')

const canExchange = computed(() => {
  if (!activityInfo.value || userPoints.value === null) return false
  return userPoints.value >= activityInfo.value.point && activityInfo.value.stock > 0
})

const fetchData = async () => {
  loading.value = true
  try {
    const spuId = route.params.id

    // 获取商品详情
    const goodsRes = await getSpuDetail(spuId)
    if (goodsRes.code === 0) {
      goodsInfo.value = goodsRes.data
    }

    // 获取积分活动详情（优先通过spuId获取，如果失败则通过活动ID）
    if (route.query.activityId) {
      const activityRes = await getPointActivity(route.query.activityId)
      if (activityRes.code === 0) {
        activityInfo.value = activityRes.data
      }
    } else {
      const activityRes = await getPointActivityBySpuId(spuId)
      if (activityRes.code === 0) {
        activityInfo.value = activityRes.data
      }
    }

    // 获取用户积分
    if (userStore.isLogin) {
      await userStore.getInfo()
      userPoints.value = userStore.userInfo?.point || 0
    }
  } catch (error) {
    console.error('获取商品详情失败', error)
  } finally {
    loading.value = false
  }
}

const handleExchange = () => {
  if (!userStore.isLogin) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  router.push({
    path: '/order/confirm',
    query: {
      skuId: goodsInfo.value.skuId || goodsInfo.value.id,
      count: 1,
      activityType: 'point',
      activityId: activityInfo.value.id
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.point-goods-detail-page {
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

          .point-price {
            margin-bottom: 10px;

            .point-value {
              font-size: 32px;
              color: #ff6b35;
              font-weight: bold;
              margin-right: 15px;
            }

            .cash-price {
              font-size: 18px;
              color: #ff6b35;
            }
          }

          .original-price {
            font-size: 14px;
            color: #999;
            text-decoration: line-through;
          }
        }

        .point-info {
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

        .user-points {
          background: #fff5f5;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;

          .points-label {
            font-size: 14px;
            color: #666;
          }

          .points-value {
            font-size: 24px;
            color: #ff6b35;
            font-weight: bold;
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

