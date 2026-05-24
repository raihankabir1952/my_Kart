import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS — support multiple origins (local + production + payment callbacks)
  const allowedOrigins = [
    'http://localhost:3000',
    config.get<string>('FRONTEND_URL'), // production Vercel URL
  ].filter((origin): origin is string => Boolean(origin));

  // Allowed external services (payment gateways, etc) — these are trusted servers
  const trustedExternalOrigins = [
    'https://sandbox.sslcommerz.com',
    'https://securepay.sslcommerz.com', // production SSLCommerz
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow frontend origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow trusted external services (payment callbacks)
      if (trustedExternalOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  });

  // Use Railway's assigned port (process.env.PORT) or fallback to 4000
  const port = config.get<number>('PORT') || 4000;

  // Listen on 0.0.0.0 (all interfaces) — required for Railway
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend running on port ${port}`);
}
bootstrap();