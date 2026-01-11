import Taro from '@tarojs/taro'

/**
 * 格式化价格
 */
export const formatPrice = (price: number, showSymbol = true): string => {
  const formatted = price.toFixed(2)
  return showSymbol ? `¥${formatted}` : formatted
}

/**
 * 格式化日期
 */
export const formatDate = (date: Date | string | number, format = 'YYYY-MM-DD HH:mm'): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 压缩图片
 */
export const compressImage = async (filePath: string, quality = 80): Promise<string> => {
  try {
    const res = await Taro.compressImage({
      src: filePath,
      quality,
    })
    return res.tempFilePath
  } catch (e) {
    console.error('图片压缩失败:', e)
    return filePath
  }
}

/**
 * 获取图片信息
 */
export const getImageInfo = async (src: string): Promise<Taro.getImageInfo.SuccessCallbackResult | null> => {
  try {
    return await Taro.getImageInfo({ src })
  } catch (e) {
    console.error('获取图片信息失败:', e)
    return null
  }
}

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 复制文本到剪贴板
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await Taro.setClipboardData({ data: text })
    Taro.showToast({ title: '已复制', icon: 'success' })
    return true
  } catch (e) {
    Taro.showToast({ title: '复制失败', icon: 'error' })
    return false
  }
}

/**
 * 拨打电话
 */
export const makePhoneCall = (phoneNumber: string): void => {
  Taro.makePhoneCall({ phoneNumber })
}

/**
 * 检查网络状态
 */
export const checkNetwork = async (): Promise<boolean> => {
  try {
    const res = await Taro.getNetworkType()
    return res.networkType !== 'none'
  } catch (e) {
    return false
  }
}

/**
 * 预览图片
 */
export const previewImage = (current: string, urls: string[]): void => {
  Taro.previewImage({ current, urls })
}

/**
 * 保存图片到相册
 */
export const saveImageToAlbum = async (filePath: string): Promise<boolean> => {
  try {
    await Taro.saveImageToPhotosAlbum({ filePath })
    Taro.showToast({ title: '保存成功', icon: 'success' })
    return true
  } catch (e) {
    Taro.showToast({ title: '保存失败', icon: 'error' })
    return false
  }
}

