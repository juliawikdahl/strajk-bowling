import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingInfo from '../src/components/BookingInfo/BookingInfo';
import Shoes from "../src/components/Shoes/Shoes"; 
import Booking from "../src/views/Booking";
import Confirmation from "../src/views/Confirmation";
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { server } from '../src/mocks/browser'; 
import { rest } from 'msw';


const mockUpdateBookingDetails = vi.fn();
const mockUpdateSize = vi.fn();
const mockAddShoe = vi.fn();
const mockRemoveShoe = vi.fn();
const mockNavigate = vi.fn();

// Sätt upp MSW innan alla tester
beforeAll(() => {

  server.listen(); 
});

// Återställ MSW efter varje test
beforeEach(() => {
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useNavigate: () => mockNavigate,
      };
    });
  })

// Stäng av MSW efter alla tester
afterAll(() => {
  server.close(); 
});

// TESTER FÖR BookingInfo COMPONENT
describe('BookingInfo Component', () => {
  test('ska rendera alla formulärfält korrekt', () => {
    render(<BookingInfo updateBookingDetails={mockUpdateBookingDetails} />);

    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of awesome bowlers/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of lanes/i)).toBeInTheDocument();
  });

  test('ska uppdatera värden när användaren fyller i formuläret', () => {
    render(<BookingInfo updateBookingDetails={mockUpdateBookingDetails} />);

    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-12-10' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '18:00' } });
    fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: '2' } });

    expect(mockUpdateBookingDetails).toHaveBeenCalledTimes(4);
  });
});

// TESTER FÖR Shoes COMPONENT
describe('Shoes Component', () => {
  test('ska tillåta användaren att lägga till skor', () => {
    render(<Shoes addShoe={mockAddShoe} removeShoe={mockRemoveShoe} updateSize={mockUpdateSize} shoes={[]} />);

    fireEvent.click(screen.getByText('+')); 

    expect(mockAddShoe).toHaveBeenCalled();
  });

  test('ska kunna ändra skostorlek', () => {
    render(<Shoes addShoe={mockAddShoe} removeShoe={mockRemoveShoe} updateSize={mockUpdateSize} shoes={[{ id: "1", size: "" }]} />);

    fireEvent.change(screen.getByLabelText(/Shoe size \/ person 1/i), { target: { value: '42' } });

    expect(mockUpdateSize).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({ value: '42' })
    }));
  });

  test('ska kunna ta bort skor', () => {
    render(<Shoes addShoe={mockAddShoe} removeShoe={mockRemoveShoe} updateSize={mockUpdateSize} shoes={[{ id: "1", size: "42" }]} />);

    fireEvent.click(screen.getByText('-')); 

    expect(mockRemoveShoe).toHaveBeenCalled();
  });
});

// TESTER FÖR Booking COMPONENT (Fullständig bokning)
describe('Booking Component', () => {
  test('ska visa valda skostorlekar i översikten innan bokningen slutförs', async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

 
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-12-10' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '18:00' } });
    fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: '2' } });

 
    fireEvent.click(screen.getByText('+')); 
    fireEvent.change(screen.getByLabelText(/Shoe size \/ person 1/i), { target: { value: '42' } });

    fireEvent.click(screen.getByText('+')); 
    fireEvent.change(screen.getByLabelText(/Shoe size \/ person 2/i), { target: { value: '43' } });

    fireEvent.click(screen.getByText('+')); 
    fireEvent.change(screen.getByLabelText(/Shoe size \/ person 3/i), { target: { value: '44' } });

    fireEvent.click(screen.getByText('+'));
    fireEvent.change(screen.getByLabelText(/Shoe size \/ person 4/i), { target: { value: '45' } });

 
    await waitFor(() => {
      expect(screen.getByDisplayValue(/42/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/43/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/44/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/45/i)).toBeInTheDocument();
    });
  });

  test('ska visa felmeddelande om inte alla fält är ifyllda', async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

 
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-12-10' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '18:00' } });

   
    fireEvent.click(screen.getByText(/strIIIIIike!/i));

 
    expect(await screen.findByText(/Alla fälten måste vara ifyllda/i)).toBeInTheDocument();
  });

  test('ska kunna slutföra bokningen och navigera till bekräftelsesidan', async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );



    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-12-10' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '18:00' } });
    fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: '1' } });


    fireEvent.click(screen.getByText('+')); 
    fireEvent.change(screen.getByLabelText(/Shoe size \/ person 1/i), { target: { value: '42' } });

  
    fireEvent.click(screen.getByText(/strIIIIIike!/i));

 
    server.use(
      rest.post('*', (req, res, ctx) => {
        return res(ctx.json({ confirmation: 'ABC123' }));
      })
    );

 
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/confirmation', expect.objectContaining({
        state: expect.objectContaining({
          confirmationDetails: expect.anything(),
        }),
      }));
    });
  });
});

// TESTER FÖR Confirmation COMPONENT
describe('Confirmation Component', () => {
    test('ska visa korrekt totalsumma baserat på spelare och banor', async () => {
      const confirmationDetails = {
        when: '2024-12-10T18:00',
        people: 4,
        lanes: 2,
        id: '12345',
        price: 680, 
      };
  
     
      sessionStorage.setItem('confirmation', JSON.stringify(confirmationDetails));
  
      render(
        <MemoryRouter initialEntries={['/confirmation']}>
          <Confirmation />
        </MemoryRouter>
      );
  
 
      await waitFor(() => {
        expect(screen.getByLabelText(/When/i).value).toBe('2024-12-10 18:00');
        expect(screen.getByLabelText(/Who/i).value).toBe('4');
        expect(screen.getByLabelText(/Lanes/i).value).toBe('2');
        expect(screen.getByLabelText(/Booking number/i).value).toBe('12345');
        expect(screen.getByText(/Total:/i)).toBeInTheDocument();
      });
  
     
      expect(screen.getByText(/680 sek/i)).toBeInTheDocument();
    });
  
    test('ska visa fallback-meddelande om bokningsdata är korrupt', async () => {
      sessionStorage.setItem('confirmation', 'invalid-json');
  
      render(
        <MemoryRouter initialEntries={['/confirmation']}>
          <Confirmation />
        </MemoryRouter>
      );
  
      expect(screen.getByText(/Inga bokning gjord!/i)).toBeInTheDocument();
    });
  
    test('ska visa meddelande om ingen bokning finns', async () => {
      sessionStorage.removeItem('confirmation');
  
      render(
        <MemoryRouter initialEntries={['/confirmation']}>
          <Confirmation />
        </MemoryRouter>
      );
  
      expect(screen.getByText(/Inga bokning gjord!/i)).toBeInTheDocument();
    });
  });