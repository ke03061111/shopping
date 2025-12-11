<template>
  <div class="user-wallet-page">
    <h2>我的钱包</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="wallet-card">
          <div class="wallet-info">
            <div class="label">账户余额</div>
            <div class="amount">¥{{ (walletInfo.balance / 100).toFixed(2) }}</div>
            <div class="wallet-actions">
              <el-button type="primary" @click="$router.push('/pay/recharge')">充值</el-button>
              <el-button @click="$router.push('/user/recharge-log')">充值记录</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px;">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="余额明细" name="transaction">
          <el-table :data="transactionList" border v-loading="loading">
            <el-table-column prop="title" label="交易类型" width="150" />
            <el-table-column label="金额" width="120">
              <template #default="{ row }">
                <span :class="row.price > 0 ? 'income' : 'expense'">
                  {{ row.price > 0 ? '+' : '' }}¥{{ (Math.abs(row.price) / 100).toFixed(2) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="交易时间" width="180" />
            <el-table-column prop="title" label="备注" />
          </el-table>
          <el-pagination
            v-model:current-page="pageNo"
            v-model:page-size="pageSize"
            :total="total"
            layout="total, prev, pager, next"
            @current-change="handlePageChange"
            style="margin-top: 20px; justify-content: center;"
          />
        </el-tab-pane>
        <el-tab-pane label="充值记录" name="recharge">
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
          </el-table>
          <el-pagination
            v-model:current-page="rechargePageNo"
            v-model:page-size="rechargePageSize"
            :total="rechargeTotal"
            layout="total, prev, pager, next"
            @current-change="handleRechargePageChange"
            style="margin-top: 20px; justify-content: center;"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getWalletTransactionPage } from '@/api/user'
import { getWalletRechargePage as getRechargePage } from '@/api/payment'

const userStore = useUserStore()
const loading = ref(false)
const activeTab = ref('transaction')
const walletInfo = ref({ balance: 0 })
const transactionList = ref([])
const rechargeList = ref([])
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)
const rechargePageNo = ref(1)
const rechargePageSize = ref(10)
const rechargeTotal = ref(0)

const fetchWallet = async () => {
  await userStore.fetchWallet()
  walletInfo.value = userStore.wallet || { balance: 0 }
}

const fetchTransactions = async () => {
  loading.value = true
  try {
    const res = await getWalletTransactionPage({
      pageNo: pageNo.value,
      pageSize: pageSize.value
    })
    if (res.code === 0) {
      transactionList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取交易记录失败', error)
  } finally {
    loading.value = false
  }
}

const fetchRecharges = async () => {
  loading.value = true
  try {
    const res = await getRechargePage({
      pageNo: rechargePageNo.value,
      pageSize: rechargePageSize.value
    })
    if (res.code === 0) {
      rechargeList.value = res.data.list || []
      rechargeTotal.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取充值记录失败', error)
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tab) => {
  if (tab === 'transaction') {
    fetchTransactions()
  } else if (tab === 'recharge') {
    fetchRecharges()
  }
}

const handlePageChange = () => {
  fetchTransactions()
}

const handleRechargePageChange = () => {
  fetchRecharges()
}

onMounted(() => {
  fetchWallet()
  fetchTransactions()
})
</script>

<style scoped lang="scss">
.user-wallet-page {
  h2 {
    margin-bottom: 20px;
  }

  .wallet-card {
      .wallet-info {
        text-align: center;

        .label {
          font-size: 14px;
          color: #999;
          margin-bottom: 15px;
        }

        .amount {
          font-size: 32px;
          font-weight: bold;
          color: #ff6b35;
          margin-bottom: 20px;
        }

        .wallet-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
      }
  }

  .income {
    color: #67c23a;
  }

  .expense {
    color: #f56c6c;
  }
}
</style>
