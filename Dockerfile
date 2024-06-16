FROM node:18.19.0

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

# TODO: add run migrations script
#COPY bin/run-migrations.sh ./bin
#
#RUN chmod +x ./bin/run-migrations.sh

RUN yarn build

EXPOSE 8080

#ENTRYPOINT ["./bin/run-migrations.sh"]

CMD [ "yarn", "start" ]
