import { useCallback, useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { initSmoothScroll, scrollToTarget } from './lib/scroll'
import { OrderProvider } from './lib/order'
import Preloader from './components/Preloader'
import Header from './components/Header'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Services from './components/Services'
import ServiceModal from './components/ServiceModal'
import Pricing from './components/Pricing'
import Gallery from './components/Gallery'
import Lightbox from './components/Lightbox'
import About from './components/About'
import Locations from './components/Locations'
import Reviews from './components/Reviews'
import Booking from './components/Booking'
import Footer from './components/Footer'
import OrderBar from './components/OrderBar'

export default function App() {
  const [ready, setReady] = useState(false)
  const [openService, setOpenService] = useState(null)
  const [photoIndex, setPhotoIndex] = useState(null)

  useEffect(() => initSmoothScroll(), [])

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const link = e.target.closest('a[href^="#"]')
      if (!link) return
      const hash = link.getAttribute('href')
      e.preventDefault()
      scrollToTarget(hash)
      history.replaceState(null, '', hash.length > 1 ? hash : location.pathname)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const handleReady = useCallback(() => {
    setReady(true)
    if (location.hash.length > 1) scrollToTarget(location.hash)
  }, [])

  const closeService = useCallback(() => setOpenService(null), [])

  return (
    <MotionConfig reducedMotion="user">
      <OrderProvider>
        <Preloader onDone={handleReady} />
        <Header ready={ready} />
        <main>
          <Hero ready={ready} />
          <Marquee />
          <Services />
          <Pricing onOpen={setOpenService} />
          <Gallery onOpen={setPhotoIndex} />
          <About />
          <Locations />
          <Reviews />
          <Booking />
        </main>
        <Footer />
        <OrderBar />
        <ServiceModal service={openService} onClose={closeService} />
        <Lightbox index={photoIndex} onChange={setPhotoIndex} />
      </OrderProvider>
    </MotionConfig>
  )
}
