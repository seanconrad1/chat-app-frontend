import io from "socket.io-client";
import getURL from "../utils/config";
const url = getURL(process.env.NODE_ENV);

export const socket = io(url);
