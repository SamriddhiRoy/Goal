import { useMemo, useState } from "react";

function currency(n) {
	return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0);
}

export default function GoalList({ goals, selectedId, onSelect, onDelete, onUpdate }) {
	const [editId, setEditId] = useState(null);
	const [name, setName] = useState("");
	const [budget, setBudget] = useState("");

	function startEdit(goal) {
		setEditId(goal._id);
		setName(goal.name);
		setBudget(String(goal.totalBudget));
	}
	function cancelEdit() {
		setEditId(null);
		setName("");
		setBudget("");
	}
	async function saveEdit(id) {
		await onUpdate(id, { name, totalBudget: Number(budget) });
		cancelEdit();
	}

	const sorted = useMemo(
		() => [...goals].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
		[goals]
	);

	return (
		<div className="list">
			{sorted.map((g) => {
				const remaining = g.remaining ?? Math.max(0, (g.totalBudget || 0) - (g.totalSpent || 0));
				const spent = g.totalSpent ?? 0;
				const over = spent > (g.totalBudget || 0);
				const ratio = (spent / (g.totalBudget || 1)) * 100;
				const dotClass = over ? "dot danger" : ratio > 75 ? "dot warn" : "dot success";
				const isSelected = selectedId === g._id;
				const isEditing = editId === g._id;

				return (
					<div key={g._id} className="list-item">
						{isEditing ? (
							<>
								<input value={name} onChange={(e) => setName(e.target.value)} />
								<input
									type="number"
									min="0"
									step="0.01"
									value={budget}
									onChange={(e) => setBudget(e.target.value)}
									style={{ width: 120 }}
								/>
								<span className="spacer" />
								<button className="ghost" onClick={cancelEdit}>Cancel</button>
								<button onClick={() => saveEdit(g._id)}>Save</button>
							</>
						) : (
							<>
								<button className="ghost" onClick={() => onSelect(g._id)} style={{ fontWeight: isSelected ? 700 : 500 }}>
									{g.name}
								</button>
								<span className="pill">{currency(g.totalBudget)}</span>
								<span className="spacer" />
								<span className="stat">
									<span className={dotClass} />
									<span className="muted">
										Spent {currency(spent)} • Left {currency(remaining)}
									</span>
								</span>
								<button className="ghost" onClick={() => startEdit(g)}>Edit</button>
								<button className="danger" onClick={() => onDelete(g._id)}>Delete</button>
							</>
						)}
					</div>
				);
			})}
			{sorted.length === 0 && <div className="muted">No goals yet. Create your first goal above.</div>}
		</div>
	);
}


