import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Driver } from './driver.entity';
import { Truck } from './truck.entity';
import { Invoice } from './invoice.entity';
import { Expense } from './expense.entity';
import { Company } from './company.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  company_id: string;

  @ManyToOne(() => Company, company => company.users, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ length: 150 })
  full_name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 20, default: 'driver' })
  role: string; // 'owner', 'manager', 'supervisor', 'driver'

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Driver, driver => driver.user)
  driver_details: Driver;

  @OneToMany(() => Truck, truck => truck.driver)
  trucks: Truck[];

  @OneToMany(() => Invoice, invoice => invoice.creator)
  created_invoices: Invoice[];

  @OneToMany(() => Expense, expense => expense.creator)
  created_expenses: Expense[];

  @OneToMany(() => Expense, expense => expense.approver)
  approved_expenses: Expense[];
}
