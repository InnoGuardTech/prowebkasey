import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Truck } from './truck.entity';
import { User } from './user.entity';
import { Invoice } from './invoice.entity';
import { Expense } from './expense.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  trip_number: string;

  @Column({ name: 'truck_id' })
  truck_id: string;

  @ManyToOne(() => Truck)
  @JoinColumn({ name: 'truck_id' })
  truck: Truck;

  @Column({ name: 'driver_id', nullable: true })
  driver_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'driver_id' })
  driver: User;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ length: 50, default: 'active' })
  status: string; // 'active', 'completed', 'cancelled'

  @Column({ length: 255, nullable: true })
  route: string; // e.g., Riyadh -> Jeddah

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Invoice, invoice => invoice.trip)
  invoices: Invoice[];

  @OneToMany(() => Expense, expense => expense.trip)
  expenses: Expense[];
}
