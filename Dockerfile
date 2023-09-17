FROM node:18.17.1-alpine3.18

WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json src .

RUN npm install

RUN npm run build

EXPOSE 3000

# FIXME: support k8s idea of dependencies
# - let the pod crash until dependencies are up?
# - maybe a custom entrypoint to wait for minio and mongodb?
# - maybe fix the javascript to resolve the DNS name dynamically?
#   - actually I'm not sure if it does that already
#   - I do know that if the service is not reachable at startup, ... test again
CMD [ "npm", "start" ]
