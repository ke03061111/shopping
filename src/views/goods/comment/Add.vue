<template>
  <div class="comment-add-page">
    <div class="container">
      <h2 class="page-title">评价商品</h2>
      <el-card v-loading="loading">
        <div v-if="orderInfo" class="comment-content">
          <div class="order-goods">
            <div v-for="item in orderInfo.items" :key="item.id" class="goods-item">
              <img :src="item.spuPicUrl" class="goods-image" />
              <div class="goods-info">
                <div class="goods-name">{{ item.spuName }}</div>
                <div class="goods-sku">{{ item.skuProperties }}</div>
              </div>
              <el-button
                v-if="!item.commentStatus"
                type="primary"
                @click="handleComment(item)"
              >
                评价
              </el-button>
              <el-tag v-else type="success">已评价</el-tag>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 评价对话框 -->
      <el-dialog
        v-model="showCommentDialog"
        title="评价商品"
        width="600px"
      >
        <el-form
          ref="commentFormRef"
          :model="commentForm"
          :rules="commentRules"
          label-width="80px"
        >
          <el-form-item label="商品评分" prop="scores">
            <el-rate v-model="commentForm.scores" />
          </el-form-item>
          <el-form-item label="评价内容" prop="content">
            <el-input
              v-model="commentForm.content"
              type="textarea"
              :rows="4"
              placeholder="请输入评价内容"
            />
          </el-form-item>
          <el-form-item label="上传图片">
            <el-upload
              v-model:file-list="commentForm.picUrls"
              action="/api/infra/file/upload"
              list-type="picture-card"
              :limit="5"
              :on-success="handleUploadSuccess"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showCommentDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderDetail } from '@/api/order'
import { createOrderItemComment } from '@/api/order'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const orderInfo = ref(null)
const showCommentDialog = ref(false)
const commentFormRef = ref()
const currentItem = ref(null)

const commentForm = reactive({
  orderItemId: null,
  scores: 5,
  content: '',
  picUrls: []
})

const commentRules = {
  scores: [{ required: true, message: '请选择评分', trigger: 'change' }],
  content: [{ required: true, message: '请输入评价内容', trigger: 'blur' }]
}

const fetchOrderDetail = async () => {
  loading.value = true
  try {
    const res = await getOrderDetail(route.query.id || route.params.id)
    if (res.code === 0) {
      orderInfo.value = res.data
    }
  } catch (error) {
    console.error('获取订单详情失败', error)
  } finally {
    loading.value = false
  }
}

const handleComment = (item) => {
  currentItem.value = item
  commentForm.orderItemId = item.id
  commentForm.scores = 5
  commentForm.content = ''
  commentForm.picUrls = []
  showCommentDialog.value = true
}

const handleUploadSuccess = (response) => {
  if (response.code === 0) {
    commentForm.picUrls.push(response.data.url)
  }
}

const handleSubmit = async () => {
  await commentFormRef.value.validate()
  try {
    const res = await createOrderItemComment({
      orderItemId: commentForm.orderItemId,
      scores: commentForm.scores,
      content: commentForm.content,
      picUrls: commentForm.picUrls
    })
    if (res.code === 0) {
      ElMessage.success('评价成功')
      showCommentDialog.value = false
      await fetchOrderDetail()
    }
  } catch (error) {
    console.error('评价失败', error)
  }
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped lang="scss">
.comment-add-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .order-goods {
    .goods-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      margin-bottom: 10px;

      .goods-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
      }

      .goods-info {
        flex: 1;

        .goods-name {
          font-size: 14px;
          margin-bottom: 5px;
        }

        .goods-sku {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>

