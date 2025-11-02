import crypto from 'crypto'

const algorithm = 'aes-256-gcm'
const secretKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
const salt = process.env.ENCRYPTION_SALT || 'agistaffers-payment-salt'

// Derive key from secret
function deriveKey(secret: string): Buffer {
  return crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha256')
}

export function encrypt(text: string): string {
  const key = deriveKey(secretKey)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  // Combine iv, authTag, and encrypted data
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted
}

export function decrypt(encryptedData: string): string {
  const key = deriveKey(secretKey)
  const parts = encryptedData.split(':')
  
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format')
  }
  
  const iv = Buffer.from(parts[0], 'hex')
  const authTag = Buffer.from(parts[1], 'hex')
  const encrypted = parts[2]
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

// Hash sensitive data for comparison without decryption
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data + salt).digest('hex')
}

// Generate secure random tokens
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

// Mask sensitive data for display
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars) {
    return '*'.repeat(data.length)
  }
  
  const masked = '*'.repeat(data.length - visibleChars)
  const visible = data.slice(-visibleChars)
  
  return masked + visible
}