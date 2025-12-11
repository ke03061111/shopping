<template>
  <div class="activity-index-page">
    <div class="container">
      <h2 class="page-title">营销活动</h2>
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="全部活动" name="all">
          <div class="activity-list">
            <el-card
              v-for="item in activityList"
              :key="item.id"
              class="activity-card"
              @click="handleGoToActivity(item)"
            >
              <div class="card-content">
                <img :src="item.picUrl" class="activity-image" />
                <div class="activity-info">
                  <h3>{{ item.name }}</h3>
                  <p class="activity-desc">{{ item.description }}</p>
                  <div class="activity-time">
                    <el-icon><Clock /></el-icon>
                    <span>{{ item.startTime }} 至 {{ item.endTime }}</span>
                  </div>
                  <el-button type="primary" @click.stop="handleGoToActivity(item)">
                    立即参与
                  </el-button>
                </div>
              </div>
            </el-card>
            <el-empty v-if="activityList.length === 0" description="暂无活动" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="拼团活动" name="groupon">
          <div class="activity-list">
            <el-card
              v-for="item in grouponList"
              :key="item.id"
              class="activity-card"
              @click="$router.push(`/activity/groupon/detail/${item.id}`)"
            >
              <div class="card-content">
                <img :src="item.picUrl" class="activity-image" />
                <div class="activity-info">
                  <h3>{{ item.name }}</h3>
                  <div class="activity-price">
                    <span class="current-price">拼团价：¥{{ (item.combinationPrice / 100).toFixed(2) }}</span>
                    <span class="original-price">原价：¥{{ (item.originalPrice / 100).toFixed(2) }}</span>
                  </div>
                  <div class="activity-time">
                    <el-icon><Clock /></el-icon>
                    <span>{{ item.startTime }} 至 {{ item.endTime }}</span>
                  </div>
                  <el-button type="primary" @click.stop="$router.push(`/activity/groupon/detail/${item.id}`)">
                    立即参团
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="秒杀活动" name="seckill">
          <div class="activity-list">
            <el-card
              v-for="item in seckillList"
              :key="item.id"
              class="activity-card"
              @click="$router.push(`/goods/seckill/${item.spuId}`)"
            >
              <div class="card-content">
                <img :src="item.picUrl" class="activity-image" />
                <div class="activity-info">
                  <h3>{{ item.name }}</h3>
                  <div class="activity-price">
                    <span class="current-price">秒杀价：¥{{ (item.seckillPrice / 100).toFixed(2) }}</span>
                    <span class="original-price">原价：¥{{ (item.originalPrice / 100).toFixed(2) }}</span>
                  </div>
                  <div class="activity-time">
                    <el-icon><Clock /></el-icon>
                    <span>{{ item.startTime }} 至 {{ item.endTime }}</span>
                  </div>
                  <el-button type="primary" @click.stop="$router.push(`/goods/seckill/${item.spuId}`)">
                    立即秒杀
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCombinationActivityPage, getSeckillActivityPage } from '@/api/activity'
import { Clock } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('all')
const activityList = ref([])
const grouponList = ref([])
const seckillList = ref([])

const fetchActivities = async () => {
  try {
    // 获取拼团活动
    const grouponRes = await getCombinationActivityPage({ pageNo: 1, pageSize: 10 })
    if (grouponRes.code === 0) {
      grouponList.value = grouponRes.data.list || []
    }

    // 获取秒杀活动
    const seckillRes = await getSeckillActivityPage({ pageNo: 1, pageSize: 10 })
    if (seckillRes.code === 0) {
      seckillList.value = seckillRes.data.list || []
    }

    // 合并所有活动
    activityList.value = [...grouponList.value, ...seckillList.value]
  } catch (error) {
    console.error('获取活动列表失败', error)
  }
}

const handleTabChange = () => {
  // 切换标签页时重新加载数据
}

const handleGoToActivity = (item) => {
  // 根据活动类型跳转
  if (item.spuId) {
    // 如果有spuId，可能是秒杀活动
    router.push(`/goods/seckill/${item.spuId}`)
  } else if (item.id) {
    // 拼团活动
    router.push(`/activity/groupon/detail/${item.id}`)
  }
}

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped lang="scss">
.activity-index-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .activity-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;

    .activity-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .card-content {
        display: flex;
        flex-direction: column;

        .activity-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 15px;
        }

        .activity-info {
          h3 {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .activity-desc {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .activity-price {
            margin-bottom: 10px;

            .current-price {
              font-size: 20px;
              color: #ff6b35;
              font-weight: bold;
              margin-right: 10px;
            }

            .original-price {
              font-size: 14px;
              color: #999;
              text-decoration: line-through;
            }
          }

          .activity-time {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #999;
            font-size: 12px;
            margin-bottom: 15px;
          }
        }
      }
    }
  }
}
</style>

