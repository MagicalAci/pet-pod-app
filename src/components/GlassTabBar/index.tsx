import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import './index.scss'

interface TabItem {
  key: string
  title: string
  icon: string
  iconActive: string
  path: string
}

const tabs: TabItem[] = [
  {
    key: 'home',
    title: '首页',
    icon: '🏠',
    iconActive: '🏡',
    path: '/pages/index/index'
  },
  {
    key: 'square',
    title: '广场',
    icon: '🌐',
    iconActive: '🌍',
    path: '/pages/square/index'
  },
  {
    key: 'mine',
    title: '我的',
    icon: '👤',
    iconActive: '😊',
    path: '/pages/mine/index'
  }
]

interface GlassTabBarProps {
  current?: number
}

export default function GlassTabBar({ current = 0 }: GlassTabBarProps) {
  const [activeIndex, setActiveIndex] = useState(current)
  const [ripple, setRipple] = useState<number | null>(null)

  useEffect(() => {
    setActiveIndex(current)
  }, [current])

  const handleTabClick = (index: number, path: string) => {
    if (index === activeIndex) return
    
    // 触发波纹效果
    setRipple(index)
    setTimeout(() => setRipple(null), 400)
    
    setActiveIndex(index)
    
    // 延迟跳转，让动画有时间播放
    setTimeout(() => {
      Taro.redirectTo({ url: path })
    }, 150)
  }

  return (
    <View className='glass-tabbar'>
      {/* 玻璃背景层 */}
      <View className='glass-bg'>
        <View className='glass-blur' />
        <View className='glass-noise' />
      </View>
      
      {/* 顶部高光线 */}
      <View className='glass-highlight' />
      
      {/* Tab项容器 */}
      <View className='tabs-container'>
        {tabs.map((tab, index) => (
          <View 
            key={tab.key}
            className={`tab-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleTabClick(index, tab.path)}
          >
            {/* 激活指示器 */}
            {activeIndex === index && (
              <View className='active-indicator'>
                <View className='indicator-glow' />
              </View>
            )}
            
            {/* 波纹效果 */}
            {ripple === index && <View className='ripple' />}
            
            {/* 图标 */}
            <View className='tab-icon'>
              <Text className='icon-text'>
                {activeIndex === index ? tab.iconActive : tab.icon}
              </Text>
            </View>
            
            {/* 标题 */}
            <Text className='tab-title'>{tab.title}</Text>
          </View>
        ))}
      </View>
      
      {/* 底部安全区域 */}
      <View className='safe-area' />
    </View>
  )
}

