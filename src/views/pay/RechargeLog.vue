<template>
  <div class="recharge-log-page">
    <h2>充值记录</h2>
    <el-card>
      <el-table :data="rechargeList" border v-loading="loading">
        <el-table-column prop="payPrice" label="充值金额" width="120">
          <template #default="{ row }">
            ¥{{ (row.payPrice / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.payStatus === 20 ? 'success' : 'info'">
              {{ row.payStatus === 20 ? '已支付' : '待支付' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="payTime" label="支付时间" width="180" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button
              v-if="row.payStatus !== 20"
              type="primary"
              link
              @click="handlePay(row.id)"
            >
              去支付
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
        style="margin-top: 20px; justify-content: center;"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getWalletRechargePage, getPayOrder } from '@/api/payment'

const router = useRouter()
const loading = ref(false)
const rechargeList = ref([])
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchRecharges = async () => {
  loading.value = true
  try {
    const res = await getWalletRechargePage({
      pageNo: pageNo.value,
      pageSize: pageSize.value
    })
    if (res.code === 0) {
      rechargeList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取充值记录失败', error)
  } finally {
    loading.value = false
  }
}

const handlePay = async (rechargeId) => {
  try {
    const res = await getPayOrder(undefined, undefined, undefined)
    if (res.code === 0 && res.data) {
      router.push(`/pay?rechargeId=${rechargeId}`)
    }
  } catch (error) {
    console.error('获取支付订单失败', error)
  }
}

const handlePageChange = () => {
  fetchRecharges()
}

onMounted(() => {
  fetchRecharges()
})
</script>

<style scoped lang="scss">
.recharge-log-page {
  h2 {
    margin-bottom: 20px;
  }
}
</style>

