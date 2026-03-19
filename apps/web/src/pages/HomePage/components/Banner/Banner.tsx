import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { Button, Heading } from '@mealdrop/ui'
import { breakpoints } from '@mealdrop/ui/styles'
import ladies from '../../../../assets/images/ladies.svg'

const Container = styled.div(
  ({ theme: { color } }) => css`
    background: ${color.bannerBackground};
    width: 100%;
    position: relative;
    height: 410px;
    padding-top: 3.75rem;

    @media ${breakpoints.M} {
      padding-top: 6rem;
      height: 566px;
    }
  `
)

const ContentContainer = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 1;
`

const Image = styled.div<{ src: string }>(
  ({ src }) => css`
    background: url(${src});
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: 700px;
    position: absolute;
    bottom: 0;
    @media ${breakpoints.M} {
      background-size: 1000px;
    }
  `
)

const StyledHeading = styled(Heading)(
  ({ theme: { color } }) => `
  margin-bottom: 2.5rem;
  padding: 0 2rem;
  strong {
    color: ${color.primaryText};
    font-weight: 900;
  }
`
)

const SearchForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem;

  @media ${breakpoints.M} {
    width: 66%;
  }
`

const SearchInput = styled.input(
  ({ theme: { color, borderRadius } }) => css`
    width: 100%;
    padding: 0.875rem 1rem;
    font-family: 'Hind';
    font-size: 1rem;
    border: 0;
    border-radius: ${borderRadius.xs};
    background-color: ${color.white};
    color: ${color.primaryText};
    outline: none;

    &::placeholder {
      color: ${color.inputHint};
    }
  `
)

export const Banner = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <Container>
      <ContentContainer>
        <StyledHeading level={2}>
          <strong>Hungry?</strong> find your next meal
        </StyledHeading>
        <SearchForm onSubmit={handleSubmit}>
          <SearchInput
            type="text"
            placeholder="Search for restaurant or food…"
            aria-label="Search for restaurant or food"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </SearchForm>
      </ContentContainer>
      <Image src={ladies} />
    </Container>
  )
}
