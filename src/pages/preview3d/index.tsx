import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import './index.scss'

// 动态导入STL查看器
import STLViewer from '../../components/STLViewer'

// STL模型URL - 卡通狗3D模型
const STL_MODEL_URL = '/assets/models/cartoon-dog.stl'

export default function Preview3D() {
  const router = useRouter()
  const [style, setStyle] = useState('')
  const [loading, setLoading] = useState(true)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelError, setModelError] = useState(false)

  useEffect(() => {
    const { style: s } = router.params
    if (s) setStyle(s)
    
    // 模拟初始加载
    setTimeout(() => setLoading(false), 500)
  }, [])

  const handleNext = () => {
    Taro.navigateTo({
      url: `/pages/customize/index?style=${style}`
    })
  }

  const getStyleName = () => {
    const names: { [key: string]: string } = {
      realistic: '写实风格',
      cartoon: '卡通风格',
      chibi: 'Q版萌系',
      artistic: '艺术风格'
    }
    return names[style] || '写实风格'
  }

  const handleModelLoad = () => {
    setModelLoaded(true)
  }

  const handleModelError = () => {
    setModelError(true)
  }

  return (
    <ScrollView className='preview3d-page' scrollY style={{ height: '100vh' }}>
      {/* 进度指示 */}
      <View className='progress-bar'>
        <View className='progress-step done'>
          <View className='step-dot'>✓</View>
          <Text className='step-label'>上传</Text>
        </View>
        <View className='progress-line done' />
        <View className='progress-step done'>
          <View className='step-dot'>✓</View>
          <Text className='step-label'>AI生成</Text>
        </View>
        <View className='progress-line active' />
        <View className='progress-step active'>
          <View className='step-dot'>3</View>
          <Text className='step-label'>定制</Text>
        </View>
      </View>

      {/* 3D预览区 */}
      <View className='viewer-section'>
        <View className='viewer-card'>
          {loading ? (
            <View className='loading-state'>
              <View className='spinner' />
              <Text className='loading-text'>准备3D预览...</Text>
            </View>
          ) : (
            <>
              {/* 3D模型查看器 */}
              {!modelError ? (
                <View className='model-3d-container'>
                  <STLViewer 
                    url={STL_MODEL_URL}
                    color="#FFB347"
                    backgroundColor="#16213e"
                    onLoad={handleModelLoad}
                    onError={handleModelError}
                  />
                </View>
              ) : (
                <View className='fallback-message'>
                  <Text>3D模型加载失败，请刷新重试</Text>
                </View>
              )}
              
              {/* 操作提示 */}
              <View className='hint-bar'>
                <Text>👆 拖动旋转 · 双指缩放 · 自动旋转中</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* 模型信息 */}
      <View className='info-card'>
        <View className='info-row'>
          <Text className='info-label'>风格</Text>
          <Text className='info-value'>{getStyleName()}</Text>
        </View>
        <View className='info-divider' />
        <View className='info-row'>
          <Text className='info-label'>状态</Text>
          <Text className='info-value success'>
            {modelLoaded ? '✓ 模型已加载' : '加载中...'}
          </Text>
        </View>
      </View>

      {/* 模型规格 */}
      <View className='spec-card'>
        <Text className='spec-title'>📦 模型规格</Text>
        <View className='spec-list'>
          <View className='spec-item'>
            <Text className='spec-label'>格式</Text>
            <Text className='spec-value'>STL</Text>
          </View>
          <View className='spec-item'>
            <Text className='spec-label'>精度</Text>
            <Text className='spec-value'>高精度</Text>
          </View>
          <View className='spec-item'>
            <Text className='spec-label'>可打印</Text>
            <Text className='spec-value'>✓ 是</Text>
          </View>
        </View>
      </View>

      {/* 提示 */}
      <View className='tip-card'>
        <Text className='tip-icon'>💡</Text>
        <Text className='tip-text'>这是您的宠物3D模型，可拖动旋转查看各个角度</Text>
      </View>

      {/* 底部留白 */}
      <View style={{ height: '100px' }} />

      {/* 底部按钮 */}
      <View className='footer-bar'>
        <View className='back-btn' onClick={() => Taro.navigateBack()}>
          <Text>返回</Text>
        </View>
        <View 
          className='next-btn'
          onClick={handleNext}
        >
          <Text>🛒 确认，开始定制</Text>
        </View>
      </View>
    </ScrollView>
  )
}
