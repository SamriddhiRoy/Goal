import { useState } from "react";

export default function ExpenseForm({ onSubmit }) {
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [date, setDate] = useState("");
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		if (!description || !amount) return;
		setSubmitting(true);
		try {
			await onSubmit({
				description,
				amount: Number(amount),
				date: date || undefined
			});
			setDescription("");
			setAmount("");
			setDate("");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form className="row" onSubmit={handleSubmit}>
			<input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
			<input type="number" min="0" step="0.01" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
			<input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
			<button type="submit" disabled={submitting}>Add expense</button>
		</form>
	);
}


