FROM node:10-alpine as builder
WORKDIR app
COPY package*.json ./
RUN apk add --no-cache \
    python \
    make \
    gcc \
    g++ \
    && npm i

FROM node:10-alpine
WORKDIR app
COPY . .
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4100
EXPOSE 6100
CMD npm run migrate && npm run dev
