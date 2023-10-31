import { EventDate } from "./event-date.dto";
import { EventAttendee } from "./event-attendee.dto";
import { EventReminders } from "./event-reminders.dto";

export class Event {
    summary: string;
    location?: string;
    description: string;
    start: EventDate
    end: EventDate;
    recurrence?: string[];
    attendees?: EventAttendee[];
    reminders?: EventReminders;
}