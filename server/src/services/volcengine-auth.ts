/**
 * 火山引擎API签名认证
 * 参考文档: https://www.volcengine.com/docs/6369/67269
 */
import crypto from 'crypto'
import { volcConfig } from '../config/volcengine'

interface SignatureParams {
  method: string
  path: string
  query?: Record<string, string>
  headers: Record<string, string>
  body?: string
  timestamp: Date
}

/**
 * HMAC-SHA256签名
 */
const hmacSHA256 = (key: string | Buffer, data: string): Buffer => {
  return crypto.createHmac('sha256', key).update(data).digest()
}

/**
 * SHA256哈希
 */
const sha256 = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * 格式化日期为火山引擎格式
 */
const formatDate = (date: Date): string => {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, 8)
}

const formatDateTime = (date: Date): string => {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, '')
}

/**
 * 构建规范请求
 */
const buildCanonicalRequest = (params: SignatureParams): string => {
  const { method, path, query = {}, headers, body = '' } = params
  
  // 规范化查询字符串
  const sortedQuery = Object.keys(query)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&')
  
  // 规范化请求头
  const signedHeaders = Object.keys(headers)
    .map(key => key.toLowerCase())
    .sort()
    .join(';')
  
  const canonicalHeaders = Object.keys(headers)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map(key => `${key.toLowerCase()}:${headers[key].trim()}`)
    .join('\n')
  
  // 请求体哈希
  const payloadHash = sha256(body)
  
  return [
    method.toUpperCase(),
    path,
    sortedQuery,
    canonicalHeaders + '\n',
    signedHeaders,
    payloadHash
  ].join('\n')
}

/**
 * 构建待签名字符串
 */
const buildStringToSign = (
  canonicalRequest: string,
  timestamp: Date,
  credentialScope: string
): string => {
  const algorithm = 'HMAC-SHA256'
  const requestDateTime = formatDateTime(timestamp)
  const hashedCanonicalRequest = sha256(canonicalRequest)
  
  return [
    algorithm,
    requestDateTime,
    credentialScope,
    hashedCanonicalRequest
  ].join('\n')
}

/**
 * 计算签名
 */
const calculateSignature = (
  stringToSign: string,
  secretKey: string,
  date: string,
  region: string,
  service: string
): string => {
  const kDate = hmacSHA256(secretKey, date)
  const kRegion = hmacSHA256(kDate, region)
  const kService = hmacSHA256(kRegion, service)
  const kSigning = hmacSHA256(kService, 'request')
  
  return hmacSHA256(kSigning, stringToSign).toString('hex')
}

/**
 * 生成请求签名
 */
export const signRequest = (params: SignatureParams): Record<string, string> => {
  const { method, path, query = {}, body = '', timestamp } = params
  
  const date = formatDate(timestamp)
  const dateTime = formatDateTime(timestamp)
  const credentialScope = `${date}/${volcConfig.region}/${volcConfig.service}/request`
  
  // 构建请求头
  const headers: Record<string, string> = {
    'Host': new URL(volcConfig.apiHost).host,
    'Content-Type': 'application/json',
    'X-Date': dateTime,
  }
  
  if (body) {
    headers['X-Content-Sha256'] = sha256(body)
  }
  
  // 构建规范请求
  const canonicalRequest = buildCanonicalRequest({
    method,
    path,
    query,
    headers,
    body,
    timestamp
  })
  
  // 构建待签名字符串
  const stringToSign = buildStringToSign(canonicalRequest, timestamp, credentialScope)
  
  // 计算签名
  const signature = calculateSignature(
    stringToSign,
    volcConfig.secretAccessKey,
    date,
    volcConfig.region,
    volcConfig.service
  )
  
  // 构建Authorization头
  const signedHeaders = Object.keys(headers)
    .map(key => key.toLowerCase())
    .sort()
    .join(';')
  
  const authorization = [
    `HMAC-SHA256 Credential=${volcConfig.accessKeyId}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`
  ].join(', ')
  
  return {
    ...headers,
    'Authorization': authorization
  }
}

export default signRequest

