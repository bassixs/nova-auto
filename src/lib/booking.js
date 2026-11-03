import { createContext, useContext } from 'react'

export const BookingContext = createContext({ request: null, chooseService: () => {} })

export const useBooking = () => useContext(BookingContext)
