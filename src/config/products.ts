/**
 * 产品配置 - 材质、尺寸、造型等
 */

// 产品造型选项
export const productShapes = [
  { 
    id: 'plush', 
    name: '毛绒玩偶', 
    icon: '🧸', 
    basePrice: 299, 
    desc: '软萌可抱',
    image: '/assets/products/plush.jpg'
  },
  { 
    id: 'figurine', 
    name: '手办摆件', 
    icon: '🏆', 
    basePrice: 399, 
    desc: '精致收藏',
    image: '/assets/products/figurine.jpg'
  },
  { 
    id: 'frame', 
    name: '艺术画框', 
    icon: '🖼️', 
    basePrice: 199, 
    desc: '墙面装饰',
    image: '/assets/products/frame.jpg'
  },
  { 
    id: 'pillow', 
    name: '定制抱枕', 
    icon: '🛋️', 
    basePrice: 149, 
    desc: '温馨陪伴',
    image: '/assets/products/pillow.jpg'
  },
  { 
    id: 'keychain', 
    name: '钥匙扣', 
    icon: '🔑', 
    basePrice: 79, 
    desc: '随身携带',
    image: '/assets/products/keychain.jpg'
  },
  { 
    id: 'lamp', 
    name: '3D夜灯', 
    icon: '💡', 
    basePrice: 259, 
    desc: '温馨照明',
    image: '/assets/products/lamp.jpg'
  },
]

// 风格选项
export const styleOptions = [
  { id: 'realistic', name: '写实还原', icon: '📷', priceAdd: 0, desc: '1:1真实还原' },
  { id: 'cartoon', name: '卡通风格', icon: '🎨', priceAdd: 50, desc: '可爱卡通化' },
  { id: 'chibi', name: 'Q版萌系', icon: '🍭', priceAdd: 80, desc: '大头萌娃' },
  { id: 'artistic', name: '艺术绘画', icon: '🖌️', priceAdd: 100, desc: '油画/水彩风' },
  { id: 'minimalist', name: '极简线条', icon: '✏️', priceAdd: 30, desc: '简约线描' },
]

// 材质选项 - 根据用户需求更新
export const materialOptions = [
  { 
    id: 'eva', 
    name: 'EVA/糖胶', 
    icon: '🍬', 
    priceMultiplier: 1, 
    desc: '软弹Q感，色彩鲜艳，适合可爱造型',
    features: ['防水耐磨', '环保安全', '色彩持久'],
    suitableFor: ['钥匙扣', '小摆件', 'Q版手办']
  },
  { 
    id: 'plush', 
    name: '棉花/布绒', 
    icon: '🧸', 
    priceMultiplier: 1.2, 
    desc: '柔软舒适，可抱可洗，毛绒质感',
    features: ['柔软亲肤', '可机洗', '仿真毛发'],
    suitableFor: ['毛绒玩偶', '抱枕', '大型摆件']
  },
  { 
    id: 'resin', 
    name: '树脂/PU 高端手办', 
    icon: '💎', 
    priceMultiplier: 1.8, 
    desc: '高精细度，收藏级品质，细节丰富',
    features: ['高精度', '收藏级', '可上色'],
    suitableFor: ['写实手办', '艺术摆件', '纪念收藏']
  },
  { 
    id: 'mixed', 
    name: '创意混合材质', 
    icon: '✨', 
    priceMultiplier: 2.2, 
    desc: '多材质组合，独特创意，专属定制',
    features: ['独特设计', '多材质', 'VIP定制'],
    suitableFor: ['高端定制', '特殊造型', '艺术品']
  },
]

// 尺寸选项 - 根据用户需求更新
export const sizeOptions = [
  { 
    id: 'xs', 
    name: '迷你', 
    size: '8cm', 
    priceMultiplier: 0.6,
    desc: '小巧精致，适合钥匙扣、桌面装饰'
  },
  { 
    id: 's', 
    name: '小号', 
    size: '10cm', 
    priceMultiplier: 0.8,
    desc: '经典尺寸，适合手办、小摆件'
  },
  { 
    id: 'm', 
    name: '中号', 
    size: '15cm', 
    priceMultiplier: 1,
    desc: '标准尺寸，视觉效果佳'
  },
  { 
    id: 'l', 
    name: '大号', 
    size: '45cm', 
    priceMultiplier: 2.5,
    desc: '大型摆件，震撼视觉效果'
  },
  { 
    id: 'xl', 
    name: '1:1等身', 
    size: '1:1', 
    priceMultiplier: 5,
    desc: '真实比例还原，高端收藏级',
    isCustom: true,
    needConsult: true
  },
]

// 附加服务选项
export const addOnOptions = [
  { id: 'base', name: '定制底座', price: 49, icon: '🪨', desc: '木质/亚克力底座' },
  { id: 'name', name: '刻字服务', price: 29, icon: '✍️', desc: '刻上宠物名字' },
  { id: 'box', name: '精美礼盒', price: 59, icon: '🎁', desc: '高档礼盒包装' },
  { id: 'card', name: '祝福贺卡', price: 9, icon: '💌', desc: '手写祝福卡片' },
  { id: 'certificate', name: '收藏证书', price: 39, icon: '📜', desc: '限量编号证书' },
  { id: 'rush', name: '加急制作', price: 99, icon: '⚡', desc: '5天内发货' },
]

// 计算产品价格
export interface PriceCalculation {
  basePrice: number
  styleAdd: number
  materialMultiplier: number
  sizeMultiplier: number
  addOnsPrice: number
  quantity: number
  subtotal: number
  discount: number
  total: number
}

export const calculatePrice = (
  shapeId: string,
  styleId: string,
  materialId: string,
  sizeId: string,
  addOnIds: string[],
  quantity: number = 1,
  couponDiscount: number = 0
): PriceCalculation => {
  const shape = productShapes.find(s => s.id === shapeId)
  const style = styleOptions.find(s => s.id === styleId)
  const material = materialOptions.find(m => m.id === materialId)
  const size = sizeOptions.find(s => s.id === sizeId)

  const basePrice = shape?.basePrice || 0
  const styleAdd = style?.priceAdd || 0
  const materialMultiplier = material?.priceMultiplier || 1
  const sizeMultiplier = size?.priceMultiplier || 1

  // 计算附加服务价格
  const addOnsPrice = addOnIds.reduce((sum, id) => {
    const addon = addOnOptions.find(a => a.id === id)
    return sum + (addon?.price || 0)
  }, 0)

  // 计算单件价格
  const unitPrice = (basePrice + styleAdd) * materialMultiplier * sizeMultiplier

  // 小计（含附加服务）
  const subtotal = Math.round((unitPrice + addOnsPrice) * quantity)

  // 折扣
  const discount = couponDiscount

  // 最终价格
  const total = Math.max(0, subtotal - discount)

  return {
    basePrice,
    styleAdd,
    materialMultiplier,
    sizeMultiplier,
    addOnsPrice,
    quantity,
    subtotal,
    discount,
    total
  }
}

