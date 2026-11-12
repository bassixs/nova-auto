// JS API Яндекс Карт 2.1. Ключ необязателен для показа карты, но Яндекс рекомендует его получить:
// https://developer.tech.yandex.ru → «JavaScript API и HTTP Геокодер», затем задать VITE_YMAPS_KEY при сборке.
const KEY = import.meta.env.VITE_YMAPS_KEY || ''

let promise = null

export function loadYmaps() {
  if (promise) return promise
  promise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU${KEY ? `&apikey=${encodeURIComponent(KEY)}` : ''}`
    script.async = true
    script.onload = () => window.ymaps.ready(() => resolve(window.ymaps), reject)
    script.onerror = () => reject(new Error('Yandex Maps failed to load'))
    document.head.appendChild(script)
    setTimeout(() => reject(new Error('Yandex Maps timed out')), 15000)
  })
  promise.catch(() => {
    promise = null
  })
  return promise
}
