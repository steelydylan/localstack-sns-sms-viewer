FROM node:20-alpine AS build-env

COPY . /app
WORKDIR /app
RUN npm install --omit=dev

FROM gcr.io/distroless/nodejs20-debian12

COPY --from=build-env /app /app
WORKDIR /app

ENV PORT=3006
ENV LOCALSTACK_HOST=http://localhost:4566
ENV POLL_INTERVAL=5000

EXPOSE 3006

CMD ["server.js"]
