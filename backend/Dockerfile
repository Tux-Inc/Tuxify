# Production image for any NestJS service of the workspace.
# Build from the repository root (the pnpm lockfile lives there):
#
#   docker build -f backend/Dockerfile --build-arg SERVICE=backend/auth -t tuxify-api-auth .

ARG NODE_VERSION=24.22.2
ARG PNPM_VERSION=12.17.0

FROM node:${NODE_VERSION}-alpine AS base
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /repo

FROM base AS build
ARG SERVICE
# Native modules (bcrypt, sqlite3) may need to be compiled.
RUN apk add --no-cache python3 make g++
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
RUN pnpm fetch --frozen-lockfile
COPY . .
RUN pnpm install --frozen-lockfile --offline --filter "{./${SERVICE}}..."
# "..." also builds the workspace packages the service depends on (@tuxify/common).
RUN pnpm --filter "{./${SERVICE}}..." build
# Self-contained copy of the service with production dependencies only.
RUN pnpm --filter "./${SERVICE}" deploy --prod --legacy /prod

FROM node:${NODE_VERSION}-alpine AS production
ARG SERVICE
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /prod ./
COPY --from=build --chown=node:node /repo/${SERVICE}/dist ./dist
USER node
CMD ["node", "dist/main.js"]
