import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, {
    snapshot: true,
  });
  await app.listen(3000);
}
bootstrap();
