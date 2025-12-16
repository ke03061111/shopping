<template>
  <div class="return-delivery-page">
    <div class="container">
      <h2 class="page-title">退货物流</h2>
      <el-card>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
          style="max-width: 600px;"
        >
          <el-form-item label="快递公司" prop="logisticsId">
            <el-select
              v-model="form.logisticsId"
              placeholder="请选择快递公司"
              style="width: 100%"
              @change="handleExpressChange"
            >
              <el-option
                v-for="item in expressList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="物流单号" prop="logisticsNo">
            <el-input
              v-model="form.logisticsNo"
              placeholder="请输入物流单号"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
            <el-button @click="$router.back()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDeliveryExpressList, deliveryAfterSale } from '@/api/afterSale'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const expressList = ref([])

const form = reactive({
  id: '',
  logisticsId: null,
  logisticsNo: ''
})

const rules = {
  logisticsId: [{ required: true, message: '请选择快递公司', trigger: 'change' }],
  logisticsNo: [{ required: true, message: '请输入物流单号', trigger: 'blur' }]
}

const fetchExpressList = async () => {
  try {
    const res = await getDeliveryExpressList()
    if (res.code === 0) {
      expressList.value = res.data || []
    }
  } catch (error) {
    console.error('获取快递公司列表失败', error)
  }
}

const handleExpressChange = (id) => {
  form.logisticsId = id
}

const handleSubmit = async () => {
  await formRef.value.validate()
  try {
    const res = await deliveryAfterSale({
      id: route.params.id,
      logisticsId: form.logisticsId,
      logisticsNo: form.logisticsNo
    })
    if (res.code === 0) {
      ElMessage.success('提交成功')
      router.push('/order/aftersale/list')
    }
  } catch (error) {
    console.error('提交物流信息失败', error)
  }
}

onMounted(() => {
  if (route.params.id) {
    form.id = route.params.id
  }
  fetchExpressList()
})
</script>

<style scoped lang="scss">
.return-delivery-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);
}
</style>

