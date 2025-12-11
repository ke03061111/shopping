<template>
  <div class="commission-withdraw-page">
    <h2>申请提现</h2>
    <el-card>
      <div class="withdraw-content">
        <div class="balance-info">
          <div class="balance-item">
            <div class="label">可提现佣金</div>
            <div class="amount">¥{{ (availableBalance / 100).toFixed(2) }}</div>
          </div>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
          style="max-width: 600px; margin-top: 30px;"
        >
          <el-form-item label="提现金额" prop="price">
            <el-input-number
              v-model="form.price"
              :min="1"
              :max="availableBalance / 100"
              :precision="2"
              :step="10"
              placeholder="请输入提现金额"
              style="width: 200px;"
            />
            <span class="unit">元</span>
            <el-button type="text" @click="form.price = availableBalance / 100">全部提现</el-button>
          </el-form-item>
          <el-form-item label="提现方式" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio :label="1">银行卡</el-radio>
              <el-radio :label="2">支付宝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.type === 1" label="开户银行" prop="bankName">
            <el-select v-model="form.bankName" placeholder="请选择银行" style="width: 100%">
              <el-option
                v-for="bank in bankList"
                :key="bank.value"
                :label="bank.label"
                :value="bank.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.type === 1" label="银行卡号" prop="bankAccountNo">
            <el-input v-model="form.bankAccountNo" placeholder="请输入银行卡号" />
          </el-form-item>
          <el-form-item v-if="form.type === 1" label="开户姓名" prop="accountName">
            <el-input v-model="form.accountName" placeholder="请输入开户姓名" />
          </el-form-item>
          <el-form-item v-if="form.type === 2" label="支付宝账号" prop="alipayAccount">
            <el-input v-model="form.alipayAccount" placeholder="请输入支付宝账号" />
          </el-form-item>
          <el-form-item v-if="form.type === 2" label="真实姓名" prop="accountName">
            <el-input v-model="form.accountName" placeholder="请输入真实姓名" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit" :loading="submitting">提交申请</el-button>
            <el-button @click="$router.push('/commission')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBrokerageUser, createBrokerageWithdraw } from '@/api/brokerage'
import { getDictDataListByType } from '@/api/system'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()
const submitting = ref(false)
const availableBalance = ref(0)
const bankList = ref([])

const form = reactive({
  price: null,
  type: 1,
  bankName: '',
  bankAccountNo: '',
  accountName: '',
  alipayAccount: ''
})

const rules = computed(() => {
  const baseRules = {
    price: [
      { required: true, message: '请输入提现金额', trigger: 'blur' },
      { type: 'number', min: 1, message: '提现金额必须大于0', trigger: 'blur' }
    ],
    type: [{ required: true, message: '请选择提现方式', trigger: 'change' }],
    accountName: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
  }

  if (form.type === 1) {
    baseRules.bankName = [{ required: true, message: '请选择银行', trigger: 'change' }]
    baseRules.bankAccountNo = [
      { required: true, message: '请输入银行卡号', trigger: 'blur' },
      { pattern: /^\d{16,19}$/, message: '请输入正确的银行卡号', trigger: 'blur' }
    ]
  } else if (form.type === 2) {
    baseRules.alipayAccount = [
      { required: true, message: '请输入支付宝账号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$|^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: '请输入正确的手机号或邮箱', trigger: 'blur' }
    ]
  }

  return baseRules
})

const fetchUserInfo = async () => {
  try {
    const res = await getBrokerageUser()
    if (res.code === 0) {
      availableBalance.value = res.data?.settlementPrice || 0
    }
  } catch (error) {
    console.error('获取分销用户信息失败', error)
  }
}

const fetchBankList = async () => {
  try {
    const res = await getDictDataListByType('brokerage_bank_name')
    if (res.code === 0) {
      bankList.value = (res.data || []).map(item => ({
        label: item.label || item.name,
        value: item.value || item.code
      }))
    }
  } catch (error) {
    console.error('获取银行列表失败', error)
  }
}

const handleSubmit = async () => {
  await formRef.value.validate()
  if (form.price * 100 > availableBalance.value) {
    ElMessage.warning('提现金额不能超过可提现佣金')
    return
  }
  submitting.value = true
  try {
    const data = {
      price: Math.round(form.price * 100),
      type: form.type,
      accountName: form.accountName
    }
    if (form.type === 1) {
      data.bankName = form.bankName
      data.bankAccountNo = form.bankAccountNo
    } else {
      data.alipayAccount = form.alipayAccount
    }
    const res = await createBrokerageWithdraw(data)
    if (res.code === 0) {
      ElMessage.success('申请成功')
      router.push('/commission')
    }
  } catch (error) {
    console.error('申请提现失败', error)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchUserInfo()
  fetchBankList()
})
</script>

<style scoped lang="scss">
.commission-withdraw-page {
  h2 {
    margin-bottom: 20px;
  }

  .withdraw-content {
    .balance-info {
      text-align: center;
      padding: 30px 0;
      border-bottom: 1px solid #f0f0f0;

      .balance-item {
        .label {
          font-size: 16px;
          color: #666;
          margin-bottom: 10px;
        }

        .amount {
          font-size: 32px;
          font-weight: bold;
          color: #ff6b35;
        }
      }
    }

    .unit {
      margin-left: 10px;
      font-size: 16px;
    }
  }
}
</style>

