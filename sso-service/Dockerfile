FROM node:20-alpine AS builder
WORKDIR /app
# [MODIFICADO POR IA] Railway usa la raiz del repo como build context (no sso-service/),
# por lo que los COPY deben apuntar a sso-service/ explicitamente para encontrar
# package.json, prisma/schema.prisma y el codigo fuente correctamente en CI.
COPY sso-service/package*.json ./
RUN npm ci
COPY sso-service/ .
# [MODIFICADO POR IA] Prisma v7 requiere generar el cliente antes de compilar TypeScript;
# sin este paso @prisma/client no tiene los tipos del schema y el build falla.
RUN npx prisma generate --schema ./prisma/schema.prisma
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
# [MODIFICADO POR IA] Copia el prisma.config.ts original (no el compilado) porque
# el CLI de Prisma v7 tiene su propio bundler para archivos .ts de configuracion;
# el .js compilado en formato CommonJS no puede ser parseado por el CLI de Prisma.
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3001
# [MODIFICADO POR IA] Ejecuta las migraciones pendientes antes de arrancar el servidor;
# garantiza que la tabla "User" exista en postgres al primer inicio del contenedor.
# [MODIFICADO POR IA] El entrypoint es dist/src/main (no dist/main) porque prisma.config.ts
# esta en la raiz del proyecto; TypeScript preserva la estructura de directorios en el output,
# por lo que src/main.ts compila a dist/src/main.js en lugar de dist/main.js.
CMD ["sh", "-c", "npx prisma migrate deploy --schema ./prisma/schema.prisma && node dist/src/main"]
