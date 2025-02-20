import type { NextConfig } from "next";

require('dotenv').config({ path: '../.env' });

const nextConfig: NextConfig = {
  env: {
    WEB_APPS_SOCKET_HOST: process.env.WEB_APPS_SOCKET_HOST
  }
};

export default nextConfig;
