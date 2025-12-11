<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <h2 class="login-title">登录</h2>
        <el-tabs v-model="activeTab" class="login-tabs">
          <el-tab-pane label="验证码登录" name="sms">
            <el-form
              ref="smsFormRef"
              :model="smsForm"
              :rules="smsRules"
              label-width="0"
            >
              <el-form-item prop="mobile">
                <el-input
                  v-model="smsForm.mobile"
                  placeholder="请输入手机号"
                  :prefix-icon="User"
                />
              </el-form-item>
              <el-form-item prop="code">
                <div class="code-input">
                  <el-input
                    v-model="smsForm.code"
                    placeholder="请输入验证码"
                    :prefix-icon="Message"
                  />
                  <el-button
                    :disabled="codeCountdown > 0"
                    @click="handleSendCode"
                  >
                    {{ codeCountdown > 0 ? `${codeCountdown}秒后重试` : '发送验证码' }}
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  style="width: 100%"
                  :loading="loading"
                  @click="handleSmsLogin"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="密码登录" name="password">
            <el-form
              ref="passwordFormRef"
              :model="passwordForm"
              :rules="passwordRules"
              label-width="0"
            >
              <el-form-item prop="mobile">
                <el-input
                  v-model="passwordForm.mobile"
                  placeholder="请输入手机号"
                  :prefix-icon="User"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="passwordForm.password"
                  type="password"
                  placeholder="请输入密码"
                  :prefix-icon="Lock"
                  show-password
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  style="width: 100%"
                  :loading="loading"
                  @click="handlePasswordLogin"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div class="login-footer">
          <el-link type="primary" @click="$router.push('/home')">返回首页</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login, smsLogin, sendSmsCode } from '@/api/auth'
import { ElMessage } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeTab = ref('sms')
const loading = ref(false)
const codeCountdown = ref(0)

const passwordFormRef = ref()
const smsFormRef = ref()

const passwordForm = reactive({
  mobile: '',
  password: ''
})

const smsForm = reactive({
  mobile: '',
  code: ''
})

const passwordRules = {
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const smsRules = {
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{4}$/, message: '请输入4位验证码', trigger: 'blur' }
  ]
}

const handlePasswordLogin = async () => {
  await passwordFormRef.value.validate()
  loading.value = true
  try {
    const res = await login(passwordForm)
    if (res.code === 0) {
      ElMessage.success('登录成功')
      await userStore.updateUserData()
      const redirect = route.query.redirect || '/home'
      router.push(redirect)
    }
  } catch (error) {
    console.error('登录失败', error)
  } finally {
    loading.value = false
  }
}

const handleSmsLogin = async () => {
  await smsFormRef.value.validate()
  loading.value = true
  try {
    const res = await smsLogin({
      mobile: smsForm.mobile,
      code: smsForm.code
    })
    if (res.code === 0) {
      ElMessage.success('登录成功')
      await userStore.updateUserData()
      const redirect = route.query.redirect || '/home'
      router.push(redirect)
    }
  } catch (error) {
    console.error('登录失败', error)
  } finally {
    loading.value = false
  }
}

const handleSendCode = async () => {
  if (!smsForm.mobile) {
    ElMessage.warning('请先输入手机号')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(smsForm.mobile)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  try {
    await sendSmsCode(smsForm.mobile, 1)
    codeCountdown.value = 60
    const timer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error('发送验证码失败', error)
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-box {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

  .login-title {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 30px;
    color: #333;
  }

  .login-tabs {
    :deep(.el-tabs__item) {
      font-size: 16px;
    }
  }

  .code-input {
    display: flex;
    gap: 10px;

    .el-input {
      flex: 1;
    }
  }

  .login-footer {
    text-align: center;
    margin-top: 20px;
  }
}
</style>

