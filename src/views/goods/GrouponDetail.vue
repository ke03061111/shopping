<template>
  <div class="groupon-goods-detail-page">
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
              <el-tag type="danger" size="large">拼团活动</el-tag>
            </div>
            <h1 class="goods-name">{{ goodsInfo.name }}</h1>
            <div class="goods-price">
              <span class="current-price">拼团价：¥{{ (activityInfo.combinationPrice / 100).toFixed(2) }}</span>
              <span class="original-price">原价：¥{{ (activityInfo.originalPrice / 100).toFixed(2) }}</span>
            </div>
            <div class="groupon-info">
              <div class="info-item">
                <span class="label">拼团人数：</span>
                <span class="value">{{ activityInfo.peopleCount }}人</span>
              </div>
              <div class="info-item">
                <span class="label">活动时间：</span>
                <span class="value">{{ activityInfo.startTime }} 至 {{ activityInfo.endTime }}</span>
              </div>
              <div class="info-item">
                <span class="label">库存：</span>
                <span class="value">{{ activityInfo.stock }}件</span>
              </div>
            </div>
            <div class="groupon-progress" v-if="recordId">
              <h3>拼团进度</h3>
              <div class="progress-info">
                <span>已参团：{{ recordInfo?.userCount || 0 }}/{{ activityInfo.peopleCount }}人</span>
                <el-progress
                  :percentage="((recordInfo?.userCount || 0) / activityInfo.peopleCount) * 100"
                  :status="recordInfo?.status === 1 ? 'success' : recordInfo?.status === 2 ? 'exception' : ''"
                />
              </div>
              <div class="groupon-members" v-if="recordInfo?.users && recordInfo.users.length > 0">
                <div
                  v-for="user in recordInfo.users"
                  :key="user.id"
                  class="member-item"
                >
                  <el-avatar :src="user.avatar" :size="40">
                    <el-icon><User /></el-icon>
                  </el-avatar>
                  <span class="member-name">{{ user.nickname || '匿名用户' }}</span>
                  <el-tag v-if="user.headId === recordInfo.headId" type="success" size="small">团长</el-tag>
                </div>
              </div>
            </div>
            <div class="action-buttons">
              <el-button
                v-if="!recordId"
                type="primary"
                size="large"
                @click="handleCreateGroupon"
              >
                发起拼团
              </el-button>
              <el-button
                v-else-if="recordInfo?.status === 0"
                type="primary"
                size="large"
                @click="handleJoinGroupon"
              >
                立即参团
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSpuDetail } from '@/api/product'
import { getCombinationActivity, getCombinationActivityBySpuId, getCombinationRecordDetail } from '@/api/activity'
import { addCart } from '@/api/cart'
import { User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const goodsInfo = ref(null)
const activityInfo = ref(null)
const recordInfo = ref(null)
const recordId = ref(null)
const activeTab = ref('detail')

const fetchData = async () => {
  loading.value = true
  try {
    recordId.value = route.query.recordId
    let activityId = route.query.activityId
    
    // 如果有拼团记录ID，先获取记录详情
    if (recordId.value) {
      const recordRes = await getCombinationRecordDetail(recordId.value)
      if (recordRes.code === 0) {
        recordInfo.value = recordRes.data
        activityId = recordRes.data.headRecord?.activityId || activityId
      }
    }

    // 获取拼团活动详情
    if (activityId) {
      const activityRes = await getCombinationActivity(activityId)
      if (activityRes.code === 0) {
        activityInfo.value = activityRes.data
        // 通过活动的spuId获取商品详情
        const goodsRes = await getSpuDetail(activityRes.data.spuId)
        if (goodsRes.code === 0) {
          goodsInfo.value = goodsRes.data
        }
      }
    } else {
      // 如果没有活动ID，通过spuId获取
      const spuId = route.params.id
      const activityRes = await getCombinationActivityBySpuId(spuId)
      if (activityRes.code === 0) {
        activityInfo.value = activityRes.data
        const goodsRes = await getSpuDetail(spuId)
        if (goodsRes.code === 0) {
          goodsInfo.value = goodsRes.data
        }
      }
    }

  } catch (error) {
    console.error('获取商品详情失败', error)
  } finally {
    loading.value = false
  }
}

const handleCreateGroupon = () => {
  router.push({
    path: '/order/confirm',
    query: {
      spuId: goodsInfo.value.id,
      activityType: 'groupon',
      activityId: activityInfo.value.id
    }
  })
}

const handleJoinGroupon = () => {
  router.push({
    path: '/order/confirm',
    query: {
      spuId: goodsInfo.value.id,
      activityType: 'groupon',
      activityId: activityInfo.value.id,
      recordId: recordId.value
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
</script>

<style scoped lang="scss">
.groupon-goods-detail-page {
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

        .groupon-info {
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

        .groupon-progress {
          background: #fff5f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;

          h3 {
            font-size: 18px;
            margin-bottom: 15px;
          }

          .progress-info {
            margin-bottom: 15px;

            span {
              display: block;
              margin-bottom: 10px;
            }
          }

          .groupon-members {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;

            .member-item {
              display: flex;
              align-items: center;
              gap: 10px;
              padding: 10px;
              background: #fff;
              border-radius: 4px;

              .member-name {
                font-size: 14px;
              }
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

