import { Inject, Injectable } from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateOrderDto } from './dto/create-orders';

@Injectable()
export class OrdersService {
  [x: string]: any;
  constructor(
    @Inject('ORDERS_SERVICE') private ordersRepo: any,
    private notificationsService: NotificationsService, // 👈 index [1]
  ) {}

  createOrder(orderDto: CreateOrderDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.ordersRepo.emit('order_created', {
      order: orderDto,
      createdAt: new Date().toISOString(),
    });

    this.notificationsService.notify('order_created', {
      order: orderDto,
    });

    return { status: 'Order accepted', order: orderDto };
  }
  findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.ordersRepo.find({ order: { issuedAt: 'DESC' } });
  }
}
