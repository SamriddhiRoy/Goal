import { useState } from "react";

export default function GoalForm({ onSubmit }) {
	const [name, setName] = useState("");
	const [totalBudget, setTotalBudget] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		const trimmed = name.trim();
		const hasBudgetInput = totalBudget !== "";
		const budgetNumber = Number(totalBudget);
		if (!trimmed) {
			setError("Name is required.");
			return;
		}
		if (!hasBudgetInput || Number.isNaN(budgetNumber)) {
			setError("Total budget must be a number.");
			return;
		}
		if (budgetNumber < 0) {
			setError("Total budget cannot be negative.");
			return;
		}
		setSubmitting(true);
		try {
			await onSubmit({ name: trimmed, totalBudget: budgetNumber });
			setName("");
			setTotalBudget("");
		} catch (err) {
			setError(err?.message || "Failed to create goal.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form className="row" onSubmit={handleSubmit}>
			<input
				placeholder="Goal name (e.g., Emergency Fund)"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<input
				type="number"
				min="0"
				step="0.01"
				placeholder="Total budget"
				value={totalBudget}
				onChange={(e) => setTotalBudget(e.target.value)}
			/>
			<button type="submit" disabled={submitting}>Add</button>
			{error && <div className="muted" style={{ width: "100%" }}>{error}</div>}
		</form>
	);
}


