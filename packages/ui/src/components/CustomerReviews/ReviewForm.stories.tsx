import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, expect, within, userEvent, waitFor } from 'storybook/test'

import { ReviewForm } from './ReviewForm'

const meta = {
  title: 'Components/CustomerReviews/ReviewForm',
  component: ReviewForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof ReviewForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomLabels: Story = {
  args: {
    ratingLabel: 'Rate this restaurant',
    textLabel: 'Tell us about your experience',
    textPlaceholder: 'What did you think of the food, service, and atmosphere?',
  },
}

export const CustomSubmitButton: Story = {
  args: {
    submitButtonText: 'Post Review',
  },
}

export const ValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Try to submit without filling anything
    const submitButton = canvas.getByRole('button', { name: /submit review/i })
    await userEvent.click(submitButton)
    
    // Check for validation errors
    await waitFor(async () => {
      await expect(canvas.getByText(/please select a rating/i)).toBeInTheDocument()
      await expect(canvas.getByText(/please write a review/i)).toBeInTheDocument()
    })
  },
}

export const InteractiveStarRating: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Find and click the 4-star button
    const fourthStar = canvas.getByRole('button', { name: /rate 4 star/i })
    await userEvent.click(fourthStar)
    
    // Verify rating text appears
    await expect(canvas.getByText(/very good/i)).toBeInTheDocument()
  },
}

export const ShortReviewValidation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Select a rating
    const fifthStar = canvas.getByRole('button', { name: /rate 5 star/i })
    await userEvent.click(fifthStar)
    
    // Type a very short review
    const textarea = canvas.getByRole('textbox', { name: /your review/i })
    await userEvent.type(textarea, 'Good!')
    
    // Try to submit
    const submitButton = canvas.getByRole('button', { name: /submit review/i })
    await userEvent.click(submitButton)
    
    // Check for validation error
    await waitFor(async () => {
      await expect(canvas.getByText(/review must be at least 10 characters/i)).toBeInTheDocument()
    })
  },
}

export const SuccessfulSubmission: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    
    // Select a 5-star rating
    const fifthStar = canvas.getByRole('button', { name: /rate 5 star/i })
    await userEvent.click(fifthStar)
    await expect(canvas.getByText(/excellent/i)).toBeInTheDocument()
    
    // Type a valid review
    const textarea = canvas.getByRole('textbox', { name: /your review/i })
    await userEvent.type(textarea, 'Amazing food and great service! Highly recommend this restaurant.')
    
    // Submit the form
    const submitButton = canvas.getByRole('button', { name: /submit review/i })
    await userEvent.click(submitButton)
    
    // Verify onSubmit was called with correct data
    await waitFor(() => {
      expect(args.onSubmit).toHaveBeenCalledWith({
        rating: 5,
        text: 'Amazing food and great service! Highly recommend this restaurant.',
      })
    })
    
    // Verify form was reset
    await expect(canvas.queryByText(/excellent/i)).not.toBeInTheDocument()
    await expect(textarea).toHaveValue('')
  },
}

export const StarHoverPreview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Hover over the 3rd star
    const thirdStar = canvas.getByRole('button', { name: /rate 3 star/i })
    await userEvent.hover(thirdStar)
    
    // Verify "Good" text appears
    await expect(canvas.getByText(/^good$/i)).toBeInTheDocument()
    
    // Unhover
    await userEvent.unhover(thirdStar)
  },
}

export const ChangeRating: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // First select 2 stars
    const secondStar = canvas.getByRole('button', { name: /rate 2 star/i })
    await userEvent.click(secondStar)
    await expect(canvas.getByText(/fair/i)).toBeInTheDocument()
    
    // Change to 5 stars
    const fifthStar = canvas.getByRole('button', { name: /rate 5 star/i })
    await userEvent.click(fifthStar)
    await expect(canvas.getByText(/excellent/i)).toBeInTheDocument()
    await expect(canvas.queryByText(/fair/i)).not.toBeInTheDocument()
  },
}
