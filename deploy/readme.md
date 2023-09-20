#### Testing the manifest

Commands to deploy and test the manifest in e.g. Docker Desktop on a Mac.

```
# Make sure the API server container image is available locally
( cd ..; docker build -t floppies:dev --platform linux/amd64,linux/arm64 . )

# Generate the combined manifest
make

# Deploy to local cluster
kubectl apply -f dist/manifest.yaml

# Add reverse proxy and load balancer
helm repo add traefik https://helm.traefik.io/traefik
helm repo update
helm install traefik traefik/traefik --namespace web-api

# Smoke test
curl localhost:80
```
