import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from "process";
import { User } from './user/user.entity';
import { Group } from './group/group.entity';
@Module({
  imports: [
      ConfigModule.forRoot({
          
      }),
      TypeOrmModule.forRootAsync({
          imports: undefined,
            useFactory: () => ({
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: parseInt(process.env.POSTGRES_PORT, 10),
                username: process.env.POSTGRES_USERNAME,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DATABASE,
                entities: [User, Group],
                synchronize: true,
            }),
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
