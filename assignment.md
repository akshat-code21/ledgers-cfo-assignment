# Assignment: Mini Compliance Tracker

## Objective

Build a simple web app to track compliance tasks for different clients.

The goal is not to build something complex. We want to see a **working product end-to-end**.

---

## What we care about most

Please prioritize these above everything else:

1. **A working deployed link (must-have)**
We should be able to open and use your app directly.
2. **GitHub repository with commit history (must-have)**
We want to see how you built it over time, not just a final dump.

---

## Problem

At LedgersCFO, teams manage compliance tasks (like filings, taxes, etc.) for multiple clients.

Build a small app where a user can:

- View clients
- View tasks for a selected client
- Add new tasks
- Update task status
- Identify overdue tasks easily

---

## Core Features

### 1. Clients

- Show a list of clients
- Allow selecting a client

### 2. Tasks

For a selected client:

- Show list of tasks
- Add a new task
- Update task status (e.g., Pending → Completed)
- Filter tasks by:
    - Status
    - Category
- Clearly highlight **overdue pending tasks**

---

## Suggested Data Models

You can follow this structure (or something similar):

### Client

- id
- company_name
- country
- entity_type

### Compliance Task

- id
- client_id
- title
- description
- category
- due_date
- status
- priority

---

## Backend (Basic APIs)

Create simple APIs for:

- Get all clients
- Get tasks for a client
- Create a task
- Update task status

Also include:

- Basic validation
- Basic error handling
- Persistent storage (DB preferred, but simple storage is fine)

---

## Frontend

Keep it simple and clean. Must include:

- Client list
- Task list
- Add task form
- Filters
- Overdue task highlighting

No need for heavy design — focus on usability.

---

## Bonus (Optional)

Only if you have time:

- Search
- Sorting
- Summary stats (e.g., total / pending / overdue)
- Seed data
- Docker setup
- Clean README

---

## Time Expectation

This should take **less than a day**.

We are not looking for perfection. We are looking for:

- Clear thinking
- Working functionality
- Clean structure

---

## Submission

Please share:

1. **Deployed app link (required)**
2. **GitHub repo link with commit history (required)**
3. Setup instructions (in README)
4. Short note on:
    - Tradeoffs
    - Assumptions