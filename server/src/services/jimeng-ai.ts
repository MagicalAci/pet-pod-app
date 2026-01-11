/**
 * 即梦AI服务 - 火山引擎视觉AI能力
 * 
 * 集成的API:
 * - 图片生成4.0: https://www.volcengine.com/docs/85621/1820192
 * - 素材提取POD: https://www.volcengine.com/docs/85621/1976207
 * - 交互编辑inpainting: https://www.volcengine.com/docs/85621/2136166
 */
import axios, { AxiosInstance } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { volcConfig, jimengEndpoints, apiPricing } from '../config/volcengine'
import { signRequest } from './volcengine-auth'
import { CostTracker } from './cost-tracker'

// 任务状态
export type TaskStatus = 'pending' | 'processing' | 'success' | 'failed'

// 图片生成请求
export interface ImageGenerationRequest {
  prompt: string                    // 正向提示词
  negativePrompt?: string           // 负向提示词
  width?: number                    // 宽度 (512-2048)
  height?: number                   // 高度 (512-2048)
  scale?: number                    // CFG scale (1-20)
  seed?: number                     // 随机种子
  steps?: number                    // 采样步数
  stylePreset?: string              // 风格预设
  referenceImage?: string           // 参考图片 (base64)
  referenceStrength?: number        // 参考强度 (0-1)
}

// 图片生成结果
export interface ImageGenerationResult {
  taskId: string
  status: TaskStatus
  images?: string[]                 // base64图片数组
  progress?: number
  errorMessage?: string
}

// 素材提取请求 (POD按需定制)
export interface MaterialExtractionRequest {
  image: string                     // 输入图片 (base64或URL)
  extractType: 'subject' | 'background' | 'all'  // 提取类型
  outputFormat?: 'png' | 'webp'
  backgroundColor?: string          // 背景色
  padding?: number                  // 边距
}

// 素材提取结果
export interface MaterialExtractionResult {
  taskId: string
  status: TaskStatus
  extractedImage?: string           // 提取后的图片 (base64)
  mask?: string                     // 遮罩图 (base64)
  errorMessage?: string
}

// 交互编辑请求 (Inpainting)
export interface InpaintingRequest {
  image: string                     // 原图 (base64)
  mask: string                      // 遮罩图 (base64)
  prompt: string                    // 编辑提示词
  negativePrompt?: string
  strength?: number                 // 编辑强度 (0-1)
}

// 交互编辑结果
export interface InpaintingResult {
  taskId: string
  status: TaskStatus
  editedImage?: string              // 编辑后的图片 (base64)
  errorMessage?: string
}

/**
 * 即梦AI服务类
 */
export class JimengAIService {
  private client: AxiosInstance
  private costTracker: CostTracker
  
  constructor() {
    this.client = axios.create({
      baseURL: volcConfig.apiHost,
      timeout: 120000, // 2分钟超时
    })
    
    this.costTracker = new CostTracker()
  }
  
