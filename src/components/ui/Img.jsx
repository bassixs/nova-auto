import { photoSrcSet, photoUrl } from '../../lib/images'

export default function Img({ id, alt, sizes = '100vw', priority = false, className, width = 1600, height = 1067, onLoad }) {
  return (
    <img
      src={photoUrl(id, 1080)}
      srcSet={photoSrcSet(id)}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      draggable="false"
      onLoad={onLoad}
    />
  )
}
