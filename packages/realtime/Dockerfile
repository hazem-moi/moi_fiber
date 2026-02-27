FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/realtime/package.json ./packages/realtime/
RUN npm install --workspace=packages/realtime
COPY packages/realtime ./packages/realtime
WORKDIR /app/packages/realtime
RUN npx tsc

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/packages/realtime/dist ./dist
COPY --from=builder /app/packages/realtime/node_modules ./node_modules
CMD ["node", "dist/index.js"]
