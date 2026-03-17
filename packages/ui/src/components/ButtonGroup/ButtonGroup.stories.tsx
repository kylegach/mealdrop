import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { ButtonGroup } from './ButtonGroup'

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: undefined,
  },
  render: () => (
    <ButtonGroup>
      <button type="button">Option A</button>
      <button type="button">Option B</button>
      <button type="button">Option C</button>
    </ButtonGroup>
  ),
}

export const WithActiveButton: Story = {
  render: () => {
    const [active, setActive] = useState('B')
    return (
      <ButtonGroup>
        {['Option A', 'Option B', 'Option C'].map((label) => (
          <button
            key={label}
            type="button"
            aria-pressed={active === label.split(' ')[1]}
            onClick={() => setActive(label.split(' ')[1])}
          >
            {label}
          </button>
        ))}
      </ButtonGroup>
    )
  },
  play: async ({ canvas }) => {
    const buttonA = await canvas.findByRole('button', { name: 'Option A' })
    const buttonB = await canvas.findByRole('button', { name: 'Option B' })

    await expect(buttonB).toHaveAttribute('aria-pressed', 'true')
    await expect(buttonA).toHaveAttribute('aria-pressed', 'false')

    await buttonA.click()

    await expect(buttonA).toHaveAttribute('aria-pressed', 'true')
    await expect(buttonB).toHaveAttribute('aria-pressed', 'false')
  },
}

export const WithDisabledButton: Story = {
  render: () => (
    <ButtonGroup>
      <button type="button">Enabled</button>
      <button type="button" disabled>
        Disabled
      </button>
      <button type="button">Enabled</button>
    </ButtonGroup>
  ),
  play: async ({ canvas }) => {
    const disabled = await canvas.findByRole('button', { name: 'Disabled' })
    await expect(disabled).toBeDisabled()
  },
}

export const ClickHandler: Story = {
  args: {
    onClick: fn(),
    children: undefined,
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <button type="button">Click me</button>
    </ButtonGroup>
  ),
  play: async ({ canvas, args }) => {
    const button = await canvas.findByRole('button', { name: 'Click me' })
    await button.click()
    await expect(args.onClick).toHaveBeenCalled()
  },
}
