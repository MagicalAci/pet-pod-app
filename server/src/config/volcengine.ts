/**
 * 火山引擎配置
 */
import { env } from './env'

export const volcConfig = {
  // API凭证
  accessKeyId: env.VOLC_ACCESS_KEY_ID,
  secretAccessKey: env.VOLC_SECRET_ACCESS_KEY,
  
  // 服务配置
  apiHost: env.JIMENG_API_HOST,
  region: env.JIMENG_REGION,
  service: env.JIMENG_SERVICE,
  
  // API版本
  apiVersion: '2022-08-31',
}

// 即梦AI API端点
export const jimengEndpoints = {
  // 图片生成4.0
  imageGeneration: '/v1/image/generation',
  
  // 素材提取 (POD按需定制)
  materialExtraction: '/v1/image/pod_extraction',
  
  // 交互编辑 inpainting
  inpainting: '/v1/image/inpainting',
  
  // 图生图
  imageToImage: '/v1/image/img2img',
  
  // 任务查询
  taskQuery: '/v1/async/query',
}

// API定价 (单位: 元/次)
export const apiPricing = {
  // 图片生成4.0
  imageGeneration: {
    '512x512': 0.04,
    '1024x1024': 0.08,
    '2048x2048': 0.16,
  },
  
  // 素材提取POD
  materialExtraction: 0.02,
  
  // 交互编辑
  inpainting: 0.06,
  
  // 图生图
  imageToImage: 0.05,
}

export default volcConfig

