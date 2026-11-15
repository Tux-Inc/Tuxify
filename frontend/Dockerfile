# Static build of the Nuxt frontend served by nginx.
# Build from the repository root (the pnpm lockfile lives there):
#
#   docker build -f frontend/Dockerfile -t tuxify .

ARG NODE_VERSION=24.22.2
ARG PNPM_VERSION=12.17.0

FROM node:${NODE_VERSION}-alpine AS build
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
RUN pnpm fetch --frozen-lockfile
COPY . .
RUN pnpm install --frozen-lockfile --offline --filter "{./frontend}..."
RUN pnpm --filter ./frontend generate

FROM nginx:latest AS production
COPY --from=build /repo/frontend/.output/public /app/
COPY frontend/nginx.conf /etc/nginx/nginx.conf
