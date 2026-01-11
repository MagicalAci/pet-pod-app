/**
 * 即梦AI前端客户端
 * 通过后端API调用火山引擎即梦AI服务
 */
import Taro from '@tarojs/taro'

// API基础配置
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api'
  : '/api'

/**
 * 发送请求到后端API
 */
async function request<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST'
    data?: any
    filePath?: string
    fileName?: string
  } = {}
): Promise<T> {
  const { method = 'GET', data, filePath, fileName } = options

  try {
    // 如果有文件上传
    if (filePath) {
      const uploadRes = await Taro.uploadFile({
        url: `${API_BASE_URL}${path}`,
        filePath,
        name: fileName || 'image',
        formData: data,
        header: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (uploadRes.statusCode !== 200) {
        throw new Error('上传失败')
      }
      
      return JSON.parse(uploadRes.data) as T
    }

    // 普通请求
    const res = await Taro.request({
      url: `${API_BASE_URL}${path}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json'
      }
    })

    if (res.statusCode !== 200) {
      throw new Error(res.data?.error || '请求失败')
    }

    return res.data as T
  } catch (error: any) {
    console.error(`API请求失败 [${path}]:`, error)
    throw error
  }
}

/**
 * 素材提取 - 从图片中提取宠物主体
 */
export async function extractPetSubject(imagePath: string): Promise<{
  success: boolean
  taskId: string
  extractedImage?: string
  mask?: string
  error?: string
}> {
  try {
    Taro.showLoading({ title: '分析宠物特征...' })
    
    const result = await request<{
      success: boolean
      taskId: string
      extractedImage?: string
      mask?: string
      error?: string
    }>('/extract', {
      method: 'POST',
      filePath: imagePath,
      fileName: 'image'
    })
    
    Taro.hideLoading()
    return result
  } catch (error: any) {
    Taro.hideLoading()
    return {
      success: false,
      taskId: '',
      error: error.message
    }
  }
}

/**
 * 生成风格化图片
 */
export async function generateStyledImage(params: {
  prompt: string
  negativePrompt?: string
  referenceImage?: string
  referenceStrength?: number
  style?: 'realistic' | 'cartoon' | 'chibi' | 'artistic'
  width?: number
  height?: number
}): Promise<{
  success: boolean
  taskId: string
  images?: string[]
  error?: string
}> {
  try {
    Taro.showLoading({ title: 'AI生成中...' })
    
    const result = await request<{
      success: boolean
      taskId: string
      images?: string[]
      error?: string
    }>('/generate', {
      method: 'POST',
      data: params
    })
    
    Taro.hideLoading()
    return result
  } catch (error: any) {
    Taro.hideLoading()
    return {
      success: false,
      taskId: '',
      error: error.message
    }
  }
}

/**
 * 综合宠物形象生成
 * 输入宠物照片，一键生成多种风格的形象
 */
export async function generatePetPortrait(
  imagePath: string,
  style: 'realistic' | 'cartoon' | 'chibi' | 'artistic' = 'realistic',
  productType: 'plush' | 'figurine' | 'frame' | 'pillow' = 'figurine'
): Promise<{
  success: boolean
  taskId: string
  generatedImages?: string[]
  extractedSubject?: string
  cost?: number
  error?: string
}> {
  try {
    Taro.showLoading({ title: 'AI正在创作...' })
    
    const result = await request<{
      success: boolean
      taskId: string
      generatedImages?: string[]
      extractedSubject?: string
      cost?: number
      error?: string
    }>('/pet-portrait', {
      method: 'POST',
      filePath: imagePath,
      fileName: 'image',
      data: { style, productType }
    })
    
    Taro.hideLoading()
    return result
  } catch (error: any) {
    Taro.hideLoading()
    return {
      success: false,
      taskId: '',
      error: error.message
    }
  }
}

/**
 * 交互编辑 - Inpainting
 */
export async function inpaintImage(params: {
  image: string
  mask: string
  prompt: string
  negativePrompt?: string
  strength?: number
}): Promise<{
  success: boolean
  taskId: string
  editedImage?: string
  error?: string
}> {
  try {
    Taro.showLoading({ title: '智能编辑中...' })
    
    const result = await request<{
      success: boolean
      taskId: string
      editedImage?: string
      error?: string
    }>('/inpaint', {
      method: 'POST',
      data: params
    })
    
    Taro.hideLoading()
    return result
  } catch (error: any) {
    Taro.hideLoading()
    return {
      success: false,
      taskId: '',
      error: error.message
    }
  }
}

/**
 * 获取成本统计
 */
export async function getCostStatistics(): Promise<{
  success: boolean
  statistics?: {
    totalCost: number
    todayCost: number
    thisMonthCost: number
    byService: Record<string, { count: number; totalCost: number }>
  }
}> {
  try {
    const result = await request<{
      success: boolean
      statistics?: any
    }>('/costs')
    
    return result
  } catch (error) {
    return { success: false }
  }
}

/**
 * 估算任务成本
 */
export async function estimateCost(params: {
  imageCount?: number
  resolution?: '512' | '1024' | '2048'
  includeExtraction?: boolean
  includeInpainting?: boolean
}): Promise<{
  success: boolean
  estimatedCost?: number
  breakdown?: Record<string, number>
}> {
  try {
    const result = await request<{
      success: boolean
      estimatedCost?: number
      breakdown?: Record<string, number>
    }>('/estimate-cost', {
      method: 'POST',
      data: params
    })
    
    return result
  } catch (error) {
    return { success: false }
  }
}

/**
 * 获取API定价信息
 */
export async function getPricingInfo(): Promise<{
  success: boolean
  pricing?: Record<string, any>
}> {
  try {
    const result = await request<{
      success: boolean
      pricing?: Record<string, any>
    }>('/pricing')
    
    return result
  } catch (error) {
    return { success: false }
  }
}

// 导出所有API
export default {
  extractPetSubject,
  generateStyledImage,
  generatePetPortrait,
  inpaintImage,
  getCostStatistics,
  estimateCost,
  getPricingInfo
}

