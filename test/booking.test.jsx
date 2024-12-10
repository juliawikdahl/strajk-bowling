import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingInfo from '../src/components/BookingInfo/BookingInfo';
import Shoes from "../src/components/Shoes/Shoes"; 
import Booking from "../src/views/Booking";
import Confirmation from "../src/views/Confirmation";
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { server } from '../src/mocks/browser'; // Importera den mockade servern
import { rest } from 'msw'; // Importera rest för att skapa mockade API-anrop

// Mock-funktioner
const mockUpdateBookingDetails = vi.fn();
const mockUpdateSize = vi.fn();
const mockAddShoe = vi.fn();
const mockRemoveShoe = vi.fn();


// Sätt upp MSW innan alla tester
beforeAll(() => {
  server.listen(); // Starta servern
});

// Återställ MSW efter varje test
afterEach(() => {
  server.resetHandlers(); // Återställ eventuella mockade svar
});

// Stäng av MSW efter alla tester
afterAll(() => {
  server.close(); // Stäng servern
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

const mockNavigate = vi.fn();

// // TESTER FÖR Booking COMPONENT (Fullständig bokning)
// describe('Booking Component', () => {
//   beforeAll(() => {
//     // Mock useNavigate globally before the tests run
//     vi.mock('react-router-dom', async () => {
//       const actual = await vi.importActual('react-router-dom');
//       return {
//         ...actual,
//         useNavigate: vi.fn(() => mockNavigate),  // Return the mock navigate function
//       };
//     });
//   });

//   afterAll(() => {
//     // Cleanup after tests
//     vi.restoreAllMocks();
//   });

//   test('ska kunna slutföra bokningen och navigera till bekräftelsesidan', async () => {
//     render(
//       <MemoryRouter>
//         <Booking />
//       </MemoryRouter>
//     );

//     // Fyll i alla fält
//     fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-12-10' } });
//     fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '18:00' } });
//     fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: '4' } });
//     fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: '2' } });

//     // Lägg till skor och fyll i storlekar
//     fireEvent.click(screen.getByText('+'));
//     fireEvent.change(screen.getByLabelText(/Shoe size \/ person 1/i), { target: { value: '42' } });
//     fireEvent.click(screen.getByText('+'));
//     fireEvent.change(screen.getByLabelText(/Shoe size \/ person 2/i), { target: { value: '43' } });
//     fireEvent.click(screen.getByText('+'));
//     fireEvent.change(screen.getByLabelText(/Shoe size \/ person 3/i), { target: { value: '44' } });
//     fireEvent.click(screen.getByText('+'));
//     fireEvent.change(screen.getByLabelText(/Shoe size \/ person 4/i), { target: { value: '45' } });

//     // Klicka på knappen för att slutföra bokningen
//     fireEvent.click(screen.getByText(/strIIIIIike!/i));

//     // Vänta på att bekräftelsesidan ska visas och kontrollera navigeringen
//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith('/confirmation', expect.objectContaining({
//         state: expect.objectContaining({
//           confirmationDetails: expect.anything(),
//         }),
//       }));
//     });

//     // Kontrollera att en bekräftelse text är synlig
//     expect(await screen.findByText("Sweet, let's go!")).toBeInTheDocument();
//   });

//   test('ska visa felmeddelande om inte alla fält är ifyllda', () => {
//     render(
//       <MemoryRouter>
//         <Booking />
//       </MemoryRouter>
//     );

//     fireEvent.click(screen.getByText(/strIIIIIike!/i));

//     expect(screen.getByText(/Alla fälten måste vara ifyllda/)).toBeInTheDocument();
//   });
// });

// TESTER FÖR Confirmation COMPONENT
describe('Confirmation Component', () => {
  test('ska visa bokningsinformation när bokning finns', () => {
    const mockBookingDetails = {
      when: '2024-12-10T18:00',
      people: 4,
      lanes: 2,
      id: '12345',
      price: 680
    };

    sessionStorage.setItem('confirmation', JSON.stringify(mockBookingDetails));

    render(
      <MemoryRouter initialEntries={['/confirmation']}>
        <Confirmation />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/When/i).value).toBe('2024-12-10 18:00');
    expect(screen.getByLabelText(/Who/i).value).toBe('4');
    expect(screen.getByLabelText(/Lanes/i).value).toBe('2');
    expect(screen.getByLabelText(/Booking number/i).value).toBe('12345');
    expect(screen.getByText(/Total:/i)).toBeInTheDocument();
  });

  test('ska visa meddelande om ingen bokning finns', () => {
    sessionStorage.removeItem('confirmation');

    render(
      <MemoryRouter initialEntries={['/confirmation']}>
        <Confirmation />
      </MemoryRouter>
    );

    expect(screen.getByText(/Inga bokning gjord!/i)).toBeInTheDocument();
  });
});
