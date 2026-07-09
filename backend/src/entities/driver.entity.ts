import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Company } from './company.entity';

@Entity('drivers')
export class Driver {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.driver_details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: User;

  @Column({ nullable: true })
  company_id: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ length: 50, nullable: true })
  license_number: string;

  @Column({ type: 'date', nullable: true })
  license_expiry: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary: number;

  @Column({ type: 'date', nullable: true })
  hired_date: Date;

  @Column({ length: 20, nullable: true })
  emergency_contact: string;

  @Column({ length: 50, nullable: true })
  iqama_number: string;

  @Column({ type: 'date', nullable: true })
  iqama_expiry: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
