import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

export default function Upload() {
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  // 选择图片
  const handleChooseImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      
      if (res.tempFilePaths.length > 0) {
        setSelectedImage(res.tempFilePaths[0])
      }
    } catch (e) {
      console.log('用户取消选择')
    }
  }

  // 重新选择
  const handleReselect = () => {
    setSelectedImage('')
  }

  // 开始生成
  const handleGenerate = async () => {
    if (!selectedImage) {
      Taro.showToast({ title: '请先选择照片', icon: 'none' })
      return
    }

    setUploading(true)
    
    // 模拟AI处理
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setUploading(false)
    
    Taro.navigateTo({
      url: `/pages/preview2d/index?image=${encodeURIComponent(selectedImage)}`
    })
  }

  return (
    <ScrollView className='upload-page' scrollY>
      {/* 进度指示 */}
      <View className='progress-bar'>
        <View className='progress-step active'>
          <View className='step-dot'>1</View>
          <Text className='step-label'>上传照片</Text>
        </View>
        <View className='progress-line' />
        <View className='progress-step'>
          <View className='step-dot'>2</View>
          <Text className='step-label'>AI生成</Text>
        </View>
        <View className='progress-line' />
        <View className='progress-step'>
          <View className='step-dot'>3</View>
          <Text className='step-label'>定制下单</Text>
        </View>
      </View>

      {/* 上传区域 */}
      <View className='upload-area'>
        {!selectedImage ? (
          <View className='upload-box' onClick={handleChooseImage}>
            <View className='upload-icon'>
              <Text className='icon-main'>📷</Text>
              <View className='icon-plus'>+</View>
            </View>
            <Text className='upload-title'>点击上传宠物照片</Text>
            <Text className='upload-hint'>支持相册选择或拍照</Text>
          </View>
        ) : (
          <View className='preview-box'>
            <Image 
              className='preview-image' 
              src={selectedImage} 
              mode='aspectFill'
            />
            <View className='preview-check'>✓</View>
            <View className='preview-change' onClick={handleReselect}>
              <Text>更换</Text>
            </View>
          </View>
        )}
      </View>

      {/* 拍摄提示 */}
      <View className='tips-card'>
        <Text className='tips-title'>📸 拍摄建议</Text>
        <View className='tips-list'>
          <View className='tip-row'>
            <Text className='tip-icon good'>✓</Text>
            <Text className='tip-text'>正面清晰，光线充足</Text>
          </View>
          <View className='tip-row'>
            <Text className='tip-icon good'>✓</Text>
            <Text className='tip-text'>完整展示宠物全身</Text>
          </View>
          <View className='tip-row'>
            <Text className='tip-icon bad'>✗</Text>
            <Text className='tip-text'>避免模糊、过曝照片</Text>
          </View>
        </View>
      </View>

      {/* 示例 */}
      <View className='example-card'>
        <Text className='example-title'>参考示例</Text>
        <View className='example-grid'>
          <View className='example-item good'>
            <Image 
              className='example-img'
              src='https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200'
              mode='aspectFill'
            />
            <Text className='example-label'>✓ 推荐</Text>
          </View>
          <View className='example-item good'>
            <Image 
              className='example-img'
              src='https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200'
              mode='aspectFill'
            />
            <Text className='example-label'>✓ 推荐</Text>
          </View>
        </View>
      </View>

      {/* 底部留白 */}
      <View style={{ height: '100px' }} />

      {/* 底部按钮 */}
      <View className='footer-bar'>
        <View 
          className={`submit-btn ${selectedImage ? 'active' : ''} ${uploading ? 'loading' : ''}`}
          onClick={handleGenerate}
        >
          {uploading ? (
            <Text className='btn-text'>AI分析中...</Text>
          ) : (
            <>
              <Text className='btn-icon'>✨</Text>
              <Text className='btn-text'>下一步：AI生成</Text>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  )
}
