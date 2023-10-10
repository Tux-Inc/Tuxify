
import { LoadStrategy, Options } from '@mikro-orm/core';
import { defineConfig as definePGConfig } from '@mikro-orm/postgresql';
import { defineConfig as defineSqliteConfig } from '@mikro-orm/sqlite';

const baseOptions = {
  entities: ['dist/**/*.entity.js', 'dist/**/*.embeddable.js'],
  entitiesTs: ['src/**/*.entity.ts', 'src/**/*.embeddable.ts'],
  loadStrategy: LoadStrategy.JOINED,
  allowGlobalContext: true,
};

const config: Options =
    definePGConfig({
        ...baseOptions,
        password: process.env.POSTGRES_PASSWORD,
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT, 10),
        dbName: process.env.POSTGRES_DB,
        schema: process.env.POSTGRES_DB,
      })
export default config;
