import { Meta, StoryObj } from '@storybook/react-vite'
import { http, HttpResponse, delay } from 'msw'
import { expect } from 'storybook/test'

import { BASE_URL } from '../../api'
import { restaurantsCompleteData } from '../../stub/restaurants'
import { withDeeplink } from '../../../.storybook/withDeeplink'

import { SearchResultsPage } from './SearchResultsPage'

const meta = {
  title: 'Pages/SearchResultsPage',
  component: SearchResultsPage,
  parameters: {
    layout: 'fullscreen',
    deeplink: { route: '/search?q=burger', path: '/search' },
    msw: {
      handlers: [
        http.get(BASE_URL, ({ request }) => {
          const url = new URL(request.url)
          const id = url.searchParams.get('id')

          if (id) {
            return HttpResponse.json(restaurantsCompleteData[0])
          }

          return HttpResponse.json(restaurantsCompleteData)
        }),
      ],
    },
  },
  decorators: [withDeeplink],
} satisfies Meta<typeof SearchResultsPage>

export default meta
type Story = StoryObj<typeof meta>

export const WithResults: Story = {
  play: async ({ canvas }) => {
    // Should show restaurant results for "burger"
    const heading = await canvas.findByText('Restaurants')
    await expect(heading).toBeVisible()
    // Should find restaurant cards
    const cards = await canvas.findAllByTestId('restaurant-card')
    await expect(cards.length).toBeGreaterThan(0)
    // Should show menu items section
    await expect(await canvas.findByText('Menu items')).toBeVisible()
  },
}

export const NoResults: Story = {
  parameters: {
    deeplink: { route: '/search?q=xyznonexistent', path: '/search' },
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('No matches found')).toBeVisible()
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(BASE_URL, async () => {
          await delay('infinite')
        }),
      ],
    },
  },
}

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(BASE_URL, () => {
          return new HttpResponse(null, { status: 500 })
        }),
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Something went wrong!')).toBeVisible()
    await expect(canvas.getByText('Try again')).toBeVisible()
  },
}

export const ClickRestaurantResult: Story = {
  play: async ({ canvas, userEvent }) => {
    // Wait for results and click the first restaurant card
    const cards = await canvas.findAllByTestId('restaurant-card')
    await userEvent.click(cards[0])
    // Should navigate to restaurant detail
    await expect(await canvas.findByText(/Nicest place for burgers/)).toBeVisible()
  },
}

export const ClickMenuItem: Story = {
  parameters: {
    deeplink: { route: '/search?q=cheeseburger', path: '/search' },
  },
  play: async ({ canvas, userEvent }) => {
    // Wait for menu item results — multiple restaurants share the same item
    const menuItems = await canvas.findAllByText('Cheeseburger')
    await userEvent.click(menuItems[0])
    // Should navigate to restaurant detail
    await expect(await canvas.findByText(/Nicest place for burgers/)).toBeVisible()
  },
}
