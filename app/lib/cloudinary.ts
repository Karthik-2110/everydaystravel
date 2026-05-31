import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
})

export default cloudinary

// ── URL helpers ───────────────────────────────────────────────────────────────

const BASE = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`

/**
 * Returns a Cloudinary URL with automatic format, quality, and optional
 * max-width so browsers never download more pixels than they need.
 */
export function cdnUrl(publicId: string, widthPx?: number): string {
  const transforms = ['f_auto', 'q_auto', ...(widthPx ? [`w_${widthPx},c_limit`] : [])]
  return `${BASE}/${transforms.join(',')}/${publicId}`
}
