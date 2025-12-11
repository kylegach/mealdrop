import styled from 'styled-components'

import { Heading } from '../typography'
import { Review, ReviewProps } from './Review'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 800px;
`

const ReviewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export type CustomerReviewsProps = {
  reviews: ReviewProps[]
  title?: string
  className?: string
}

export const CustomerReviews = ({
  reviews,
  title = 'Customer Reviews',
  className,
}: CustomerReviewsProps) => (
  <Container className={className}>
    <Heading level={2}>{title}</Heading>
    <ReviewsContainer>
      {reviews.map((review, index) => (
        <Review key={index} {...review} />
      ))}
    </ReviewsContainer>
  </Container>
)
