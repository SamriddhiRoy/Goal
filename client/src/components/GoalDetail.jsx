import ExpenseForm from "./ExpenseForm";

function currency(n) {
	return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0);
}

export default function GoalDetail({ goal, onAddExpense, onUpdateExpense, onDeleteExpense }) {
	const spent = goal.totalSpent ?? (goal.expenses || []).reduce((a, e) => a + (e.amount || 0), 0);
	const remaining = goal.remaining ?? Math.max(0, (goal.totalBudget || 0) - spent);

	return (
		<div>
			<div className="row" style={{ marginBottom: 10 }}>
				<span className="pill">Budget: {currency(goal.totalBudget)}</span>
				<span className="pill">Spent: {currency(spent)}</span>
				<span className="pill">Remaining: {currency(remaining)}</span>
			</div>
			<div className="section-title">Add Expense</div>
			<ExpenseForm onSubmit={(e) => onAddExpense(goal._id, e)} />

			<div className="section-title">Expenses</div>
			<div className="list">
				{(goal.expenses || []).length === 0 && <div className="muted">No expenses yet.</div>}
				{(goal.expenses || []).map((exp) => (
					<div key={exp._id} className="list-item">
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<strong>{exp.description}</strong>
							<span className="muted">{exp.date ? new Date(exp.date).toLocaleDateString() : ""}</span>
						</div>
						<span className="spacer" />
						<span className="pill">{currency(exp.amount)}</span>
						<button className="danger" onClick={() => onDeleteExpense(goal._id, exp._id)}>Remove</button>
					</div>
				))}
			</div>
		</div>
	);
}


