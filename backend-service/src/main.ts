import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Brainstorming AI API')
    .setDescription('Brainstorming AI API Documentation')
    .setVersion('1.0')
    .setExternalDoc('Open API Collection', 'docs-json')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => {})
  .catch(() => {});
