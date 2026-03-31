# PostgreSQL Setup

## Purpose

This guide explains how to install PostgreSQL locally for KISSAN and prepare a database that matches the default `.env` configuration.

## Expected Local Connection

The default local app configuration expects:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kissan_market"
```

## Install PostgreSQL on macOS with Homebrew

Install PostgreSQL:

```bash
brew install postgresql@16
```

Start it as a background service:

```bash
brew services start postgresql@16
```

If you prefer to run it manually instead of as a service:

```bash
LC_ALL="en_US.UTF-8" /opt/homebrew/opt/postgresql@16/bin/postgres -D /opt/homebrew/var/postgresql@16
```

## Create the Local Database

Create the `postgres` superuser if needed:

```bash
createuser -s postgres
```

Set the password used by the local `.env`:

```bash
psql postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

Create the KISSAN database:

```bash
createdb -O postgres kissan_market
```

## Verify the Connection

Run:

```bash
psql "postgresql://postgres:postgres@localhost:5432/kissan_market" -c "\dt"
```

If the database is brand new, it is normal to see:

```text
Did not find any relations.
```

That only means the database exists but no Prisma migrations have been applied yet.

## Apply Prisma Migrations

Once PostgreSQL is ready:

```bash
npm run prisma:generate
npm run prisma:migrate:dev -- --name init
```

## Seed Demo Data

After the migration:

```bash
npm run db:seed
```

## Start the App

```bash
npm run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### `psql: command not found`

PostgreSQL is not installed or its binaries are not available on your shell `PATH`.

### `role "postgres" already exists`

That is fine. Continue with password setup and database creation.

### `database "kissan_market" already exists`

That is also fine if you intend to reuse the same local database.

### `Did not find any relations`

This is expected before running Prisma migrations.
