import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Button } from '../Button'
import { Body } from '../typography'

const Form = styled.form(
  ({ theme: { color, borderRadius } }) => css`
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    background: ${color.cardBackground};
    border-radius: ${borderRadius.s};
    max-width: 600px;
  `
)

const FormGroup = styled.div(
  ({ theme: { spacing } }) => css`
    display: flex;
    flex-direction: column;
    gap: ${spacing.xs};
  `
)

const Label = styled(Body)(
  ({ theme: { color } }) => css`
    color: ${color.label};
    font-weight: medium;
  `
)

const StarRatingContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const StarButton = styled.button<{ $selected: boolean; $hovered: boolean }>(
  ({ theme: { color }, $selected, $hovered }) => css`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 32px;
    padding: 0;
    transition: transform 0.2s;
    color: ${$selected || $hovered ? color.primaryText : color.inputHint};

    &:hover {
      transform: scale(1.1);
    }

    &:focus {
      outline: 2px solid ${color.primaryText};
      outline-offset: 2px;
      border-radius: 4px;
    }
  `
)

const TextArea = styled.textarea(
  ({ theme: { color, boxShadow, borderRadius } }) => css`
    outline: none;
    padding: 13px 16px;
    box-sizing: border-box;
    border-radius: ${borderRadius.xs};
    border: none;
    color: ${color.primaryText};
    background: ${color.inputBackground};
    margin: 0;
    font-family: inherit;
    font-size: 16px;
    line-height: 1.6;
    resize: vertical;
    min-height: 120px;

    &::placeholder {
      color: ${color.inputHint};
    }

    &:focus,
    &:hover {
      box-shadow: ${boxShadow.outerBorder};
    }
  `
)

const ErrorMessage = styled(Body)(
  ({ theme: { color, spacing } }) => css`
    color: ${color.error};
    margin-top: ${spacing.xxs};
    font-size: 12px;
    min-height: 16px;
  `
)

const RatingValue = styled(Body)(
  ({ theme: { color } }) => css`
    color: ${color.primaryText};
    margin-left: 8px;
  `
)

export type ReviewFormProps = {
  onSubmit: (data: { rating: number; text: string }) => void
  submitButtonText?: string
  ratingLabel?: string
  textLabel?: string
  textPlaceholder?: string
  className?: string
}

export const ReviewForm = ({
  onSubmit,
  submitButtonText = 'Submit Review',
  ratingLabel = 'Your Rating',
  textLabel = 'Your Review',
  textPlaceholder = 'Share your experience...',
  className,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [text, setText] = useState('')
  const [errors, setErrors] = useState({ rating: '', text: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = { rating: '', text: '' }

    if (rating === 0) {
      newErrors.rating = 'Please select a rating'
    }

    if (text.trim().length === 0) {
      newErrors.text = 'Please write a review'
    } else if (text.trim().length < 10) {
      newErrors.text = 'Review must be at least 10 characters'
    }

    setErrors(newErrors)

    if (!newErrors.rating && !newErrors.text) {
      onSubmit({ rating, text: text.trim() })
      // Reset form
      setRating(0)
      setText('')
    }
  }

  const getRatingText = (value: number) => {
    if (value === 0) return ''
    if (value === 1) return 'Poor'
    if (value === 2) return 'Fair'
    if (value === 3) return 'Good'
    if (value === 4) return 'Very Good'
    return 'Excellent'
  }

  return (
    <Form onSubmit={handleSubmit} className={className}>
      <FormGroup>
        <Label type="label">{ratingLabel}</Label>
        <StarRatingContainer>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarButton
              key={star}
              type="button"
              $selected={star <= rating}
              $hovered={star <= hoveredRating}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              ★
            </StarButton>
          ))}
          {(hoveredRating || rating) > 0 && (
            <RatingValue size="S">{getRatingText(hoveredRating || rating)}</RatingValue>
          )}
        </StarRatingContainer>
        <ErrorMessage>{errors.rating || ' '}</ErrorMessage>
      </FormGroup>

      <FormGroup>
        <Label type="label" htmlFor="review-text">
          {textLabel}
        </Label>
        <TextArea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={textPlaceholder}
          aria-label={textLabel}
        />
        <ErrorMessage>{errors.text || ' '}</ErrorMessage>
      </FormGroup>

      <Button type="submit">{submitButtonText}</Button>
    </Form>
  )
}
