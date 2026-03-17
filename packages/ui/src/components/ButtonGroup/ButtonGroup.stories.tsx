import type { StoryObj, Meta } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { ButtonGroup } from './ButtonGroup'

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  args: {
    children: (
      <>
        <button>One</button>
        <button>Two</button>
        <button>Three</button>
      </>
    ),
  },
} satisfies Meta<typeof ButtonGroup>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TwoButtons: Story = {
  args: {
    children: (
      <>
        <button>Left</button>
        <button>Right</button>
      </>
    ),
  },
}

export const WithDisabledButton: Story = {
  args: {
    children: (
      <>
        <button>Enabled</button>
        <button disabled>Disabled</button>
        <button>Enabled</button>
      </>
    ),
  },
  play: async ({ canvas }) => {
    const buttons = await canvas.findAllByRole('button')
    await expect(buttons[1]).toBeDisabled()
  },
}

export const ClickHandler: Story = {
  args: {
    onClick: fn(),
    children: null,
  },
  render: (args) => {
    const { onClick, ...rest } = args as any
    return (
      <ButtonGroup {...rest}>
        <button onClick={onClick}>Click me</button>
        <button>Other</button>
      </ButtonGroup>
    )
  },
  play: async ({ canvas, args }) => {
    const button = await canvas.findByText('Click me')
    await button.click()
    await expect((args as any).onClick).toHaveBeenCalledTimes(1)
  },
}
