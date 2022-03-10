# Goal-Based Budget Planner

React + Node.js app for budgeting by goals with nested expenses. Remaining amount auto-updates based on the sum of expenses in each goal.

## Tech
- Backend: Express + Mongoose (with automatic fallback to in-memory MongoDB for local dev)
- Frontend: React (Vite)

## Features
- Add budgets per goal (name + total budget)
- Track expenses under each goal (description, amount, date)
- Auto-calculated totals: totalSpent and remaining
- Full CRUD for goals and expenses

## Future Features
- User authentication and profiles
- Persistent MongoDB (Atlas) configuration and Docker Compose for local dev
- Budget categories/tags and filtering
- Recurring expenses and reminders
- Reports and charts (monthly and per-goal)
- CSV/Excel import and export
- Mobile-friendly PWA with basic offline support
- Sharing and role-based access (view/edit)
- Comprehensive tests (unit/integration) and CI workflow
- Deployment templates (Render/Heroku/Vercel) and environment examples

## Getting Started

Prerequisites:
- Node.js 16+
- Optional: A running MongoDB instance (otherwise an in-memory database will be used automatically)

### 1) Backend
On Windows PowerShell:
```powershell
cd server
npm install
$env:PORT="4000"
# Optional: connect to your Mongo
# $env:MONGODB_URI="mongodb://localhost:27017/goal_budget"
npm start
```
Server will start at `http://localhost:4000`.

API base: `http://localhost:4000/api`

Endpoints:
- `GET /goals` list goals
- `POST /goals` create `{ name, totalBudget:number }`
- `GET /goals/:id` fetch one
- `PUT /goals/:id` update `{ name?, totalBudget?:number }`
- `DELETE /goals/:id` remove
- `POST /goals/:id/expenses` add expense `{ description, amount:number, date? }`
- `PUT /goals/:goalId/expenses/:expenseId` update expense
- `DELETE /goals/:goalId/expenses/:expenseId` delete expense

### 2) Frontend
Open a new terminal:
```powershell
cd client
npm install
# Optional: point to a non-default API
# $env:VITE_API_URL="http://localhost:4000/api"
npm run dev
```
App runs at `http://localhost:5173`.

## Notes
- If `MONGODB_URI` is not set, the backend uses an in-memory database, which resets on server restart.
- CORS is enabled for `http://localhost:5173`.


