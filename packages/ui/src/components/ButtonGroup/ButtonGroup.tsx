import * as React from 'react'
import styled, { css } from 'styled-components'

const StyledButtonGroup = styled.div(
  ({ theme: { color, borderRadius } }) => css`
    display: inline-flex;
    align-items: center;
    gap: 0;

    & > button {
      outline: none;
      border: 0;
      font-family: 'Hind';
      padding: 0.875rem 1rem;
      color: ${color.accentText};
      background-color: ${color.buttonSecondary};
      cursor: pointer;
      transition: background-color 150ms ease-in;

      &:hover {
        background-color: ${color.buttonSecondaryHover};
      }

      &:disabled {
        background-color: ${color.buttonSecondary};
        opacity: 0.4;
        cursor: default;
      }

      &:first-child {
        border-radius: ${borderRadius.xs} 0 0 ${borderRadius.xs};
      }

      &:last-child {
        border-radius: 0 ${borderRadius.xs} ${borderRadius.xs} 0;
      }

      &:only-child {
        border-radius: ${borderRadius.xs};
      }
    }
  `
)

type ButtonGroupProps = {
  children: React.ReactNode
} & React.ComponentProps<'div'>

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, ...props }) => (
  <StyledButtonGroup role="group" {...props}>
    {children}
  </StyledButtonGroup>
)
