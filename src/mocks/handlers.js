// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
    rest.post('/api/booking', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: '12345',
          when: '2024-12-10T18:00',
          people: 4,
          lanes: 2,
          price: 680
        })
      );
    }),
  
  rest.get('/api/confirmation', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        confirmationDetails: {
          bookingId: '12345',
          date: '2024-12-10',
          time: '18:00',
          people: 4,
          lanes: 2,
          price: 680
        }
      })
    );
  })
];
