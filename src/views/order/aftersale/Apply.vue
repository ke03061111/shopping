<template>
  <div class="aftersale-apply-page">
    <div class="container">
      <h2 class="page-title">申请售后</h2>
      <el-card v-loading="loading">
        <div v-if="orderInfo" class="apply-content">
          <div class="order-info-section">
            <h3>订单信息</h3>
            <div class="order-goods">
              <div v-for="item in orderInfo.items" :key="item.id" class="goods-item">
                <img :src="item.spuPicUrl" class="goods-image" />
                <div class="goods-info">
                  <div class="goods-name">{{ item.spuName }}</div>
                  <div class="goods-sku">{{ item.skuProperties }}</div>
                </div>
                <el-checkbox
                  v-model="selectedItems"
                  :label="item.id"
                  @change="handleItemSelect"
                >
                  选择
                </el-checkbox>
              </div>
            </div>
          </div>

          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
            style="max-width: 600px; margin-top: 30px;"
          >
            <el-form-item label="售后类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio :label="10">退货退款</el-radio>
                <el-radio :label="20">换货</el-radio>
                <el-radio :label="30">仅退款</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="申请原因" prop="reason">
              <el-select v-model="form.reason" placeholder="请选择申请原因" style="width: 100%">
                <el-option label="质量问题" value="质量问题" />
                <el-option label="与描述不符" value="与描述不符" />
                <el-option label="不喜欢/不想要" value="不喜欢/不想要" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
            <el-form-item label="问题描述" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="4"
                placeholder="请详细描述问题"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit">提交申请</el-button>
              <el-button @click="$router.back()">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail } from '@/api/order'
import { createAfterSale } from '@/api/afterSale'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const orderInfo = ref(null)
const formRef = ref()
const selectedItems = ref([])

const form = reactive({
  orderId: '',
  orderItemId: null,
  type: 10,
  reason: '',
  description: ''
})

const rules = {
  type: [{ required: true, message: '请选择售后类型', trigger: 'change' }],
  reason: [{ required: true, message: '请选择申请原因', trigger: 'change' }],
  description: [{ required: true, message: '请输入问题描述', trigger: 'blur' }]
}

const fetchOrderDetail = async () => {
  loading.value = true
  try {
    const res = await getOrderDetail(route.query.orderId)
    if (res.code === 0) {
      orderInfo.value = res.data
      form.orderId = res.data.id
    }
  } catch (error) {
    console.error('获取订单详情失败', error)
  } finally {
    loading.value = false
  }
}

const handleItemSelect = () => {
  if (selectedItems.value.length > 0) {
    form.orderItemId = selectedItems.value[0]
  }
}

const handleSubmit = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要申请售后的商品')
    return
  }
  await formRef.value.validate()
  try {
    const res = await createAfterSale({
      orderId: form.orderId,
      orderItemId: form.orderItemId,
      type: form.type,
      reason: form.reason,
      description: form.description
    })
    if (res.code === 0) {
      ElMessage.success('申请成功')
      router.push('/order/aftersale/list')
    }
  } catch (error) {
    console.error('申请售后失败', error)
  }
}

onMounted(() => {
  if (route.query.orderId) {
    fetchOrderDetail()
  }
})
</script>

<style scoped lang="scss">
.aftersale-apply-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .order-info-section {
    h3 {
      font-size: 18px;
      margin-bottom: 15px;
    }

    .order-goods {
      .goods-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        margin-bottom: 10px;

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
      }
    }
  }
}
</style>

