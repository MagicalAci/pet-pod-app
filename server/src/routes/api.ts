/**
 * API路由
 */
import { Router, Request, Response } from 'express'
import multer from 'multer'
import { jimengAI } from '../services/jimeng-ai'
import { CostTracker } from '../services/cost-tracker'

const router = Router()

// 文件上传配置
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('只支持图片文件'))
    }
  }
})

/**
 * 健康检查
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

/**
 * 上传图片并提取主体
 * POST /api/extract
 */
router.post('/extract', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传图片文件' })
    }

    // 转换为base64
    const base64Image = req.file.buffer.toString('base64')
    
    // 调用素材提取API
    const result = await jimengAI.extractMaterial({
      image: base64Image,
      extractType: 'subject',
      outputFormat: 'png'
    })

    if (result.status === 'failed') {
      return res.status(500).json({ 
        error: '素材提取失败', 
        message: result.errorMessage 
      })
    }

    res.json({
      success: true,
      taskId: result.taskId,
      extractedImage: result.extractedImage ? 
        `data:image/png;base64,${result.extractedImage}` : null,
      mask: result.mask ? 
        `data:image/png;base64,${result.mask}` : null
    })
  } catch (error: any) {
    console.error('素材提取错误:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * 生成风格化图片
 * POST /api/generate
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { 
      prompt, 
      negativePrompt,
      referenceImage, 
      referenceStrength,
      width = 1024,
      height = 1024,
      style = 'realistic'
    } = req.body

    if (!prompt) {
      return res.status(400).json({ error: '请提供生成提示词' })
    }

    // 构建风格化提示词
    const stylePrompts: Record<string, string> = {
      realistic: 'photorealistic, highly detailed, professional photography',
      cartoon: 'cute cartoon style, vibrant colors, Pixar style',
      chibi: 'chibi style, super cute, kawaii, anime style',
      artistic: 'oil painting style, artistic, masterpiece, fine art'
    }

    const fullPrompt = `${stylePrompts[style] || ''}, ${prompt}`

    const result = await jimengAI.generateImage({
      prompt: fullPrompt,
      negativePrompt: negativePrompt || 'low quality, blurry, distorted',
      referenceImage,
      referenceStrength: referenceStrength || 0.6,
      width,
      height
    })

    if (result.status === 'failed') {
      return res.status(500).json({ 
        error: '图片生成失败', 
        message: result.errorMessage 
      })
    }

    res.json({
      success: true,
      taskId: result.taskId,
      images: result.images?.map(img => `data:image/png;base64,${img}`) || [],
      progress: result.progress
    })
  } catch (error: any) {
    console.error('图片生成错误:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * 综合宠物形象生成
 * POST /api/pet-portrait
 */
router.post('/pet-portrait', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传宠物图片' })
    }

    const { style = 'realistic', productType = 'figurine' } = req.body

    // 转换为base64
    const base64Image = req.file.buffer.toString('base64')

    // 调用综合生成API
    const result = await jimengAI.generatePetPortrait(
      base64Image,
      style as any,
      productType as any
    )

    if (result.status === 'failed') {
      return res.status(500).json({ 
        error: '宠物形象生成失败'
      })
    }

    res.json({
      success: true,
      taskId: result.taskId,
      generatedImages: result.generatedImages.map(img => 
        `data:image/png;base64,${img}`
      ),
      extractedSubject: result.extractedSubject ? 
        `data:image/png;base64,${result.extractedSubject}` : null,
      cost: result.cost
    })
  } catch (error: any) {
    console.error('宠物形象生成错误:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * 交互编辑 (Inpainting)
 * POST /api/inpaint
 */
router.post('/inpaint', async (req: Request, res: Response) => {
  try {
    const { image, mask, prompt, negativePrompt, strength } = req.body

    if (!image || !mask || !prompt) {
      return res.status(400).json({ 
        error: '请提供原图、遮罩和编辑提示词' 
      })
    }

    const result = await jimengAI.inpaint({
      image: image.replace(/^data:image\/\w+;base64,/, ''),
      mask: mask.replace(/^data:image\/\w+;base64,/, ''),
      prompt,
      negativePrompt,
      strength
    })

    if (result.status === 'failed') {
      return res.status(500).json({ 
        error: '编辑失败', 
        message: result.errorMessage 
      })
    }

    res.json({
      success: true,
      taskId: result.taskId,
      editedImage: result.editedImage ? 
        `data:image/png;base64,${result.editedImage}` : null
    })
  } catch (error: any) {
    console.error('交互编辑错误:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * 获取成本统计
 * GET /api/costs
 */
router.get('/costs', (req: Request, res: Response) => {
  try {
    const stats = jimengAI.getCostStatistics()
    res.json({
      success: true,
      statistics: stats
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * 获取定价信息
 * GET /api/pricing
 */
router.get('/pricing', (req: Request, res: Response) => {
  res.json({
    success: true,
    pricing: CostTracker.getPricingInfo()
  })
})

/**
 * 估算成本
 * POST /api/estimate-cost
 */
router.post('/estimate-cost', (req: Request, res: Response) => {
  try {
    const { 
      imageCount = 2, 
      resolution = '1024',
      includeExtraction = true,
      includeInpainting = false
    } = req.body

    const estimate = CostTracker.estimateCost({
      imageCount,
      resolution: resolution as '512' | '1024' | '2048',
      includeExtraction,
      includeInpainting
    })

    res.json({
      success: true,
      ...estimate
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router

