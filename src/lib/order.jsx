import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { estimate, getService } from '../data/services'
import { scrollToTarget } from './scroll'

const OrderContext = createContext(null)

export const useOrder = () => useContext(OrderContext)

/** Shared state of the catalog and the booking form: vehicle category, location, chosen services. */
export function OrderProvider({ children }) {
  const [vehicle, setVehicleId] = useState(1)
  // The catalog needs a default category to show prices; the form requires an explicit choice
  const [vehicleChosen, setVehicleChosen] = useState(false)
  const [location, setLocation] = useState(null)
  const [direction, setDirection] = useState('wash')
  const [selection, setSelection] = useState({})

  const setVehicle = useCallback((id) => {
    setVehicleId(id)
    setVehicleChosen(true)
  }, [])

  const add = useCallback((id, { qty, variant } = {}) => {
    setSelection((s) => ({
      ...s,
      [id]: { qty: qty ?? s[id]?.qty ?? 1, variant: variant !== undefined ? variant : s[id]?.variant ?? null },
    }))
  }, [])

  const remove = useCallback((id) => {
    setSelection(({ [id]: _removed, ...rest }) => rest)
  }, [])

  const toggle = useCallback((id) => {
    setSelection((s) => {
      if (s[id]) {
        const { [id]: _removed, ...rest } = s
        return rest
      }
      return { ...s, [id]: { qty: 1, variant: null } }
    })
  }, [])

  const setQty = useCallback((id, qty) => {
    setSelection((s) => (s[id] ? { ...s, [id]: { ...s[id], qty: Math.min(20, Math.max(1, qty)) } } : s))
  }, [])

  const clear = useCallback(() => setSelection({}), [])

  const goToBooking = useCallback(() => scrollToTarget('#booking'), [])

  const bookAt = useCallback((locationId) => {
    setLocation(locationId)
    scrollToTarget('#booking')
  }, [])

  const openDirection = useCallback((directionId) => {
    setDirection(directionId)
    scrollToTarget('#pricing')
  }, [])

  const value = useMemo(() => {
    const items = Object.entries(selection).map(([id, entry]) => ({ service: getService(id), ...entry }))
    return {
      vehicle, vehicleChosen, setVehicle,
      location, setLocation,
      direction, setDirection,
      selection, items, total: estimate(items, vehicle),
      add, remove, toggle, setQty, clear,
      goToBooking, bookAt, openDirection,
    }
  }, [vehicle, vehicleChosen, setVehicle, location, direction, selection, add, remove, toggle, setQty, clear, goToBooking, bookAt, openDirection])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}
