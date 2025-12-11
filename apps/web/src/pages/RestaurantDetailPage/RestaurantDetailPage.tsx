import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'

import {
  TopBanner,
  Heading,
  Body,
  Badge,
  Stars,
  AnimatedIllustration,
  ErrorBlock,
  Spinner,
  CustomerReviews,
  ReviewForm,
} from '@mealdrop/ui'
import { PageTemplate } from '@mealdrop/ui/templates'
import { useFetchRestaurant } from '../../api/hooks'
import { useAppDispatch, useAppSelector } from '../../app-state'
import { CartItem, clearItemAction, saveItemAction, selectCartItems } from '../../app-state/cart'

import { FoodItemModal } from './components/FoodItemModal'
import { FoodSection } from './components/FoodSection'

const DetailSection = styled.div(
  ({ theme: { color, spacing } }) => css`
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
    background: ${color.restaurantDetailBackground};
    .review-text {
      color: ${color.reviewText};
      margin-bottom: ${spacing.m};
    }
  `
)

const MenuSection = styled.div(
  ({ theme: { color } }) => css`
    padding-top: 3rem !important;
    padding-bottom: 5rem !important;
    background: ${color.menuSectionBackground};
  `
)

const ReviewsSection = styled.div(
  ({ theme: { color } }) => css`
    padding-top: 3rem !important;
    padding-bottom: 5rem !important;
    background: ${color.restaurantDetailBackground};
  `
)

const ReviewsSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  max-width: 1000px;
  margin: 0 auto;
`

const StyledBadge = styled(Badge)(
  ({ theme: { spacing } }) => css`
    margin-right: ${spacing.s};
  `
)

// Mock reviews data - in a real app, this would come from an API
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
]

export const RestaurantDetailPage = () => {
  const { id = '' } = useParams<'id'>()

  const navigate = useNavigate()
  const { restaurant, status, retryRequest } = useFetchRestaurant(id)

  const [selectedItem, setSelectedItem] = useState<CartItem>()
  const closeModal = () => setSelectedItem(undefined)

  const [reviews, setReviews] = useState(mockReviews)

  const handleReviewSubmit = (data: { rating: number; text: string }) => {
    const newReview = {
      name: 'You', // In a real app, this would be the logged-in user's name
      rating: data.rating,
      text: data.text,
      avatarUrl: 'https://i.pravatar.cc/150?img=68', // Default avatar for new reviews
    }
    setReviews([newReview, ...reviews])
  }

  const cartItems = useAppSelector(selectCartItems)
  const dispatch = useAppDispatch()
  const addItemToCart = (item: CartItem) => dispatch(saveItemAction(item))
  const clearItemFromCart = (item: CartItem) => dispatch(clearItemAction(item))

  if (status === '500') {
    return (
      <PageTemplate type="sticky-header">
        <ErrorBlock
          title="Something went wrong!"
          body="Our bad, something went wrong on our side."
          image={<AnimatedIllustration animation="NotFound" />}
          onButtonClick={retryRequest}
          buttonText="Try again"
        />
      </PageTemplate>
    )
  }

  if (status === '404') {
    return (
      <PageTemplate type="sticky-header">
        <ErrorBlock
          title="We can't find this page"
          body="This page doesn’t exist, keep looking."
          image={<AnimatedIllustration animation="Error" />}
          onButtonClick={() => navigate('/')}
          buttonText="Home"
        />
      </PageTemplate>
    )
  }

  if (status === 'loading') {
    return (
      <PageTemplate type="sticky-header">
        <Spinner />
      </PageTemplate>
    )
  }

  if (!restaurant) {
    return null
  }

  const { menu, name, rating, specialty, photoUrl, categories } = restaurant

  return (
    <PageTemplate type="sticky-header">
      <FoodItemModal
        item={selectedItem}
        cartItems={cartItems}
        onClose={closeModal}
        onItemSave={addItemToCart}
        onItemRemove={clearItemFromCart}
      />
      <TopBanner photoUrl={photoUrl} onBackClick={() => navigate(-1)} />
      <DetailSection>
        <div className="container">
          <Heading level={2}>{name}</Heading>
          <Body>Specialties: {specialty}</Body>
          <Stars rating={rating} />
          <div>{categories?.map((category) => <StyledBadge key={category} text={category} />)}</div>
        </div>
      </DetailSection>
      <MenuSection>
        <div className="container">
          {menu.food && (
            <FoodSection
              title="To eat"
              items={menu.food}
              cartItems={cartItems}
              onItemClick={setSelectedItem}
            />
          )}
          {menu.dessert && (
            <FoodSection
              title="Dessert"
              items={menu.dessert}
              cartItems={cartItems}
              onItemClick={setSelectedItem}
            />
          )}
          {menu.drinks && (
            <FoodSection
              title="To drink"
              items={menu.drinks}
              cartItems={cartItems}
              onItemClick={setSelectedItem}
            />
          )}
        </div>
      </MenuSection>
      <ReviewsSection>
        <div className="container">
          <ReviewsSectionContent>
            <ReviewForm onSubmit={handleReviewSubmit} />
            <CustomerReviews reviews={reviews} />
          </ReviewsSectionContent>
        </div>
      </ReviewsSection>
    </PageTemplate>
  )
}
