import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import GlassTabBar from '../../components/GlassTabBar'
import './index.scss'

// 模拟订单数据
const orders = [
  {
    id: 'ORD202601120001',
    product: 'EVA糖胶手办',
    size: '15cm',
    price: 349,
    status: 'producing',
    statusText: '生产中',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200',
    date: '2026-01-10'
  },
  {
    id: 'ORD202601080002',
    product: '树脂高端手办',
    size: '10cm',
    price: 649,
    status: 'shipped',
    statusText: '已发货',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200',
    date: '2026-01-08'
  },
  {
    id: 'ORD202512250003',
    product: '棉花布绒玩偶',
    size: '8cm',
    price: 299,
    status: 'completed',
    statusText: '已完成',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200',
    date: '2025-12-25'
  },
]

// 菜单项
const menuItems = [
  { icon: '📦', title: '全部订单', badge: 3 },
  { icon: '🎨', title: '我的作品', badge: 0 },
  { icon: '❤️', title: '我的收藏', badge: 0 },
  { icon: '🎫', title: '优惠券', badge: 2 },
  { icon: '📞', title: '联系客服', badge: 0 },
  { icon: '⚙️', title: '设置', badge: 0 },
]

export default function Mine() {
  const handleOrderClick = (orderId: string) => {
    Taro.navigateTo({ url: `/pages/order/index?id=${orderId}` })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'producing': return '#FF9800'
      case 'shipped': return '#2196F3'
      case 'completed': return '#4CAF50'
      default: return '#999'
    }
  }

  return (
    <View className='mine-page'>
      {/* 用户信息卡片 */}
      <View className='user-card'>
        <View className='user-bg' />
        <View className='user-content'>
          <View className='avatar'>
            <Text className='avatar-emoji'>🐾</Text>
          </View>
          <View className='user-info'>
            <Text className='user-name'>爱宠用户</Text>
            <Text className='user-id'>ID: 888888</Text>
          </View>
          <View className='vip-badge'>
            <Text>VIP会员</Text>
          </View>
        </View>
        
        {/* 统计数据 */}
        <View className='user-stats'>
          <View className='stat-item'>
            <Text className='stat-num'>3</Text>
            <Text className='stat-label'>订单</Text>
          </View>
          <View className='stat-divider' />
          <View className='stat-item'>
            <Text className='stat-num'>5</Text>
            <Text className='stat-label'>作品</Text>
          </View>
          <View className='stat-divider' />
          <View className='stat-item'>
            <Text className='stat-num'>2</Text>
            <Text className='stat-label'>优惠券</Text>
          </View>
        </View>
      </View>

      {/* 订单快捷入口 */}
      <View className='section'>
        <View className='section-header'>
          <Text className='section-title'>我的订单</Text>
          <Text className='section-more'>全部 →</Text>
        </View>

        <View className='orders-list'>
          {orders.map(order => (
            <View 
              key={order.id} 
              className='order-card'
              onClick={() => handleOrderClick(order.id)}
            >
              <Image 
                className='order-image'
                src={order.image}
                mode='aspectFill'
              />
              <View className='order-info'>
                <Text className='order-product'>{order.product}</Text>
                <Text className='order-detail'>{order.size} · ¥{order.price}</Text>
                <Text className='order-date'>{order.date}</Text>
              </View>
              <View 
                className='order-status'
                style={{ color: getStatusColor(order.status) }}
              >
                <Text>{order.statusText}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 功能菜单 */}
      <View className='section'>
        <View className='menu-grid'>
          {menuItems.map((item, index) => (
            <View key={index} className='menu-item'>
              <View className='menu-icon'>
                <Text>{item.icon}</Text>
              </View>
              <Text className='menu-title'>{item.title}</Text>
              {item.badge > 0 && (
                <View className='menu-badge'>
                  <Text>{item.badge}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 底部留白 */}
      <View style={{ height: '100px' }} />

      {/* 底部TabBar */}
      <GlassTabBar current={2} />
    </View>
  )
}

