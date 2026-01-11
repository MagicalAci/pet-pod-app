import { View, Text, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState, useMemo, useEffect } from 'react'
import './index.scss'

// 导入生成的卡通图
import generatedCartoon from '../../assets/images/generated-cartoon.png'

// 材质选项 - 基础价格+500
const materials = [
  { id: 'eva', name: 'EVA糖胶', icon: '🍬', price: 699, tag: '热门' },
  { id: 'plush', name: '棉花布绒', icon: '🧸', price: 799, tag: '' },
  { id: 'resin', name: '树脂手办', icon: '✨', price: 1099, tag: '精品' },
  { id: 'mixed', name: '创意混搭', icon: '🎭', price: 1299, tag: '新品' },
]

// 尺寸选项
const sizes = [
  { id: 'xs', name: '8cm', price: 0, desc: '迷你' },
  { id: 's', name: '10cm', price: 50, desc: '小巧' },
  { id: 'm', name: '15cm', price: 150, desc: '推荐' },
  { id: 'l', name: '45cm', price: 500, desc: '大型' },
]

export default function Customize() {
  const router = useRouter()
  const style = router.params.style || 'cartoon'
  
  const [selectedMaterial, setSelectedMaterial] = useState('eva')
  const [selectedSize, setSelectedSize] = useState('m')
  const [couponApplied, setCouponApplied] = useState(false)
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [countdown, setCountdown] = useState({ minutes: 14, seconds: 59 })
  const [priceAnimating, setPriceAnimating] = useState(false)
  const [displayPrice, setDisplayPrice] = useState(0)

  // 页面加载时显示优惠券弹窗
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCouponModal(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 获取风格名称
  const getStyleName = () => {
    const names: { [key: string]: string } = {
      realistic: '写实风格',
      cartoon: '卡通风格',
      chibi: 'Q版萌系',
      artistic: '艺术风格'
    }
    return names[style] || '卡通风格'
  }

  // 计算价格
  const priceInfo = useMemo(() => {
    const material = materials.find(m => m.id === selectedMaterial)
    const size = sizes.find(s => s.id === selectedSize)
    const subtotal = (material?.price || 0) + (size?.price || 0)
    const discount = couponApplied ? 500 : 0
    
    return {
      subtotal,
      discount,
      total: subtotal - discount
    }
  }, [selectedMaterial, selectedSize, couponApplied])

  // 更新显示价格
  useEffect(() => {
    if (!priceAnimating) {
      setDisplayPrice(priceInfo.total)
    }
  }, [priceInfo.total, priceAnimating])

  // 使用优惠券
  const handleUseCoupon = () => {
    if (couponApplied) return
    
    setShowCouponModal(false)
    setCouponApplied(true)
    setPriceAnimating(true)
    
    // 价格滚动动画
    const startPrice = priceInfo.subtotal
    const endPrice = priceInfo.subtotal - 500
    const duration = 1500
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // 缓动函数
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentPrice = Math.round(startPrice - (500 * easeOut))
      
      setDisplayPrice(currentPrice)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setPriceAnimating(false)
        setDisplayPrice(endPrice)
      }
    }
    
    requestAnimationFrame(animate)
  }

  // 处理支付
  const handlePay = () => {
    Taro.showLoading({ title: '创建订单中...' })
    
    setTimeout(() => {
      Taro.hideLoading()
      Taro.showModal({
        title: '🎉 下单成功',
        content: `您的专属手办正在制作中，预计7-15个工作日发货`,
        showCancel: false,
        confirmText: '查看订单',
        success: () => {
          Taro.redirectTo({ url: '/pages/order/index' })
        }
      })
    }, 1500)
  }

  return (
    <View className='customize-page'>
      {/* 优惠券弹窗 */}
      {showCouponModal && (
        <View className='coupon-modal-overlay' onClick={() => setShowCouponModal(false)}>
          <View className='coupon-modal' onClick={(e) => e.stopPropagation()}>
            {/* 关闭按钮 */}
            <View className='modal-close' onClick={() => setShowCouponModal(false)}>
              <Text>×</Text>
            </View>
            
            {/* 顶部装饰 */}
            <View className='modal-header'>
              <View className='confetti c1'>🎊</View>
              <View className='confetti c2'>✨</View>
              <View className='confetti c3'>🎉</View>
              <Text className='modal-title'>新人专享福利</Text>
              <Text className='modal-subtitle'>首单立减，仅限今日</Text>
            </View>
            
            {/* 优惠券主体 */}
            <View className='coupon-card-modal'>
              <View className='coupon-left'>
                <Text className='coupon-symbol'>¥</Text>
                <Text className='coupon-amount'>500</Text>
              </View>
              <View className='coupon-divider'>
                <View className='circle top' />
                <View className='dashed-line' />
                <View className='circle bottom' />
              </View>
              <View className='coupon-right'>
                <Text className='coupon-name'>新人专享券</Text>
                <Text className='coupon-condition'>全场通用 · 无门槛</Text>
                <View className='countdown-box'>
                  <Text className='countdown-label'>⏰ 剩余时间</Text>
                  <View className='countdown-timer'>
                    <View className='time-block'>
                      <Text>{String(countdown.minutes).padStart(2, '0')}</Text>
                    </View>
                    <Text className='time-sep'>:</Text>
                    <View className='time-block'>
                      <Text>{String(countdown.seconds).padStart(2, '0')}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            
            {/* 使用按钮 */}
            <View className='use-coupon-btn' onClick={handleUseCoupon}>
              <Text className='btn-text'>🎁 立即使用</Text>
              <Text className='btn-sub'>立省500元</Text>
            </View>
            
            {/* 底部提示 */}
            <Text className='modal-tip'>* 优惠券过期后将无法使用</Text>
          </View>
        </View>
      )}

      {/* 产品卡片 */}
      <View className='product-card'>
        <Image 
          className='product-image'
          src={generatedCartoon}
          mode='aspectFill'
        />
        <View className='product-info'>
          <Text className='product-title'>专属定制手办</Text>
          <Text className='product-style'>{getStyleName()} · AI生成</Text>
        </View>
      </View>

      {/* 材质选择 */}
      <View className='section'>
        <Text className='section-title'>选择材质</Text>
        <View className='material-grid'>
          {materials.map(m => (
            <View 
              key={m.id}
              className={`material-card ${selectedMaterial === m.id ? 'active' : ''}`}
              onClick={() => setSelectedMaterial(m.id)}
            >
              {selectedMaterial === m.id && <View className='check-icon'>✓</View>}
              {m.tag && <View className='tag'>{m.tag}</View>}
              <Text className='icon'>{m.icon}</Text>
              <Text className='name'>{m.name}</Text>
              <Text className='price'>¥{m.price}起</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 尺寸选择 */}
      <View className='section'>
        <Text className='section-title'>选择尺寸</Text>
        <View className='size-row'>
          {sizes.map(s => (
            <View 
              key={s.id}
              className={`size-card ${selectedSize === s.id ? 'active' : ''}`}
              onClick={() => setSelectedSize(s.id)}
            >
              <Text className='size-value'>{s.name}</Text>
              <Text className='size-desc'>{s.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 优惠券状态卡片 */}
      <View 
        className={`coupon-status-card ${couponApplied ? 'applied' : ''}`}
        onClick={() => !couponApplied && setShowCouponModal(true)}
      >
        {couponApplied ? (
          <>
            <View className='coupon-applied-icon'>🎉</View>
            <View className='coupon-applied-info'>
              <Text className='coupon-applied-title'>新人券已使用</Text>
              <Text className='coupon-applied-desc'>已为您节省 ¥500</Text>
            </View>
            <Text className='coupon-applied-tag'>-¥500</Text>
          </>
        ) : (
          <>
            <View className='coupon-pending-icon'>🎁</View>
            <View className='coupon-pending-info'>
              <Text className='coupon-pending-title'>新人专享券</Text>
              <View className='coupon-pending-countdown'>
                <Text>⏰ {String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')} 后过期</Text>
              </View>
            </View>
            <View className='coupon-pending-btn'>
              <Text>立即领取</Text>
            </View>
          </>
        )}
      </View>

      {/* 底部留白 */}
      <View style={{ height: '100px' }} />

      {/* 底部支付栏 */}
      <View className='footer-bar'>
        <View className='price-info'>
          {couponApplied && (
            <View className='discount-hint'>
              <Text className='discount-icon'>🎉</Text>
              <Text className='discount-text'>新人券已抵扣</Text>
            </View>
          )}
          <View className='price-main'>
            {couponApplied && (
              <Text className='original-price'>¥{priceInfo.subtotal}</Text>
            )}
            <Text className={`price-value ${priceAnimating ? 'animating' : ''}`}>
              ¥{displayPrice}
            </Text>
          </View>
        </View>
        <View className='pay-btn' onClick={handlePay}>
          <Text className='pay-icon'>💚</Text>
          <Text className='pay-text'>立即支付</Text>
        </View>
      </View>
    </View>
  )
}
