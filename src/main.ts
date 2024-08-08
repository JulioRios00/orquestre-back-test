import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(['log', 'error', 'warn', 'debug']);

  const config = new DocumentBuilder()
    .setTitle('Orquestre API')
    .setDescription('----')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
