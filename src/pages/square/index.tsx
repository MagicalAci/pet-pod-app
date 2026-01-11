import { View, Text, Image } from '@tarojs/components'
import { useState } from 'react'
import GlassTabBar from '../../components/GlassTabBar'
import './index.scss'

// 模拟帖子数据
const posts = [
  {
    id: 1,
    user: { name: '毛毛妈妈', avatar: '👩' },
    content: '收到我家毛毛的手办啦！做工超级精致，毛发纹理都能看清楚，太惊喜了！',
    images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'],
    product: 'EVA糖胶 · 15cm',
    likes: 128,
    comments: 23,
    time: '2小时前'
  },
  {
    id: 2,
    user: { name: '橘座铲屎官', avatar: '👨' },
    content: '给我家橘座做了个树脂手办，真的是1:1还原！连那个嫌弃的小眼神都做出来了哈哈哈',
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'],
    product: '树脂手办 · 10cm',
    likes: 256,
    comments: 45,
    time: '5小时前'
  },
  {
    id: 3,
    user: { name: '柴柴的家', avatar: '👧' },
    content: '终于等到了！7天就收到了，比预期还快。打算再给我妈的狗子也做一个当生日礼物~',
    images: ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400'],
    product: '棉花布绒 · 8cm',
    likes: 89,
    comments: 12,
    time: '昨天'
  },
]

export default function Square() {
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  const handleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  return (
    <View className='square-page'>
      {/* 顶部标题 */}
      <View className='page-header'>
        <Text className='header-title'>广场</Text>
        <Text className='header-subtitle'>看看大家的作品</Text>
      </View>

      {/* 帖子列表 */}
      <View className='posts-list'>
        {posts.map(post => (
          <View key={post.id} className='post-card'>
            {/* 用户信息 */}
            <View className='post-header'>
              <View className='user-avatar'>
                <Text>{post.user.avatar}</Text>
              </View>
              <View className='user-info'>
                <Text className='user-name'>{post.user.name}</Text>
                <Text className='post-time'>{post.time}</Text>
              </View>
              <View className='product-tag'>
                <Text>{post.product}</Text>
              </View>
            </View>

            {/* 内容 */}
            <Text className='post-content'>{post.content}</Text>

            {/* 图片 */}
            <View className='post-images'>
              {post.images.map((img, idx) => (
                <Image 
                  key={idx}
                  className='post-image'
                  src={img}
                  mode='aspectFill'
                />
              ))}
            </View>

            {/* 操作栏 */}
            <View className='post-actions'>
              <View 
                className={`action-btn ${likedPosts.includes(post.id) ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <Text className='action-icon'>
                  {likedPosts.includes(post.id) ? '❤️' : '🤍'}
                </Text>
                <Text className='action-count'>
                  {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                </Text>
              </View>
              <View className='action-btn'>
                <Text className='action-icon'>💬</Text>
                <Text className='action-count'>{post.comments}</Text>
              </View>
              <View className='action-btn'>
                <Text className='action-icon'>↗️</Text>
                <Text className='action-count'>分享</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 底部留白 */}
      <View style={{ height: '100px' }} />

      {/* 底部TabBar */}
      <GlassTabBar current={1} />
    </View>
  )
}

