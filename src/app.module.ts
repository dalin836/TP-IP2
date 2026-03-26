import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from './database/entities/recipts.entity';
import { Module } from '@nestjs/common';
import { ReceiptsModule } from './receipts/receipts.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '123',
        database: 'tp2_recipts',
        entities: [Receipt],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    TypeOrmModule.forFeature([Receipt]), // ✅ comma fixed
    ReceiptsModule,
  ],
})
export class AppModule {}
