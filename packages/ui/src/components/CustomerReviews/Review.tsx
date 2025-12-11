import styled, { css } from 'styled-components'

import { Body, Heading } from '../typography'
import { Stars } from '../Stars'

const ReviewContainer = styled.div(
  ({ theme: { color, borderRadius } }) => css`
    display: flex;
    gap: 16px;
    padding: 20px;
    background: ${color.cardBackground};
    border-radius: ${borderRadius.s};
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`

const ReviewHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ReviewText = styled(Body)`
  line-height: 1.6;
`

export type ReviewProps = {
  name: string
  rating: number
  text: string
  avatarUrl: string
  className?: string
}

export const Review = ({
  name,
  rating,
  text,
  avatarUrl,
  className,
}: ReviewProps) => (
  <ReviewContainer className={className}>
    <Avatar src={avatarUrl} alt={`${name}'s avatar`} />
    <ReviewContent>
      <ReviewHeader>
        <Heading level={4}>{name}</Heading>
        <Stars rating={rating} />
      </ReviewHeader>
      <ReviewText>{text}</ReviewText>
    </ReviewContent>
  </ReviewContainer>
)
