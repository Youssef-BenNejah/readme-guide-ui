import { useState, useCallback } from "react";

const BASE_URL = "http://localhost:8080";

interface UseApiReturn {
  loading: boolean;
  error: string | null;
  execute: (method: string, path: string, body?: unknown) => Promise<any>;
  clearError: () => void;
}

export function useApi(accessToken?: string | null): UseApiReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const execute = useCallback(
    async (method: string, path: string, body?: unknown) => {
      setLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const res = await fetch(`${BASE_URL}${path}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (res.status === 204) {
          setLoading(false);
          return true;
        }

        if (!res.ok) {
          let msg = `Error ${res.status}`;
          try {
            const errBody = await res.json();
            msg = errBody.message || errBody.error || msg;
          } catch {}
          throw new Error(msg);
        }

        const data = await res.json();
        setLoading(false);
        return data;
      } catch (err: any) {
        const message =
          err.message === "Failed to fetch"
            ? "Cannot reach the server. Make sure the backend is running on http://localhost:8080."
            : err.message;
        setError(message);
        setLoading(false);
        return null;
      }
    },
    [accessToken]
  );

  return { loading, error, execute, clearError };
}
