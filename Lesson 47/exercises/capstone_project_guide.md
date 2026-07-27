# Capstone Project Guide: Enterprise Blueprints

Choose ONE of the following three production-grade blueprints for your capstone project, or combine them to create your own unique SaaS application.

---

## Blueprint 1: DevPulse — Real-Time Developer Collaboration & Social Platform

**Overview:**
A specialized social network where developers can share code snippets, write markdown technical blogs, collaborate on issues, and receive real-time notifications. Think of it as a hybrid of Hashnode, GitHub Issues, and Dev.to.

**Required Technical Features:**
- **Authentication**: NextAuth with GitHub and Google OAuth providers.
- **Rich Content**: Markdown/MDX live preview editor with robust syntax highlighting for code blocks.
- **Database Architecture**: Prisma schema with complex Many-to-Many relationships (Users ↔ Posts ↔ Tags ↔ Likes). Follows and Followers relationships.
- **Media**: AWS S3 (or Supabase Blob) for Avatar and code screenshot uploads via Pre-signed URLs.
- **UI State**: Zustand for managing global theme preferences and editor state.
- **Performance**: Cursor-based pagination for the infinite scrolling global feed.

**Prisma Schema Outline:**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  avatarUrl String?
  posts     Post[]
  likes     Like[]
  followers Follow[] @relation("following")
  following Follow[] @relation("follower")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String   // Markdown text
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  tags      Tag[]
  likes     Like[]
  createdAt DateTime @default(now())

  @@index([authorId])
}
```

**Implementation Sprints:**
- **Sprint 1 (2 weeks — ~40 story points total)**: Set up Next.js App Router (5 points), Tailwind (3 points), Prisma, Neon DB (8 points), and NextAuth (GitHub login) (8 points).
- **Sprint 2 (2 weeks — ~40 story points total)**: Build the Markdown Editor (8 points) and the Post creation API (5 points). Implement direct S3 uploads for embedded images (8 points).
- **Sprint 3 (2 weeks — ~40 story points total)**: Build the global feed with Cursor-based pagination (8 points). Implement Like (4 points) and Follow functionality (5 points).
- **Sprint 4 (2 weeks — ~40 story points total)**: Polish the UI with Optimistic updates (liking a post feels instant) (8 points), animations (5 points), and responsive design (5 points). Deploy to Vercel (5 points).

---

## Blueprint 2: ProStack — Multi-Tenant SaaS Issue Tracker (Linear Clone)

**Overview:**
A lightning-fast, keyboard-centric project management tool with workspaces, Kanban boards, sprint cycles, and strict role-based team permissions. Designed for extreme productivity.

**Required Technical Features:**
- **Multi-Tenant Architecture**: Data is siloed into Workspaces. (Workspace -> Teams -> Projects -> Issues).
- **Optimistic UI**: Using Zustand and TanStack Query, dragging Kanban cards from "Todo" to "Done" updates immediately in the UI before the API responds.
- **RBAC**: NextAuth customized to support roles (Workspace Owner vs Admin vs Member).
- **Attachments**: Presigned S3 file attachments on specific issues.
- **Audit Logs**: An activity stream tracking who changed what and when (e.g., "Alice moved issue PRO-12 to In Progress").

**Prisma Schema Outline:**
```prisma
model Workspace {
  id      String   @id @default(cuid())
  name    String
  users   WorkspaceMember[]
  issues  Issue[]
}

model WorkspaceMember {
  id          String    @id @default(cuid())
  userId      String
  workspaceId String
  role        Role      // ENUM: OWNER, ADMIN, MEMBER
  workspace   Workspace @relation(fields: [workspaceId], references: [id])

  @@index([userId])
  @@index([workspaceId])
}

model Issue {
  id          String    @id @default(cuid())
  title       String
  status      Status    // ENUM: BACKLOG, TODO, IN_PROGRESS, DONE
  priority    Priority  // ENUM: LOW, MEDIUM, HIGH, URGENT
  assigneeId  String?
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])

  @@index([workspaceId])
}
```

**Implementation Sprints:**
- **Sprint 1 (2 weeks — ~40 story points total)**: Database setup (5 points), NextAuth integration (8 points), and Workspace creation workflows (8 points).
- **Sprint 2 (2 weeks — ~40 story points total)**: The core Issue CRUD (Create, Read, Update, Delete) (8 points) and API routes protected by RBAC middleware (8 points).
- **Sprint 3 (2 weeks — ~40 story points total)**: The interactive Kanban Board (8 points) with Drag-and-Drop (5 points), powered by Optimistic UI state (8 points).
- **Sprint 4 (2 weeks — ~40 story points total)**: Issue attachments (S3) (8 points), Activity audit logs (5 points), system-wide keyboard shortcuts (5 points), and Vercel deployment (5 points).

---

## Blueprint 3: OmniMart — Next-Gen E-Commerce Engine & Vendor Marketplace

**Overview:**
A scalable multi-vendor e-commerce platform featuring product catalogs, persistent shopping carts, secure checkout simulation, and comprehensive vendor analytics dashboards.

**Required Technical Features:**
- **Persistent State**: Zustand shopping cart that synchronizes with `localStorage`.
- **Advanced Querying**: Complex filtering and search queries in PostgreSQL (filtering by price ranges, dynamic categories, and average ratings).
- **Payments**: Integration with Stripe or Paystack webhook simulation to handle payment confirmation asynchronously.
- **Dashboards**: Vendor dashboard generating sales aggregations, revenue charts, and inventory alerts.
- **Trust System**: Review and rating system with "Verified Buyer" badges.

**Prisma Schema Outline:**
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  price       Float
  vendorId    String
  vendor      User     @relation(fields: [vendorId], references: [id])
  category    String
  reviews     Review[]
  orderItems  OrderItem[]

  @@index([vendorId])
}

model Order {
  id          String   @id @default(cuid())
  userId      String
  status      OrderStatus // PENDING, PAID, SHIPPED, DELIVERED
  total       Float
  items       OrderItem[]
  createdAt   DateTime @default(now())

  @@index([userId])
}
```

**Implementation Sprints:**
- **Sprint 1 (2 weeks — ~40 story points total)**: Product Catalog UI (8 points), Database seeding (5 points), and dynamic filtering APIs (8 points).
- **Sprint 2 (2 weeks — ~40 story points total)**: The global Shopping Cart (Zustand + LocalStorage) (8 points) and the simulated Checkout flow (8 points).
- **Sprint 3 (2 weeks — ~40 story points total)**: Webhook endpoint creation for secure payment validation (8 points). Order history processing (8 points).
- **Sprint 4 (2 weeks — ~40 story points total)**: The Vendor Analytics Dashboard (aggregating sales data with Prisma `groupBy`) (8 points), Review system (5 points), and Vercel deployment (5 points).
