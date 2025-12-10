# 芋道商城 PC版

基于 Vue 3 + Vite + Element Plus 开发的PC版商城系统，复用小程序的API接口。

## 功能特性

- ✅ 商品浏览（列表、详情、分类、搜索）
- ✅ 购物车管理
- ✅ 订单管理（下单、支付、查看）
- ✅ 用户中心（个人信息、地址管理、收藏、浏览记录）
- ✅ 营销活动（拼团、秒杀、积分商城）
- ✅ 优惠券系统
- ✅ 分销中心
- ✅ 签到功能
- ✅ 售后管理

## 技术栈

- **框架**: Vue 3.3+
- **构建工具**: Vite 5.0+
- **UI组件库**: Element Plus 2.4+
- **状态管理**: Pinia 2.1+
- **路由**: Vue Router 4.2+
- **HTTP客户端**: Axios 1.6+

## 项目结构

```
mall-pc/
├── src/
│   ├── api/              # API接口封装
│   ├── components/       # 公共组件
│   ├── config/           # 配置文件
│   ├── layouts/          # 布局组件
│   ├── router/           # 路由配置
│   ├── stores/           # 状态管理
│   ├── styles/           # 全局样式
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 配置环境变量

创建 `.env.development` 文件（开发环境）：

```env
VITE_API_BASE_URL=http://localhost:48080
VITE_API_PATH=/admin-api
VITE_TENANT_ID=1
```

创建 `.env.production` 文件（生产环境）：

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_API_PATH=/admin-api
VITE_TENANT_ID=1
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录。

## 主要功能模块

### 1. 首页模块
- 首页展示（轮播图、商品推荐）
- 商品分类浏览
- 商品搜索
- 购物车管理
- 用户登录

### 2. 商品模块
- 商品列表（支持筛选、排序）
- 商品详情（规格选择、评价查看）
- 商品收藏
- 浏览记录

### 3. 订单模块
- 确认订单
- 订单列表
- 订单详情
- 物流跟踪

### 4. 用户中心
- 个人信息管理
- 收货地址管理
- 我的收藏
- 浏览记录
- 我的钱包
- 我的积分

### 5. 营销活动
- 拼团活动
- 秒杀活动
- 积分商城

### 6. 其他功能
- 优惠券领取
- 分销中心
- 签到中心
- 售后管理

## API接口

所有API接口复用小程序的接口，接口路径保持一致。主要接口模块：

- `/member/*` - 用户相关接口
- `/product/*` - 商品相关接口
- `/trade/*` - 交易相关接口（订单、购物车、售后）
- `/promotion/*` - 营销活动相关接口
- `/pay/*` - 支付相关接口

详细接口列表请参考 `功能清单.md`。

## 开发规范

### 代码风格
- 使用 ESLint 进行代码检查
- 遵循 Vue 3 Composition API 规范
- 组件使用 `<script setup>` 语法

### 命名规范
- 组件名：PascalCase（如 `GoodsCard.vue`）
- 文件名：kebab-case（如 `goods-detail.vue`）
- 变量/函数：camelCase
- 常量：UPPER_SNAKE_CASE

### 目录说明
- `api/` - API接口封装，按功能模块划分
- `components/` - 可复用的公共组件
- `views/` - 页面级组件
- `stores/` - Pinia状态管理
- `utils/` - 工具函数

## 注意事项

1. **API接口**: 确保后端API服务已启动，并配置正确的API地址
2. **跨域问题**: 开发环境已配置代理，生产环境需要后端支持CORS
3. **Token管理**: Token存储在localStorage，刷新页面会自动恢复登录状态
4. **路由守卫**: 需要登录的页面会自动跳转到登录页

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

## 相关链接

- [芋道商城小程序](../README.md)
- [Element Plus 文档](https://element-plus.org/)
- [Vue 3 文档](https://cn.vuejs.org/)

