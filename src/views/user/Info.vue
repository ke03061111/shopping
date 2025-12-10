<template>
  <div class="user-info-page">
    <h2>个人信息</h2>
    <el-card v-loading="loading">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        style="max-width: 600px"
      >
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.avatar" :src="form.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio :label="0">未知</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.mobile" disabled />
          <el-button type="text" @click="showMobileDialog = true">修改手机号</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="400px">
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="80px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="handlePasswordSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 修改手机号对话框 -->
    <el-dialog v-model="showMobileDialog" title="修改手机号" width="400px">
      <el-form ref="mobileFormRef" :model="mobileForm" :rules="mobileRules" label-width="100px">
        <el-form-item label="新手机号" prop="mobile">
          <el-input v-model="mobileForm.mobile" />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div class="code-input">
            <el-input v-model="mobileForm.code" />
            <el-button
              :disabled="codeCountdown > 0"
              @click="handleSendCode"
            >
              {{ codeCountdown > 0 ? `${codeCountdown}秒后重试` : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showMobileDialog = false">取消</el-button>
        <el-button type="primary" @click="handleMobileSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getUserInfo, updateUser, updateUserMobile, updateUserPassword } from '@/api/user'
import { sendSmsCode } from '@/api/auth'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const userStore = useUserStore()
const loading = ref(false)
const formRef = ref()
const passwordFormRef = ref()
const mobileFormRef = ref()
const showPasswordDialog = ref(false)
const showMobileDialog = ref(false)
const codeCountdown = ref(0)

const form = reactive({
  avatar: '',
  nickname: '',
  gender: 0,
  mobile: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const mobileForm = reactive({
  mobile: '',
  code: ''
})

const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const mobileRules = {
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位验证码', trigger: 'blur' }
  ]
}

const uploadUrl = '/api/infra/file/upload'

const fetchUserInfo = async () => {
  loading.value = true
  try {
    const res = await getUserInfo()
    if (res.code === 0) {
      Object.assign(form, {
        avatar: res.data.avatar || '',
        nickname: res.data.nickname || '',
        gender: res.data.gender || 0,
        mobile: res.data.mobile || ''
      })
    }
  } catch (error) {
    console.error('获取用户信息失败', error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  await formRef.value.validate()
  loading.value = true
  try {
    const res = await updateUser({
      avatar: form.avatar,
      nickname: form.nickname,
      gender: form.gender
    })
    if (res.code === 0) {
      ElMessage.success('保存成功')
      await userStore.fetchUserInfo()
    }
  } catch (error) {
    console.error('保存失败', error)
  } finally {
    loading.value = false
  }
}

const handleAvatarSuccess = (response) => {
  if (response.code === 0) {
    form.avatar = response.data.url
    ElMessage.success('上传成功')
  }
}

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

const handlePasswordSubmit = async () => {
  await passwordFormRef.value.validate()
  try {
    const res = await updateUserPassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    if (res.code === 0) {
      ElMessage.success('修改成功')
      showPasswordDialog.value = false
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    }
  } catch (error) {
    console.error('修改密码失败', error)
  }
}

const handleSendCode = async () => {
  if (!mobileForm.mobile) {
    ElMessage.warning('请先输入手机号')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(mobileForm.mobile)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  try {
    await sendSmsCode(mobileForm.mobile, 2)
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

const handleMobileSubmit = async () => {
  await mobileFormRef.value.validate()
  try {
    const res = await updateUserMobile({
      mobile: mobileForm.mobile,
      code: mobileForm.code
    })
    if (res.code === 0) {
      ElMessage.success('修改成功')
      showMobileDialog.value = false
      await fetchUserInfo()
      await userStore.fetchUserInfo()
    }
  } catch (error) {
    console.error('修改手机号失败', error)
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped lang="scss">
.user-info-page {
  h2 {
    margin-bottom: 20px;
  }

  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }

    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }

  .code-input {
    display: flex;
    gap: 10px;

    .el-input {
      flex: 1;
    }
  }
}
</style>
