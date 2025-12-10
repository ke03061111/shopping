// 配置文件
export const config = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:48080',
  apiPath: import.meta.env.VITE_API_PATH || '/app-api',
  tenantId: import.meta.env.VITE_TENANT_ID || '1',
}

export default config

