# Senior Full Stack Engineer — Coding Assessment

**Time allowed:** 1 hour
**Submission:** Push your commits to this GitHub repository.

---

## Overview

You have been given a small but working **Feature Flag Management** application. It consists of:

- **`src/api`** — A .NET 10 Web API
- **`src/ui`** — A React frontend (TypeScript/Vite)

The app allows users to create feature flags, enable/disable them, set a rollout percentage, and view an audit log of changes.

The codebase is functional, but it has issues. Your job is to find and fix them, improve the code where you see problems, and add a new feature.

---

## Getting Started

### API

Requires [.NET 10 SDK](https://dotnet.microsoft.com/download).

```bash
cd src/api
dotnet run
```

The API runs on `http://localhost:5000`.

### UI

Requires Node 18+.

```bash
cd src/ui
npm install
npm run dev
```

The UI runs on `http://localhost:5173` and proxies `/api` requests to the Functions host.

---

## Your Tasks

### 1. Find and fix the bugs

There are bugs in this codebase — some obvious, some subtle. Find as many as you can and fix them. For each bug you fix, write at least one unit test that would have caught it.

We are not looking for a specific number of bugs found. We are looking at how you approach diagnosis, what you choose to test, and the quality of your fixes.

### 2. Refactor where you see problems

The code works but has structural issues. Improve what you think genuinely needs improving. You don't need to rewrite everything — focus on changes that have clear value.

### 3. Add a new feature: Tags

Add the ability to tag feature flags (e.g. `"payments"`, `"ui"`, `"beta"`) and filter the list by tag.

**Requirements:**

- A flag can have zero or more tags
- Tags are provided when creating a flag and can be updated separately
- `GET /api/flags` should accept an optional `?tag=` query parameter to filter results
- The UI should display each flag's tags and allow filtering by tag

You do not need to build a full tag management UI — a simple approach is fine. Prioritise correctness and code quality over visual polish.

---

## What We're Looking For

- **Code quality and architecture** — Is the code well-structured? Are responsibilities clearly separated?
- **Testing** — Do your tests cover the right things? Are they focused and readable?
- **Attention to detail** — Did you catch the non-obvious issues, not just the obvious ones?
- **React fundamentals** — Does the frontend behave correctly? Are component responsibilities clear?
- **Pragmatism** — Did you make sensible trade-offs given the time constraint?

---

## Submission

Please include a short `NOTES.md` in your submission covering:

1. What bugs you found and how you fixed them
2. What refactoring you did and why
3. Any decisions or trade-offs you made on the new feature
4. Anything you would do differently with more time
