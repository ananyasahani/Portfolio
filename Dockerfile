# Use the official Bun image as the base
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Step 1: Install dependencies (cached layer)
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies only (cached layer)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Step 2: Build the frontend bundle
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build

# Step 3: Package final lightweight image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist ./dist
COPY --from=prerelease /usr/src/app/src ./src
COPY --from=prerelease /usr/src/app/package.json ./package.json
COPY --from=prerelease /usr/src/app/bunfig.toml ./bunfig.toml

# Set port and production environment
ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000/tcp

# Run as non-root user
USER bun

# Start the server
ENTRYPOINT [ "bun", "run", "start" ]
