FROM alpine:3.12
# Install Dependencies and prepare work directory
RUN apk add --no-cache nodejs npm nginx git bash &&\
    mkdir /opt/luckpermsweb
WORKDIR /opt/luckpermsweb
# Clone, install and prepare LuckPErmsWeb
RUN git clone --recursive https://github.com/lucko/LuckPermsWeb.git /opt/luckpermsweb &&\
    npm install &&\
    rm /opt/luckpermsweb/config.json &&\
    rm /etc/nginx/conf.d/default.conf
# Copy entrypoint and config files into container
COPY docker/docker.config.json /opt/luckpermsweb/docker.config.json
COPY docker/entrypoint.sh /entrypoint.sh
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
# Make entrypoint executable and set it as entrypoint
RUN chmod +x /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]