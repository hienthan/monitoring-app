# Monitoring App - Tailwind Dashboard Template

Monitoring and inventory management application built with React, Tailwind CSS, HeroUI, and PocketBase.

## Environment Variables

### PocketBase URL

Set `VITE_PB_URL` in your `.env` file to configure the PocketBase instance URL:

```bash
VITE_PB_URL=http://gmo021.cansportsvg.com:8090
```

**Default value**: `http://gmo021.cansportsvg.com:8090`

If not set, the application will use the default URL above.

## Project Structure

```
src/
  components/servers/     # Server-related components
  pages/
    dashboard/            # Dashboard pages
    servers/              # Server pages
  repositories/          # Data access layer
  lib/                   # Utilities (pb.ts for PocketBase config)
  types/                 # TypeScript types
```

## Features

- Server grid with search and filtering
- Server detail page with Apps and Ports
- Expandable rows in Apps table to show ports
- Responsive layout with Mosaic sidebar
- HeroUI components integration

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
