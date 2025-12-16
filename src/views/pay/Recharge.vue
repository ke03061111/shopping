<template>
  <div class="recharge-page">
    <div class="container">
      <h2 class="page-title">充值余额</h2>
      <el-card>
        <div class="recharge-content">
          <div class="wallet-info">
            <div class="balance">
              <span class="label">当前余额：</span>
              <span class="amount">¥{{ (walletInfo.balance / 100).toFixed(2) }}</span>
            </div>
          </div>

          <div class="package-list">
            <h3>选择充值套餐</h3>
            <el-radio-group v-model="selectedPackage" class="package-group">
              <el-radio
                v-for="item in packageList"
                :key="item.id"
                :label="item.id"
                class="package-item"
              >
                <div class="package-content">
                  <div class="package-amount">¥{{ (item.payPrice / 100).toFixed(2) }}</div>
                  <div v-if="item.bonusPrice > 0" class="package-bonus">
                    赠送 ¥{{ (item.bonusPrice / 100).toFixed(2) }}
                  </div>
                </div>
              </el-radio>
            </el-radio-group>
          </div>

          <div class="custom-amount">
            <h3>自定义金额</h3>
            <el-input-number
              v-model="customAmount"
              :min="1"
              :max="10000"
              :precision="2"
              :step="10"
              placeholder="请输入充值金额"
              style="width: 200px;"
            />
            <span class="unit">元</span>
          </div>

          <div class="recharge-actions">
            <el-button type="primary" size="large" @click="handleRecharge" :loading="recharging">
              立即充值
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getWalletRechargePackageList, createWalletRecharge } from '@/api/payment'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const recharging = ref(false)
const packageList = ref([])
const selectedPackage = ref(null)
const customAmount = ref(null)
const walletInfo = reactive({ balance: 0 })

const fetchPackages = async () => {
  loading.value = true
  try {
    const res = await getWalletRechargePackageList()
    if (res.code === 0) {
      packageList.value = res.data || []
      if (packageList.value.length > 0) {
        selectedPackage.value = packageList.value[0].id
      }
    }
  } catch (error) {
    console.error('获取充值套餐失败', error)
  } finally {
    loading.value = false
  }
}

const handleRecharge = async () => {
  let amount = 0
  if (selectedPackage.value) {
    const pkg = packageList.value.find(p => p.id === selectedPackage.value)
    if (pkg) {
      amount = pkg.payPrice
    }
  } else if (customAmount.value) {
    amount = customAmount.value * 100
  } else {
    ElMessage.warning('请选择充值套餐或输入充值金额')
    return
  }

  if (amount <= 0) {
    ElMessage.warning('充值金额必须大于0')
    return
  }

  recharging.value = true
  try {
    const res = await createWalletRecharge({
      packageId: selectedPackage.value,
      payPrice: amount
    })
    if (res.code === 0) {
      ElMessage.success('充值订单创建成功')
      router.push(`/pay?rechargeId=${res.data.id}`)
    }
  } catch (error) {
    console.error('创建充值订单失败', error)
  } finally {
    recharging.value = false
  }
}

onMounted(async () => {
  await userStore.fetchWallet()
  walletInfo.balance = userStore.wallet?.balance || 0
  fetchPackages()
})
</script>

<style scoped lang="scss">
.recharge-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .recharge-content {
    max-width: 800px;
    margin: 0 auto;

    .wallet-info {
      text-align: center;
      padding: 30px 0;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 30px;

      .balance {
        .label {
          font-size: 16px;
          color: #666;
        }

        .amount {
          font-size: 32px;
          font-weight: bold;
          color: #ff6b35;
          margin-left: 10px;
        }
      }
    }

    .package-list {
      margin-bottom: 30px;

      h3 {
        margin-bottom: 20px;
        font-size: 18px;
      }

      .package-group {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;

        .package-item {
          margin: 0;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.3s;

          &:hover {
            border-color: #ff6b35;
          }

          .package-content {
            text-align: center;

            .package-amount {
              font-size: 24px;
              font-weight: bold;
              color: #ff6b35;
              margin-bottom: 5px;
            }

            .package-bonus {
              font-size: 12px;
              color: #67c23a;
            }
          }
        }
      }
    }

    .custom-amount {
      margin-bottom: 30px;

      h3 {
        margin-bottom: 15px;
        font-size: 18px;
      }

      .unit {
        margin-left: 10px;
        font-size: 16px;
      }
    }

    .recharge-actions {
      text-align: center;
    }
  }
}
</style>

