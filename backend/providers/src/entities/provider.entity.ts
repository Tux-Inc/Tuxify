import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('flow_providers')
export class ProviderEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    provider: string;

    @Column()
    accessToken: string;

    @Column()
    refreshToken: string;

    @Column()
    userId: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}