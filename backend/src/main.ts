import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  /**
   * ✅ PRODUCTION-SAFE CORS (Vercel + Render)
   * - Allows cookies
   * - Handles OPTIONS preflight
   * - Explicit allowed origins (NO wildcard)
   */
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        // ✅ CURRENT VERCEL DOMAIN
        'https://vivah-matrimony-ffy7.vercel.app',

        // (optional) old vercel domain if reused later
        'https://vivah-matrimony.vercel.app',

        // local dev
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];

      // allow server-to-server or curl requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
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

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Backend running on port ${port}`);
}

bootstrap();
