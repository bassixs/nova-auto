// Яндекс Метрика подключается, только если при сборке задан номер счётчика VITE_YM_ID
const ID = Number(import.meta.env.VITE_YM_ID) || 0

export function initMetrika() {
  if (!ID || window.ym) return
  window.ym = function () {
    ;(window.ym.a = window.ym.a || []).push(arguments)
  }
  window.ym.l = Date.now()
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://mc.yandex.ru/metrika/tag.js'
  document.head.appendChild(script)
  window.ym(ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true })
}

export function reachGoal(name) {
  if (ID && window.ym) window.ym(ID, 'reachGoal', name)
}
