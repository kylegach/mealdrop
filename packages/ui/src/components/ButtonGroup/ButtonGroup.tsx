import styled from 'styled-components'

type ButtonGroupProps = {
  children: React.ReactNode
}

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`

const GroupButton = styled.button`
  background: ${({ theme }) => theme.color.buttonSecondary};
  color: ${({ theme }) => theme.color.black};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.s};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.s}`};
  font-family: ${({ theme }) => theme.fonts.family};
  font-size: ${({ theme }) => theme.typography.fontSize.bodyS};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.color.buttonSecondaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export type { ButtonGroupProps }
export { ButtonGroup, GroupButton }

function ButtonGroup({ children }: ButtonGroupProps) {
  return <Container>{children}</Container>
}
