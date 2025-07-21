FROM node:20-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

# Собираем проект (компилируем TS в JS)
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
