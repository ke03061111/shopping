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
              <span class="price">¥{{ (displayPrice / 100).toFixed(2) }}</span>
              <span v-if="displayOriginalPrice" class="old-price">
                ¥{{ (displayOriginalPrice / 100).toFixed(2) }}
              </span>
            </div>

            <!-- 规格选择 -->
            <div v-if="specGroups.length" class="spec-section">
              <div class="spec-group" v-for="group in specGroups" :key="group.id">
                <div class="spec-name">{{ group.name }}</div>
                <div class="spec-values">
                  <el-tag
                    v-for="value in group.values"
                    :key="value.id"
                    class="spec-tag"
                    :type="selectedSpecs[group.id] === value.id ? 'success' : 'info'"
                    @click="handleSelectSpec(group.id, value.id)"
                  >
                    {{ value.name }}
                  </el-tag>
                </div>
              </div>
              <div class="spec-selected" v-if="selectedSkuText">
                已选：{{ selectedSkuText }}
              </div>
            </div>

            <div class="stock-row" v-if="selectedSku">
              库存：{{ selectedSku.stock ?? 0 }}
            </div>
            <div class="goods-actions">
              <el-button
                type="primary"
                size="large"
                :disabled="!selectedSku"
                @click="handleAddCart"
              >
                加入购物车
              </el-button>
              <el-button size="large" :disabled="!selectedSku" @click="handleBuyNow">
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
import { ref, computed, onMounted, watch } from 'vue'
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
const selectedSpecs = ref({})
const currentSku = ref(null)
const addingCart = ref(false)

const imageList = computed(() => {
  if (!goodsInfo.value) return []
  const images = goodsInfo.value.picUrls || []
  return images.length > 0 ? images : [goodsInfo.value.picUrl]
})

// 规格分组
const specGroups = computed(() => {
  const map = {}
  goodsInfo.value?.skus?.forEach((sku) => {
    sku.properties?.forEach((p) => {
      if (!map[p.propertyId]) {
        map[p.propertyId] = { id: p.propertyId, name: p.propertyName, values: [] }
      }
      if (!map[p.propertyId].values.find((v) => v.id === p.valueId)) {
        map[p.propertyId].values.push({ id: p.valueId, name: p.valueName })
      }
    })
  })
  return Object.values(map)
})

const selectedSku = computed(() => currentSku.value)

const displayPrice = computed(() => {
  if (selectedSku.value?.price) return selectedSku.value.price
  if (goodsInfo.value?.price) return goodsInfo.value.price
  return 0
})

const displayOriginalPrice = computed(() => {
  if (selectedSku.value?.originalPrice) return selectedSku.value.originalPrice
  if (goodsInfo.value?.originalPrice) return goodsInfo.value.originalPrice
  return 0
})

const selectedSkuText = computed(() =>
  selectedSku.value?.properties?.map((p) => p.valueName).join(' ') || ''
)

const findSkuBySpecs = (specMap) => {
  return goodsInfo.value?.skus?.find((sku) =>
    sku.properties?.every((p) => specMap[p.propertyId] === p.valueId)
  )
}

const setCurrentSku = (sku) => {
  currentSku.value = sku
  if (sku?.picUrl) {
    mainImage.value = sku.picUrl
  }
}

const handleSelectSpec = (groupId, valueId) => {
  const next = { ...selectedSpecs.value, [groupId]: valueId }
  const matchedSku = findSkuBySpecs(next)
  if (!matchedSku) {
    ElMessage.warning('暂无该规格库存')
    return
  }
  selectedSpecs.value = next
  setCurrentSku(matchedSku)
}

const fetchGoodsDetail = async () => {
  loading.value = true
  try {
    const res = await getSpuDetail(route.params.id)
    if (res.code === 0) {
      goodsInfo.value = res.data
      // 默认选中第一个 SKU
      if (res.data?.skus?.length) {
        const firstSku = res.data.skus[0]
        selectedSpecs.value = firstSku.properties?.reduce((acc, cur) => {
          acc[cur.propertyId] = cur.valueId
          return acc
        }, {}) || {}
        setCurrentSku(firstSku)
      }
      mainImage.value = currentSku.value?.picUrl || res.data.picUrl || res.data.picUrls?.[0] || ''
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
  if (!selectedSku.value?.id) {
    ElMessage.warning('请先选择规格')
    return
  }
  if (addingCart.value) return
  addingCart.value = true
  try {
    await addCart({
      skuId: selectedSku.value.id,
      count: 1
    })
  } catch (error) {
    console.error('添加购物车失败', error)
  } finally {
    addingCart.value = false
  }
}

const handleBuyNow = () => {
  if (!selectedSku.value?.id) {
    ElMessage.warning('请先选择规格')
    return
  }
  router.push({
    path: '/order/confirm',
    query: {
      skuId: selectedSku.value.id,
      count: 1,
      name: goodsInfo.value.name,
      picUrl: selectedSku.value.picUrl || goodsInfo.value.picUrl,
      price: selectedSku.value.price,
      skuProperties: selectedSkuText.value
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

watch(
  () => selectedSku.value,
  (sku) => {
    if (sku?.picUrl) {
      mainImage.value = sku.picUrl
    }
  }
)
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

    .spec-section {
      margin-bottom: 20px;

      .spec-group {
        margin-bottom: 12px;

        .spec-name {
          font-weight: 600;
          margin-bottom: 6px;
        }

        .spec-values {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .spec-tag {
          cursor: pointer;
        }
      }

      .spec-selected {
        color: #666;
        font-size: 13px;
      }
    }

    .stock-row {
      margin-bottom: 16px;
      color: #666;
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

