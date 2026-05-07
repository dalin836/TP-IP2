// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Receipt } from './database/entities/recipts.entity';
// import { Module } from '@nestjs/common';
// import { ReceiptsModule } from './receipts/receipts.module';
// import { NotificationsModule } from './notifications/notifications.module';
// import { OrdersModule } from './orders/orders.module';
// import { CoreModule } from './core/core.module';

import { join } from 'path/win32';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ApolloDriver } from 'node_modules/@nestjs/apollo/dist/drivers/apollo.driver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from 'node_modules/@nestjs/apollo/dist/interfaces/apollo-driver-config.interface';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       useFactory: () => ({
//         type: 'postgres',
//         host: 'localhost',
//         port: 5432,
//         username: 'postgres',
//         password: '123',
//         database: 'tp2_recipts',
//         entities: [Receipt],
//         // autoLoadEntities: true,
//         synchronize: true,
//       }),
//     }),

//     TypeOrmModule.forFeature([Receipt]), // ✅ comma fixed
//     ReceiptsModule,
//     NotificationsModule,
//     OrdersModule,
//     CoreModule,
//   ],
// })
// export class AppModule {}
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      playground: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      context: ({ req }) => ({ req }),
    }),
    CategoryModule,
    ProductModule,
  ],
})
export class AppModule {}
