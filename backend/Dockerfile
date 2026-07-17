FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
