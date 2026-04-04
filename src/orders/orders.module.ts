import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { OrdersController } from './orders.controller';
import { EventEmitter } from 'events';

@Module({
  imports: [NotificationsModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: 'ORDERS_SERVICE',
      useValue: new EventEmitter(),
    },
  ],
})
export class OrdersModule {}
