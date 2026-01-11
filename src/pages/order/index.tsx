import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

// 订单状态步骤
const orderSteps = [
  { id: 'paid', name: '已支付', icon: '✓', done: true },
  { id: 'making', name: '制作中', icon: '🔨', done: true, current: true },
  { id: 'shipping', name: '已发货', icon: '📦', done: false },
  { id: 'done', name: '已完成', icon: '🎉', done: false },
]

// 模拟订单
const mockOrder = {
  id: 'POD202601100001',
  product: '写实风格手办',
  material: 'EVA糖胶',
  size: '15cm',
  image: 'https://picsum.photos/200/200',
  price: 349,
  status: 'making',
  createTime: '2026-01-10 10:30',
}

export default function Order() {
  const router = useRouter()
  const isSuccess = router.params.status === 'success'
  const [showDetail, setShowDetail] = useState(false)

  const handleContact = () => {
    Taro.showModal({
      title: '联系客服',
      content: '客服微信：aichongpod\n工作时间：9:00-18:00',
      showCancel: false,
    })
  }

  const handleBackHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  return (
    <ScrollView className='order-page' scrollY>
      {/* 成功提示 */}
      {isSuccess && (
        <View className='success-banner'>
          <Text className='success-icon'>🎉</Text>
          <Text className='success-title'>下单成功！</Text>
          <Text className='success-desc'>预计7个工作日内发货</Text>
        </View>
      )}

      {/* 订单进度 */}
      <View className='progress-card'>
        <Text className='card-title'>订单进度</Text>
        <View className='progress-steps'>
          {orderSteps.map((step, i) => (
            <View key={step.id} className='step-item'>
              <View className={`step-icon ${step.done ? 'done' : ''} ${step.current ? 'current' : ''}`}>
                <Text>{step.done ? '✓' : (i + 1)}</Text>
              </View>
              <Text className={`step-name ${step.current ? 'current' : ''}`}>{step.name}</Text>
              {i < orderSteps.length - 1 && (
                <View className={`step-line ${step.done ? 'done' : ''}`} />
              )}
            </View>
          ))}
        </View>
        <View className='progress-note'>
          <Text className='note-icon'>🔨</Text>
          <Text className='note-text'>工匠正在精心制作您的专属手办...</Text>
        </View>
      </View>

      {/* 订单详情 */}
      <View className='order-card'>
        <View className='order-header'>
          <Text className='order-id'>订单号：{mockOrder.id}</Text>
          <Text className='order-status'>制作中</Text>
        </View>
        
        <View className='order-product'>
          <Image 
            className='product-image'
            src={mockOrder.image}
            mode='aspectFill'
          />
          <View className='product-info'>
            <Text className='product-name'>{mockOrder.product}</Text>
            <Text className='product-spec'>{mockOrder.material} · {mockOrder.size}</Text>
            <Text className='product-price'>¥{mockOrder.price}</Text>
          </View>
        </View>

        <View className='order-meta'>
          <Text className='meta-label'>下单时间</Text>
          <Text className='meta-value'>{mockOrder.createTime}</Text>
        </View>
      </View>

      {/* 操作按钮 */}
      <View className='action-list'>
        <View className='action-item' onClick={handleContact}>
          <Text className='action-icon'>💬</Text>
          <Text className='action-text'>联系客服</Text>
          <Text className='action-arrow'>›</Text>
        </View>
        <View className='action-item'>
          <Text className='action-icon'>📍</Text>
          <Text className='action-text'>查看物流</Text>
          <Text className='action-arrow'>›</Text>
        </View>
        <View className='action-item'>
          <Text className='action-icon'>⭐</Text>
          <Text className='action-text'>评价订单</Text>
          <Text className='action-arrow'>›</Text>
        </View>
      </View>

      {/* 返回首页 */}
      <View className='home-btn' onClick={handleBackHome}>
        <Text>🏠 返回首页</Text>
      </View>

      {/* 底部留白 */}
      <View style={{ height: '40px' }} />
    </ScrollView>
  )
}
