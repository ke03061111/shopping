<template>
  <div class="user-address-page">
    <div class="page-header">
      <h2>收货地址</h2>
      <el-button type="primary" @click="handleAdd">新增地址</el-button>
    </div>
    <el-card>
      <el-table :data="addressList" border v-loading="loading">
        <el-table-column prop="name" label="收货人" width="120" />
        <el-table-column prop="mobile" label="手机号" width="150" />
        <el-table-column label="收货地址" min-width="300">
          <template #default="{ row }">
            {{ row.areaName }} {{ row.detailAddress }}
          </template>
        </el-table-column>
        <el-table-column label="默认地址" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.defaultStatus" type="success">默认</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 地址编辑对话框 -->
    <el-dialog
      v-model="showDialog"
      :title="isEdit ? '编辑地址' : '新增地址'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="收货人" prop="name">
          <el-input v-model="form.name" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="所在地区" prop="areaId">
          <el-cascader
            v-model="form.areaId"
            :options="areaOptions"
            :props="areaProps"
            placeholder="请选择所在地区"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input
            v-model="form.detailAddress"
            type="textarea"
            :rows="3"
            placeholder="请输入详细地址"
          />
        </el-form-item>
        <el-form-item label="默认地址">
          <el-switch v-model="form.defaultStatus" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getAddressList, getAddress, createAddress, updateAddress, deleteAddress, getAreaTree } from '@/api/address'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const addressList = ref([])
const showDialog = ref(false)
const isEdit = ref(false)
const formRef = ref()
const areaOptions = ref([])
const areaProps = {
  value: 'id',
  label: 'name',
  children: 'children'
}

const form = reactive({
  id: null,
  name: '',
  mobile: '',
  areaId: [],
  detailAddress: '',
  defaultStatus: false
})

const rules = {
  name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5\w]{2,16}$/, message: '姓名格式不正确', trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  areaId: [{ required: true, message: '请选择所在地区', trigger: 'change' }],
  detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

const fetchAddresses = async () => {
  loading.value = true
  try {
    const res = await getAddressList()
    if (res.code === 0) {
      addressList.value = res.data || []
    }
  } catch (error) {
    console.error('获取地址列表失败', error)
  } finally {
    loading.value = false
  }
}

const fetchAreaTree = async () => {
  try {
    const res = await getAreaTree()
    if (res.code === 0) {
      areaOptions.value = res.data || []
    }
  } catch (error) {
    console.error('获取地区数据失败', error)
  }
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: null,
    name: '',
    mobile: '',
    areaId: [],
    detailAddress: '',
    defaultStatus: false
  })
  showDialog.value = true
}

const handleEdit = async (row) => {
  isEdit.value = true
  try {
    const res = await getAddress(row.id)
    if (res.code === 0) {
      const data = res.data
      Object.assign(form, {
        id: data.id,
        name: data.name,
        mobile: data.mobile,
        areaId: data.areaId ? [data.areaId] : [],
        detailAddress: data.detailAddress,
        defaultStatus: data.defaultStatus || false
      })
      showDialog.value = true
    }
  } catch (error) {
    console.error('获取地址详情失败', error)
  }
}

const handleSubmit = async () => {
  await formRef.value.validate()
  try {
    const data = {
      name: form.name,
      mobile: form.mobile,
      areaId: form.areaId[form.areaId.length - 1],
      detailAddress: form.detailAddress,
      defaultStatus: form.defaultStatus ? 1 : 0
    }
    if (isEdit.value) {
      data.id = form.id
      await updateAddress(data)
    } else {
      await createAddress(data)
    }
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    showDialog.value = false
    await fetchAddresses()
  } catch (error) {
    console.error('保存地址失败', error)
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个地址吗？', '提示', {
      type: 'warning'
    })
    await deleteAddress(id)
    ElMessage.success('删除成功')
    await fetchAddresses()
  } catch (error) {
    // 用户取消
  }
}

onMounted(() => {
  fetchAddresses()
  fetchAreaTree()
})
</script>

<style scoped lang="scss">
.user-address-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
    }
  }
}
</style>
