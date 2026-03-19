import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Banner } from './Banner'

const meta = {
  title: 'Pages/HomePage/Components/Banner',
  component: Banner,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3Q1HTCalD0lJnNvcMoEw1x/Mealdrop?type=design&node-id=1690-5067&mode=design&t=PGeoMU7t8HOFToQL-4',
    },
  },
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Mobile: Story = {
  globals: {
    viewport: { value: 'iphonex', isRotated: false },
  },
}

export const SearchSubmit: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Search for restaurant or food')
    await userEvent.type(input, 'burger')
    await expect(input).toHaveValue('burger')
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }))
  },
}

export const EmptySearchSubmit: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Search for restaurant or food')
    await expect(input).toHaveValue('')
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }))
    // Form should still be visible — no navigation occurred
    await expect(canvas.getByRole('button', { name: 'Search' })).toBeVisible()
  },
}
