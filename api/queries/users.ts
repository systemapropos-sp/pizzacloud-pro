// Mock user store - replaces Drizzle ORM queries for demo mode
interface MockUser {
  id: number;
  unionId: string;
  name: string | null;
  email?: string | null;
  avatar: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  lastSignInAt: Date | null;
}

const userStore = new Map<string, MockUser>();
let nextUserId = 1;

// Pre-seed a demo user
userStore.set("demo_union_id", {
  id: 1,
  unionId: "demo_union_id",
  name: "Demo Manager",
  avatar: null,
  role: "manager",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignInAt: new Date(),
});

export async function findUserByUnionId(unionId: string): Promise<MockUser | undefined> {
  return userStore.get(unionId);
}

interface UpsertUserData {
  unionId: string;
  name?: string | null;
  avatar?: string | null;
  lastSignInAt?: Date;
  role?: string;
}

export async function upsertUser(data: UpsertUserData): Promise<void> {
  const existing = userStore.get(data.unionId);
  if (existing) {
    existing.name = data.name ?? existing.name;
    existing.avatar = data.avatar ?? existing.avatar;
    existing.lastSignInAt = data.lastSignInAt ?? new Date();
    existing.updatedAt = new Date();
  } else {
    const newUser: MockUser = {
      id: ++nextUserId,
      unionId: data.unionId,
      name: data.name ?? null,
      avatar: data.avatar ?? null,
      role: data.role ?? "customer",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignInAt: data.lastSignInAt ?? new Date(),
    };
    userStore.set(data.unionId, newUser);
  }
}

export type { MockUser as User };
