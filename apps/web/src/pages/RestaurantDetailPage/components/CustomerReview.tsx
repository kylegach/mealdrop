import styled, { css } from 'styled-components'
import { Stars, Body } from '@mealdrop/ui'

const ReviewContainer = styled.div(
  ({ theme: { spacing, color } }) => css`
    display: flex;
    gap: ${spacing.m};
    padding: ${spacing.l} 0;
    border-bottom: 1px solid ${color.headerBorder};

    &:last-child {
      border-bottom: none;
    }
  `
)

const Avatar = styled.img(
  ({ theme: { borderRadius } }) => css`
    width: 48px;
    height: 48px;
    border-radius: ${borderRadius.round};
    flex-shrink: 0;
  `
)

const ReviewContent = styled.div`
  flex: 1;
`

const ReviewHeader = styled.div(
  ({ theme: { spacing } }) => css`
    display: flex;
    align-items: center;
    gap: ${spacing.s};
    margin-bottom: ${spacing.xs};
  `
)

const ReviewerName = styled.span(
  ({ theme: { typography, color } }) => css`
    font-size: ${typography.fontSize.heading4};
    font-weight: ${typography.fontWeight.bold};
    color: ${color.primaryText};
  `
)

const ReviewText = styled(Body)(
  ({ theme: { spacing } }) => css`
    margin-top: ${spacing.s};
  `
)

export type CustomerReviewProps = {
  avatarUrl: string
  name: string
  rating: number
  reviewText: string
}

export const CustomerReview = ({ avatarUrl, name, rating, reviewText }: CustomerReviewProps) => {
  return (
    <ReviewContainer>
      <Avatar src={avatarUrl} alt={`${name}'s avatar`} />
      <ReviewContent>
        <ReviewHeader>
          <ReviewerName>{name}</ReviewerName>
          <Stars rating={rating} />
        </ReviewHeader>
        <ReviewText>{reviewText}</ReviewText>
      </ReviewContent>
    </ReviewContainer>
  )
}
