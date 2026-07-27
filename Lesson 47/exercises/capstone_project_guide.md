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
}
```

**Implementation Sprints:**
- **Sprint 1**: Set up Next.js App Router, Tailwind, Prisma, Neon DB, and NextAuth (GitHub login).
- **Sprint 2**: Build the Markdown Editor and the Post creation API. Implement direct S3 uploads for embedded images.
- **Sprint 3**: Build the global feed with Cursor-based pagination. Implement Like and Follow functionality.
- **Sprint 4**: Polish the UI with Optimistic updates (liking a post feels instant), animations, and responsive design. Deploy to Vercel.

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
}

model Issue {
  id          String    @id @default(cuid())
  title       String
  status      Status    // ENUM: BACKLOG, TODO, IN_PROGRESS, DONE
  priority    Priority  // ENUM: LOW, MEDIUM, HIGH, URGENT
  assigneeId  String?
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
}
```

**Implementation Sprints:**
- **Sprint 1**: Database setup, NextAuth integration, and Workspace creation workflows.
- **Sprint 2**: The core Issue CRUD (Create, Read, Update, Delete) and API routes protected by RBAC middleware.
- **Sprint 3**: The interactive Kanban Board with Drag-and-Drop, powered by Optimistic UI state.
- **Sprint 4**: Issue attachments (S3), Activity audit logs, system-wide keyboard shortcuts, and Vercel deployment.

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
}

model Order {
  id          String   @id @default(cuid())
  userId      String
  status      OrderStatus // PENDING, PAID, SHIPPED, DELIVERED
  total       Float
  items       OrderItem[]
  createdAt   DateTime @default(now())
}
```

**Implementation Sprints:**
- **Sprint 1**: Product Catalog UI, Database seeding, and dynamic filtering APIs.
- **Sprint 2**: The global Shopping Cart (Zustand + LocalStorage) and the simulated Checkout flow.
- **Sprint 3**: Webhook endpoint creation for secure payment validation. Order history processing.
- **Sprint 4**: The Vendor Analytics Dashboard (aggregating sales data with Prisma `groupBy`), Review system, and Vercel deployment.
