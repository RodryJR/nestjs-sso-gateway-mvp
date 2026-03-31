import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// [MODIFICADO POR IA] Se agrega configuración de Swagger al banking-service; el servicio
// ya tenía los decoradores @ApiTags, @ApiOperation y @ApiBearerAuth en sus controladores
// pero nunca inicializaba SwaggerModule, por lo que /docs devolvía 404.
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('TECOPOS Banking Service')
    .setDescription('API de cuentas bancarias y operaciones financieras - Integración Wells Fargo x TECOPOS')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Accounts')
    .addTag('Operations')
    .addTag('Webhooks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
