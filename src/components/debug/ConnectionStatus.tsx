"use client";

import { useEffect, useState } from "react";
import { apolloClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";

const HEALTH_CHECK = gql`
  query {
    __schema {
      types {
        name
      }
    }
  }
`;

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await apolloClient.query({
          query: HEALTH_CHECK,
          fetchPolicy: "network-only",
        });
        setIsConnected(true);
        setError("");
      } catch (err: any) {
        setIsConnected(false);
        setError(err.message || "Error de conexión");
        console.error("Error de conexión GraphQL:", err);
      }
    };

    checkConnection();

    // Verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return (
      <div className="text-sm text-yellow-600">🔄 Verificando conexión...</div>
    );
  }

  return (
    <div
      className={`text-sm ${isConnected ? "text-green-600" : "text-red-600"}`}
    >
      {isConnected ? (
        <>✅ Backend conectado</>
      ) : (
        <>❌ Backend desconectado: {error}</>
      )}
    </div>
  );
}
