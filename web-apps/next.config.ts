import type { NextConfig } from "next";

require('dotenv').config({ path: '../.env' });

const nextConfig: NextConfig = {
  env: {
    WEB_APPS_SOCKET_HOST: process.env.WEB_APPS_SOCKET_HOST,
    BACKEND_SERVICE_HOST: process.env.BACKEND_SERVICE_HOST
  }
};

export default nextConfig;
