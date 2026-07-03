import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Invoice } from './invoice.entity';
import { Expense } from './expense.entity';

@Entity('trucks')
export class Truck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  truck_number: string;

  @Column({ name: 'driver_id', nullable: true })
  driver_id: string;

  @ManyToOne(() => User, user => user.trucks, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ length: 20, default: 'inactive' })
  status: string; // 'active', 'inactive', 'maintenance'

  @Column({ type: 'date', nullable: true })
  operation_date: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ type: 'date', nullable: true })
  registration_expiry: Date;

  @Column({ type: 'date', nullable: true })
  insurance_expiry: Date;

  @Column({ type: 'date', nullable: true })
  inspection_expiry: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Invoice, invoice => invoice.truck)
  invoices: Invoice[];

  @OneToMany(() => Expense, expense => expense.truck)
  expenses: Expense[];
}
