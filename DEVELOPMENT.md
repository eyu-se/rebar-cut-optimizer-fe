# Frontend Development Guide

This document outlines the setup, execution, and deployment processes for the Rebar Cut Optimizer frontend.

## 1. Local Development Setup

To run the development server locally using Node.js:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible via Vite (usually `http://localhost:5173`).

3. **Build for production**:
   ```bash
   npm run build
   ```

## 2. Docker Local Setup

To run the application using Docker locally:

1. **Build the Docker Image**:
   ```bash
   docker build -t rebar-cut-optimizer-fe:local .
   ```
2. **Run the Image**:
   ```bash
   docker run -p 80:80 rebar-cut-optimizer-fe:local
   ```
   The application will be accessible at `http://localhost`.

Alternatively, using the provided `docker-compose.yml` (which uses the public image from GitHub Container Registry):
```bash
export GITHUB_REPOSITORY_OWNER="yourusername"
docker-compose up -d
```

## 3. GitHub Actions & Server Deployment Setup

This repository is configured with a CI/CD pipeline using GitHub Actions (`.github/workflows/deploy.yml`).

### On GitHub (Secrets Configuration)
To enable the deployment action, you must set the following **Repository Secrets** in your GitHub repository settings (`Settings` > `Secrets and variables` > `Actions`):

- `VPS_HOST`: The IP address or hostname of your Ubuntu VPS.
- `VPS_USERNAME`: The SSH user for your server (e.g., `root` or `ubuntu`).
- `VPS_SSH_KEY`: The private SSH key allowing access to your server.

The default `GITHUB_TOKEN` is used for authentication to push the Docker image to GitHub Container Registry (`ghcr.io`). Please ensure that the repository permissions allow packages to be written.

### On Server (Deployment Operations)
The GitHub Action automates the server setup. During a push to `main` or `master`:
1. It connects to the server via SSH.
2. Creates the deployment directory `~/rebar-cut-frontend`.
3. Creates a `docker-compose.yml` file dynamically on the server that exposes port 80 and links the host gateway.
4. Pulls the latest container image from `ghcr.io`.
5. Restarts the container and prunes old images.

No manual initialization is needed on the server other than having `docker` and `docker-compose` installed.
