/**
 * API成本追踪服务
 * 
 * 参考定价文档: https://www.volcengine.com/docs/85621/1544714
 */

export interface CostRecord {
  id: string
  service: string
  cost: number
  metadata: Record<string, any>
  timestamp: Date
}

export interface CostStatistics {
  totalCost: number
  todayCost: number
  thisMonthCost: number
  byService: Record<string, {
    count: number
    totalCost: number
  }>
  recentRecords: CostRecord[]
}

/**
 * 成本追踪器
 */
export class CostTracker {
  private records: CostRecord[] = []
  private enabled: boolean
  
  constructor() {
    this.enabled = process.env.ENABLE_COST_TRACKING !== 'false'
  }
  
  /**
   * 记录一次API调用成本
   */
  track(service: string, cost: number, metadata: Record<string, any> = {}): void {
    if (!this.enabled) return
    
    const record: CostRecord = {
      id: `cost_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      service,
      cost,
      metadata,
      timestamp: new Date()
    }
    
    this.records.push(record)
    
    // 只保留最近1000条记录
    if (this.records.length > 1000) {
      this.records = this.records.slice(-1000)
    }
    
    console.log(`[成本追踪] ${service}: ¥${cost.toFixed(4)}`, metadata)
  }
  
  /**
   * 获取统计数据
   */
  getStatistics(): CostStatistics {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const byService: Record<string, { count: number; totalCost: number }> = {}
    let totalCost = 0
    let todayCost = 0
    let thisMonthCost = 0
    
    for (const record of this.records) {
      totalCost += record.cost
      
      if (record.timestamp >= todayStart) {
        todayCost += record.cost
      }
      
      if (record.timestamp >= monthStart) {
        thisMonthCost += record.cost
      }
      
      if (!byService[record.service]) {
        byService[record.service] = { count: 0, totalCost: 0 }
      }
      byService[record.service].count++
      byService[record.service].totalCost += record.cost
    }
    
    return {
      totalCost: Math.round(totalCost * 100) / 100,
      todayCost: Math.round(todayCost * 100) / 100,
      thisMonthCost: Math.round(thisMonthCost * 100) / 100,
      byService,
      recentRecords: this.records.slice(-20).reverse()
    }
  }
  
  /**
   * 获取服务定价信息
   */
  static getPricingInfo(): Record<string, any> {
    return {
      imageGeneration: {
        name: '图片生成4.0',
        pricing: {
          '512x512': { price: 0.04, unit: '元/张' },
          '1024x1024': { price: 0.08, unit: '元/张' },
          '2048x2048': { price: 0.16, unit: '元/张' }
        },
        description: 'AI图像生成，支持文生图、图生图'
      },
      materialExtraction: {
        name: '素材提取(POD)',
        pricing: { default: { price: 0.02, unit: '元/张' } },
        description: '智能抠图、主体分离、背景去除'
      },
      inpainting: {
        name: '交互编辑',
        pricing: { default: { price: 0.06, unit: '元/张' } },
        description: '区域编辑、智能填充、局部重绘'
      },
      imageToImage: {
        name: '图生图',
        pricing: { default: { price: 0.05, unit: '元/张' } },
        description: '风格转换、图像变体生成'
      }
    }
  }
  
  /**
   * 估算任务成本
   */
  static estimateCost(params: {
    imageCount: number
    resolution: '512' | '1024' | '2048'
    includeExtraction: boolean
    includeInpainting: boolean
  }): { estimatedCost: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {}
    
    // 图片生成成本
    const genPrices = { '512': 0.04, '1024': 0.08, '2048': 0.16 }
    breakdown.imageGeneration = params.imageCount * genPrices[params.resolution]
    
    // 素材提取成本
    if (params.includeExtraction) {
      breakdown.materialExtraction = 0.02
    }
    
    // 交互编辑成本
    if (params.includeInpainting) {
      breakdown.inpainting = 0.06 * params.imageCount
    }
    
    const estimatedCost = Object.values(breakdown).reduce((a, b) => a + b, 0)
    
    return {
      estimatedCost: Math.round(estimatedCost * 100) / 100,
      breakdown
    }
  }
  
  /**
   * 导出报表
   */
  exportReport(): string {
    const stats = this.getStatistics()
    const lines: string[] = [
      '=== 即梦AI成本报表 ===',
      `生成时间: ${new Date().toLocaleString()}`,
      '',
      '--- 费用汇总 ---',
      `累计总费用: ¥${stats.totalCost}`,
      `今日费用: ¥${stats.todayCost}`,
      `本月费用: ¥${stats.thisMonthCost}`,
      '',
      '--- 按服务统计 ---'
    ]
    
    for (const [service, data] of Object.entries(stats.byService)) {
      lines.push(`${service}: ${data.count}次, ¥${data.totalCost.toFixed(4)}`)
    }
    
    lines.push('')
    lines.push('--- 最近调用记录 ---')
    
    for (const record of stats.recentRecords) {
      lines.push(
        `[${record.timestamp.toLocaleString()}] ${record.service}: ¥${record.cost.toFixed(4)}`
      )
    }
    
    return lines.join('\n')
  }
}

export default CostTracker

