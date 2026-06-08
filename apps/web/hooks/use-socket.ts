"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let _socket: Socket | null = null;
let _refCount = 0;

function getSocket(): Socket {
  if (!_socket) {
    _socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4001",
      {
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 30_000,
        randomizationFactor: 0.5,
      },
    );
  }
  _refCount++;
  return _socket;
}

function releaseSocket() {
  _refCount--;
  if (_refCount <= 0 && _socket) {
    _socket.disconnect();
    _socket = null;
    _refCount = 0;
  }
}

// --- Hook ---
export function useSocket(event: string, handler: (payload: unknown) => void) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = getSocket();

    const stableHandler = (payload: unknown) => handlerRef.current(payload);
    socket.on(event, stableHandler);

    return () => {
      socket.off(event, stableHandler);
      releaseSocket();
    };
  }, [event]);
}
