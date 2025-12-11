<template>
  <div class="cart-page">
    <div class="container">
      <h2 class="page-title">购物车</h2>
      <div v-if="cartStore.validList.length === 0" class="empty-cart">
        <el-empty description="购物车空空如也，快去逛逛吧~">
          <el-button type="primary" @click="$router.push('/home')">去购物</el-button>
        </el-empty>
      </div>
      <div v-else class="cart-content">
        <el-table :data="cartStore.validList" border>
          <el-table-column width="60">
            <template #header>
              <el-checkbox
                :model-value="cartStore.isAllSelected"
                @change="cartStore.toggleSelectAll"
              />
            </template>
            <template #default="{ row }">
              <el-checkbox
                :model-value="cartStore.selectedIds.includes(row.id)"
                @change="() => cartStore.toggleSelect(row.id)"
              />
            </template>
          </el-table-column>
          <el-table-column label="商品信息" min-width="300">
            <template #default="{ row }">
              <div class="goods-info">
                <img :src="row.spu?.picUrl || row.goods?.image" class="goods-image" />
                <div class="goods-details">
                  <div class="goods-name">{{ row.spu?.name || row.goods?.name }}</div>
                  <div class="goods-sku">
                    {{ row.sku?.properties?.map(p => p.valueName).join(' ') }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="120" align="center">
            <template #default="{ row }">
              <span class="price">¥{{ (row.sku?.price / 100).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="150" align="center">
            <template #default="{ row }">
              <el-input-number
                v-model="row.count"
                :min="1"
                :max="row.sku?.stock"
                @change="handleCountChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120" align="center">
            <template #default="{ row }">
              <span class="price">
                ¥{{ ((row.count * row.sku?.price) / 100).toFixed(2) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ row }">
              <el-button
                type="danger"
                link
                @click="handleDelete(row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="cart-footer">
          <div class="footer-left">
            <el-checkbox
              :model-value="cartStore.isAllSelected"
              @change="cartStore.toggleSelectAll"
            >
              全选
            </el-checkbox>
            <el-button type="danger" link @click="handleBatchDelete">
              批量删除
            </el-button>
          </div>
          <div class="footer-right">
            <div class="total-info">
              <span>已选 {{ selectedCount }} 件商品</span>
              <span class="total-price">
                合计：<span class="price">¥{{ (cartStore.totalPrice / 100).toFixed(2) }}</span>
              </span>
            </div>
            <el-button
              type="primary"
              size="large"
              :disabled="selectedCount === 0"
              @click="handleCheckout"
            >
              去结算
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { updateCartCount } from '@/api/cart'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()

const selectedCount = computed(() => cartStore.selectedIds.length)

const handleCountChange = async (row) => {
  try {
    await updateCartCount({
      id: row.id,
      count: row.count
    })
    await cartStore.fetchCartList()
  } catch (error) {
    console.error('更新数量失败', error)
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个商品吗？', '提示', {
      type: 'warning'
    })
    await cartStore.removeCartItem(id)
  } catch (error) {
    // 用户取消
  }
}

const handleBatchDelete = async () => {
  if (cartStore.selectedIds.length === 0) {
    ElMessageBox.warning('请先选择要删除的商品')
    return
  }
  try {
    await ElMessageBox.confirm('确定要删除选中的商品吗？', '提示', {
      type: 'warning'
    })
    await cartStore.removeCartItem(cartStore.selectedIds)
  } catch (error) {
    // 用户取消
  }
}

const handleCheckout = () => {
  if (cartStore.selectedIds.length === 0) {
    ElMessageBox.warning('请先选择要结算的商品')
    return
  }
  router.push('/order/confirm?from=cart')
}
</script>

<style scoped lang="scss">
.cart-page {
  padding: 20px 0;
  min-height: calc(100vh - 200px);

  .page-title {
    margin-bottom: 20px;
  }

  .empty-cart {
    padding: 100px 0;
    text-align: center;
  }

  .cart-content {
    background: #fff;
    border-radius: 8px;
    padding: 20px;

    .goods-info {
      display: flex;
      gap: 15px;
      align-items: center;

      .goods-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
      }

      .goods-details {
        flex: 1;

        .goods-name {
          font-size: 14px;
          color: #333;
          margin-bottom: 8px;
        }

        .goods-sku {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .cart-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #f0f0f0;

      .footer-left {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .footer-right {
        display: flex;
        align-items: center;
        gap: 20px;

        .total-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;

          .total-price {
            font-size: 18px;

            .price {
              font-size: 24px;
              color: #ff6b35;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>

