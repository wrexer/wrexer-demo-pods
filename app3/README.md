# App3: Wrexer CertCheck Service

The official Wrexer Certificate Verification & Management Service. This app allows students to verify their bootcamp certificates and admins to issue new ones.

## Features
- **Certificate Verification**: Public interface for verifying certificate authenticity.
- **Admin Dashboard**: Secure management area for issuing and deleting certificates.
- **PostgreSQL Storage**: Dedicated certificate database.
- **Premium Design**: Dark-themed, glassmorphic UI with Wrexer branding.

## API Endpoints
### Public
- `GET /api/verify/:id`: Verify a specific certificate ID.

### Admin (Authenticated)
- `POST /api/admin/login`: Secure login for administrators.
- `GET /api/admin/certificates`: List all issued certificates.
- `POST /api/admin/certificates`: Issue a new certificate.
- `DELETE /api/admin/certificates/:id`: Revoke a certificate.

## Assets
- Includes [Docker Guide](docker_guide.md) for deployment instructions.
- Uses `favicon.png` for consistent branding.
