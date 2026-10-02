import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * MSW browser worker.
 * Started in main.tsx before rendering the app.
 */
export const worker = setupWorker(...handlers)
