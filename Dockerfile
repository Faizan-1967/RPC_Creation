FROM node:alpine AS node-builder

WORKDIR /backend

COPY package*.json .
RUN npm install

COPY tsconfig.json .
COPY src/*.ts src/
COPY src/Utilities/*.ts src/Utilities/
COPY src/Modules/*.ts src/Modules/
COPY src/Modules/Authentication/*.ts src/Modules/Authentication/
COPY src/Modules/LeaderBoard/*.ts src/Modules/LeaderBoard/
COPY src/Modules/UserState/*.ts src/Modules/UserState/
COPY src/Modules/MatchEnd/*.ts src/Modules/MatchEnd/
COPY src/Modules/Configuration/*.ts src/Modules/Configuration/

RUN npx tsc

FROM registry.heroiclabs.com/heroiclabs/nakama:3.22.0

COPY --from=node-builder /backend/build/*.js /nakama/data/modules/build/
COPY local.yml /nakama/data/