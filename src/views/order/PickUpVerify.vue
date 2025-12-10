<template>
  <div class="pickup-verify-page">
    <div class="container">
      <h2 class="page-title">自提核销</h2>
      <el-card>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
          style="max-width: 600px;"
        >
          <el-form-item label="订单号" prop="orderNo">
            <el-input
              v-model="form.orderNo"
              placeholder="请输入订单号"
              clearable
            />
          </el-form-item>
          <el-form-item label="核销码" prop="verifyCode">
            <el-input
              v-model="form.verifyCode"
              placeholder="请输入核销码"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleVerify" :loading="verifying">
              核销
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>

        <el-divider>或</el-divider>

        <div class="scan-section">
          <el-button type="primary" @click="handleScan">
            <el-icon><Camera /></el-icon>
            扫码核销
          </el-button>
        </div>
      </el-card>

      <!-- 核销记录 -->
      <el-card style="margin-top: 20px;">
        <template #header>
          <span>核销记录</span>
        </template>
        <el-table :data="verifyList" border v-loading="loading">
          <el-table-column prop="orderNo" label="订单号" width="180" />
          <el-table-column prop="storeName" label="门店" width="150" />
          <el-table-column prop="verifyTime" label="核销时间" width="180" />
          <el-table-column prop="verifyUser" label="核销人" width="120" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'">
                {{ row.status === 1 ? '已核销' : '待核销' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { verifyPickUpOrder, getPickUpVerifyList } from '@/api/order'
import { Camera } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const formRef = ref()
const verifying = ref(false)
const loading = ref(false)
const verifyList = ref([])

const form = reactive({
  orderNo: '',
  verifyCode: ''
})

const rules = {
  orderNo: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
  verifyCode: [{ required: true, message: '请输入核销码', trigger: 'blur' }]
}

const handleVerify = async () => {
  await formRef.value.validate()
  verifying.value = true
  try {
    const res = await verifyPickUpOrder({
      orderNo: form.orderNo,
      verifyCode: form.verifyCode
    })
    if (res.code === 0) {
      ElMessage.success('核销成功')
      handleReset()
      fetchVerifyList()
    }
  } catch (error) {
    console.error('核销失败', error)
  } finally {
    verifying.value = false
  }
}

const handleReset = () => {
  form.orderNo = ''
  form.verifyCode = ''
  formRef.value?.resetFields()
}

const handleScan = () => {
  ElMessage.info('扫码功能需要调用设备摄像头，请在移动端使用')
  // 这里可以集成二维码扫描功能
}

const fetchVerifyList = async () => {
  loading.value = true
  try {
    const res = await getPickUpVerifyList()
    if (res.code === 0) {
      verifyList.value = res.data || []
    }
  } catch (error) {
    console.error('获取核销记录失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchVerifyList()
})
</script>

<style scoped lang="scss">
.pickup-verify-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .scan-section {
    text-align: center;
    padding: 20px 0;
  }
}
</style>

