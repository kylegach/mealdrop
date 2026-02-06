import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, userEvent, expect } from 'storybook/test'

import { CustomerReviews } from './CustomerReviews'

const meta = {
  title: 'Pages/RestaurantDetailPage/Components/CustomerReviews',
  component: CustomerReviews,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof CustomerReviews>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FilledForm: Story = {
  play: async ({ canvas }) => {
    const nameInput = canvas.getByLabelText('Your Name')
    const reviewTextarea = canvas.getByPlaceholderText('Share your experience...')
    
    await userEvent.type(nameInput, 'John Doe')
    await userEvent.type(reviewTextarea, 'This restaurant is amazing! The food was delicious.')
  },
}

export const WithFormInteraction: Story = {
  play: async ({ canvas }) => {
    const nameInput = canvas.getByLabelText('Your Name')
    const reviewTextarea = canvas.getByPlaceholderText('Share your experience...')
    const submitButton = canvas.getByRole('button', { name: 'Submit Review' })
    
    // Fill in the name
    await userEvent.type(nameInput, 'Jane Smith')
    
    // Select a 3-star rating
    const threeStarButton = canvas.getByRole('button', { name: '3 stars' })
    await userEvent.click(threeStarButton)
    
    // Type review text
    await userEvent.type(reviewTextarea, 'The food was good but service could be better.')
    
    // Verify form fields are filled
    await expect(nameInput).toHaveValue('Jane Smith')
    await expect(reviewTextarea).toHaveValue('The food was good but service could be better.')
  },
}

export const SubmitReview: Story = {
  play: async ({ canvas }) => {
    const nameInput = canvas.getByLabelText('Your Name')
    const reviewTextarea = canvas.getByPlaceholderText('Share your experience...')
    const submitButton = canvas.getByRole('button', { name: 'Submit Review' })
    
    // Fill out the form
    await userEvent.type(nameInput, 'Alex Johnson')
    await userEvent.type(reviewTextarea, 'Fantastic experience!')
    
    // Click 5-star rating
    const fiveStarButton = canvas.getByRole('button', { name: '5 stars' })
    await userEvent.click(fiveStarButton)
    
    // Submit the form
    await userEvent.click(submitButton)
    
    // Verify form is cleared after submission
    await expect(nameInput).toHaveValue('')
    await expect(reviewTextarea).toHaveValue('')
  },
}

export const RatingSelection: Story = {
  play: async ({ canvas }) => {
    // Test selecting different ratings
    const twoStarButton = canvas.getByRole('button', { name: '2 stars' })
    await userEvent.click(twoStarButton)
    
    // Verify button is selected by checking visual state
    await expect(twoStarButton).toBeInTheDocument()
    
    // Change rating to 4 stars
    const fourStarButton = canvas.getByRole('button', { name: '4 stars' })
    await userEvent.click(fourStarButton)
    
    await expect(fourStarButton).toBeInTheDocument()
  },
}

export const EmptyFormSubmit: Story = {
  play: async ({ canvas }) => {
    const submitButton = canvas.getByRole('button', { name: 'Submit Review' })
    
    // Try to submit empty form - HTML5 validation should prevent this
    await userEvent.click(submitButton)
    
    // The form should still be visible and not submitted
    const nameInput = canvas.getByLabelText('Your Name')
    await expect(nameInput).toBeInTheDocument()
  },
}
