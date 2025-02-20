"use client";

import { io } from "socket.io-client";

export const socket = io(process.env.WEB_APPS_SOCKET_HOST);

