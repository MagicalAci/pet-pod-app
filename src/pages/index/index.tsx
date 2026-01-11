import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import GlassTabBar from '../../components/GlassTabBar'
import heroPetImage from '../../assets/images/hero-pet.png'
import flowProcessImage from '../../assets/images/flow-process.png'
import showcaseDemoImage from '../../assets/images/showcase-demo.png'
import './index.scss'

export default function Index() {
  const handleStartCreate = () => {
    Taro.navigateTo({ url: '/pages/upload/index' })
  }

  return (
    <ScrollView className='index-page' scrollY>
      {/* ========== Hero区域 - 重新设计 ========== */}
      <View className='hero'>
        {/* 背景装饰 */}
        <View className='hero-bg'>
          <View className='bg-gradient' />
          <View className='bg-circle c1' />
          <View className='bg-circle c2' />
        </View>

        {/* 主标题区域 */}
        <View className='hero-content'>
          <View className='hero-text'>
            <Text className='title-line'>为正在陪伴的它</Text>
            <Text className='title-highlight'>留住现在的样子</Text>
            <Text className='hero-subtitle'>
              上传一张照片，AI智能生成专属3D形象，打造独一无二的宠物纪念品
            </Text>
          </View>
        </View>

        {/* 宠物预览卡片 */}
        <View className='hero-card'>
          <Image 
            className='card-image'
            src={heroPetImage}
            mode='aspectFill'
          />
          <View className='card-glow' />
        </View>

        {/* CTA按钮 - 独立放置 */}
        <View className='hero-action'>
          <View className='cta-btn' onClick={handleStartCreate}>
            <View className='cta-shine' />
            <Text className='cta-icon'>✨</Text>
            <Text className='cta-text'>立即开始制作</Text>
            <Text className='cta-arrow'>→</Text>
          </View>
        </View>

        {/* 信任指标 */}
        <View className='trust-bar'>
          <View className='trust-item'>
            <Text className='trust-num'>50K+</Text>
            <Text className='trust-label'>作品</Text>
          </View>
          <View className='trust-divider' />
          <View className='trust-item'>
            <Text className='trust-num'>99%</Text>
            <Text className='trust-label'>好评</Text>
          </View>
          <View className='trust-divider' />
          <View className='trust-item'>
            <Text className='trust-num'>7天</Text>
            <Text className='trust-label'>发货</Text>
          </View>
        </View>
      </View>

      {/* ========== 制作流程图 ========== */}
      <View className='process-section'>
        <Image 
          className='process-image'
          src={flowProcessImage}
          mode='widthFix'
        />
      </View>

      {/* ========== 成品展示 ========== */}
      <View className='showcase-section'>
        <View className='showcase-header'>
          <Text className='showcase-title'>✨ 还原陪伴的每一刻</Text>
          <Text className='showcase-subtitle'>把日常变成永恒的纪念</Text>
        </View>

        <View className='showcase-card' onClick={() => Taro.redirectTo({ url: '/pages/square/index' })}>
          <Image 
            className='showcase-image'
            src={showcaseDemoImage}
            mode='widthFix'
          />
          <View className='showcase-footer'>
            <View className='footer-left'>
              <Text className='footer-name'>金毛 Lucky</Text>
              <Text className='footer-desc'>树脂手办 · 15cm · 定制铭牌</Text>
            </View>
            <View className='footer-btn'>
              <Text>查看更多</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ========== 底部CTA ========== */}
      <View className='bottom-cta'>
        <View className='cta-card' onClick={handleStartCreate}>
          <Text className='cta-emoji'>🐾</Text>
          <View className='cta-content'>
            <Text className='cta-title'>开始创作专属纪念品</Text>
            <Text className='cta-subtitle'>AI智能生成 · 7天快速发货</Text>
          </View>
          <View className='cta-go'>
            <Text>GO</Text>
          </View>
        </View>
      </View>

      {/* 底部留白（给TabBar） */}
      <View style={{ height: '100px' }} />

      {/* 液态玻璃TabBar */}
      <GlassTabBar current={0} />
    </ScrollView>
  )
}
