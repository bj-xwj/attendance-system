const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.alias['@/lib'] = path.resolve(__dirname, 'src/lib');
    return config;
  }
}

module.exports = nextConfig;