<template>
  <div class="comment-list-page">
    <div class="container">
      <h2 class="page-title">商品评价</h2>
      <el-card>
        <div class="comment-filter">
          <el-radio-group v-model="commentType" @change="handleTypeChange">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="0">好评</el-radio-button>
            <el-radio-button label="1">中评</el-radio-button>
            <el-radio-button label="2">差评</el-radio-button>
          </el-radio-group>
        </div>
        <div class="comment-list" v-loading="loading">
          <div v-for="item in commentList" :key="item.id" class="comment-item">
            <div class="comment-header">
              <div class="user-info">
                <el-avatar :src="item.userAvatar" :size="40">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <div class="user-details">
                  <div class="username">{{ item.userNickname || '匿名用户' }}</div>
                  <el-rate
                    v-model="item.scores"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                  />
                </div>
              </div>
              <div class="comment-time">{{ item.createTime }}</div>
            </div>
            <div class="comment-content">
              <p>{{ item.content }}</p>
              <div v-if="item.picUrls && item.picUrls.length > 0" class="comment-images">
                <el-image
                  v-for="(img, index) in item.picUrls"
                  :key="index"
                  :src="img"
                  :preview-src-list="item.picUrls"
                  fit="cover"
                  class="comment-image"
                />
              </div>
            </div>
            <div v-if="item.replyContent" class="comment-reply">
              <div class="reply-label">商家回复：</div>
              <div class="reply-content">{{ item.replyContent }}</div>
            </div>
          </div>
          <el-empty v-if="commentList.length === 0" description="暂无评价" />
        </div>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
          style="margin-top: 20px; justify-content: center;"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCommentPage } from '@/api/product'
import { User } from '@element-plus/icons-vue'

const route = useRoute()
const loading = ref(false)
const commentList = ref([])
const commentType = ref('')
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchComments = async () => {
  loading.value = true
  try {
    const res = await getCommentPage(
      route.params.id || route.query.spuId,
      pageNo.value,
      pageSize.value,
      commentType.value ? Number(commentType.value) : undefined
    )
    if (res.code === 0) {
      commentList.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取评价列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleTypeChange = () => {
  pageNo.value = 1
  fetchComments()
}

const handlePageChange = () => {
  fetchComments()
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped lang="scss">
.comment-list-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .comment-filter {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
  }

  .comment-list {
    .comment-item {
      padding: 20px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .comment-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;

        .user-info {
          display: flex;
          gap: 15px;
          align-items: center;

          .user-details {
            .username {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 5px;
            }
          }
        }

        .comment-time {
          font-size: 12px;
          color: #999;
        }
      }

      .comment-content {
        margin-bottom: 15px;

        p {
          font-size: 14px;
          color: #333;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .comment-images {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;

          .comment-image {
            width: 80px;
            height: 80px;
            border-radius: 4px;
            cursor: pointer;
          }
        }
      }

      .comment-reply {
        background: #f9f9f9;
        padding: 15px;
        border-radius: 4px;
        margin-top: 10px;

        .reply-label {
          font-size: 12px;
          color: #999;
          margin-bottom: 5px;
        }

        .reply-content {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
}
</style>

