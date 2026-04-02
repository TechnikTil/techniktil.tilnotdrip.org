FROM oven/bun:latest AS builder
WORKDIR /app

COPY package.json bun.lock ./
COPY frontend/ backend/ ./

RUN bun install --frozen-lockfile
RUN bun run db:generate
RUN bun run build



FROM oven/bun:slim
WORKDIR /app/backend

COPY --from=builder frontend/dist/ /app/frontend/
COPY --from=builder backend/dist/ /app/backend/

EXPOSE 5000
CMD ["bun", "run", "."]