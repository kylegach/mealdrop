import { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent } from 'storybook/test'

import { CustomerReviews } from './CustomerReviews'

const meta = {
  title: 'Pages/RestaurantDetailPage/Components/CustomerReviews',
  component: CustomerReviews,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CustomerReviews>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Customer Reviews')).toBeInTheDocument()
    await expect(canvas.getByText('Maya Johnson')).toBeInTheDocument()
    await expect(canvas.getByText('Liam Chen')).toBeInTheDocument()
    await expect(canvas.getByText('Ava Patel')).toBeInTheDocument()
    await expect(canvas.getByText('Noah Williams')).toBeInTheDocument()
    await expect(canvas.getByText('Sophie Martinez')).toBeInTheDocument()
  },
}

export const SubmitNewReview: Story = {
  play: async ({ canvas, userEvent: user }) => {
    const nameInput = canvas.getByLabelText('Your name')
    await user.type(nameInput, 'Test User')

    const star4 = canvas.getByLabelText('4 stars')
    await user.click(star4)

    const reviewTextArea = canvas.getByLabelText('Review text')
    await user.type(reviewTextArea, 'This is a fantastic restaurant!')

    const submitButton = canvas.getByRole('button', { name: 'Submit Review' })
    await user.click(submitButton)

    await expect(canvas.getByText('Test User')).toBeInTheDocument()
    await expect(canvas.getByText('This is a fantastic restaurant!')).toBeInTheDocument()
  },
}
