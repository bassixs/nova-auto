import { useCallback, useEffect, useMemo, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { initSmoothScroll, scrollToTarget } from './lib/scroll'
import { BookingContext } from './lib/booking'
import Preloader from './components/Preloader'
import Header from './components/Header'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Advantages from './components/Advantages'
import Services from './components/Services'
import ServiceModal from './components/ServiceModal'
import Pricing from './components/Pricing'
import Gallery from './components/Gallery'
import Lightbox from './components/Lightbox'
import About from './components/About'
import Reviews from './components/Reviews'
import Booking from './components/Booking'
import Contacts from './components/Contacts'
import Footer from './components/Footer'
import MobileBar from './components/MobileBar'

export default function App() {
  const [ready, setReady] = useState(false)
  const [request, setRequest] = useState(null)
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

  const chooseService = useCallback((name) => {
    setRequest({ name, at: Date.now() })
    scrollToTarget('#booking')
  }, [])

  const closeService = useCallback(() => setOpenService(null), [])

  const booking = useMemo(() => ({ request, chooseService }), [request, chooseService])

  return (
    <MotionConfig reducedMotion="user">
      <BookingContext.Provider value={booking}>
        <Preloader onDone={handleReady} />
        <Header ready={ready} />
        <main>
          <Hero ready={ready} />
          <Marquee />
          <Advantages />
          <Services onOpen={setOpenService} />
          <Pricing />
          <Gallery onOpen={setPhotoIndex} />
          <About />
          <Reviews />
          <Booking />
          <Contacts />
        </main>
        <Footer />
        <MobileBar />
        <ServiceModal service={openService} onClose={closeService} />
        <Lightbox index={photoIndex} onChange={setPhotoIndex} />
      </BookingContext.Provider>
    </MotionConfig>
  )
}
