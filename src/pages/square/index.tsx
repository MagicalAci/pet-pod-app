import { View, Text, Image, ScrollView, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import GlassTabBar from '../../components/GlassTabBar'
import './index.scss'

// 分类标签
const categories = [
  { id: 'all', name: '全部', emoji: '🔥' },
  { id: 'figure', name: '手办', emoji: '🎨' },
  { id: 'keychain', name: '钥匙扣', emoji: '🔑' },
  { id: 'plush', name: '毛绒', emoji: '🧸' },
  { id: 'diorama', name: '场景', emoji: '🏠' },
]

// 模拟帖子数据
const postsData = [
  {
    id: 1,
    user: { name: '毛毛妈妈', avatar: '👩', verified: true },
    content: '收到我家毛毛的手办啦！做工超级精致，毛发纹理都能看清楚，太惊喜了！推荐大家都来试试~',
    images: ['/assets/images/dog-3d-preview.png'],
    product: { type: 'figure', name: 'EVA糖胶', size: '15cm' },
    likes: 128,
    comments: 23,
    shares: 8,
    time: '2小时前',
    isHot: true
  },
  {
    id: 2,
    user: { name: '橘座铲屎官', avatar: '🧑', verified: false },
    content: '给我家橘座做了个树脂手办，真的是1:1还原！连那个嫌弃的小眼神都做出来了哈哈哈 🐱',
    images: ['/assets/images/showcase-demo.png'],
    product: { type: 'figure', name: '树脂手办', size: '10cm' },
    likes: 256,
    comments: 45,
    shares: 15,
    time: '5小时前',
    isHot: true
  },
  {
    id: 3,
    user: { name: '柴柴的家', avatar: '👧', verified: true },
    content: '终于等到了！7天就收到了，比预期还快。打算再给我妈的狗子也做一个当生日礼物~ 🎁',
    images: ['/assets/images/generated-cartoon.png'],
    product: { type: 'plush', name: '棉花布绒', size: '8cm' },
    likes: 89,
    comments: 12,
    shares: 3,
    time: '昨天',
    isHot: false
  },
  {
    id: 4,
    user: { name: '金毛控', avatar: '👦', verified: false },
    content: '做了一个钥匙扣挂在包上，每天出门都能看到我家大金毛，幸福感满满！',
    images: ['/assets/images/product-keychain.jpeg'],
    product: { type: 'keychain', name: '亚克力钥匙扣', size: '5cm' },
    likes: 67,
    comments: 8,
    shares: 2,
    time: '2天前',
    isHot: false
  },
  {
    id: 5,
    user: { name: '萌宠工作室', avatar: '🏪', verified: true },
    content: '【作品展示】客户定制的场景手办，还原了宝贝在沙发上打盹的样子，主人看到都感动哭了 😭❤️',
    images: ['/assets/images/product-diorama.png'],
    product: { type: 'diorama', name: '场景微缩', size: '20cm' },
    likes: 512,
    comments: 88,
    shares: 45,
    time: '3天前',
    isHot: true
  },
]

export default function Square() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishContent, setPublishContent] = useState('')

  // 筛选帖子
  const filteredPosts = activeCategory === 'all' 
    ? postsData 
    : postsData.filter(post => post.product.type === activeCategory)

  const handleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const handleComment = (postId: number) => {
    Taro.showToast({
      title: '评论功能开发中',
      icon: 'none'
    })
  }

  const handleShare = (post: typeof postsData[0]) => {
    Taro.showActionSheet({
      itemList: ['分享给好友', '保存图片', '复制链接'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.showToast({ title: '分享成功', icon: 'success' })
        } else if (res.tapIndex === 1) {
          Taro.showToast({ title: '图片已保存', icon: 'success' })
        } else {
          Taro.showToast({ title: '链接已复制', icon: 'success' })
        }
      }
    })
  }

  const handlePublish = () => {
    setShowPublishModal(true)
  }

  const submitPublish = () => {
    if (!publishContent.trim()) {
      Taro.showToast({ title: '请输入内容', icon: 'none' })
      return
    }
    Taro.showToast({ title: '发布成功', icon: 'success' })
    setShowPublishModal(false)
    setPublishContent('')
  }

  const handleImagePreview = (images: string[], current: number) => {
    Taro.previewImage({
      current: images[current],
      urls: images
    })
  }

  return (
    <View className='square-page'>
      {/* 顶部标题 */}
      <View className='page-header'>
        <View className='header-content'>
          <Text className='header-title'>🐾 广场</Text>
          <Text className='header-subtitle'>看看大家的萌宠作品</Text>
        </View>
        <View className='header-stats'>
          <View className='stat-item'>
            <Text className='stat-num'>{postsData.length}</Text>
            <Text className='stat-label'>作品</Text>
          </View>
          <View className='stat-divider' />
          <View className='stat-item'>
            <Text className='stat-num'>{postsData.reduce((acc, p) => acc + p.likes, 0)}</Text>
            <Text className='stat-label'>点赞</Text>
          </View>
        </View>
      </View>

      {/* 分类标签 */}
      <View className='category-section'>
        <ScrollView scrollX className='category-scroll' showScrollbar={false}>
          <View className='category-list'>
            {categories.map(cat => (
              <View 
                key={cat.id}
                className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Text className='cat-emoji'>{cat.emoji}</Text>
                <Text className='cat-name'>{cat.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 帖子列表 */}
      <View className='posts-list'>
        {filteredPosts.length === 0 ? (
          <View className='empty-state'>
            <Text className='empty-emoji'>🔍</Text>
            <Text className='empty-text'>暂无相关作品</Text>
            <Text className='empty-hint'>快去定制你的专属手办吧~</Text>
          </View>
        ) : (
          filteredPosts.map(post => (
            <View key={post.id} className='post-card'>
              {/* 热门标签 */}
              {post.isHot && (
                <View className='hot-badge'>
                  <Text>🔥 热门</Text>
                </View>
              )}

              {/* 用户信息 */}
              <View className='post-header'>
                <View className='user-avatar'>
                  <Text>{post.user.avatar}</Text>
                  {post.user.verified && <View className='verified-badge'>✓</View>}
                </View>
                <View className='user-info'>
                  <View className='user-name-row'>
                    <Text className='user-name'>{post.user.name}</Text>
                    {post.user.verified && <Text className='verified-text'>认证用户</Text>}
                  </View>
                  <Text className='post-time'>{post.time}</Text>
                </View>
                <View className='product-tag'>
                  <Text>{post.product.name} · {post.product.size}</Text>
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
                    onClick={() => handleImagePreview(post.images, idx)}
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
                <View className='action-btn' onClick={() => handleComment(post.id)}>
                  <Text className='action-icon'>💬</Text>
                  <Text className='action-count'>{post.comments}</Text>
                </View>
                <View className='action-btn' onClick={() => handleShare(post)}>
                  <Text className='action-icon'>📤</Text>
                  <Text className='action-count'>{post.shares}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {/* 底部留白 */}
      <View style={{ height: '120px' }} />

      {/* 悬浮发布按钮 */}
      <View className='publish-fab' onClick={handlePublish}>
        <View className='fab-btn'>
          <Text className='fab-icon'>✏️</Text>
          <Text className='fab-text'>晒作品</Text>
        </View>
      </View>

      {/* 发布弹窗 */}
      {showPublishModal && (
        <View className='publish-modal'>
          <View className='modal-overlay' onClick={() => setShowPublishModal(false)} />
          <View className='modal-content'>
            <View className='modal-header'>
              <Text className='modal-title'>✨ 晒晒我的作品</Text>
              <View className='modal-close' onClick={() => setShowPublishModal(false)}>
                <Text>✕</Text>
              </View>
            </View>
            <Textarea 
              className='publish-textarea'
              placeholder='分享你的萌宠手办故事...'
              value={publishContent}
              onInput={(e) => setPublishContent(e.detail.value)}
              maxlength={500}
            />
            <View className='publish-tips'>
              <Text className='tip-item'>📷 添加图片</Text>
              <Text className='tip-item'>🏷️ 添加标签</Text>
            </View>
            <View className='publish-actions'>
              <View className='cancel-btn' onClick={() => setShowPublishModal(false)}>
                <Text>取消</Text>
              </View>
              <View className='submit-btn' onClick={submitPublish}>
                <Text>发布</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 底部TabBar */}
      <GlassTabBar current={1} />
    </View>
  )
}
