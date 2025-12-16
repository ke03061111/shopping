<template>
  <div class="order-confirm-page">
    <div class="container">
      <h2 class="page-title">确认订单</h2>
      <div class="confirm-content">
        <!-- 收货地址 -->
        <div class="address-section">
          <h3>收货地址</h3>
          <div v-if="selectedAddress" class="address-item">
            <div class="address-info">
              <span class="name">{{ selectedAddress.name }}</span>
              <span class="phone">{{ selectedAddress.mobile }}</span>
            </div>
            <div class="address-detail">
              {{ selectedAddress.areaName }} {{ selectedAddress.detailAddress }}
            </div>
          </div>
          <el-button v-else @click="showAddressDialog = true">选择收货地址</el-button>
        </div>

        <!-- 商品信息 -->
        <div class="goods-section">
          <h3>商品信息</h3>
          <div v-for="item in orderItems" :key="item.id || item.skuId" class="goods-item">
            <img :src="item.picUrl" class="goods-image" />
            <div class="goods-info">
              <div class="goods-name">{{ item.name }}</div>
              <div class="goods-sku">{{ item.skuProperties }}</div>
            </div>
            <div class="goods-price">¥{{ (item.price / 100).toFixed(2) }}</div>
            <div class="goods-count">x{{ item.count }}</div>
          </div>
        </div>

        <!-- 优惠券选择 -->
        <div class="coupon-section" v-if="availableCoupons.length > 0">
          <h3>优惠券</h3>
          <el-select
            v-model="selectedCouponId"
            placeholder="请选择优惠券"
            style="width: 100%"
            @change="handleCouponChange"
          >
            <el-option label="不使用优惠券" :value="null" />
            <el-option
              v-for="item in availableCoupons"
              :key="item.id"
              :label="`${item.name} - 减¥${(item.discountPrice / 100).toFixed(2)}`"
              :value="item.id"
            />
          </el-select>
        </div>

        <!-- 订单信息 -->
        <div class="order-info">
          <div class="info-row">
            <span>商品金额：</span>
            <span>¥{{ (orderInfo.productPrice / 100).toFixed(2) }}</span>
          </div>
          <div class="info-row" v-if="orderInfo.couponPrice > 0">
            <span>优惠券：</span>
            <span class="discount">-¥{{ (orderInfo.couponPrice / 100).toFixed(2) }}</span>
          </div>
          <div class="info-row">
            <span>运费：</span>
            <span>¥{{ (orderInfo.deliveryPrice / 100).toFixed(2) }}</span>
          </div>
          <div class="info-row total">
            <span>合计：</span>
            <span class="price">¥{{ (orderInfo.payPrice / 100).toFixed(2) }}</span>
          </div>
        </div>

        <el-button type="primary" size="large" style="width: 100%; margin-top: 20px;" @click="handleSubmit">
          提交订单
        </el-button>
      </div>
    </div>

    <!-- 地址选择对话框 -->
    <el-dialog v-model="showAddressDialog" title="选择收货地址" width="600px">
      <div v-for="item in addressList" :key="item.id" class="address-option">
        <el-radio v-model="selectedAddressId" :label="item.id">
          <div class="address-content">
            <div class="address-info">
              <span class="name">{{ item.name }}</span>
              <span class="phone">{{ item.mobile }}</span>
            </div>
            <div class="address-detail">
              {{ item.areaName }} {{ item.detailAddress }}
            </div>
          </div>
        </el-radio>
      </div>
      <template #footer>
        <el-button @click="showAddressDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSelectAddress">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { getAddressList } from '@/api/address'
import { getCouponTemplateList } from '@/api/coupon'
import { settlementOrder, createOrder } from '@/api/order'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const addressList = ref([])
const selectedAddress = ref(null)
const selectedAddressId = ref(null)
const showAddressDialog = ref(false)
const orderItems = ref([])
const availableCoupons = ref([])
const selectedCouponId = ref(null)
const orderInfo = ref({
  productPrice: 0,
  deliveryPrice: 0,
  couponPrice: 0,
  payPrice: 0
})

const fetchAddresses = async () => {
  try {
    const res = await getAddressList()
    if (res.code === 0) {
      addressList.value = res.data || []
      const defaultAddr = addressList.value.find(item => item.defaultStatus)
      if (defaultAddr) {
        selectedAddress.value = defaultAddr
        selectedAddressId.value = defaultAddr.id
      }
    }
  } catch (error) {
    console.error('获取地址失败', error)
  }
}

const handleSelectAddress = () => {
  const addr = addressList.value.find(item => item.id === selectedAddressId.value)
  if (addr) {
    selectedAddress.value = addr
    showAddressDialog.value = false
    calculateOrder()
  }
}

const handleCouponChange = () => {
  calculateOrder()
}

