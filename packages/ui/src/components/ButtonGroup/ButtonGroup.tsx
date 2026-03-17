import * as React from 'react'
import styled, { css } from 'styled-components'

type ButtonGroupProps = {
  /** The buttons to render inside the group */
  children: React.ReactNode
} & React.ComponentProps<'div'>

const StyledButtonGroup = styled.div(
  ({ theme: { color, borderRadius, spacing } }) => css`
    display: inline-flex;
    align-items: center;
    gap: ${spacing.xs};
    padding: ${spacing.xs};
    background-color: ${color.buttonSecondary};
    border-radius: ${borderRadius.s};

    & > button {
      background-color: transparent;
      border: none;
      border-radius: ${borderRadius.xs};
      padding: 0.625rem 1rem;
      font-family: 'Hind';
      font-weight: 500;
      cursor: pointer;
      color: ${color.accentText};
      transition: background-color 150ms ease-in;

      &:hover {
        background-color: ${color.buttonSecondaryHover};
      }

      &[aria-pressed='true'],
      &[data-active='true'] {
        background-color: ${color.white};
      }

      &:disabled {
        opacity: 0.4;
        cursor: default;
      }
    }
  `
)

/**
 * Groups related buttons together with a shared `buttonSecondary` background.
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, ...props }) => {
  return <StyledButtonGroup {...props}>{children}</StyledButtonGroup>
}
