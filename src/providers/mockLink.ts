import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../api/router";
import { getMockResponse } from "@/lib/mockData";

export function createMockFallbackLink() {
  return httpBatchLink<AppRouter>({
    url: "/api/trpc",
    transformer: superjson,
    headers() {
      return { "content-type": "application/json" };
    },
    // Custom fetch that always returns mock data (no real API call)
    fetch: async (_url, options) => {
      const body = options?.body;
      if (!body || typeof body !== "string") {
        return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
      }

      try {
        const requests = JSON.parse(body);
        const responses: any[] = [];

        for (const [key, value] of Object.entries(requests)) {
          const path = key as string;
          const input = (value as any)?.json;
          const mockData = getMockResponse(path, input);
          responses.push({
            result: {
              data: superjson.serialize(mockData),
            },
          });
        }

        return new Response(JSON.stringify(responses), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      } catch {
        return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
      }
    },
  });
}
