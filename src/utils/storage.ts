import Taro from '@tarojs/taro'

// 存储键名
export const STORAGE_KEYS = {
  USER_INFO: 'user_info',
  TOKEN: 'auth_token',
  DRAFT_ORDER: 'draft_order',
  RECENT_IMAGES: 'recent_images',
  ADDRESS_LIST: 'address_list',
} as const

/**
 * 设置存储
 */
export const setStorage = <T>(key: string, data: T): void => {
  try {
    Taro.setStorageSync(key, JSON.stringify(data))
  } catch (e) {
    console.error('存储失败:', e)
  }
}

/**
 * 获取存储
 */
export const getStorage = <T>(key: string, defaultValue?: T): T | undefined => {
  try {
    const value = Taro.getStorageSync(key)
    if (value) {
      return JSON.parse(value) as T
    }
    return defaultValue
  } catch (e) {
    console.error('读取存储失败:', e)
    return defaultValue
  }
}

/**
 * 移除存储
 */
export const removeStorage = (key: string): void => {
  try {
    Taro.removeStorageSync(key)
  } catch (e) {
    console.error('移除存储失败:', e)
  }
}

/**
 * 清空所有存储
 */
export const clearStorage = (): void => {
  try {
    Taro.clearStorageSync()
  } catch (e) {
    console.error('清空存储失败:', e)
  }
}

// 用户信息相关
export interface UserInfo {
  id: string
  nickname: string
  avatar: string
  phone?: string
}

export const saveUserInfo = (userInfo: UserInfo): void => {
  setStorage(STORAGE_KEYS.USER_INFO, userInfo)
}

export const getUserInfo = (): UserInfo | undefined => {
  return getStorage<UserInfo>(STORAGE_KEYS.USER_INFO)
}

// Token相关
export const saveToken = (token: string): void => {
  setStorage(STORAGE_KEYS.TOKEN, token)
}

export const getToken = (): string | undefined => {
  return getStorage<string>(STORAGE_KEYS.TOKEN)
}

export const clearAuth = (): void => {
  removeStorage(STORAGE_KEYS.USER_INFO)
  removeStorage(STORAGE_KEYS.TOKEN)
}

// 草稿订单
export interface DraftOrder {
  imageUrl?: string
  style?: string
  shape?: string
  material?: string
  size?: string
  addOns?: string[]
}

export const saveDraftOrder = (draft: DraftOrder): void => {
  setStorage(STORAGE_KEYS.DRAFT_ORDER, draft)
}

export const getDraftOrder = (): DraftOrder | undefined => {
  return getStorage<DraftOrder>(STORAGE_KEYS.DRAFT_ORDER)
}

export const clearDraftOrder = (): void => {
  removeStorage(STORAGE_KEYS.DRAFT_ORDER)
}

// 最近上传的图片
export const saveRecentImage = (imageUrl: string): void => {
  const images = getStorage<string[]>(STORAGE_KEYS.RECENT_IMAGES, []) || []
  const newImages = [imageUrl, ...images.filter(url => url !== imageUrl)].slice(0, 10)
  setStorage(STORAGE_KEYS.RECENT_IMAGES, newImages)
}

export const getRecentImages = (): string[] => {
  return getStorage<string[]>(STORAGE_KEYS.RECENT_IMAGES, []) || []
}

