FROM node:20-alpine AS builder
WORKDIR /app
# [MODIFICADO POR IA] Railway usa la raiz del repo como build context (no gateway/),
# por lo que los COPY deben apuntar a gateway/ explicitamente para encontrar
# package.json y el codigo fuente correctamente en CI.
COPY gateway/package*.json ./
RUN npm ci
COPY gateway/ .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/main"]
