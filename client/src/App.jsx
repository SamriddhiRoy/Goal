import { useEffect, useMemo, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import GoalForm from "./components/GoalForm";
import GoalList from "./components/GoalList";
import GoalDetail from "./components/GoalDetail";

export default function App() {
	const [goals, setGoals] = useState([]);
	const [selectedId, setSelectedId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		(async () => {
			try {
				const data = await apiGet("/goals");
				setGoals(data);
			} catch (e) {
				setError("Failed to load goals");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const selectedGoal = useMemo(
		() => goals.find((g) => g._id === selectedId) || null,
		[goals, selectedId]
	);

	async function createGoal({ name, totalBudget }) {
		const goal = await apiPost("/goals", { name, totalBudget });
		setGoals((gs) => [goal, ...gs]);
		setSelectedId(goal._id);
	}

	async function updateGoal(id, payload) {
		const updated = await apiPut(`/goals/${id}`, payload);
		setGoals((gs) => gs.map((g) => (g._id === id ? updated : g)));
	}

	async function deleteGoal(id) {
		await apiDelete(`/goals/${id}`);
		setGoals((gs) => gs.filter((g) => g._id !== id));
		if (selectedId === id) setSelectedId(null);
	}

	async function addExpense(goalId, expense) {
		const updated = await apiPost(`/goals/${goalId}/expenses`, expense);
		setGoals((gs) => gs.map((g) => (g._id === goalId ? updated : g)));
	}

	async function updateExpense(goalId, expenseId, payload) {
		const updated = await apiPut(`/goals/${goalId}/expenses/${expenseId}`, payload);
		setGoals((gs) => gs.map((g) => (g._id === goalId ? updated : g)));
	}

	async function deleteExpense(goalId, expenseId) {
		const updated = await apiDelete(`/goals/${goalId}/expenses/${expenseId}`);
		setGoals((gs) => gs.map((g) => (g._id === goalId ? updated : g)));
	}

	return (
		<div className="container">
			<div className="header">
				<div className="title">Goal-Based Budget Planner</div>
			</div>
			<div className="grid">
				<div className="card">
					<h3>Create a new goal</h3>
					<GoalForm onSubmit={createGoal} />
					<div className="divider" />
					<h3>Your goals</h3>
					{loading ? (
						<div className="muted">Loading...</div>
					) : error ? (
						<div className="muted">{error}</div>
					) : (
						<GoalList
							goals={goals}
							selectedId={selectedId}
							onSelect={setSelectedId}
							onDelete={deleteGoal}
							onUpdate={updateGoal}
						/>
					)}
				</div>
				<div className="card">
					<h3>Details</h3>
					{selectedGoal ? (
						<GoalDetail
							goal={selectedGoal}
							onAddExpense={addExpense}
							onUpdateExpense={updateExpense}
							onDeleteExpense={deleteExpense}
						/>
					) : (
						<div className="muted">Select a goal to view details</div>
					)}
				</div>
			</div>
		</div>
	);
}


