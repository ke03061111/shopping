<template>
  <div class="goods-card" @click="handleClick">
    <div class="goods-image">
      <img 
        :src="imageUrl" 
        :alt="goods.name"
        @error="handleImageError"
        @load="imageLoaded = true"
      />
      <div v-if="!imageLoaded" class="image-placeholder">
        <el-icon :size="40"><Picture /></el-icon>
        <span>加载中...</span>
      </div>
      <div v-if="goods.activityTag" class="activity-tag">{{ goods.activityTag }}</div>
      <div v-if="goods.salesCount" class="sales-tag">已售{{ formatSalesCount(goods.salesCount) }}</div>
    </div>
    <div class="goods-info">
      <h3 class="goods-name" :title="goods.name">{{ goods.name }}</h3>
      <div v-if="goods.sellPoint" class="goods-desc" :title="goods.sellPoint">{{ goods.sellPoint }}</div>
      <div class="goods-footer">
        <div class="price-box">
          <span class="price">¥{{ formatPrice(goods.price) }}</span>
          <span v-if="goods.originalPrice && goods.originalPrice > goods.price" class="old-price">
            ¥{{ formatPrice(goods.originalPrice) }}
          </span>
        </div>
        <el-button 
          type="primary" 
          size="small" 
          @click.stop="handleBuyNow"
        >
          立即购买
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Picture } from '@element-plus/icons-vue'

const props = defineProps({
  goods: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const imageLoaded = ref(false)
const imageError = ref(false)

// 处理图片URL，支持多种字段名
const imageUrl = computed(() => {
  const url = props.goods.picUrl || props.goods.image || props.goods.pic || ''
  if (!url || imageError.value) {
    // 使用 data URI 作为默认占位图
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7lm77niYfliqDovb3lpLHotKU8L3RleHQ+PC9zdmc+'
  }
  return url
})

// 格式化价格
const formatPrice = (price) => {
  if (!price) return '0.00'
  return (price / 100).toFixed(2)
}

// 格式化销量
const formatSalesCount = (count) => {
  if (!count) return 0
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count
}

// 图片加载失败处理
const handleImageError = () => {
  imageError.value = true
  imageLoaded.value = false
}

const handleClick = () => {
  router.push(`/goods/detail/${props.goods.id}`)
}

const handleBuyNow = () => {
  // 列表页点击立即购买直接进入详情页
  handleClick()
}
</script>

<style scoped lang="scss">
.goods-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #ff6b35;

    .goods-image img {
      transform: scale(1.05);
    }
  }

  .goods-image {
    position: relative;
    width: 100%;
    height: 240px;
    overflow: hidden;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .image-placeholder {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #999;
      font-size: 12px;
    }

    .activity-tag {
      position: absolute;
      top: 10px;
      left: 10px;
      background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
      color: #fff;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      z-index: 2;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .sales-tag {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      backdrop-filter: blur(4px);
    }
  }

  .goods-info {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;

    .goods-name {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.4;
      color: #333;
      min-height: 42px;
    }

    .goods-desc {
      font-size: 12px;
      color: #999;
      margin-bottom: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      line-height: 1.4;
      flex-shrink: 0;
    }

    .goods-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid #f5f5f5;

      .price-box {
        display: flex;
        align-items: baseline;
        gap: 8px;

        .price {
          color: #ff6b35;
          font-size: 22px;
          font-weight: bold;
          line-height: 1;
        }

        .old-price {
          color: #999;
          font-size: 13px;
          text-decoration: line-through;
        }
      }

      .el-button {
        padding: 8px 16px;
        font-size: 13px;
        border-radius: 6px;
      }
    }
  }
}
</style>

