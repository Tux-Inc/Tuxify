import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, {
    snapshot: true,
  });
  const whitelist = ['http://localhost:8080', 'https://tuxify.fr'];
  app.enableCors({
    origin: whitelist,
  });
  await app.listen(3000);
}
bootstrap();
