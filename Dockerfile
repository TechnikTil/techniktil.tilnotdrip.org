FROM oven/bun:latest AS builder
WORKDIR /app

COPY package.json ./
COPY bun.lock ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/

RUN bun install --frozen-lockfile
RUN bun install @rollup/rollup-linux-x64-gnu --no-save

COPY . .
RUN bun run build



FROM oven/bun:slim
WORKDIR /dist/backend

COPY --from=builder /app/dist/ /dist

EXPOSE 5000
CMD ["bun", "run", "./src/index.js"]