import { useState } from 'react'
import styled, { css } from 'styled-components'
import { Heading, Body, Stars, Input, Button } from '@mealdrop/ui'

const ReviewsContainer = styled.div(
  ({ theme: { spacing } }) => css`
    padding: ${spacing.xl} 0;
  `
)

const ReviewForm = styled.form(
  ({ theme: { color, spacing } }) => css`
    background: ${color.cardBackground};
    padding: ${spacing.l};
    border-radius: 8px;
    margin-bottom: ${spacing.xl};
  `
)

const FormRow = styled.div(
  ({ theme: { spacing } }) => css`
    margin-bottom: ${spacing.m};
  `
)

const StyledButton = styled(Button)(
  ({ theme: { color } }) => css`
    background: ${color.buttonSecondary};
    color: ${color.black};
    
    &:hover:not(:disabled) {
      background: ${color.buttonSecondaryHover};
    }
  `
)

const ReviewsList = styled.div(
  ({ theme: { spacing } }) => css`
    display: flex;
    flex-direction: column;
    gap: ${spacing.l};
  `
)

const ReviewCard = styled.div(
  ({ theme: { color, spacing } }) => css`
    background: ${color.cardBackground};
    padding: ${spacing.l};
    border-radius: 8px;
    display: flex;
    gap: ${spacing.m};
  `
)

const Avatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`

const ReviewContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const ReviewHeader = styled.div(
  ({ theme: { spacing } }) => css`
    display: flex;
    align-items: center;
    gap: ${spacing.s};
    margin-bottom: ${spacing.xs};
  `
)

const ReviewText = styled(Body)(
  ({ theme: { spacing } }) => css`
    margin-top: ${spacing.s};
  `
)

type Review = {
  id: number
  name: string
  avatar: string
  rating: number
  text: string
}

const initialReviews: Review[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    text: 'Absolutely amazing! The food was fresh, flavorful, and beautifully presented. Will definitely order again!',
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?img=33',
    rating: 4.5,
    text: 'Great experience overall. The portions were generous and everything arrived hot. The flavors were authentic and delicious.',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    text: "Best delivery I've had in months! The packaging was excellent and the food tasted like it came straight from the kitchen. Highly recommend!",
  },
  {
    id: 4,
    name: 'David Thompson',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 4,
    text: 'Very satisfied with the quality and taste. The delivery was prompt and the driver was friendly. Will order again soon.',
  },
]

export const CustomerReviews = () => {
  const [reviews] = useState<Review[]>(initialReviews)
  const [name, setName] = useState('')
  const [rating, setRating] = useState('')
  const [reviewText, setReviewText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to an API
    console.log('Review submitted:', { name, rating, reviewText })
    setName('')
    setRating('')
    setReviewText('')
  }

  return (
    <ReviewsContainer>
      <div className="container">
        <Heading level={3}>Customer Reviews</Heading>
        
        <ReviewForm onSubmit={handleSubmit}>
          <Heading level={4}>Share Your Experience</Heading>
          <FormRow>
            <Input
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </FormRow>
          <FormRow>
            <Input
              label="Rating (1-5)"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="Rate from 1 to 5"
            />
          </FormRow>
          <FormRow>
            <Input
              label="Your Review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about your experience"
            />
          </FormRow>
          <StyledButton type="submit">Submit Review</StyledButton>
        </ReviewForm>

        <ReviewsList>
          {reviews.map((review) => (
            <ReviewCard key={review.id}>
              <Avatar src={review.avatar} alt={review.name} />
              <ReviewContent>
                <ReviewHeader>
                  <Body fontWeight="bold">{review.name}</Body>
                  <Stars rating={review.rating} />
                </ReviewHeader>
                <ReviewText>{review.text}</ReviewText>
              </ReviewContent>
            </ReviewCard>
          ))}
        </ReviewsList>
      </div>
    </ReviewsContainer>
  )
}
