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
    fetch: async (_url, options) => {
      try {
        const realRes = await fetch(_url, options);
        if (realRes.ok) return realRes;
      } catch {
        // API unavailable
      }

      // Parse body and extract procedure paths
      const body = options?.body;
      if (!body || typeof body !== "string") {
        return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
      }

      try {
        const requests = JSON.parse(body);
        const responses: any[] = [];

        // tRPC v11 httpBatchLink sends body as { "0": { json: ... }, "1": { json: ... } }
        // Procedure paths are in the x-trpc-batch header or similar
        // Let's extract from URL query params or try all known paths
        
        // Get paths from URL
        const urlObj = new URL(_url.toString(), "http://localhost");
        const batchParam = urlObj.searchParams.get("batch");
        const paths = batchParam ? batchParam.split(",") : [];

        if (paths.length > 0 && requests && typeof requests === "object") {
          // Match each path with its input
          for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const input = requests[i.toString()]?.json ?? {};
            const mockData = getMockResponse(path, input);
            responses.push({ result: { data: superjson.serialize(mockData) } });
          }
        } else if (Array.isArray(requests)) {
          for (const req of requests) {
            const path = req.path || "";
            const input = req.input?.json ?? {};
            const mockData = getMockResponse(path, input);
            responses.push({ result: { data: superjson.serialize(mockData) } });
          }
        } else {
          // Single request - try to infer path from URL
          const urlStr = _url.toString();
          const pathMatch = urlStr.match(/\/api\/trpc\/(.+?)(\?|$)/);
          const path = pathMatch ? pathMatch[1] : "";
          const input = requests?.json ?? {};
          if (path) {
            const mockData = getMockResponse(path, input);
            responses.push({ result: { data: superjson.serialize(mockData) } });
          } else {
            // Fallback: try iterating request keys as paths
            for (const [key, value] of Object.entries(requests)) {
              if (key === "json") continue;
              const mockData = getMockResponse(key, (value as any)?.json ?? {});
              if (mockData !== undefined) {
                responses.push({ result: { data: superjson.serialize(mockData) } });
              }
            }
          }
        }

        // If still no responses, return all common data
        if (responses.length === 0) {
          const allPaths = [
            "menu.categories", "menu.items", "menu.popular",
            "analytics.dashboard", "order.today", "analytics.salesByDay",
            "analytics.popularItems", "order.list", "inventory.list",
            "staff.list", "table.list", "kitchen.tickets", "kitchen.stats",
            "rbac.myPermissions", "rbac.allPermissions"
          ];
          for (const path of allPaths) {
            const mockData = getMockResponse(path, {});
            if (mockData !== undefined) {
              responses.push({ result: { data: superjson.serialize(mockData) } });
            }
          }
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
