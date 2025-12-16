<template>
  <div class="coupon-list-page">
    <div class="container">
      <h2 class="page-title">领券中心</h2>
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="可领取" name="available">
          <el-row :gutter="20" v-loading="loading">
            <el-col
              v-for="item in couponList"
              :key="item.id"
              :xs="12"
              :sm="8"
              :md="6"
              :lg="6"
            >
              <el-card class="coupon-card">
                <div class="coupon-content">
                  <div class="coupon-left">
                    <div class="coupon-amount">
                      <span class="currency">¥</span>
                      <span class="amount">{{ (item.discountPrice / 100).toFixed(0) }}</span>
                    </div>
                    <div class="coupon-desc">{{ item.name }}</div>
                  </div>
                  <div class="coupon-right">
                    <div class="coupon-info">
                      <div class="coupon-title">{{ item.name }}</div>
                      <div class="coupon-time">
                        {{ item.validStartTime }} 至 {{ item.validEndTime }}
                      </div>
                    </div>
                    <el-button
                      type="primary"
                      :disabled="item.takeCount >= item.totalCount"
                      @click="handleTake(item.id)"
                    >
                      {{ item.takeCount >= item.totalCount ? '已领完' : '立即领取' }}
                    </el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="我的优惠券" name="my">
          <el-table :data="myCouponList" border v-loading="loading">
            <el-table-column prop="name" label="优惠券名称" />
            <el-table-column label="面额" width="120">
              <template #default="{ row }">
                ¥{{ (row.discountPrice / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="validStartTime" label="有效期开始" width="180" />
            <el-table-column prop="validEndTime" label="有效期结束" width="180" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:current-page="myPageNo"
            v-model:page-size="myPageSize"
            :total="myTotal"
            layout="total, prev, pager, next"
            @current-change="handleMyPageChange"
            style="margin-top: 20px; justify-content: center;"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCouponTemplatePage, takeCoupon, getCouponPage } from '@/api/coupon'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const activeTab = ref('available')
const couponList = ref([])
const myCouponList = ref([])
const pageNo = ref(1)
const pageSize = ref(12)
const total = ref(0)
const myPageNo = ref(1)
const myPageSize = ref(10)
const myTotal = ref(0)

const fetchCoupons = async () => {
  loading.value = true
  try {
    const res = await getCouponTemplatePage({
      pageNo: pageNo.value,
      pageSize: pageSize.value
    })
    if (res.code === 0) {
      couponList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取优惠券失败', error)
  } finally {
    loading.value = false
  }
}

const fetchMyCoupons = async () => {
  loading.value = true
  try {
    const res = await getCouponPage({
      pageNo: myPageNo.value,
      pageSize: myPageSize.value
    })
    if (res.code === 0) {
      myCouponList.value = res.data.list || []
      myTotal.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取我的优惠券失败', error)
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tab) => {
  if (tab === 'available') {
    fetchCoupons()
  } else if (tab === 'my') {
    fetchMyCoupons()
  }
}

const handleTake = async (templateId) => {
  try {
    const res = await takeCoupon(templateId)
    if (res.code === 0) {
      ElMessage.success('领取成功')
      await fetchCoupons()
    }
  } catch (error) {
    console.error('领取优惠券失败', error)
  }
}

const getStatusText = (status) => {
  const statusMap = {
    1: '未使用',
    2: '已使用',
    3: '已过期'
  }
  return statusMap[status] || '未知'
}

const getStatusType = (status) => {
  const typeMap = {
    1: 'success',
    2: 'info',
    3: 'danger'
  }
  return typeMap[status] || 'info'
}

const handleMyPageChange = () => {
  fetchMyCoupons()
}

onMounted(() => {
  fetchCoupons()
})
</script>

<style scoped lang="scss">
.coupon-list-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .page-title {
    margin-bottom: 20px;
  }

  .coupon-card {
    .coupon-content {
      display: flex;
      height: 120px;

      .coupon-left {
        width: 120px;
        background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 4px 0 0 4px;

        .coupon-amount {
          display: flex;
          align-items: baseline;
          margin-bottom: 10px;

          .currency {
            font-size: 18px;
          }

          .amount {
            font-size: 32px;
            font-weight: bold;
          }
        }

        .coupon-desc {
          font-size: 12px;
        }
      }

      .coupon-right {
        flex: 1;
        padding: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .coupon-info {
          .coupon-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
          }

          .coupon-time {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
}
</style>
