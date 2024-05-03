FROM ghcr.io/puppeteer/puppeteer:19.7.2

# Add Google's official GPG key
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -

# Add the Google Chrome repository
RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list

# Update packages and install Google Chrome
RUN apt-get update && apt-get install -y google-chrome-stable

# Cleanup to reduce image size
RUN rm -rf /var/lib/apt/lists/*

# Check Chrome installation
RUN google-chrome-stable --version

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    PUPPETEER_ARGS="--no-sandbox --disable-setuid-sandbox"

# Set up the working directory
WORKDIR /usr/src/app

# Install Node.js dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Command to run the application
CMD ["node", "--trace-warnings", "index.js"]
