import type { Meta, StoryObj } from '@storybook/react-vite'

import { Review } from './Review'

const meta = {
  title: 'Components/CustomerReviews/Review',
  component: Review,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    rating: {
      control: {
        type: 'range',
        min: 0,
        max: 5,
        step: 0.1,
      },
    },
  },
} satisfies Meta<typeof Review>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'Sarah Johnson',
    rating: 5,
    text: 'Absolutely amazing food! The delivery was quick and the packaging kept everything fresh and hot. The flavors were incredible and portions were generous. Will definitely order again!',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
}

export const HighRating: Story = {
  args: {
    name: 'Michael Chen',
    rating: 4.8,
    text: "Outstanding service and delicious meals! I've been ordering regularly for months now and the quality is always consistent. The new menu items are creative and tasty.",
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
  },
}

export const MediumRating: Story = {
  args: {
    name: 'Emma Davis',
    rating: 3.5,
    text: 'Good food, though delivery took a bit longer than expected. The taste made up for it though, and the portion sizes were fair. Would order again but maybe earlier in the day.',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
}

export const ShortReview: Story = {
  args: {
    name: 'Alex Martinez',
    rating: 5,
    text: 'Love it! Quick, tasty, and affordable.',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
  },
}

export const LongReview: Story = {
  args: {
    name: 'Jessica Thompson',
    rating: 4.5,
    text: 'I have been using this service for several months now and I must say that I am thoroughly impressed with every aspect of it. The food quality is consistently excellent, with fresh ingredients and careful preparation. The delivery drivers are always friendly and professional, and my orders have never been late or incorrect. The app interface is intuitive and makes ordering a breeze. My only minor suggestion would be to add more dessert options, but overall this is hands down the best food delivery service I have used.',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
  },
}
