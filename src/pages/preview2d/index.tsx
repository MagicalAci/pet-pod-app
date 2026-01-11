import { View, Text, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import jimengClient from '../../services/jimeng-client'
import './index.scss'

// 导入生成的卡通手办图
import generatedCartoon from '../../assets/images/generated-cartoon.png'

// 风格选项 - 使用固定的卡通手办图
const styles = [
  { id: 'realistic', name: '写实', icon: '🎨', preview: generatedCartoon },
  { id: 'cartoon', name: '卡通', icon: '🌟', preview: generatedCartoon },
  { id: 'chibi', name: 'Q版', icon: '🍭', preview: generatedCartoon },
  { id: 'artistic', name: '艺术', icon: '🖌️', preview: generatedCartoon },
]

export default function Preview2D() {
  const router = useRouter()
  const [originalImage, setOriginalImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('初始化...')
  const [selectedStyle, setSelectedStyle] = useState('realistic')
  const [generatedImages, setGeneratedImages] = useState<{ [key: string]: string }>({})
  const [useRealAI, setUseRealAI] = useState(false)

  useEffect(() => {
    const imageParam = router.params.image
    if (imageParam) {
      setOriginalImage(decodeURIComponent(imageParam))
    }
    checkAndStartGeneration()
  }, [])

  const checkAndStartGeneration = async () => {
    // 直接使用模拟生成，使用本地3D模型图片
    await simulateGeneration()
  }

  const startRealAIGeneration = async () => {
    setLoading(true)
    setProgress(0)

    const imageParam = router.params.image
    if (!imageParam) {
      setLoading(false)
      return
    }

    const imagePath = decodeURIComponent(imageParam)
    const allImages: { [key: string]: string } = {}

    try {
      for (let i = 0; i < styles.length; i++) {
        const style = styles[i]
        setCurrentStep(`生成${style.name}风格...`)
        setProgress(Math.floor((i / styles.length) * 80) + 10)

        try {
          const result = await jimengClient.generatePetPortrait(imagePath, style.id as any, 'figurine')
          if (result.success && result.generatedImages?.length) {
            allImages[style.id] = result.generatedImages[0]
          } else {
            // 使用固定的卡通手办图作为fallback
            allImages[style.id] = generatedCartoon
          }
        } catch {
          allImages[style.id] = generatedCartoon
        }
      }

      setGeneratedImages(allImages)
      setProgress(100)
      setCurrentStep('生成完成！')
      await new Promise(r => setTimeout(r, 300))
      setLoading(false)
    } catch {
      await simulateGeneration()
    }
  }

  const simulateGeneration = async () => {
    setLoading(true)
    setProgress(0)
    setUseRealAI(false)

    const steps = ['分析宠物特征...', '提取关键信息...', '生成3D形象...', '优化细节...']
    
    for (let i = 0; i <= 100; i += 4) {
      setProgress(i)
      setCurrentStep(steps[Math.min(Math.floor(i / 25), 3)])
      await new Promise(r => setTimeout(r, 60))
    }

    // 使用固定的卡通手办图作为AI生成结果
    setGeneratedImages({
      realistic: generatedCartoon,
      cartoon: generatedCartoon,
      chibi: generatedCartoon,
      artistic: generatedCartoon,
    })

    setCurrentStep('生成完成！')
    setLoading(false)
  }

  const handleRegenerate = () => {
    if (useRealAI) {
      startRealAIGeneration()
    } else {
      simulateGeneration()
    }
  }

  const handleNext = () => {
    const currentImage = generatedImages[selectedStyle]
    Taro.navigateTo({
      url: `/pages/preview3d/index?style=${selectedStyle}&image=${encodeURIComponent(currentImage)}`
    })
  }

  const currentGeneratedImage = generatedImages[selectedStyle]

  return (
    <View className='preview2d-page'>
      {/* 顶部进度指示器 */}
      <View className='progress-header'>
        <View className='step done'>
          <View className='step-dot'>✓</View>
          <Text className='step-text'>上传</Text>
        </View>
        <View className='step-line active' />
        <View className='step active'>
          <View className='step-dot'>2</View>
          <Text className='step-text'>AI生成</Text>
        </View>
        <View className='step-line' />
        <View className='step'>
          <View className='step-dot'>3</View>
          <Text className='step-text'>定制</Text>
        </View>
      </View>

      {/* 主内容区 */}
      <View className='main-content'>
        {/* AI生成的大图 */}
        <View className='ai-preview-container'>
          {loading ? (
            <View className='loading-state'>
              <View className='loading-spinner' />
              <Text className='loading-title'>AI正在生成...</Text>
              <Text className='loading-step'>{currentStep}</Text>
              <View className='loading-bar'>
                <View className='loading-fill' style={{ width: `${progress}%` }} />
              </View>
              <Text className='loading-percent'>{progress}%</Text>
            </View>
          ) : (
            <View className='ai-image-wrapper'>
              <Image 
                className='ai-image'
                src={currentGeneratedImage}
                mode='aspectFill'
              />
              
              {/* 原图小缩略图 - 附着在大图内部右下角 */}
              <View className='original-thumb'>
                <Image 
                  className='thumb-image'
                  src={originalImage.startsWith('http') || originalImage.startsWith('data:') || originalImage.startsWith('/') ? originalImage : generatedCartoon}
                  mode='aspectFill'
                />
              </View>
            </View>
          )}
        </View>

        {/* 风格选择 */}
        {!loading && (
          <View className='style-section'>
            <Text className='section-title'>选择风格</Text>
            <View className='style-list'>
              {styles.map(style => (
                <View 
                  key={style.id}
                  className={`style-item ${selectedStyle === style.id ? 'active' : ''}`}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  <View className='style-preview'>
                    <Image src={style.preview} mode='aspectFill' />
                  </View>
                  <Text className='style-name'>{style.name}</Text>
                  {selectedStyle === style.id && <View className='style-check'>✓</View>}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 重新生成按钮 */}
        {!loading && (
          <View className='regen-btn' onClick={handleRegenerate}>
            <Text>🔄 不满意？重新生成</Text>
          </View>
        )}
      </View>

      {/* 底部固定操作栏 */}
      <View className='bottom-bar'>
        <View className='back-btn' onClick={() => Taro.navigateBack()}>
          <Text>返回</Text>
        </View>
        <View 
          className={`next-btn ${loading ? 'disabled' : ''}`}
          onClick={!loading ? handleNext : undefined}
        >
          <Text>下一步：查看3D效果</Text>
        </View>
      </View>
    </View>
  )
}
