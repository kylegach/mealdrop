import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

import {
  TopBanner,
  Body,
  RestaurantCard,
  AnimatedIllustration,
  ErrorBlock,
  Spinner,
} from '@mealdrop/ui'
import { PageTemplate } from '@mealdrop/ui/templates'
import { breakpoints } from '@mealdrop/ui/styles'

import { useFetchRestaurants } from '../../api/hooks'
import type { Restaurant, FoodMenuItem } from '../../types'

const StyledBody = styled(Body)`
  margin-bottom: 2.5rem;
`

const RestaurantGrid = styled.div`
  gap: 12px;
  display: grid;
  padding-bottom: 5rem;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

  @media ${breakpoints.M} {
    gap: 24px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  @media ${breakpoints.XL} {
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  }
`

const MenuItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 3rem;
`

const MenuItemRow = styled(Link)(
  ({ theme: { color, borderRadius } }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: ${color.cardBackground};
    border-radius: ${borderRadius.xs};
    text-decoration: none;
    color: ${color.primaryText};

    &:hover {
      opacity: 0.85;
    }
  `
)

const MenuItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const MenuItemName = styled.span`
  font-weight: 600;
`

const MenuItemRestaurant = styled.span(
  ({ theme: { color } }) => css`
    font-size: 0.85rem;
    color: ${color.secondaryText};
  `
)

const MenuItemPrice = styled.span`
  font-weight: 600;
`

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  margin-top: 2rem;
`

type MatchedMenuItem = FoodMenuItem & {
  restaurantId: string
  restaurantName: string
}

function filterRestaurants(restaurants: Restaurant[], query: string) {
  const q = query.toLowerCase()

  const matchedRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.specialty.toLowerCase().includes(q) ||
      r.categories?.some((c) => c.toLowerCase().includes(q))
  )

  const matchedMenuItems: MatchedMenuItem[] = []
  for (const restaurant of restaurants) {
    const allItems = [
      ...restaurant.menu.food,
      ...restaurant.menu.dessert,
      ...restaurant.menu.drinks,
    ]
    for (const item of allItems) {
      if (item.name.toLowerCase().includes(q)) {
        matchedMenuItems.push({
          ...item,
          restaurantId: restaurant.id || '',
          restaurantName: restaurant.name,
        })
      }
    }
  }

  return { matchedRestaurants, matchedMenuItems }
}

export const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const { status, restaurants, retryRequest } = useFetchRestaurants()

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

  if (status === 'loading' || status === 'idle') {
    return (
      <PageTemplate type="sticky-header">
        <TopBanner title="Search results" onBackClick={() => navigate(-1)} />
        <div className="container" style={{ minHeight: '50vh' }}>
          <Spinner />
        </div>
      </PageTemplate>
    )
  }

  const { matchedRestaurants, matchedMenuItems } = filterRestaurants(restaurants, query)
  const totalResults = matchedRestaurants.length + matchedMenuItems.length

  return (
    <PageTemplate>
      <TopBanner
        title={query ? `Search results for '${query}'` : 'Search results'}
        onBackClick={() => navigate(-1)}
      />
      <div className="container">
        <StyledBody>
          {totalResults === 0
            ? `No results found for '${query}'.`
            : `${totalResults} result${totalResults === 1 ? '' : 's'} found for '${query}'.`}
        </StyledBody>

        {totalResults === 0 && (
          <ErrorBlock
            title="No matches found"
            body="Try a different search term or browse our categories."
            image={<AnimatedIllustration animation="NotFound" />}
            onButtonClick={() => navigate('/categories')}
            buttonText="See all categories"
          />
        )}

        {matchedRestaurants.length > 0 && (
          <>
            <SectionTitle>Restaurants</SectionTitle>
            <RestaurantGrid>
              {matchedRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  name={restaurant.name}
                  rating={restaurant.rating}
                  specialty={restaurant.specialty}
                  photoUrl={restaurant.photoUrl}
                  isClosed={restaurant.isClosed}
                  isNew={restaurant.isNew}
                  categories={restaurant.categories}
                  onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                />
              ))}
            </RestaurantGrid>
          </>
        )}

        {matchedMenuItems.length > 0 && (
          <>
            <SectionTitle>Menu items</SectionTitle>
            <MenuItemList>
              {matchedMenuItems.map((item) => (
                <MenuItemRow
                  key={`${item.restaurantId}-${item.id}`}
                  to={`/restaurants/${item.restaurantId}`}
                >
                  <MenuItemInfo>
                    <MenuItemName>{item.name}</MenuItemName>
                    <MenuItemRestaurant>{item.restaurantName}</MenuItemRestaurant>
                  </MenuItemInfo>
                  <MenuItemPrice>€ {item.price.toFixed(2)}</MenuItemPrice>
                </MenuItemRow>
              ))}
            </MenuItemList>
          </>
        )}
      </div>
    </PageTemplate>
  )
}
