FROM node:20.9.0 AS builder

WORKDIR /home/tecina/client

COPY *.json ./

RUN npm install --production --pure-lockfile --ignore-scripts

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /home/tecina/client/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
