import { useState, useCallback } from "react";

const generateId = () => crypto.randomUUID();

function getMockResponse(method: string, path: string, body?: any): any {
  if (path === "/api/admin/setup") {
    return {
      restaurantId: generateId(),
      deviceId: generateId(),
      ownerId: generateId(),
    };
  }
  if (path === "/api/auth/pin-login") {
    return {
      accessToken: "mock-access-token-" + generateId().slice(0, 8),
      refreshToken: "mock-refresh-token-" + generateId().slice(0, 8),
      staffName: "Owner",
      role: "OWNER",
      mustChangePin: true,
    };
  }
  if (path.includes("/pin")) {
    return true;
  }
  if (path.includes("/api/restaurants/")) {
    return { id: body?.restaurantId || generateId(), ...body };
  }
  if (path === "/api/tax-rates") {
    return { id: generateId(), ...body };
  }
  if (path === "/api/families") {
    return { id: generateId(), ...body };
  }
  if (path === "/api/menu/categories") {
    return { id: generateId(), ...body };
  }
  if (path === "/api/menu/modifier-groups") {
    return { id: generateId(), ...body };
  }
  if (path === "/api/menu/modifiers") {
    return { id: generateId(), ...body };
  }
  if (path === "/api/menu/items") {
    return { id: generateId(), ...body };
  }
  return { id: generateId() };
}

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
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 600));
      const data = getMockResponse(method, path, body);
      setLoading(false);
      return data;
    },
    [accessToken]
  );

  return { loading, error, execute, clearError };
}
