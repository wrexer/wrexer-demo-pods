# Docker Build and Push Guide for App3

Follow these instructions to build, tag, and push your Docker image for `app3`.

## 1. Build the Image

Run this command from the `app3` directory. Replace `your-docker-username` with your actual Docker Hub or repository username.

### Basic Build
```bash
docker build -t your-docker-username/app3:latest .
```

### Build with Version Tag (Recommended)/app3 should be your repo name .
It's best practice to tag your images with a version number for better tracking.
```bash
docker build -t your-docker-username/app3:v1.0.0 .
```

---

## 2. Pushing to a Repository

### Login to Docker Hub (or your private registry)
```bash
docker login
```

### Push to Public Repository
By default, Docker Hub repositories are public unless configured otherwise.
```bash
docker push your-docker-username/app3:latest
docker push your-docker-username/app3:v1.0.0
```

### Push to Private Repository
If you are using a private repository (e.g., GHCR, AWS ECR, or a private Docker Hub repo), make sure you have authenticated correctly and use the full registry path.

**Example for GHCR (GitHub Container Registry):**
```bash
docker tag your-docker-username/app3:v1.0.0 ghcr.io/your-github-username/app3:v1.0.0
docker push ghcr.io/your-github-username/app3:v1.0.0
```

---

## 3. How Repositories Work

In Docker, the repository name is determined by the image name you use in the `tag`.

If you have a repository named `certcheck-app` and another named `billing-service` on Docker Hub:
- To push to `certcheck-app`, tag your image as `rox007/certcheck-app:v1.0.0`
- To push to `billing-service`, tag your image as `rox007/billing-service:v1.0.0`

### Summary of Commands (Cheatsheet)

| Action | Command |
| :--- | :--- |
| **Build for specific repo** | `docker build -t your-username/repo-name:v1.0.0 .` |
| **Push to that repo** | `docker push your-username/repo-name:v1.0.0` |

> [!IMPORTANT]
> Docker knows where to push based on the `your-username/repo-name` prefix. If the repository doesn't exist yet on Docker Hub, pushing it will create it (if public) or fail if you haven't created the private repo first.
