// src/mocks/browser.js

import { setupServer } from 'msw/node'; // Importera setupServer för Node.js-miljö
import { handlers } from './handlers'; // Importera dina API-mockar

// Setup server för MSW
export const server = setupServer(...handlers);
