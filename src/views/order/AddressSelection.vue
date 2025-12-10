<template>
  <div class="address-selection-page">
    <div class="container">
      <h2 class="page-title">选择收货地址</h2>
      <el-card>
        <div class="address-list" v-loading="loading">
          <div
            v-for="item in addressList"
            :key="item.id"
            class="address-item"
            :class="{ active: selectedAddressId === item.id }"
            @click="handleSelect(item)"
          >
            <div class="address-content">
              <div class="address-header">
                <span class="name">{{ item.name }}</span>
                <span class="phone">{{ item.mobile }}</span>
                <el-tag v-if="item.defaultStatus" type="success" size="small">默认</el-tag>
              </div>
              <div class="address-detail">
                {{ item.areaName }} {{ item.detailAddress }}
              </div>
            </div>
            <div class="address-actions">
              <el-button type="text" @click.stop="handleEdit(item)">编辑</el-button>
            </div>
          </div>
          <el-empty v-if="addressList.length === 0" description="暂无收货地址" />
        </div>
        <div class="page-actions">
          <el-button type="primary" @click="handleAdd">新增地址</el-button>
          <el-button @click="handleConfirm" :disabled="!selectedAddressId">确定</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAddressList } from '@/api/address'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const addressList = ref([])
const selectedAddressId = ref(null)

const fetchAddresses = async () => {
  loading.value = true
  try {
    const res = await getAddressList()
    if (res.code === 0) {
      addressList.value = res.data || []
      const defaultAddr = addressList.value.find(item => item.defaultStatus)
      if (defaultAddr) {
        selectedAddressId.value = defaultAddr.id
      }
    }
  } catch (error) {
    console.error('获取地址列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleSelect = (address) => {
  selectedAddressId.value = address.id
}

const handleEdit = (address) => {
  router.push({
    path: '/user/address',
    query: { id: address.id, edit: true }
  })
}

const handleAdd = () => {
  router.push({
    path: '/user/address',
    query: { add: true }
  })
}

const handleConfirm = () => {
  const address = addressList.value.find(item => item.id === selectedAddressId.value)
  if (address) {
    // 通过路由参数或事件传递选中的地址
    const redirect = route.query.redirect || '/order/confirm'
    router.push({
      path: redirect,
      query: { addressId: address.id }
    })
  }
}

onMounted(() => {
  fetchAddresses()
})
</script>

<style scoped lang="scss">
.address-selection-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .address-list {
    margin-bottom: 20px;

    .address-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border: 2px solid #f0f0f0;
      border-radius: 8px;
      margin-bottom: 15px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #ff6b35;
      }

      &.active {
        border-color: #ff6b35;
        background: #fff5f5;
      }

      .address-content {
        flex: 1;

        .address-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;

          .name {
            font-size: 16px;
            font-weight: bold;
          }

          .phone {
            color: #666;
          }
        }

        .address-detail {
          color: #666;
          font-size: 14px;
        }
      }
    }
  }

  .page-actions {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
  }
}
</style>

