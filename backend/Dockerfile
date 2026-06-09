FROM node:24.16.0 AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	pnpm --filter backend install --frozen-lockfile

RUN pnpm --filter backend run db:generate
RUN pnpm --filter backend run build

FROM node:24.16.0-slim AS production
ENV NODE_ENV="production"
WORKDIR /app

COPY --from=builder /app/backend/dist .
RUN npm install @prisma/client

EXPOSE 5000
CMD ["node", "."]