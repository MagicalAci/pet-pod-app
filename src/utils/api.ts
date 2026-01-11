import Taro from '@tarojs/taro'

// API基础配置
const BASE_URL = 'https://api.example.com'

// 请求方法
interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
}

export const request = async <T = any>(options: RequestOptions): Promise<T> => {
  const { url, method = 'GET', data, header = {} } = options
  
  try {
    Taro.showLoading({ title: '加载中...' })
    
    const response = await Taro.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
    })
    
    Taro.hideLoading()
    
    if (response.statusCode === 200) {
      return response.data as T
    }
    
    throw new Error(response.data?.message || '请求失败')
  } catch (error) {
    Taro.hideLoading()
    Taro.showToast({ title: '网络错误', icon: 'error' })
    throw error
  }
}

// API接口定义

/**
 * 上传图片
 */
export const uploadImage = async (filePath: string): Promise<{ url: string }> => {
  // 模拟上传
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { url: filePath } // 实际应返回服务器URL
}

/**
 * AI生成2D形象
 */
export interface GenerateImageParams {
  imageUrl: string
  style: 'realistic' | 'cartoon' | 'chibi' | 'pixel'
}

export interface GenerateImageResult {
  taskId: string
  imageUrl: string
  progress: number
}

export const generatePetImage = async (params: GenerateImageParams): Promise<GenerateImageResult> => {
  // 模拟AI生成
  await new Promise(resolve => setTimeout(resolve, 2000))
  return {
    taskId: 'task_' + Date.now(),
    imageUrl: `https://picsum.photos/400/400?random=${Date.now()}`,
    progress: 100,
  }
}

/**
 * 生成3D模型
 */
export interface Generate3DParams {
  imageUrl: string
  style: string
}

export interface Generate3DResult {
  taskId: string
  modelUrl: string
  thumbnailUrl: string
  progress: number
}

export const generate3DModel = async (params: Generate3DParams): Promise<Generate3DResult> => {
  // 模拟3D生成
  await new Promise(resolve => setTimeout(resolve, 2500))
  return {
    taskId: 'model_' + Date.now(),
    modelUrl: 'https://example.com/model.glb',
    thumbnailUrl: `https://picsum.photos/300/300?random=${Date.now()}`,
    progress: 100,
  }
}

/**
 * 创建订单
 */
export interface CreateOrderParams {
  productType: string
  style: string
  material: string
  size: string
  quantity: number
  addOns: string[]
  addressId: string
  remark?: string
}

export interface Order {
  id: string
  status: string
  totalPrice: number
  createTime: string
}

export const createOrder = async (params: CreateOrderParams): Promise<Order> => {
  // 模拟创建订单
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    id: 'ORD' + Date.now(),
    status: 'pending',
    totalPrice: 399,
    createTime: new Date().toISOString(),
  }
}

/**
 * 发起支付
 */
export interface PaymentParams {
  orderId: string
  paymentMethod: 'wechat' | 'alipay'
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
}

export const initiatePayment = async (params: PaymentParams): Promise<PaymentResult> => {
  // 模拟支付
  await new Promise(resolve => setTimeout(resolve, 1500))
  return {
    success: true,
    transactionId: 'TXN' + Date.now(),
  }
}

/**
 * 获取订单列表
 */
export const getOrderList = async (status?: string): Promise<Order[]> => {
  // 模拟获取订单
  await new Promise(resolve => setTimeout(resolve, 500))
  return []
}

/**
 * 获取订单详情
 */
export const getOrderDetail = async (orderId: string): Promise<Order | null> => {
  // 模拟获取订单详情
  await new Promise(resolve => setTimeout(resolve, 500))
  return null
}

