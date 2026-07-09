import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Truck } from './truck.entity';
import { Contractor } from './contractor.entity';
import { User } from './user.entity';
import { Company } from './company.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  company_id: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'truck_id', nullable: true })
  truck_id: string;

  @ManyToOne(() => Truck, truck => truck.invoices, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'truck_id' })
  truck: Truck;

  @Column({ name: 'trip_id', nullable: true })
  trip_id: string;

  @ManyToOne('Trip', 'invoices', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'trip_id' })
  trip: any;

  @Column({ name: 'contractor_id', nullable: true })
  contractor_id: string;

  @ManyToOne(() => Contractor, contractor => contractor.invoices, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'contractor_id' })
  contractor: Contractor;

  @Column({ length: 50 })
  invoice_number: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  invoice_date: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 20, default: 'pending' })
  status: string; // 'pending', 'paid', 'overdue'

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  vat_amount: number;

  @Column({ length: 1000, nullable: true })
  attachment_url: string;

  @ManyToOne(() => User, user => user.created_invoices, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ default: false })
  is_deleted: boolean;

  @DeleteDateColumn()
  deleted_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
