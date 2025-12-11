import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../store'
import { CartItem } from '../cart'

const selectOrder = (state: RootState) => state.order

export const selectOrderItems = createSelector([selectOrder], (order) => order.items)

export const selectOrderTotal = createSelector([selectOrderItems], (items) =>
  items.reduce((acc: number, item: CartItem) => acc + item.quantity * item.price, 0)
)
