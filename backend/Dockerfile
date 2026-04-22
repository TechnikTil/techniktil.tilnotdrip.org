FROM oven/bun:latest AS builder
WORKDIR /app
COPY . /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN bun --global install pnpm

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	pnpm --filter backend -filter database install --frozen-lockfile

RUN pnpm --filter database run generate

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
	pnpm --filter backend run build



FROM oven/bun:slim AS production
WORKDIR /app

COPY --from=builder /app/backend/dist .

EXPOSE 5000
CMD ["bun", "run", "index.js"]