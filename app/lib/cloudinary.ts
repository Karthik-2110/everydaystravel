// Client-safe Cloudinary URL helper — no Node.js SDK, works in browser too.
// The cloud name is public (appears in every URL) so it is safe to inline here.

const CLOUD = 'dckyndryf'

/**
 * Returns a Cloudinary URL with automatic format, quality, and an optional
 * max-width cap so browsers never download more pixels than they need.
 */
export function cdnUrl(publicId: string, widthPx?: number): string {
  const transforms = ['f_auto', 'q_auto', ...(widthPx ? [`w_${widthPx},c_limit`] : [])]
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${transforms.join(',')}/${publicId}`
}

/**
 * Cloudinary serves whatever codec the delivery URL asks for, so each clip is
 * offered twice: VP9/WebM for Chrome & Firefox, H.264/MP4 for Safari. The
 * source's own extension is dropped first — the public ID is what matters.
 */
export function videoVariants(src: string) {
  const base = src.replace(/\.(mov|mp4|m4v|webm)$/i, '')
  return {
    webm: base.replace('/upload/', '/upload/vc_vp9,q_auto/') + '.webm',
    mp4:  base.replace('/upload/', '/upload/vc_h264,q_auto/') + '.mp4',
  }
}
