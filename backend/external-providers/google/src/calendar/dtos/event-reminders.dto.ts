import { EventReminder } from "./event-reminder.dto";

export class EventReminders {
    useDefault: boolean;
    overrides: EventReminder[];
}