const fetchAvailableCoupons = async () => {
  if (orderItems.value.length === 0) return
  try {
    const spuIds = orderItems.value.map(item => item.spuId).join(',')
    const res = await getCouponTemplateList(spuIds, 2, 20)
    if (res.code === 0) {
      availableCoupons.value = res.data || []
    }
  } catch (error) {
    console.error('获取可用优惠券失败', error)
  }
}

const calculateOrder = async () => {
  if (orderItems.value.length === 0) {
    ElMessage.warning('请先选择商品')
    return
  }
  try {
    const params = {
      items: orderItems.value.map(item => ({
        skuId: item.sku?.id || item.skuId,
        count: item.count,
        cartId: item.id
      }))
    }
    if (selectedAddress.value?.id) {
      params.addressId = selectedAddress.value.id
    }
    if (selectedCouponId.value) {
      params.couponId = selectedCouponId.value
    }
    const res = await settlementOrder(params)
    if (res.code === 0) {
      orderInfo.value = res.data || {
        productPrice: 0,
        deliveryPrice: 0,
        couponPrice: 0,
        payPrice: 0
      }
    }
  } catch (error) {
    console.error('计算订单失败', error)
  }
}

const handleSubmit = async () => {
  if (orderItems.value.length === 0) {
    ElMessage.warning('请选择要购买的商品')
    return
  }
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }
  try {
    const orderData = {
      addressId: selectedAddress.value.id,
      items: orderItems.value.map(item => ({
        skuId: item.sku?.id || item.skuId,
        count: item.count,
        cartId: item.id
      }))
    }
    if (selectedCouponId.value) {
      orderData.couponId = selectedCouponId.value
    }
    const res = await createOrder(orderData)
    if (res.code === 0) {
      ElMessage.success('订单创建成功')
      // 清空购物车已选商品
      await cartStore.removeCartItem(orderItems.value.map(item => item.id))
      router.push(`/pay?orderId=${res.data.id}`)
    }
  } catch (error) {
    console.error('创建订单失败', error)
  }
}

const initOrderItems = () => {
  // 从购物车获取选中的商品
  if (route.query.from === 'cart') {
    const selectedCartItems = cartStore.validList.filter(item => 
      cartStore.selectedIds.includes(item.id)
    )
    if (selectedCartItems.length > 0) {
      orderItems.value = selectedCartItems.map(item => ({
        id: item.id,
        spuId: item.spu?.id,
        skuId: item.sku?.id,
        sku: item.sku,
        name: item.spu?.name || item.goods?.name,
        picUrl: item.spu?.picUrl || item.goods?.image,
        price: item.sku?.price || 0,
        count: item.count,
        skuProperties: item.sku?.properties?.map(p => p.valueName).join(' ') || ''
      }))
    }
  } else if (route.query.skuId && route.query.count) {
    // 从商品详情页直接购买
    orderItems.value = [{
      id: null,
      skuId: Number(route.query.skuId),
      count: Number(route.query.count),
      name: route.query.name || '商品',
      picUrl: route.query.picUrl || '',
      price: Number(route.query.price) || 0,
      skuProperties: route.query.skuProperties || ''
    }]
  }
  
  if (orderItems.value.length > 0) {
    fetchAvailableCoupons()
    calculateOrder()
  } else {
    ElMessage.warning('请先选择要购买的商品')
    router.push('/cart')
  }
}

onMounted(() => {
  fetchAddresses()
  initOrderItems()
})
</script>

<style scoped lang="scss">
.order-confirm-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .confirm-content {
    background: #fff;
    border-radius: 8px;
    padding: 30px;

    .address-section,
    .goods-section,
    .coupon-section {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f0f0f0;

      h3 {
        font-size: 18px;
        margin-bottom: 15px;
      }

      .address-item {
        padding: 15px;
        background: #f9f9f9;
        border-radius: 4px;

        .address-info {
          margin-bottom: 8px;

          .name {
            font-weight: bold;
            margin-right: 15px;
          }
        }
      }
    }

    .goods-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px 0;

      .goods-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
      }

      .goods-info {
        flex: 1;

        .goods-name {
          font-size: 14px;
          margin-bottom: 5px;
        }

        .goods-sku {
          font-size: 12px;
          color: #999;
        }
      }

      .goods-price {
        color: #ff6b35;
        font-weight: bold;
      }

      .goods-count {
        color: #999;
      }
    }

    .coupon-section {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f0f0f0;

      h3 {
        font-size: 18px;
        margin-bottom: 15px;
      }
    }

    .order-info {
      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;

        .discount {
          color: #67c23a;
        }

        &.total {
          font-size: 18px;
          font-weight: bold;
          border-top: 1px solid #f0f0f0;
          margin-top: 10px;
          padding-top: 15px;

          .price {
            color: #ff6b35;
            font-size: 24px;
          }
        }
      }
    }
  }

  .address-option {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;

    .address-content {
      margin-left: 10px;

      .address-info {
        margin-bottom: 5px;

        .name {
          font-weight: bold;
          margin-right: 15px;
        }
      }
    }
  }
}
</style>

