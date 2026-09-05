FROM node:22

WORKDIR /app

# Root dependencies (shared code: redis helpers, dotenv, ioredis)
COPY package*.json ./
RUN npm ci --omit=dev

# Service dependencies
COPY gateway/package*.json ./gateway/
RUN cd gateway && npm ci --omit=dev

COPY services/auth/package*.json ./services/auth/
RUN cd services/auth && npm ci --omit=dev

COPY services/chat/package*.json ./services/chat/
RUN cd services/chat && npm ci --omit=dev

COPY services/agent/package*.json ./services/agent/
RUN cd services/agent && npm ci --omit=dev

# Source code
COPY gateway ./gateway
COPY shared ./shared
COPY services/auth ./services/auth
COPY services/chat ./services/chat
COPY services/agent ./services/agent
COPY start-all.js ./

EXPOSE 8000

CMD ["node", "start-all.js"]