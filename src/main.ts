import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SilentLogger } from './common/middlewares/silent-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new SilentLogger(),
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
