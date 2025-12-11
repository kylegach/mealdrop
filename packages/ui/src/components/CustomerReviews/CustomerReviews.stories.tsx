import type { Meta, StoryObj } from '@storybook/react-vite'

import { CustomerReviews } from './CustomerReviews'

const meta = {
  title: 'Components/CustomerReviews',
  component: CustomerReviews,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CustomerReviews>

export default meta
type Story = StoryObj<typeof meta>

const mockReviews = [
  {
    name: 'Sarah Johnson',
    rating: 5,
    text: 'Absolutely amazing food! The delivery was quick and the packaging kept everything fresh and hot. The flavors were incredible and portions were generous. Will definitely order again!',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Michael Chen',
    rating: 4.5,
    text: "Great experience overall! The menu had lots of variety and the food was delicious. Only minor complaint is I wish they had more vegetarian options, but what they do have is fantastic.",
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
  },
  {
    name: 'Emma Davis',
    rating: 5,
    text: 'Best meal delivery service in town! The app is easy to use, customer service is responsive, and the food always exceeds expectations. The new summer menu items are especially good!',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'James Wilson',
    rating: 4.8,
    text: 'Super impressed with the quality and speed. Ordered late at night and it still arrived perfectly. The burger was juicy, fries were crispy, and even the drink was cold. Highly recommend!',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
]

export const Default: Story = {
  args: {
    reviews: mockReviews,
  },
}

export const SingleReview: Story = {
  args: {
    reviews: [mockReviews[0]],
  },
}

export const TwoReviews: Story = {
  args: {
    reviews: mockReviews.slice(0, 2),
  },
}

export const CustomTitle: Story = {
  args: {
    reviews: mockReviews.slice(0, 3),
    title: 'What Our Customers Say',
  },
}
