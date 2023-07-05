FROM node:current-alpine as builder
#Set working directory
WORKDIR /app
COPY . .
#Set runtime dependecies
RUN npm ci
RUN npm install styled-components
RUN npm install @mui/icons-material
#Build the app
RUN npm run build

FROM nginx:1.25.1-alpine as production
ENV NODE_ENV production
#Copy build assets
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
#Expose port
EXPOSE 80
#Start nginx
CMD [ "nginx", "-g", "daemon off;" ]