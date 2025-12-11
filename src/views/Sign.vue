<template>
  <div class="sign-page">
    <div class="container">
      <h2 class="page-title">签到中心</h2>
      <el-card>
        <div class="sign-content">
          <div class="sign-calendar">
            <div class="calendar-header">
              <div class="sign-info">
                <span>已连续签到 <strong>{{ signSummary.continuousDay || 0 }}</strong> 天</span>
                <span>累计签到 <strong>{{ signSummary.totalDay || 0 }}</strong> 天</span>
              </div>
            </div>
            <div class="calendar-days">
              <div
                v-for="(config, index) in signConfigList"
                :key="index"
                class="calendar-day"
                :class="{
                  'signed': signSummary.continuousDay >= config.day,
                  'today': index === todayIndex
                }"
              >
                <div class="day-number">第{{ config.day }}天</div>
                <div class="day-reward">+{{ config.point }}积分</div>
                <div v-if="signSummary.continuousDay >= config.day" class="day-status">✓</div>
              </div>
            </div>
            <div class="sign-button">
              <el-button
                type="primary"
                size="large"
                :disabled="signSummary.todaySignIn"
                @click="handleSign"
                :loading="signing"
              >
                {{ signSummary.todaySignIn ? '今日已签到' : '立即签到' }}
              </el-button>
            </div>
          </div>
          <div class="sign-rules">
            <h3>签到说明</h3>
            <ul>
              <li>每天签到可获得积分奖励</li>
              <li>连续签到可获得更多积分</li>
              <li>积分可用于兑换商品或抵扣现金</li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getSignInConfigList, getSignInRecordSummary, createSignInRecord } from '@/api/signin'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const signing = ref(false)
const signConfigList = ref([])
const signSummary = ref({
  continuousDay: 0,
  totalDay: 0,
  todaySignIn: false
})

const todayIndex = computed(() => {
  const today = new Date().getDate()
  return signConfigList.value.findIndex(config => config.day === today)
})

const fetchSignData = async () => {
  loading.value = true
  try {
    const [configRes, summaryRes] = await Promise.all([
      getSignInConfigList(),
      getSignInRecordSummary()
    ])
    if (configRes.code === 0) {
      signConfigList.value = configRes.data || []
    }
    if (summaryRes.code === 0) {
      signSummary.value = summaryRes.data || {}
    }
  } catch (error) {
    console.error('获取签到数据失败', error)
  } finally {
    loading.value = false
  }
}

const handleSign = async () => {
  signing.value = true
  try {
    const res = await createSignInRecord()
    if (res.code === 0) {
      ElMessage.success(`签到成功，获得${res.data.point || 0}积分`)
      await fetchSignData()
    }
  } catch (error) {
    console.error('签到失败', error)
  } finally {
    signing.value = false
  }
}

onMounted(() => {
  fetchSignData()
})
</script>

<style scoped lang="scss">
.sign-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .page-title {
    margin-bottom: 20px;
  }

  .sign-content {
    .sign-calendar {
      .calendar-header {
        text-align: center;
        margin-bottom: 30px;

        .sign-info {
          display: flex;
          justify-content: center;
          gap: 30px;
          font-size: 16px;

          strong {
            color: #ff6b35;
            font-size: 20px;
            margin: 0 5px;
          }
        }
      }

      .calendar-days {
        display: flex;
        justify-content: space-around;
        margin-bottom: 30px;

        .calendar-day {
          flex: 1;
          text-align: center;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          margin: 0 5px;
          position: relative;
          transition: all 0.3s;

          &.signed {
            background: #fff5f0;
            border-color: #ff6b35;

            .day-status {
              position: absolute;
              top: 5px;
              right: 5px;
              color: #ff6b35;
              font-size: 20px;
            }
          }

          &.today {
            border-color: #409eff;
            background: #ecf5ff;
          }

          .day-number {
            font-size: 14px;
            color: #333;
            margin-bottom: 8px;
          }

          .day-reward {
            font-size: 12px;
            color: #ff6b35;
            font-weight: bold;
          }
        }
      }

      .sign-button {
        text-align: center;
      }
    }

    .sign-rules {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #f0f0f0;

      h3 {
        margin-bottom: 15px;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          padding: 8px 0;
          color: #666;

          &:before {
            content: '• ';
            color: #ff6b35;
            font-weight: bold;
            margin-right: 8px;
          }
        }
      }
    }
  }
}
</style>
