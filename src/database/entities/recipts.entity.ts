import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  receiptId: string;

  @Column()
  issuedAt: Date;

  @Column()
  name: string;

  @Column('float')
  price: number;
}
