FROM node:20-alpine AS builder
WORKDIR /app
# [MODIFICADO POR IA] Railway usa la raiz del repo como build context (no banking-service/),
# por lo que los COPY deben apuntar a banking-service/ explicitamente para encontrar
# package.json y el codigo fuente correctamente en CI.
COPY banking-service/package*.json ./
RUN npm ci
COPY banking-service/ .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3002
CMD ["node", "dist/main"]
