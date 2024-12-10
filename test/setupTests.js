// src/setupTests.js
import '@testing-library/jest-dom';
import { worker } from './mocks/browser';

// Starta MSW före alla tester
beforeAll(() => worker.start());

// Stoppa MSW efter alla tester
afterAll(() => worker.stop());

// Nollställ handlers efter varje test
afterEach(() => worker.resetHandlers());
