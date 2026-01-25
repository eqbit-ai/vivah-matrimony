import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // 👇 IMPORTANT: NestExpressApplication for static files
  const app =
    await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  /**
   * ✅ SERVE UPLOADED FILES
   * Makes URLs like:
   * https://vivah-matrimony.onrender.com/uploads/profiles/xxx.jpg
   * work correctly
   */
  app.use(
    '/uploads',
    express.static(
      path.join(process.env.UPLOAD_DIR || '/data/uploads'),
    ),
  );

  /**
   * ✅ PRODUCTION-SAFE CORS (Vercel + Render)
   */
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://vivah-matrimony-ffy7.vercel.app',
        'https://vivah-matrimony.vercel.app',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];

      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`),
        false,
      );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ],
    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Vivah Matrimony API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document =
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Backend running on port ${port}`);
}

bootstrap();
