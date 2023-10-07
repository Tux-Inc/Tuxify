import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('flow_providers')
export class FlowProviderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    provider: string;

    @Column()
    token: string;

    @Column()
    refresh_token: string;

    @Column()
    expires_in: number;

    @Column()
    user_id: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}