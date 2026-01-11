/**
 * 环境变量配置
 * 注意: 在生产环境中，请通过环境变量注入敏感信息
 */

// 默认配置（开发环境）
const defaultConfig = {
  // 火山引擎API凭证 - 请通过环境变量配置
  VOLC_ACCESS_KEY_ID: process.env.VOLC_ACCESS_KEY_ID || '',
  VOLC_SECRET_ACCESS_KEY_BASE64: process.env.VOLC_SECRET_ACCESS_KEY || '',
  
  // 服务配置
  PORT: 3001,
  NODE_ENV: 'development',
  
  // 即梦AI服务配置
  JIMENG_API_HOST: 'https://visual.volcengineapi.com',
  JIMENG_REGION: 'cn-north-1',
  JIMENG_SERVICE: 'cv',
  
  // 成本追踪
  ENABLE_COST_TRACKING: true,
}

// 从环境变量读取，优先使用环境变量
export const env = {
  VOLC_ACCESS_KEY_ID: process.env.VOLC_ACCESS_KEY_ID || defaultConfig.VOLC_ACCESS_KEY_ID,
  VOLC_SECRET_ACCESS_KEY: Buffer.from(
    process.env.VOLC_SECRET_ACCESS_KEY || defaultConfig.VOLC_SECRET_ACCESS_KEY_BASE64,
    'base64'
  ).toString('utf-8'),
  
  PORT: parseInt(process.env.PORT || String(defaultConfig.PORT)),
  NODE_ENV: process.env.NODE_ENV || defaultConfig.NODE_ENV,
  
  JIMENG_API_HOST: process.env.JIMENG_API_HOST || defaultConfig.JIMENG_API_HOST,
  JIMENG_REGION: process.env.JIMENG_REGION || defaultConfig.JIMENG_REGION,
  JIMENG_SERVICE: process.env.JIMENG_SERVICE || defaultConfig.JIMENG_SERVICE,
  
  ENABLE_COST_TRACKING: process.env.ENABLE_COST_TRACKING !== 'false',
}

export default env

