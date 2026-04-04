import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type EventPublisher = { publish: (event: string, payload: any) => void };
@Injectable()
export class NotificationsService {
  notify(event: string, payload: any) {
    console.log(`Notification: ${event} - Payload:`, payload);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { success: true, event, payload };
  }
}
