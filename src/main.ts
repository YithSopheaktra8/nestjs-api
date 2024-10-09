/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // add configuration to enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // convert query params to their respective types 
      }
    }),
  );
  
  // add configuration to enable Swagger documentation
  const config = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('NestJS API')
    .setDescription('use this API to get started with NestJS')
    .setTermsOfService('http://swagger.io/terms/')
    .setLicense('MIT', 'http://swagger.io/license/')
    .addServer('http://localhost:3000', 'Development')
    .addServer('http://api.example.com', 'Production')  
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);  

  await app.listen(3000);
}
bootstrap();
