import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Heading, Body, Stars, Input } from '@mealdrop/ui'
import { breakpoints } from '@mealdrop/ui/styles'

type Review = {
  id: number
  name: string
  avatar: string
  rating: number
  text: string
}

const placeholderReviews: Review[] = [
  {
    id: 1,
    name: 'Maya Johnson',
    avatar: 'https://i.pravatar.cc/80?img=1',
    rating: 5,
    text: 'Absolutely loved the food here! The flavors were incredible and everything arrived fresh. Will definitely be ordering again soon.',
  },
  {
    id: 2,
    name: 'Liam Chen',
    avatar: 'https://i.pravatar.cc/80?img=3',
    rating: 4.5,
    text: 'Great variety on the menu. The desserts are to die for. Only reason for not giving 5 stars is the wait time, but totally worth it!',
  },
  {
    id: 3,
    name: 'Ava Patel',
    avatar: 'https://i.pravatar.cc/80?img=5',
    rating: 4,
    text: 'Really solid meal. The portion sizes are generous and the quality is top-notch. My whole family enjoyed it.',
  },
  {
    id: 4,
    name: 'Noah Williams',
    avatar: 'https://i.pravatar.cc/80?img=8',
    rating: 5,
    text: 'This is my go-to spot whenever I am craving something special. Consistently delicious every single time.',
  },
  {
    id: 5,
    name: 'Sophie Martinez',
    avatar: 'https://i.pravatar.cc/80?img=9',
    rating: 3.5,
    text: 'Good food overall. A couple of dishes were a bit too salty for my taste, but the service and presentation were lovely.',
  },
]

const Section = styled.div(
  ({ theme: { color } }) => css`
    padding-top: 3rem;
    padding-bottom: 3rem;
    background: ${color.restaurantDetailBackground};
    border-top: 1px solid ${color.headerBorder};
  `
)

const ReviewForm = styled.form(
  ({ theme: { color, spacing, borderRadius } }) => css`
    background: ${color.cardBackground};
    border-radius: ${borderRadius.s};
    padding: ${spacing.l};
    margin-bottom: ${spacing.xl};
  `
)

const FormRow = styled.div(
  ({ theme: { spacing } }) => css`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${spacing.s};
    margin-bottom: ${spacing.s};

    @media ${breakpoints.M} {
      grid-template-columns: 1fr 1fr;
    }
  `
)

const TextArea = styled.textarea(
  ({ theme: { color, borderRadius, boxShadow, spacing } }) => css`
    outline: none;
    padding: 13px 16px;
    box-sizing: border-box;
    border-radius: ${borderRadius.xs};
    border: none;
    color: ${color.primaryText};
    background: ${color.inputBackground};
    font-family: 'Hind', sans-serif;
    font-size: 1rem;
    resize: vertical;
    min-height: 100px;
    width: 100%;
    margin-bottom: ${spacing.s};

    &::placeholder {
      color: ${color.inputHint};
    }

    &:focus,
    &:hover {
      box-shadow: ${boxShadow.outerBorder};
    }
  `
)

const RatingSelect = styled.div(
  ({ theme: { spacing } }) => css`
    display: flex;
    flex-direction: column;
    padding-bottom: 0;

    label {
      font-family: 'Hind', sans-serif;
      font-size: 0.9rem;
      margin-bottom: ${spacing.xxs};
    }
  `
)

const RatingOptions = styled.div(
  ({ theme: { spacing } }) => css`
    display: flex;
    gap: ${spacing.xs};
  `
)

const RatingButton = styled.button<{ $active: boolean }>(
  ({ $active, theme: { color, borderRadius, boxShadow } }) => css`
    outline: none;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: ${borderRadius.xs};
    cursor: pointer;
    font-family: 'Hind', sans-serif;
    font-weight: 700;
    font-size: 0.875rem;
    background: ${$active ? color.buttonSecondary : color.inputBackground};
    color: ${$active ? color.accentText : color.primaryText};

    &:hover {
      background: ${color.buttonSecondaryHover};
    }

    &:focus {
      box-shadow: ${boxShadow.outerBorder};
    }
  `
)

const SubmitButton = styled.button(
  ({ theme: { color, borderRadius, boxShadow } }) => css`
    outline: none;
    border: none;
    border-radius: ${borderRadius.xs};
    padding: 0.875rem 1.5rem;
    font-family: 'Hind', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    background: ${color.buttonSecondary};
    color: ${color.accentText};

    &:hover {
      background: ${color.buttonSecondaryHover};
    }

    &:focus {
      box-shadow: ${boxShadow.outerBorder};
    }
  `
)

const ReviewList = styled.div(
  ({ theme: { spacing } }) => css`
    display: flex;
    flex-direction: column;
    gap: ${spacing.l};
  `
)

const ReviewCard = styled.div(
  ({ theme: { color, spacing, borderRadius } }) => css`
    display: flex;
    gap: ${spacing.m};
    background: ${color.cardBackground};
    border-radius: ${borderRadius.s};
    padding: ${spacing.l};
  `
)

const Avatar = styled.img(
  ({ theme: { borderRadius } }) => css`
    width: 48px;
    height: 48px;
    border-radius: ${borderRadius.round};
    object-fit: cover;
    flex-shrink: 0;
  `
)

const ReviewContent = styled.div`
  flex: 1;
  min-width: 0;
`

const ReviewHeader = styled.div(
  ({ theme: { spacing } }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: ${spacing.xs};
    margin-bottom: ${spacing.xs};
  `
)

export const CustomerReviews = () => {
  const [reviews, setReviews] = useState<Review[]>(placeholderReviews)
  const [name, setName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState<number>(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !reviewText.trim() || rating === 0) return

    const newReview: Review = {
      id: Date.now(),
      name: name.trim(),
      avatar: `https://i.pravatar.cc/80?u=${Date.now()}`,
      rating,
      text: reviewText.trim(),
    }

    setReviews([newReview, ...reviews])
    setName('')
    setReviewText('')
    setRating(0)
  }

  return (
    <Section>
      <div className="container">
        <Heading level={3}>Customer Reviews</Heading>
        <ReviewForm onSubmit={handleSubmit} aria-label="Write a review">
          <Heading level={4}>Leave a Review</Heading>
          <FormRow>
            <Input
              label="Your name"
              id="review-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
            <RatingSelect>
              <label id="rating-label">Rating</label>
              <RatingOptions role="group" aria-labelledby="rating-label">
                {[1, 2, 3, 4, 5].map((value) => (
                  <RatingButton
                    key={value}
                    type="button"
                    $active={rating === value}
                    onClick={() => setRating(value)}
                    aria-label={`${value} star${value !== 1 ? 's' : ''}`}
                    aria-pressed={rating === value}
                  >
                    {value}★
                  </RatingButton>
                ))}
              </RatingOptions>
            </RatingSelect>
          </FormRow>
          <TextArea
            placeholder="Share your experience..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            aria-label="Review text"
          />
          <SubmitButton type="submit">Submit Review</SubmitButton>
        </ReviewForm>

        <ReviewList>
          {reviews.map((review) => (
            <ReviewCard key={review.id}>
              <Avatar src={review.avatar} alt={`${review.name}'s avatar`} />
              <ReviewContent>
                <ReviewHeader>
                  <Body fontWeight="bold">{review.name}</Body>
                  <Stars rating={review.rating} />
                </ReviewHeader>
                <Body size="S">{review.text}</Body>
              </ReviewContent>
            </ReviewCard>
          ))}
        </ReviewList>
      </div>
    </Section>
  )
}
