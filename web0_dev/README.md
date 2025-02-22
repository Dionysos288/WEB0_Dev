# WEB0_Dev

## C# Compiler Setup

This project uses Judge0 for C# code compilation. There are two ways to set it up:

### Local Development

This project uses a self-hosted Judge0 instance for C# code compilation. Follow these steps to set it up:

#### Prerequisites

- Docker
- Docker Compose
- At least 2GB of RAM available for Docker

#### Installation Steps

1. Make sure Docker and Docker Compose are installed on your system
2. Navigate to the project directory
3. Start the Judge0 services:
   ```bash
   docker-compose up -d
   ```
4. Wait for all services to start (this may take a few minutes on first run)
5. Verify the installation by checking if Judge0 is running:
   ```bash
   curl http://localhost:2358/system_info
   ```

#### Configuration

The Judge0 instance is configured with the following settings:

- C# (Mono 6.x) support enabled
- Memory limit: 512MB
- CPU time limit: 5 seconds
- Stack limit: 64MB
- Network access disabled for security

#### Troubleshooting

If you encounter any issues:

1. Check if all containers are running:

   ```bash
   docker-compose ps
   ```

2. View container logs:

   ```bash
   docker-compose logs
   ```

3. Common issues:
   - Port 2358 already in use: Change the port in docker-compose.yml
   - Not enough memory: Increase Docker's memory limit
   - Compilation timeouts: Adjust timeouts in judge0.conf

#### Stopping the Service

To stop Judge0:

```bash
docker-compose down
```

To stop and remove all data (including database):

```bash
docker-compose down -v
```

### Production Deployment

For production deployment with Vercel, you'll need to host the Judge0 service separately. Here are your options:

#### Option 1: Digital Ocean App Platform (Recommended)

1. Install the Digital Ocean CLI:

   ```bash
   # macOS
   brew install doctl
   # Windows
   scoop install doctl
   ```

2. Authenticate with Digital Ocean:

   ```bash
   doctl auth init
   ```

3. Deploy Judge0:

   ```bash
   doctl apps create --spec app.yaml
   ```

4. Once deployed, update your Vercel environment variables:
   - Go to your project settings in Vercel
   - Add environment variable: `JUDGE0_URL=https://your-do-app-url`

#### Option 2: Azure Container Apps

1. Install the Azure CLI:

   ```bash
   # macOS
   brew install azure-cli
   # Windows
   winget install Microsoft.AzureCLI
   ```

2. Login and set up resources:

   ```bash
   az login
   az group create --name judge0-rg --location eastus
   az containerapp up --name judge0-compiler --resource-group judge0-rg --yaml azure.yaml
   ```

3. Update Vercel environment variables:
   - Add `JUDGE0_URL=https://your-azure-app-url`

#### Option 3: Traditional VPS

You can also host Judge0 on any VPS that supports Docker:

1. SSH into your server
2. Install Docker and Docker Compose
3. Copy the `docker-compose.yml` and `judge0.conf` files
4. Run:
   ```bash
   docker-compose up -d
   ```
5. Update Vercel environment variables with your VPS URL

### Security Considerations

1. Enable authentication in production:

   - Set `AUTHN_HEADER` in judge0.conf
   - Add authentication token to your requests

2. Set up HTTPS:

   - Use Let's Encrypt for SSL certificates
   - Configure reverse proxy (nginx recommended)

3. Configure firewall rules:

   - Allow only necessary ports (2358 for Judge0)
   - Restrict access to your IP if possible

4. Regular updates:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

## Development

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
