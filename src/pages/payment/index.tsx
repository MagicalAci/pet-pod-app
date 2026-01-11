import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

// 支付方式
const paymentMethods = [
  { id: 'wechat', name: '微信支付', icon: '💚', desc: '推荐' },
  { id: 'alipay', name: '支付宝', icon: '💙', desc: '' },
]

// 优惠券
const coupons = [
  { id: 'new', name: '新人立减¥20', amount: 20, min: 199 },
  { id: 'vip', name: '会员专享¥50', amount: 50, min: 399 },
]

export default function Payment() {
  const router = useRouter()
  const basePrice = Number(router.params.price) || 299
  const [payMethod, setPayMethod] = useState('wechat')
  const [selectedCoupon, setSelectedCoupon] = useState('')
  const [paying, setPaying] = useState(false)

  // 计算折扣
  const discount = coupons.find(c => c.id === selectedCoupon)?.amount || 0
  const finalPrice = Math.max(0, basePrice - discount)

  const handlePay = async () => {
    setPaying(true)
    
    // 模拟支付
    await new Promise(r => setTimeout(r, 1500))
    
    Taro.showToast({ title: '支付成功！', icon: 'success' })
    
    setTimeout(() => {
      Taro.redirectTo({ url: '/pages/order/index?status=success' })
    }, 1000)
  }

  return (
    <ScrollView className='payment-page' scrollY>
      {/* 订单摘要 */}
      <View className='summary-card'>
        <Text className='card-title'>订单摘要</Text>
        <View className='summary-row'>
          <Text className='row-label'>商品金额</Text>
          <Text className='row-value'>¥{basePrice}</Text>
        </View>
        <View className='summary-row'>
          <Text className='row-label'>运费</Text>
          <Text className='row-value free'>免运费</Text>
        </View>
        {discount > 0 && (
          <View className='summary-row'>
            <Text className='row-label'>优惠</Text>
            <Text className='row-value discount'>-¥{discount}</Text>
          </View>
        )}
        <View className='summary-divider' />
        <View className='summary-row total'>
          <Text className='row-label'>应付金额</Text>
          <Text className='row-value'>¥{finalPrice}</Text>
        </View>
      </View>

      {/* 优惠券 */}
      <View className='section'>
        <Text className='section-title'>优惠券</Text>
        <View className='coupon-list'>
          {coupons.map(c => (
            <View 
              key={c.id}
              className={`coupon-card ${selectedCoupon === c.id ? 'active' : ''} ${basePrice < c.min ? 'disabled' : ''}`}
              onClick={() => basePrice >= c.min && setSelectedCoupon(selectedCoupon === c.id ? '' : c.id)}
            >
              <View className='coupon-left'>
                <Text className='coupon-amount'>¥{c.amount}</Text>
              </View>
              <View className='coupon-right'>
                <Text className='coupon-name'>{c.name}</Text>
                <Text className='coupon-min'>满¥{c.min}可用</Text>
              </View>
              <View className='coupon-check'>
                {selectedCoupon === c.id && '✓'}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 支付方式 */}
      <View className='section'>
        <Text className='section-title'>支付方式</Text>
        <View className='pay-list'>
          {paymentMethods.map(p => (
            <View 
              key={p.id}
              className={`pay-card ${payMethod === p.id ? 'active' : ''}`}
              onClick={() => setPayMethod(p.id)}
            >
              <Text className='pay-icon'>{p.icon}</Text>
              <Text className='pay-name'>{p.name}</Text>
              {p.desc && <View className='pay-tag'>{p.desc}</View>}
              <View className='pay-radio'>
                {payMethod === p.id && <View className='radio-dot' />}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 服务条款 */}
      <View className='terms'>
        <Text>下单即表示同意《服务协议》和《隐私政策》</Text>
      </View>

      {/* 底部留白 */}
      <View style={{ height: '100px' }} />

      {/* 底部支付栏 */}
      <View className='footer-bar'>
        <View className='price-display'>
          <Text className='price-label'>实付</Text>
          <Text className='price-value'>¥{finalPrice}</Text>
        </View>
        <View 
          className={`pay-btn ${paying ? 'loading' : ''}`}
          onClick={handlePay}
        >
          <Text>{paying ? '支付中...' : '立即支付'}</Text>
        </View>
      </View>
    </ScrollView>
  )
}
