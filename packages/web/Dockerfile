FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/web/package.json ./packages/web/
RUN npm install --workspace=packages/shared --workspace=packages/web
COPY packages/shared ./packages/shared
COPY packages/web ./packages/web
RUN npm run build --workspace=packages/shared
WORKDIR /app/packages/web
ARG VITE_API_URL=http://localhost:3201
ARG VITE_WS_URL=ws://localhost:1234
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
RUN npx vite build

FROM nginx:alpine
COPY --from=builder /app/packages/web/dist /usr/share/nginx/html
COPY packages/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
