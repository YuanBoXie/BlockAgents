FROM node:16.6.0

WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
EXPOSE 5173
ENTRYPOINT ["yarn", "dev"]