  /**
   * 发送API请求
   */
  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    data?: any,
    query?: Record<string, string>
  ): Promise<T> {
    const timestamp = new Date()
    const body = data ? JSON.stringify(data) : ''
    
    // 生成签名头
    const signedHeaders = signRequest({
      method,
      path,
      query,
      headers: {},
      body,
      timestamp
    })
    
    try {
      const response = await this.client.request({
        method,
        url: path,
        params: query,
        data,
        headers: signedHeaders
      })
      
      return response.data
    } catch (error: any) {
      console.error('即梦AI API请求失败:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'API请求失败')
    }
  }
  
  /**
   * 图片生成4.0
   * 根据文本提示生成高质量图片
   */
  async generateImage(params: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const taskId = uuidv4()
    
    const requestBody = {
      req_key: 'jimeng_high_aes_general_v20_L',
      prompt: params.prompt,
      negative_prompt: params.negativePrompt || '',
      width: params.width || 1024,
      height: params.height || 1024,
      scale: params.scale || 7.5,
      seed: params.seed || Math.floor(Math.random() * 2147483647),
      ddim_steps: params.steps || 25,
      use_sr: true,
      return_url: false,
      logo_info: {
        add_logo: false
      }
    }
    
    // 如果有参考图片，添加到请求
    if (params.referenceImage) {
      Object.assign(requestBody, {
        image_urls: [params.referenceImage],
        ctrl_strength: params.referenceStrength || 0.6
      })
    }
    
    try {
      const response = await this.request<any>(
        'POST',
        '/v2/image/generate',
        requestBody,
        { Action: 'VisualGenerate', Version: '2022-08-31' }
      )
      
      // 记录成本
      const resolution = `${params.width || 1024}x${params.height || 1024}`
      const cost = apiPricing.imageGeneration[resolution as keyof typeof apiPricing.imageGeneration] || 0.08
      this.costTracker.track('imageGeneration', cost, {
        taskId,
        resolution,
        prompt: params.prompt.slice(0, 50)
      })
      
      if (response.code === 10000) {
        return {
          taskId,
          status: 'success',
          images: response.data?.binary_data_base64 || [],
          progress: 100
        }
      }
      
      return {
        taskId,
        status: 'failed',
        errorMessage: response.message || '生成失败'
      }
    } catch (error: any) {
      return {
        taskId,
        status: 'failed',
        errorMessage: error.message
      }
    }
  }
  
  /**
   * 素材提取 (POD按需定制)
   * 从图片中提取主体、去除背景
   */
  async extractMaterial(params: MaterialExtractionRequest): Promise<MaterialExtractionResult> {
    const taskId = uuidv4()
    
    const requestBody = {
      req_key: 'img_segment_matting',
      binary_data_base64: [params.image.replace(/^data:image\/\w+;base64,/, '')],
      return_url: false,
      max_side: 2048
    }
    
    try {
      const response = await this.request<any>(
        'POST',
        '/v2/image/segment',
        requestBody,
        { Action: 'ImageSegment', Version: '2022-08-31' }
      )
      
      // 记录成本
      this.costTracker.track('materialExtraction', apiPricing.materialExtraction, {
        taskId,
        extractType: params.extractType
      })
      
      if (response.code === 10000) {
        return {
          taskId,
          status: 'success',
          extractedImage: response.data?.binary_data_base64?.[0],
          mask: response.data?.mask_base64?.[0]
        }
      }
      
      return {
        taskId,
        status: 'failed',
        errorMessage: response.message || '提取失败'
      }
    } catch (error: any) {
      return {
        taskId,
        status: 'failed',
        errorMessage: error.message
      }
    }
  }
  
  /**
   * 交互编辑 (Inpainting)
   * 根据遮罩区域进行智能编辑
   */
  async inpaint(params: InpaintingRequest): Promise<InpaintingResult> {
    const taskId = uuidv4()
    
    const requestBody = {
      req_key: 'jimeng_inpainting',
      binary_data_base64: [
        params.image.replace(/^data:image\/\w+;base64,/, ''),
        params.mask.replace(/^data:image\/\w+;base64,/, '')
      ],
      prompt: params.prompt,
      negative_prompt: params.negativePrompt || '',
      strength: params.strength || 0.75,
      return_url: false
    }
    
    try {
      const response = await this.request<any>(
        'POST',
        '/v2/image/inpaint',
        requestBody,
        { Action: 'ImageInpaint', Version: '2022-08-31' }
      )
      
      // 记录成本
      this.costTracker.track('inpainting', apiPricing.inpainting, {
        taskId,
        prompt: params.prompt.slice(0, 50)
      })
      
      if (response.code === 10000) {
        return {
          taskId,
          status: 'success',
          editedImage: response.data?.binary_data_base64?.[0]
        }
      }
      
      return {
        taskId,
        status: 'failed',
        errorMessage: response.message || '编辑失败'
      }
    } catch (error: any) {
      return {
        taskId,
        status: 'failed',
        errorMessage: error.message
      }
    }
  }
  
  /**
   * 宠物形象生成 - 综合能力
   * 输入宠物照片，生成多种风格的形象
   */
  async generatePetPortrait(
    petImage: string,
    style: 'realistic' | 'cartoon' | 'chibi' | 'artistic',
    productType: 'plush' | 'figurine' | 'frame' | 'pillow'
  ): Promise<{
    taskId: string
    status: TaskStatus
    generatedImages: string[]
    extractedSubject?: string
    cost: number
  }> {
    const taskId = uuidv4()
    let totalCost = 0
    const generatedImages: string[] = []
    
    try {
      // Step 1: 素材提取 - 分离宠物主体
      console.log('[Step 1] 提取宠物主体...')
      const extractResult = await this.extractMaterial({
        image: petImage,
        extractType: 'subject',
        outputFormat: 'png'
      })
      
      if (extractResult.status === 'failed') {
        throw new Error('素材提取失败: ' + extractResult.errorMessage)
      }
      
      totalCost += apiPricing.materialExtraction
      
      // Step 2: 根据风格生成提示词
      const stylePrompts = this.getStylePrompts(style, productType)
      
      // Step 3: 图片生成 - 生成不同视角/风格
      console.log('[Step 2] 生成风格化图片...')
      for (const prompt of stylePrompts) {
        const genResult = await this.generateImage({
          prompt: prompt.positive,
          negativePrompt: prompt.negative,
          referenceImage: extractResult.extractedImage,
          referenceStrength: 0.7,
          width: 1024,
          height: 1024
        })
        
        if (genResult.status === 'success' && genResult.images) {
          generatedImages.push(...genResult.images)
        }
        
        totalCost += apiPricing.imageGeneration['1024x1024']
      }
      
      return {
        taskId,
        status: 'success',
        generatedImages,
        extractedSubject: extractResult.extractedImage,
        cost: totalCost
      }
    } catch (error: any) {
      return {
        taskId,
        status: 'failed',
        generatedImages: [],
        cost: totalCost
      }
    }
  }
  
  /**
   * 获取风格提示词
   */
  private getStylePrompts(
    style: string,
    productType: string
  ): Array<{ positive: string, negative: string }> {
    const baseNegative = 'low quality, blurry, distorted, deformed, ugly, bad anatomy'
    
    const styleMap: Record<string, string> = {
      realistic: 'photorealistic, highly detailed, professional photography, studio lighting, sharp focus',
      cartoon: 'cute cartoon style, vibrant colors, smooth shading, Pixar style, Disney style',
      chibi: 'chibi style, super cute, big head small body, kawaii, anime style, adorable',
      artistic: 'oil painting style, artistic, masterpiece, fine art, impressionist'
    }
    
    const productMap: Record<string, string> = {
      plush: 'plush toy design, soft fabric texture, cuddly, toy-like',
      figurine: '3D figurine, collectible figure, detailed sculpture, display piece',
      frame: 'portrait artwork, framed picture, wall art, decorative',
      pillow: 'pillow design, fabric print, cozy, home decor'
    }
    
    const stylePrompt = styleMap[style] || styleMap.realistic
    const productPrompt = productMap[productType] || ''
    
    return [
      {
        positive: `${stylePrompt}, ${productPrompt}, front view, pet portrait, adorable pet`,
        negative: baseNegative
      },
      {
        positive: `${stylePrompt}, ${productPrompt}, three quarter view, pet portrait, charming pet`,
        negative: baseNegative
      }
    ]
  }
  
  /**
   * 获取成本统计
   */
  getCostStatistics() {
    return this.costTracker.getStatistics()
  }
}

// 导出单例实例
export const jimengAI = new JimengAIService()

export default jimengAI

