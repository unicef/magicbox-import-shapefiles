# Docker image for import_shapefiles_to_postgres
# Downloads all shapefiles from gadmn and unpacks them in the data/ directory
#
# https://hub.docker.com/r/jflory/import-shapefiles-to-postgres/
#

FROM centos:latest

LABEL maintainer="Justin W. Flory <jflory@unicef.org>" \
      vendor="UNICEF Office of Innovation"

WORKDIR /app

RUN yum upgrade -y \
    && yum install -y \
        curl \
        git \
        postgresql \
    && yum clean all

# Add NodeJS 8 package
# https://github.com/nodesource/distributions#rpm
RUN curl -sL https://rpm.nodesource.com/setup_8.x | bash -
RUN yum install -y nodejs

# Set up import_shapefiles_to_postgres
RUN     git clone https://github.com/unicef/magicbox-import-shapefiles.git
WORKDIR magicbox-import-shapefiles
RUN     npm install
COPY    config.js .

ENTRYPOINT ["node", "main.js", "-s", "gadm2-8"]

