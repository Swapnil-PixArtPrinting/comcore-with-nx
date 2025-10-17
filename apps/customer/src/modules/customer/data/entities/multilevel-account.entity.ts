// src/your-module/multilevel-account.entity.ts
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('multilevel_account_last_root_key')
export class MultilevelAccountLastRootKey {
  @PrimaryColumn()
  workspace: string;

  @Column()
  last_root_node_key: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
