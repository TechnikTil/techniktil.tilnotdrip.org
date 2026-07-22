FROM node:24.16.0 AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

COPY . /app

WORKDIR /app/backend
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	pnpm install --frozen-lockfile

WORKDIR /app/backend/database
RUN pnpm run db:generate

WORKDIR /app/backend
RUN pnpm run build

FROM node:24.16.0-slim AS production
ENV NODE_ENV="production"
WORKDIR /app

COPY --from=builder /app/backend/dist .
RUN npm install @prisma/client

EXPOSE 5000
CMD ["node", "."]