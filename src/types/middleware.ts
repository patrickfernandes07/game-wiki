import type { NextRequest } from "next/server";

export interface AuthenticatedRequest extends NextRequest {
  auth: {
    user?: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: string;
    };
  } | null;
}
