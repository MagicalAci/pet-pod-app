import Taro from '@tarojs/taro'

// 订单状态类型
interface OrderItem {
  id: string
  petImage: string
  generatedImage: string
  style: string
  material: string
  size: string
  addons: string[]
  price: number
  status: 'pending' | 'paid' | 'producing' | 'shipping' | 'completed'
  createTime: string
  updateTime: string
}

// 用户偏好类型
interface UserPreferences {
  lastStyle: string
  lastMaterial: string
  lastSize: string
  favoriteStyles: string[]
}

// 全局状态类型
interface AppState {
  // 当前制作流程数据
  currentOrder: {
    petImage: string
    generatedImages: { [key: string]: string }
    selectedStyle: string
    selectedMaterial: string
    selectedSize: string
    addons: string[]
  }
  // 订单历史
  orders: OrderItem[]
  // 用户偏好
  preferences: UserPreferences
  // AI使用统计
  aiStats: {
    totalGenerations: number
    totalCost: number
  }
}

// 默认状态
const defaultState: AppState = {
  currentOrder: {
    petImage: '',
    generatedImages: {},
    selectedStyle: 'realistic',
    selectedMaterial: 'eva',
    selectedSize: 's',
    addons: []
  },
  orders: [],
  preferences: {
    lastStyle: 'realistic',
    lastMaterial: 'eva',
    lastSize: 's',
    favoriteStyles: []
  },
  aiStats: {
    totalGenerations: 0,
    totalCost: 0
  }
}

// 存储键
const STORAGE_KEY = 'aichong_pod_state'

class Store {
  private state: AppState

  constructor() {
    this.state = this.loadState()
  }

  // 加载持久化状态
  private loadState(): AppState {
    try {
      const saved = Taro.getStorageSync(STORAGE_KEY)
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.log('加载状态失败:', e)
    }
    return { ...defaultState }
  }

  // 保存状态到本地存储
  private saveState() {
    try {
      Taro.setStorageSync(STORAGE_KEY, JSON.stringify(this.state))
    } catch (e) {
      console.log('保存状态失败:', e)
    }
  }

  // 获取当前订单
  getCurrentOrder() {
    return { ...this.state.currentOrder }
  }

  // 设置宠物图片
  setPetImage(image: string) {
    this.state.currentOrder.petImage = image
    this.saveState()
  }

  // 设置生成的图片
  setGeneratedImages(images: { [key: string]: string }) {
    this.state.currentOrder.generatedImages = images
    this.saveState()
  }

  // 设置选中的风格
  setSelectedStyle(style: string) {
    this.state.currentOrder.selectedStyle = style
    this.state.preferences.lastStyle = style
    this.saveState()
  }

  // 设置选中的材质
  setSelectedMaterial(material: string) {
    this.state.currentOrder.selectedMaterial = material
    this.state.preferences.lastMaterial = material
    this.saveState()
  }

  // 设置选中的尺寸
  setSelectedSize(size: string) {
    this.state.currentOrder.selectedSize = size
    this.state.preferences.lastSize = size
    this.saveState()
  }

  // 设置附加选项
  setAddons(addons: string[]) {
    this.state.currentOrder.addons = addons
    this.saveState()
  }

  // 获取用户偏好
  getPreferences(): UserPreferences {
    return { ...this.state.preferences }
  }

  // 创建订单
  createOrder(price: number): OrderItem {
    const order: OrderItem = {
      id: `ORD${Date.now()}`,
      petImage: this.state.currentOrder.petImage,
      generatedImage: this.state.currentOrder.generatedImages[this.state.currentOrder.selectedStyle] || '',
      style: this.state.currentOrder.selectedStyle,
      material: this.state.currentOrder.selectedMaterial,
      size: this.state.currentOrder.selectedSize,
      addons: [...this.state.currentOrder.addons],
      price,
      status: 'pending',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    }
    
    this.state.orders.unshift(order)
    this.saveState()
    return order
  }

  // 更新订单状态
  updateOrderStatus(orderId: string, status: OrderItem['status']) {
    const order = this.state.orders.find(o => o.id === orderId)
    if (order) {
      order.status = status
      order.updateTime = new Date().toISOString()
      this.saveState()
    }
  }

  // 获取所有订单
  getOrders(): OrderItem[] {
    return [...this.state.orders]
  }

  // 获取订单详情
  getOrder(orderId: string): OrderItem | undefined {
    return this.state.orders.find(o => o.id === orderId)
  }

  // 记录AI使用
  recordAIUsage(cost: number) {
    this.state.aiStats.totalGenerations++
    this.state.aiStats.totalCost += cost
    this.saveState()
  }

  // 获取AI统计
  getAIStats() {
    return { ...this.state.aiStats }
  }

  // 重置当前订单
  resetCurrentOrder() {
    this.state.currentOrder = {
      petImage: '',
      generatedImages: {},
      selectedStyle: this.state.preferences.lastStyle,
      selectedMaterial: this.state.preferences.lastMaterial,
      selectedSize: this.state.preferences.lastSize,
      addons: []
    }
    this.saveState()
  }

  // 清除所有数据（调试用）
  clearAll() {
    this.state = { ...defaultState }
    this.saveState()
  }
}

// 单例导出
export const store = new Store()
export type { OrderItem, UserPreferences, AppState }

