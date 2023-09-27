import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from "process";
import { User } from './user/user.entity';
import { GroupService } from './group/group.service';
import { GroupController } from './group/group.controller';
import { GroupModule } from './group/group.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
@Module({
  imports: [
      ConfigModule.forRoot({}),
      TypeOrmModule.forRootAsync({
          imports: undefined,
            useFactory: () => ({
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: parseInt(process.env.POSTGRES_PORT, 10),
                username: process.env.POSTGRES_USERNAME,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DATABASE,
                entities: [User],
                synchronize: true,
            }),
      }),
      GroupModule,
      UserModule,
  ],
  controllers: [GroupController, UserController],
  providers: [GroupService],
})
export class AppModule {}
