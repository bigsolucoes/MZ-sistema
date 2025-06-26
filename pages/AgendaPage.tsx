
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuthStore } from '@/store/authStore';
import { fetchCalendarEvents, addCalendarEvent } from '@/services/googleCalendarService';
import type { CalendarEvent } from '@/types';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { PlusCircle, Loader2 } from 'lucide-react';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: ptBR }),
  getDay,
  locales,
});

const messages = {
  allDay: 'Dia todo',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Não há eventos neste período.',
  showMore: (total: number) => `+ Ver mais (${total})`,
};

const AgendaPage: React.FC = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    start: new Date(),
    end: new Date(),
    allDay: false,
    description: '',
  });

  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());

  const loadEvents = useCallback(async (view?: View, date?: Date) => {
    setLoading(true);
    setError(null);
    try {
      // For real API, you'd calculate date range based on view and date
      const fetchedEvents = await fetchCalendarEvents(accessToken);
      setEvents(fetchedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar eventos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]); // Keep accessToken, view, and date if API uses them for filtering

  useEffect(() => {
    loadEvents(currentView, currentDate);
  }, [loadEvents, currentView, currentDate]);


  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date; action: string }) => {
    if (slotInfo.action === 'click' || slotInfo.action === 'select') {
      setNewEvent({
        start: slotInfo.start,
        end: slotInfo.end,
        allDay: slotInfo.start.getHours() === 0 && slotInfo.start.getMinutes() === 0 && slotInfo.end.getHours() === 0 && slotInfo.end.getMinutes() === 0 && (slotInfo.end.getTime() - slotInfo.start.getTime()) % (24*60*60*1000) === 0,
        title: '',
        description: '',
      });
      setIsAddEventModalOpen(true);
    }
  }, []);

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert('Título, Início e Fim são obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await addCalendarEvent(accessToken, newEvent as Omit<CalendarEvent, 'id'>);
      setIsAddEventModalOpen(false);
      setNewEvent({ title: '', start: new Date(), end: new Date(), allDay: false, description: '' }); // Reset form
      loadEvents(currentView, currentDate); // Reload events
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao adicionar evento.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">Erro: {error}</div>;
  }

  return (
    <div className="space-y-6 h-[calc(100vh-10rem)] flex flex-col"> {/* Adjust height as needed */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Agenda</h1>
        <Button onClick={() => setIsAddEventModalOpen(true)} variant="default">
          <PlusCircle className="mr-2 h-5 w-5" /> Novo Evento
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="ml-2 text-gray-600 dark:text-gray-300">Carregando eventos...</p>
        </div>
      )}

      {!loading && (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ flexGrow: 1 }} // Make calendar take available space
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          messages={messages}
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onView={(view: View) => setCurrentView(view)}
          onNavigate={(date: Date) => setCurrentDate(date)}
          view={currentView}
          date={currentDate}
          popup // enables the "+X more" link for month view
          components={{
            // You can customize event rendering here if needed
            // event: CustomEventComponent, 
          }}
        />
      )}

      {/* View Event Modal */}
      <Dialog isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title={selectedEvent?.title || 'Detalhes do Evento'}>
        {selectedEvent && (
          <div className="space-y-3 text-sm">
            <p><strong>Início:</strong> {format(selectedEvent.start, 'Pp', { locale: ptBR })}</p>
            <p><strong>Fim:</strong> {format(selectedEvent.end, 'Pp', { locale: ptBR })}</p>
            {selectedEvent.allDay && <p className="text-green-600 dark:text-green-400"><strong>Dia todo</strong></p>}
            {selectedEvent.description && <p><strong>Descrição:</strong> {selectedEvent.description}</p>}
            {selectedEvent.resource && <p><strong>Local/Recurso:</strong> {selectedEvent.resource}</p>}
          </div>
        )}
      </Dialog>

      {/* Add Event Modal */}
      <Dialog isOpen={isAddEventModalOpen} onClose={() => setIsAddEventModalOpen(false)} title="Adicionar Novo Evento">
        <div className="space-y-4">
          <div>
            <Label htmlFor="eventTitle">Título</Label>
            <Input id="eventTitle" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eventStart">Início</Label>
              <Input id="eventStart" type="datetime-local" value={newEvent.start ? format(newEvent.start, "yyyy-MM-dd'T'HH:mm") : ''} onChange={(e) => setNewEvent({...newEvent, start: new Date(e.target.value)})} />
            </div>
            <div>
              <Label htmlFor="eventEnd">Fim</Label>
              <Input id="eventEnd" type="datetime-local" value={newEvent.end ? format(newEvent.end, "yyyy-MM-dd'T'HH:mm") : ''} onChange={(e) => setNewEvent({...newEvent, end: new Date(e.target.value)})} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="eventAllDay" checked={newEvent.allDay} onChange={(e) => setNewEvent({...newEvent, allDay: e.target.checked})} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <Label htmlFor="eventAllDay" className="font-normal">Dia todo</Label>
          </div>
          <div>
            <Label htmlFor="eventDescription">Descrição</Label>
            <Textarea id="eventDescription" value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} />
          </div>
          <Button onClick={handleAddEvent} disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            Adicionar Evento
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default AgendaPage;
    