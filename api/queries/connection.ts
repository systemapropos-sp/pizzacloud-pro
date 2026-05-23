import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: any;

// Mock database that returns data from mock-data.ts
export function getDb() {
  if (!instance) {
    instance = { schema: fullSchema };
  }
  return instance;
}
