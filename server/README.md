# Backend Server

Backend API server menggunakan Koa dan routing-controllers.

## Struktur Folder

```
server/
├── src/
│   ├── index.ts                 # Entry point
│   ├── config/                  # Configuration files
│   ├── controllers/             # API controllers (routing-controllers)
│   ├── services/                # Business logic
│   ├── entities/                # Data entities/models
│   ├── middleware/              # Custom middleware
│   ├── dtos/                    # Data Transfer Objects
│   ├── utils/                   # Utility functions
│   └── constants/               # Constants
├── .env.example                 # Environment variables template
├── tsconfig.json               # TypeScript config
└── README.md
```

## Setup

1. Copy `.env.example` to `.env` dan sesuaikan konfigurasi:
   ```bash
   cp .env.example .env
   ```

2. Start development server:
   ```bash
   npm run dev:server
   ```

## Development

- Controllers menggunakan decorators dari `routing-controllers`
- Services berisi business logic
- DTOs untuk validasi data input
- Entities untuk struktur data

## Endpoints

Semua endpoints tersedia di `/api/...`
