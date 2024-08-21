# Use an official Node.js runtime as a parent image
FROM node:22.5.1

# Set the working directory in the container
WORKDIR /app

# Install bun
RUN curl -fsSL https://bun.sh/install | bash && \
    mv /root/.bun/bin/bun /usr/local/bin/bun

# Install Chromium and dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libxcomposite1 \
    libxrandr2 \
    xdg-utils \
    curl

# Set the CHROME_PATH environment variable
ENV CHROME_PATH=/usr/bin/chromium

# Set npm global bin directory
ENV NPM_CONFIG_PREFIX=/usr/local

# Install foghorn and lighthouse globally
RUN npm install -g foghorn lighthouse

# Add npm global bin to PATH
ENV PATH=$PATH:/usr/local/bin

# Copy the rest of your application code
COPY . .

# Set the entry point to your CLI tool
ENTRYPOINT ["node", "index.js"]