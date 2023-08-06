FROM node:current-alpine as builder
#Set working directory
WORKDIR /app
COPY . .
#Set runtime dependecies
RUN npm install
#Build the app
RUN npm run build

FROM nginx as production
ENV NODE_ENV production
#Copy build assets
COPY --from=builder /app/build /usr/share/nginx/html