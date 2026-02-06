import { useState } from 'react'
import styled, { css } from 'styled-components'
import { Button, Heading, Input } from '@mealdrop/ui'
import { CustomerReview } from './CustomerReview'

const ReviewsContainer = styled.div(
  ({ theme: { spacing } }) => css`
    padding: ${spacing.xl} 0;
  `
)

const ReviewsHeader = styled.div(
  ({ theme: { spacing } }) => css`
    margin-bottom: ${spacing.xl};
  `
)

const ReviewForm = styled.form(
  ({ theme: { spacing, color, borderRadius, boxShadow } }) => css`
    background: ${color.cardBackground};
    padding: ${spacing.l};
    border-radius: ${borderRadius.m};
    box-shadow: ${boxShadow.card};
    margin-bottom: ${spacing.xl};
  `
)

const FormTitle = styled(Heading)(
  ({ theme: { spacing } }) => css`
    margin-bottom: ${spacing.m};
  `
)

const FormRow = styled.div(
  ({ theme: { spacing } }) => css`
    margin-bottom: ${spacing.m};
  `
)

const RatingSelector = styled.div(
  ({ theme: { spacing } }) => css`
    display: flex;
    align-items: center;
    gap: ${spacing.s};
    margin-bottom: ${spacing.m};
  `
)

const RatingLabel = styled.label(
  ({ theme: { typography, color } }) => css`
    font-size: ${typography.fontSize.body};
    font-weight: ${typography.fontWeight.medium};
    color: ${color.primaryText};
  `
)

const RatingButton = styled.button<{ selected: boolean }>(
  ({ theme: { spacing, color, borderRadius }, selected }) => css`
    background: ${selected ? color.buttonSecondary : color.inputBackground};
    border: none;
    padding: ${spacing.xs} ${spacing.s};
    border-radius: ${borderRadius.s};
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.2s ease;

    &:hover {
      background: ${selected ? color.buttonSecondaryHover : color.headerBorder};
      transform: scale(1.1);
    }
  `
)

const StyledTextarea = styled.textarea(
  ({ theme: { spacing, color, borderRadius, typography, fonts } }) => css`
    width: 100%;
    min-height: 100px;
    padding: ${spacing.s};
    border: 1px solid ${color.headerBorder};
    border-radius: ${borderRadius.s};
    font-family: ${fonts.family};
    font-size: ${typography.fontSize.body};
    resize: vertical;

    &:focus {
      outline: none;
      border-color: ${color.buttonSecondary};
    }
  `
)

const SubmitButton = styled(Button)(
  ({ theme: { color } }) => css`
    background-color: ${color.buttonSecondary};
    
    &:hover:not(:disabled) {
      background-color: ${color.buttonSecondaryHover};
    }
  `
)

const ReviewsList = styled.div``

const mockReviews = [
  {
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    name: 'Sarah Johnson',
    rating: 5,
    reviewText: 'Absolutely amazing food! The flavors were incredible and the service was top-notch. Will definitely be coming back!',
  },
  {
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    name: 'Michael Chen',
    rating: 4.5,
    reviewText: 'Great experience overall. The ambiance was lovely and the dishes were beautifully presented. Highly recommend the signature dish!',
  },
  {
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    name: 'Emma Davis',
    rating: 5,
    reviewText: 'This place never disappoints! Every visit is a delightful culinary journey. The staff are always friendly and attentive.',
  },
  {
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    name: 'David Martinez',
    rating: 4,
    reviewText: 'Solid food and good portions. The wait time was reasonable and the atmosphere was cozy. Perfect for a casual dinner.',
  },
]

export const CustomerReviews = () => {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log({ name, rating, reviewText })
    // Reset form
    setName('')
    setRating(5)
    setReviewText('')
  }

  return (
    <ReviewsContainer>
      <ReviewsHeader>
        <Heading level={3}>Customer Reviews</Heading>
      </ReviewsHeader>

      <ReviewForm onSubmit={handleSubmit}>
        <FormTitle level={4}>Write a Review</FormTitle>
        
        <FormRow>
          <Input
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </FormRow>

        <RatingSelector>
          <RatingLabel>Rating:</RatingLabel>
          {[1, 2, 3, 4, 5].map((star) => (
            <RatingButton
              key={star}
              type="button"
              selected={star <= rating}
              onClick={() => setRating(star)}
              aria-label={`${star} stars`}
            >
              ⭐
            </RatingButton>
          ))}
        </RatingSelector>

        <FormRow>
          <RatingLabel>Your Review</RatingLabel>
          <StyledTextarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience..."
            required
          />
        </FormRow>

        <SubmitButton type="submit">Submit Review</SubmitButton>
      </ReviewForm>

      <ReviewsList>
        {mockReviews.map((review, index) => (
          <CustomerReview key={index} {...review} />
        ))}
      </ReviewsList>
    </ReviewsContainer>
  )
}
