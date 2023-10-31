import { Event } from "./event.dto";

export class AddEventInput {
    calendarId: string;
    summary: string;
    description: string;
    start: string;
    end: string;
}