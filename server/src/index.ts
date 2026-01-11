/**
 * 爱宠POD 后端服务
 * 
 * 集成火山引擎即梦AI能力:
 * - 图片生成4.0
 * - 素材提取POD
 * - 交互编辑inpainting
 */
import express from 'express'
import cors from 'cors'
import path from 'path'
import apiRouter from './routes/api'

// 加载环境变量
const PORT = process.env.PORT || 3001
const NODE_ENV = process.env.NODE_ENV || 'development'

// 创建Express应用
const app = express()

// 中间件配置
app.use(cors({
  origin: NODE_ENV === 'development' 
    ? ['http://localhost:10086', 'http://localhost:3000', 'http://127.0.0.1:10086']
    : process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true
}))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// 请求日志
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`)
  })
  next()
})

// API路由
app.use('/api', apiRouter)

// 静态文件服务 (H5构建产物)
app.use(express.static(path.join(__dirname, '../../dist')))

// 首页
app.get('/', (req, res) => {
  res.json({
    name: '爱宠POD API服务',
    version: '1.0.0',
    description: '宠物3D定制小程序后端服务，集成火山引擎即梦AI',
    endpoints: {
      health: 'GET /api/health',
      extract: 'POST /api/extract - 素材提取',
      generate: 'POST /api/generate - 图片生成',
      petPortrait: 'POST /api/pet-portrait - 宠物形象生成',
      inpaint: 'POST /api/inpaint - 交互编辑',
      costs: 'GET /api/costs - 成本统计',
      pricing: 'GET /api/pricing - 定价信息',
      estimateCost: 'POST /api/estimate-cost - 成本估算'
    },
    documentation: {
      imageGeneration: 'https://www.volcengine.com/docs/85621/1820192',
      materialExtraction: 'https://www.volcengine.com/docs/85621/1976207',
      inpainting: 'https://www.volcengine.com/docs/85621/2136166',
      pricing: 'https://www.volcengine.com/docs/85621/1544714'
    }
  })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err)
  res.status(500).json({ 
    error: '服务器内部错误',
    message: NODE_ENV === 'development' ? err.message : undefined
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🐾 爱宠POD 后端服务已启动                              ║
║                                                        ║
║   地址: http://localhost:${PORT}                         ║
║   环境: ${NODE_ENV}                                      ║
║                                                        ║
║   API文档:                                              ║
║   - 图片生成: POST /api/generate                        ║
║   - 素材提取: POST /api/extract                         ║
║   - 宠物形象: POST /api/pet-portrait                    ║
║   - 交互编辑: POST /api/inpaint                         ║
║   - 成本统计: GET /api/costs                            ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `)
})

export default app

