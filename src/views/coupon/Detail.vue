<template>
  <div class="coupon-detail-page">
    <div class="container">
      <el-card v-loading="loading">
        <div v-if="couponInfo" class="coupon-content">
          <div class="coupon-header">
            <div class="coupon-amount">
              <span class="currency">¥</span>
              <span class="amount">{{ (couponInfo.discountPrice / 100).toFixed(0) }}</span>
            </div>
            <div class="coupon-info">
              <h2>{{ couponInfo.name }}</h2>
              <p class="coupon-desc">{{ couponInfo.description }}</p>
            </div>
          </div>

          <el-divider />

          <div class="coupon-details">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="优惠类型">
                {{ getDiscountTypeText(couponInfo.discountType) }}
              </el-descriptions-item>
              <el-descriptions-item label="使用门槛">
                {{ couponInfo.usePrice > 0 ? `满¥${(couponInfo.usePrice / 100).toFixed(2)}可用` : '无门槛' }}
              </el-descriptions-item>
              <el-descriptions-item label="有效期">
                {{ couponInfo.validStartTime }} 至 {{ couponInfo.validEndTime }}
              </el-descriptions-item>
              <el-descriptions-item label="适用范围">
                {{ getProductScopeText(couponInfo.productScope) }}
              </el-descriptions-item>
              <el-descriptions-item label="使用状态">
                <el-tag :type="getStatusType(couponInfo.status)">
                  {{ getStatusText(couponInfo.status) }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <div v-if="couponInfo.productSpuIds && couponInfo.productSpuIds.length > 0" class="coupon-products">
            <h3>适用商品</h3>
            <el-row :gutter="20">
              <el-col
                v-for="spu in productList"
                :key="spu.id"
                :xs="12"
                :sm="8"
                :md="6"
                :lg="6"
              >
                <div class="product-item" @click="$router.push(`/goods/detail/${spu.id}`)">
                  <img :src="spu.picUrl" class="product-image" />
                  <div class="product-name">{{ spu.name }}</div>
                </div>
              </el-col>
            </el-row>
          </div>

          <div class="coupon-actions">
            <el-button v-if="couponInfo.status === 0" type="primary" size="large" @click="handleUse">
              立即使用
            </el-button>
            <el-button @click="$router.push('/coupon')">返回列表</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCoupon, getCouponTemplate } from '@/api/coupon'
import { getSpuListByIds } from '@/api/product'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const couponInfo = ref(null)
const productList = ref([])

const getDiscountTypeText = (type) => {
  const typeMap = {
    1: '满减券',
    2: '折扣券',
    3: '随机金额券'
  }
  return typeMap[type] || '未知'
}

const getProductScopeText = (scope) => {
  const scopeMap = {
    1: '全部商品',
    2: '指定商品',
    3: '指定分类'
  }
  return scopeMap[scope] || '未知'
}

const getStatusText = (status) => {
  const statusMap = {
    0: '未使用',
    1: '已使用',
    2: '已过期'
  }
  return statusMap[status] || '未知'
}

const getStatusType = (status) => {
  const typeMap = {
    0: 'success',
    1: 'info',
    2: 'danger'
  }
  return typeMap[status] || 'info'
}

const fetchDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id || route.query.id
    const isTemplate = route.query.type === 'template'
    
    let res
    if (isTemplate) {
      res = await getCouponTemplate(id)
    } else {
      res = await getCoupon(id)
    }
    
    if (res.code === 0) {
      couponInfo.value = res.data
      
      // 获取适用商品列表
      if (couponInfo.value.productSpuIds && couponInfo.value.productSpuIds.length > 0) {
        const spuRes = await getSpuListByIds(couponInfo.value.productSpuIds.join(','))
        if (spuRes.code === 0) {
          productList.value = spuRes.data || []
        }
      }
    }
  } catch (error) {
    console.error('获取优惠券详情失败', error)
  } finally {
    loading.value = false
  }
}

const handleUse = () => {
  router.push('/goods/list')
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped lang="scss">
.coupon-detail-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .coupon-content {
    .coupon-header {
      display: flex;
      gap: 30px;
      align-items: center;

      .coupon-amount {
        display: flex;
        align-items: baseline;
        color: #ff6b35;

        .currency {
          font-size: 24px;
          font-weight: bold;
        }

        .amount {
          font-size: 48px;
          font-weight: bold;
        }
      }

      .coupon-info {
        flex: 1;

        h2 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }

        .coupon-desc {
          color: #666;
          font-size: 14px;
          margin: 0;
        }
      }
    }

    .coupon-details {
      margin: 30px 0;
    }

    .coupon-products {
      margin: 30px 0;

      h3 {
        font-size: 18px;
        margin-bottom: 15px;
      }

      .product-item {
        cursor: pointer;
        text-align: center;
        padding: 10px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        transition: all 0.3s;

        &:hover {
          border-color: #ff6b35;
          transform: translateY(-5px);
        }

        .product-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .product-name {
          font-size: 14px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .coupon-actions {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #f0f0f0;
    }
  }
}
</style>

