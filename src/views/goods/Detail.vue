<template>
  <div class="goods-detail-page" v-loading="loading">
    <div class="container" v-if="goodsInfo">
      <el-row :gutter="30">
        <!-- 商品图片 -->
        <el-col :span="12">
          <div class="goods-images">
            <el-image
              :src="mainImage"
              fit="contain"
              style="width: 100%; height: 500px;"
            />
            <div class="image-thumbs">
              <el-image
                v-for="(img, index) in imageList"
                :key="index"
                :src="img"
                fit="cover"
                class="thumb-item"
                :class="{ active: img === mainImage }"
                @click="mainImage = img"
              />
            </div>
          </div>
        </el-col>

        <!-- 商品信息 -->
        <el-col :span="12">
          <div class="goods-info">
            <h1 class="goods-name">{{ goodsInfo.name }}</h1>
            <div class="goods-desc">{{ goodsInfo.sellPoint }}</div>
            <div class="price-section">
              <span class="price">¥{{ (goodsInfo.price / 100).toFixed(2) }}</span>
              <span v-if="goodsInfo.originalPrice" class="old-price">
                ¥{{ (goodsInfo.originalPrice / 100).toFixed(2) }}
              </span>
            </div>
            <div class="goods-actions">
              <el-button type="primary" size="large" @click="handleAddCart">
                加入购物车
              </el-button>
              <el-button size="large" @click="handleBuyNow">
                立即购买
              </el-button>
              <el-button
                :icon="isFavorite ? StarFilled : Star"
                circle
                @click="handleToggleFavorite"
              />
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 商品详情 -->
      <el-tabs v-model="activeTab" style="margin-top: 30px;">
        <el-tab-pane label="商品详情" name="detail">
          <div v-html="goodsInfo.detailHtml" class="goods-detail-html"></div>
        </el-tab-pane>
        <el-tab-pane label="商品评价" name="comment">
          <div class="comment-header">
            <el-button type="primary" @click="$router.push(`/goods/comment/list/${route.params.id}`)">
              查看全部评价
            </el-button>
          </div>
          <div class="comment-list">
            <div v-for="item in comments" :key="item.id" class="comment-item">
              <div class="comment-user">
                <el-avatar :src="item.userAvatar" />
                <div class="user-details">
                  <span>{{ item.userNickname || '匿名用户' }}</span>
                  <el-rate
                    v-model="item.scores"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                  />
                </div>
              </div>
              <div class="comment-content">{{ item.content }}</div>
              <div class="comment-time">{{ item.createTime }}</div>
            </div>
            <el-empty v-if="comments.length === 0" description="暂无评价" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSpuDetail, isFavoriteExists, createFavorite, deleteFavorite, getCommentPage } from '@/api/product'
import { addCart } from '@/api/cart'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const goodsInfo = ref(null)
const isFavorite = ref(false)
const activeTab = ref('detail')
const comments = ref([])
const mainImage = ref('')

const imageList = computed(() => {
  if (!goodsInfo.value) return []
  const images = goodsInfo.value.picUrls || []
  return images.length > 0 ? images : [goodsInfo.value.picUrl]
})

const fetchGoodsDetail = async () => {
  loading.value = true
  try {
    const res = await getSpuDetail(route.params.id)
    if (res.code === 0) {
      goodsInfo.value = res.data
      mainImage.value = res.data.picUrl || res.data.picUrls?.[0] || ''
      await checkFavorite()
      await fetchComments()
    }
  } catch (error) {
    console.error('获取商品详情失败', error)
  } finally {
    loading.value = false
  }
}

const checkFavorite = async () => {
  try {
    const res = await isFavoriteExists(route.params.id)
    if (res.code === 0) {
      isFavorite.value = res.data || false
    }
  } catch (error) {
    console.error('检查收藏状态失败', error)
  }
}

const handleToggleFavorite = async () => {
  try {
    if (isFavorite.value) {
      await deleteFavorite(route.params.id)
      isFavorite.value = false
      ElMessage.success('取消收藏')
    } else {
      await createFavorite(route.params.id)
      isFavorite.value = true
      ElMessage.success('收藏成功')
    }
  } catch (error) {
    console.error('收藏操作失败', error)
  }
}

const handleAddCart = async () => {
  try {
    await addCart({
      skuId: goodsInfo.value.skuId || goodsInfo.value.id,
      count: 1
    })
    ElMessage.success('已添加到购物车')
  } catch (error) {
    console.error('添加购物车失败', error)
  }
}

const handleBuyNow = () => {
  router.push({
    path: '/order/confirm',
    query: {
      skuId: goodsInfo.value.skuId || goodsInfo.value.id,
      count: 1,
      name: goodsInfo.value.name,
      picUrl: goodsInfo.value.picUrl,
      price: goodsInfo.value.price,
      skuProperties: goodsInfo.value.sku?.properties?.map(p => p.valueName).join(' ') || ''
    }
  })
}

const fetchComments = async () => {
  try {
    const res = await getCommentPage(route.params.id, 1, 10)
    if (res.code === 0) {
      comments.value = res.data.list || []
    }
  } catch (error) {
    console.error('获取评价失败', error)
  }
}

onMounted(() => {
  fetchGoodsDetail()
})
</script>

<style scoped lang="scss">
.goods-detail-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .goods-images {
    .image-thumbs {
      display: flex;
      gap: 10px;
      margin-top: 10px;

      .thumb-item {
        width: 80px;
        height: 80px;
        cursor: pointer;
        border: 2px solid transparent;
        border-radius: 4px;

        &.active {
          border-color: #ff6b35;
        }
      }
    }
  }

  .goods-info {
    .goods-name {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .goods-desc {
      color: #999;
      margin-bottom: 20px;
    }

    .price-section {
      margin-bottom: 30px;

      .price {
        color: #ff6b35;
        font-size: 32px;
        font-weight: bold;
      }

      .old-price {
        color: #999;
        font-size: 18px;
        text-decoration: line-through;
        margin-left: 15px;
      }
    }

    .goods-actions {
      display: flex;
      gap: 15px;
    }
  }

  .goods-detail-html {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
  }

      .comment-header {
        margin-bottom: 20px;
        text-align: right;
      }

      .comment-list {
        .comment-item {
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;

          .comment-user {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;

            .user-details {
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
          }

          .comment-content {
            margin-bottom: 10px;
            color: #333;
            line-height: 1.6;
          }

          .comment-time {
            color: #999;
            font-size: 12px;
          }
        }
      }
}
</style>

