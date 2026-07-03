import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Truck } from './truck.entity';
import { ExpenseCategory } from './expense_category.entity';
import { User } from './user.entity';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'truck_id', nullable: true })
  truck_id: string;

  @ManyToOne(() => Truck, truck => truck.expenses, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'truck_id' })
  truck: Truck;

  @Column({ name: 'trip_id', nullable: true })
  trip_id: string;

  @ManyToOne('Trip', 'expenses', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'trip_id' })
  trip: any;

  @Column({ name: 'category_id', nullable: true })
  category_id: string;

  @ManyToOne(() => ExpenseCategory, category => category.expenses, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: ExpenseCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  expense_date: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ length: 1000, nullable: true })
  attachment_url: string;

  @Column({ default: false })
  is_approved: boolean;

  @ManyToOne(() => User, user => user.approved_expenses, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by' })
  approver: User;

  @Column({ type: 'datetime', nullable: true })
  approved_at: Date;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string;

  @ManyToOne(() => User, user => user.created_expenses, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ type: 'datetime', nullable: true })
  deleted_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
