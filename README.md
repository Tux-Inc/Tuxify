## Introduction

This project is a web application that allows you to manage your tasks. It is a project that we have been working on for 2 months. We have used the PNN stack (PostgresSQL, Next.js, Nuxt.js) to develop this application.

## Requirements

- Node.js 24 (see `.nvmrc`)
- pnpm 12 (the exact version is pinned in `package.json` under `packageManager`)
- Docker with Docker Compose

## Installation

The repository is a pnpm workspace: the frontend, every backend service and
the shared `common` package are installed together, with a single lockfile.

```bash
pnpm install
```

Useful commands from the repository root:

| Command | Description |
| --- | --- |
| `pnpm build` | Build every backend service |
| `pnpm build:frontend` | Generate the static frontend |
| `pnpm test` | Run the backend unit tests |
| `pnpm --filter @tuxify/auth start:dev` | Run one service in watch mode |

## Usage

To use the project in dev mode, you must first start the docker containers. To do this, you must run the following command in the root folder of the project:

```bash
cp .env.example .env
```

Modify the `.env` file to set your environment variables as needed.

Generate the RS256 key pair used by the auth service to sign access tokens (it is never committed):

```bash
./backend/auth/scripts/generate-keys.sh
```

Then, you can start the docker containers by running:

```bash
docker compose up -d
```

All Node services share one development image (`Dockerfile.dev`) that contains
the installed workspace; only the sources are mounted, so changes are picked up
in watch mode. Rebuild the image after changing a `package.json` or the
lockfile:

```bash
docker compose build
```

Finally, you can access the application by going to the following address: http://localhost:8080/

## Production images

Images are built from the repository root so that pnpm can use the workspace
lockfile:

```bash
docker build -f backend/Dockerfile --build-arg SERVICE=backend/auth -t tuxify-api-auth .
docker build -f frontend/Dockerfile -t tuxify .
```

## Contributors

- Alexandre Kévin De Freitas Martins
- Gwenaël Hubler
- Roman Lopes
- Stéphane Fievez
- Bouna Diallo

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Project Infos

Tuxify is a project like IFTTT, the goal is simple, be the revolution of
action/reaction.
