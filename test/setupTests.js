
import '@testing-library/jest-dom';
import { worker } from './mocks/browser';
import 'whatwg-fetch';



beforeAll(() => worker.start());


afterAll(() => worker.stop());


afterEach(() => worker.resetHandlers());
