import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150, unique: true })
  subdomain: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  tax_id: string;

  @Column({ type: 'jsonb', nullable: true })
  theme_colors: any;

  @Column({ type: 'jsonb', nullable: true })
  features: any;

  @Column({ default: 'active' })
  status: string; // 'active', 'suspended'

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => User, user => user.company)
  users: User[];
}
