
import '@testing-library/jest-dom';
import { worker } from './mocks/browser';


beforeAll(() => worker.start());


afterAll(() => worker.stop());


afterEach(() => worker.resetHandlers());
