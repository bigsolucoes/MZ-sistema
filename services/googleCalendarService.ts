
import type { CalendarEvent } from '@/types';
import { API_ENDPOINTS } from '@/constants';
import { addDays, subDays, startOfWeek, endOfWeek, setHours, setMinutes } from 'date-fns';

// This is a MOCK service. In a real application, you would use the Google Calendar API.
// Ensure you have proper error handling and token management.

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Reunião Cliente A',
    start: setMinutes(setHours(new Date(), 9), 30),
    end: setMinutes(setHours(new Date(), 10), 30),
    description: 'Discussão sobre o caso 123/XYZ.',
  },
  {
    id: '2',
    title: 'Audiência Caso B',
    start: setMinutes(setHours(addDays(new Date(), 1), 14), 0),
    end: setMinutes(setHours(addDays(new Date(), 1), 15), 30),
    allDay: false,
    resource: 'Fórum Central',
  },
  {
    id: '3',
    title: 'Prazo Petição Inicial Caso C',
    start: addDays(new Date(), 2),
    end: addDays(new Date(), 2), // For allDay events, end is often exclusive or same as start
    allDay: true,
  },
  {
    id: '4',
    title: 'Almoço com Equipe',
    start: setMinutes(setHours(subDays(new Date(),1), 12), 0),
    end: setMinutes(setHours(subDays(new Date(),1), 13), 30),
  },
   {
    id: '5',
    title: 'Workshop LGPD',
    start: setMinutes(setHours(startOfWeek(new Date(), { weekStartsOn: 1 }), 10),0), // Monday this week
    end: setMinutes(setHours(startOfWeek(new Date(), { weekStartsOn: 1 }), 12),0),
  },
  {
    id: '6',
    title: 'Call com Parceiro Internacional',
    start: setMinutes(setHours(endOfWeek(new Date(), { weekStartsOn: 1 }), 16),0), // Friday this week
    end: setMinutes(setHours(endOfWeek(new Date(), { weekStartsOn: 1 }), 17),0),
  }
];

export const fetchCalendarEvents = async (accessToken: string | null, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> => {
  console.log('Fetching calendar events with token (mock):', accessToken ? 'Token Present' : 'No Token');
  console.log('Date range (mock):', startDate, endDate);

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!accessToken) { // Basic check, real API would handle auth
    // throw new Error("Authentication token is required.");
    console.warn("Mock fetchCalendarEvents: No access token provided, returning mock data for unauthenticated preview.");
    // return []; // Or return mock data if desired for unauth preview
  }
  
  // In a real scenario, use startDate and endDate to filter events from API
  // For mock, just return all events
  return MOCK_EVENTS;
  
  // Example of how a real API call might look:
  /*
  const params = new URLSearchParams();
  if (startDate) params.append('timeMin', startDate.toISOString());
  if (endDate) params.append('timeMax', endDate.toISOString());
  // Add other params like singleEvents=true, orderBy='startTime'

  const response = await fetch(`${API_ENDPOINTS.GOOGLE_CALENDAR_EVENTS}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to fetch calendar events: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.items.map((item: any) => ({ // Map Google API response to CalendarEvent type
    id: item.id,
    title: item.summary,
    start: new Date(item.start.dateTime || item.start.date),
    end: new Date(item.end.dateTime || item.end.date),
    allDay: !!item.start.date, // If only date is present, it's an all-day event
    description: item.description,
    resource: item.location, // or other custom fields
  }));
  */
};

// Mock function to add an event
export const addCalendarEvent = async (accessToken: string | null, event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
  console.log('Adding calendar event (mock):', event);
  await new Promise(resolve => setTimeout(resolve, 500));
  if (!accessToken) {
    console.warn("Mock addCalendarEvent: No access token. Event not truly added.");
  }
  const newEvent: CalendarEvent = { ...event, id: String(Date.now()) };
  MOCK_EVENTS.push(newEvent); // Add to mock list for demo purposes
  return newEvent;
};
    