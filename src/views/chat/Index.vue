<template>
  <div class="chat-page">
    <div class="chat-container">
      <div class="chat-header">
        <h2>在线客服</h2>
        <el-button type="text" @click="handleClear">清空记录</el-button>
      </div>
      <div class="chat-messages" ref="messagesRef">
        <div
          v-for="(msg, index) in messageList"
          :key="index"
          :class="['message-item', msg.userId ? 'message-user' : 'message-service']"
        >
          <el-avatar :src="msg.userAvatar || msg.serviceAvatar" :size="40">
            <el-icon><User /></el-icon>
          </el-avatar>
          <div class="message-content">
            <div class="message-text">{{ msg.content }}</div>
            <div class="message-time">{{ msg.createTime }}</div>
          </div>
        </div>
        <div v-if="messageList.length === 0" class="empty-message">
          <el-empty description="暂无消息，开始对话吧~" />
        </div>
      </div>
      <div class="chat-input">
        <el-input
          v-model="inputMessage"
          type="textarea"
          :rows="3"
          placeholder="请输入消息..."
          @keyup.ctrl.enter="handleSend"
        />
        <div class="input-actions">
          <el-upload
            action="/api/infra/file/upload"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <el-button type="text">
              <el-icon><Picture /></el-icon>
              图片
            </el-button>
          </el-upload>
          <el-button type="primary" @click="handleSend" :loading="sending">
            发送
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { getKefuMessageList, sendKefuMessage } from '@/api/chat'
import { User, Picture } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const messagesRef = ref()
const messageList = ref([])
const inputMessage = ref('')
const sending = ref(false)

const fetchMessages = async () => {
  try {
    const res = await getKefuMessageList()
    if (res.code === 0) {
      messageList.value = res.data || []
      scrollToBottom()
    }
  } catch (error) {
    console.error('获取消息列表失败', error)
  }
}

const handleSend = async () => {
  if (!inputMessage.value.trim()) {
    ElMessage.warning('请输入消息内容')
    return
  }
  sending.value = true
  try {
    const res = await sendKefuMessage({
      content: inputMessage.value,
      type: 1 // 文本消息
    })
    if (res.code === 0) {
      inputMessage.value = ''
      await fetchMessages()
    }
  } catch (error) {
    console.error('发送消息失败', error)
  } finally {
    sending.value = false
  }
}

const handleUploadSuccess = (response) => {
  if (response.code === 0) {
    sendKefuMessage({
      content: response.data.url,
      type: 2 // 图片消息
    }).then(() => {
      fetchMessages()
    })
  }
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return true
}

const handleClear = () => {
  messageList.value = []
  ElMessage.success('已清空消息记录')
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

// 定时刷新消息
let timer = null
onMounted(() => {
  fetchMessages()
  timer = setInterval(() => {
    fetchMessages()
  }, 3000) // 每3秒刷新一次
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped lang="scss">
.chat-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .chat-container {
    max-width: 800px;
    margin: 0 auto;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: calc(100vh - 250px);

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #f0f0f0;

      h2 {
        margin: 0;
        font-size: 20px;
      }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #f5f5f5;

      .message-item {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;

        &.message-user {
          flex-direction: row-reverse;

          .message-content {
            background: #409eff;
            color: #fff;

            .message-time {
              color: rgba(255, 255, 255, 0.8);
            }
          }
        }

        &.message-service {
          .message-content {
            background: #fff;
            color: #333;
          }
        }

        .message-content {
          max-width: 60%;
          padding: 12px 16px;
          border-radius: 8px;
          word-wrap: break-word;

          .message-text {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 5px;
          }

          .message-time {
            font-size: 12px;
            color: #999;
          }
        }
      }

      .empty-message {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
    }

    .chat-input {
      padding: 20px;
      border-top: 1px solid #f0f0f0;

      .input-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
      }
    }
  }
}
</style>

