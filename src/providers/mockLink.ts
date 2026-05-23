import type { TRPCLink } from "@trpc/client";
import { TRPCClientError } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import superjson from "superjson";
import type { AppRouter } from "../../api/router";
import { getMockResponse } from "@/lib/mockData";

export const mockFallbackLink: TRPCLink<AppRouter> = () => {
  return ({ op }) => {
    return observable((observer) => {
      const url = `/api/trpc/${op.path}`;
      const body = JSON.stringify({
        [op.path]: { json: op.input },
      });

      let cancelled = false;

      fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        credentials: "include",
      })
        .then(async (res) => {
          if (cancelled) return;
          if (!res.ok) {
            const mockResult = getMockResponse(op.path, op.input);
            if (mockResult !== undefined) {
              observer.next({ result: { type: "data" as const, data: mockResult } });
              observer.complete();
              return;
            }
            throw new Error(`API error ${res.status}`);
          }
          const json = await res.json();
          const result = json[0]?.result;
          if (result?.data) {
            observer.next({ result: { type: "data" as const, data: superjson.deserialize(result.data) } });
          } else {
            observer.next({ result: { type: "data" as const, data: result } });
          }
          observer.complete();
        })
        .catch(() => {
          if (cancelled) return;
          const mockResult = getMockResponse(op.path, op.input);
          if (mockResult !== undefined) {
            observer.next({ result: { type: "data" as const, data: mockResult } });
            observer.complete();
          } else {
            observer.error(new TRPCClientError(`No mock data for ${op.path}`));
          }
        });

      return () => {
        cancelled = true;
      };
    });
  };
}
