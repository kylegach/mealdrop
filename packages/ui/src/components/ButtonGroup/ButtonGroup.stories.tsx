import type { StoryObj, Meta } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { ButtonGroup, GroupButton } from './ButtonGroup'

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  args: {
    children: (
      <>
        <GroupButton>One</GroupButton>
        <GroupButton>Two</GroupButton>
        <GroupButton>Three</GroupButton>
      </>
    ),
  },
} satisfies Meta<typeof ButtonGroup>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

const clickHandler = fn()

export const WithClickHandler: Story = {
  args: {
    children: (
      <>
        <GroupButton onClick={clickHandler}>Action A</GroupButton>
        <GroupButton onClick={clickHandler}>Action B</GroupButton>
      </>
    ),
  },
  play: async ({ canvas }) => {
    const buttons = await canvas.findAllByRole('button')
    await buttons[0].click()
    await expect(clickHandler).toHaveBeenCalledTimes(1)
  },
}

export const WithDisabledButton: Story = {
  args: {
    children: (
      <>
        <GroupButton>Enabled</GroupButton>
        <GroupButton disabled>Disabled</GroupButton>
      </>
    ),
  },
  play: async ({ canvas }) => {
    const buttons = await canvas.findAllByRole('button')
    await expect(buttons[1]).toBeDisabled()
  },
}
