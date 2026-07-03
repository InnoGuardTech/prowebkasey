import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string; // e.g. 'CREATE', 'UPDATE', 'DELETE'

  @Column()
  entity_type: string; // e.g. 'Truck', 'Invoice'

  @Column()
  entity_id: string;

  @Column('simple-json', { nullable: true })
  old_values: any;

  @Column('simple-json', { nullable: true })
  new_values: any;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
