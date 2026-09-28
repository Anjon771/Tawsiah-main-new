import { createContext, useState, useContext } from 'react'

const OrderContext = createContext()

export function OrderProvider({ children }) {
  const [orderItems, setOrderItems] = useState([])

  const addToOrder = (item) => {
    const exists = orderItems.find(o => o.place.id === item.place.id)
    if (exists) {
      setOrderItems(prev =>
        prev.map(o =>
          o.place.id === item.place.id ? item : o
        )
      )
    } else {
      setOrderItems(prev => [...prev, item])
    }
  }

  const removeFromOrder = (placeId) => {
    setOrderItems(prev => prev.filter(o => o.place.id !== placeId))
  }

  const clearOrder = () => {
    setOrderItems([])
  }

  const getTotalPrice = () => {
    return orderItems
      .reduce((sum, item) => sum + parseFloat(item.pricing.total), 0)
      .toFixed(2)
  }

  const value = {
    orderItems,
    addToOrder,
    removeFromOrder,
    clearOrder,
    getTotalPrice,
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}
