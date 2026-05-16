FROM oven/bun:1 AS base
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    fontconfig \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS runtime
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /app/uploads

CMD ["bun", "run", "src/index.ts"]
