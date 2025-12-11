import '@testing-library/jest-dom/vitest'
import * as matchers from 'vitest-axe/matchers'
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview'
import { beforeAll, expect } from 'vitest'
import { setProjectAnnotations } from '@storybook/react-vite'
import * as projectAnnotations from './preview'

expect.extend(matchers)

const project = setProjectAnnotations([a11yAddonAnnotations, projectAnnotations])

beforeAll(project.beforeAll)
