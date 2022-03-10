"use strict";

const express = require("express");
const mongoose = require("mongoose");
const Goal = require("../models/Goal");

const router = express.Router();

function isValidObjectId(id) {
	return mongoose.Types.ObjectId.isValid(id);
}

// List goals
router.get("/", async (_req, res) => {
	try {
		const goals = await Goal.find().sort({ createdAt: -1 });
		res.json(goals);
	} catch (err) {
		res.status(500).json({ message: "Failed to fetch goals" });
	}
});

// Create goal
router.post("/", async (req, res) => {
	try {
		const raw = req.body || {};
		const name = typeof raw.name === "string" ? raw.name.trim() : "";
		const totalBudget =
			typeof raw.totalBudget === "number" ? raw.totalBudget : parseFloat(raw.totalBudget);
		if (!name) {
			return res.status(400).json({ message: "name is required" });
		}
		if (Number.isNaN(totalBudget)) {
			return res.status(400).json({ message: "totalBudget must be a number" });
		}
		if (totalBudget < 0) {
			return res.status(400).json({ message: "totalBudget cannot be negative" });
		}
		const goal = await Goal.create({ name, totalBudget, expenses: [] });
		res.status(201).json(goal);
	} catch (err) {
		res.status(400).json({ message: err.message || "Failed to create goal" });
	}
});

// Read one goal
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
		const goal = await Goal.findById(id);
		if (!goal) return res.status(404).json({ message: "Goal not found" });
		res.json(goal);
	} catch (_err) {
		res.status(500).json({ message: "Failed to fetch goal" });
	}
});

// Update goal (name/totalBudget)
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
		const updates = {};
		if (typeof req.body.name === "string") {
			const trimmed = req.body.name.trim();
			if (!trimmed) return res.status(400).json({ message: "name cannot be empty" });
			updates.name = trimmed;
		}
		if (req.body.totalBudget !== undefined) {
			const tb =
				typeof req.body.totalBudget === "number"
					? req.body.totalBudget
					: parseFloat(req.body.totalBudget);
			if (Number.isNaN(tb)) return res.status(400).json({ message: "totalBudget must be a number" });
			if (tb < 0) return res.status(400).json({ message: "totalBudget cannot be negative" });
			updates.totalBudget = tb;
		}
		const goal = await Goal.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true
		});
		if (!goal) return res.status(404).json({ message: "Goal not found" });
		res.json(goal);
	} catch (err) {
		res.status(400).json({ message: err.message || "Failed to update goal" });
	}
});

// Delete goal
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
		const goal = await Goal.findByIdAndDelete(id);
		if (!goal) return res.status(404).json({ message: "Goal not found" });
		res.json({ message: "Deleted", id });
	} catch (_err) {
		res.status(500).json({ message: "Failed to delete goal" });
	}
});

// Add expense
router.post("/:id/expenses", async (req, res) => {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
		const { description, amount, date } = req.body || {};
		const trimmed = typeof description === "string" ? description.trim() : "";
		const amt = typeof amount === "number" ? amount : parseFloat(amount);
		if (!trimmed) return res.status(400).json({ message: "description is required" });
		if (Number.isNaN(amt)) return res.status(400).json({ message: "amount must be a number" });
		if (amt < 0) return res.status(400).json({ message: "amount cannot be negative" });
		const goal = await Goal.findById(id);
		if (!goal) return res.status(404).json({ message: "Goal not found" });
		goal.expenses.push({ description: trimmed, amount: amt, date: date ? new Date(date) : undefined });
		await goal.save();
		res.status(201).json(goal);
	} catch (err) {
		res.status(400).json({ message: err.message || "Failed to add expense" });
	}
});

// Update expense
router.put("/:goalId/expenses/:expenseId", async (req, res) => {
	try {
		const { goalId, expenseId } = req.params;
		if (!isValidObjectId(goalId) || !isValidObjectId(expenseId)) {
			return res.status(400).json({ message: "Invalid id(s)" });
		}
		const goal = await Goal.findById(goalId);
		if (!goal) return res.status(404).json({ message: "Goal not found" });
		const expense = goal.expenses.id(expenseId);
		if (!expense) return res.status(404).json({ message: "Expense not found" });
		if (typeof req.body.description === "string") {
			const trimmed = req.body.description.trim();
			if (!trimmed) return res.status(400).json({ message: "description cannot be empty" });
			expense.description = trimmed;
		}
		if (req.body.amount !== undefined) {
			const amt =
				typeof req.body.amount === "number" ? req.body.amount : parseFloat(req.body.amount);
			if (Number.isNaN(amt)) return res.status(400).json({ message: "amount must be a number" });
			if (amt < 0) return res.status(400).json({ message: "amount cannot be negative" });
			expense.amount = amt;
		}
		if (req.body.date) expense.date = new Date(req.body.date);
		await goal.save();
		res.json(goal);
	} catch (err) {
		res.status(400).json({ message: err.message || "Failed to update expense" });
	}
});

// Delete expense
router.delete("/:goalId/expenses/:expenseId", async (req, res) => {
	try {
		const { goalId, expenseId } = req.params;
		if (!isValidObjectId(goalId) || !isValidObjectId(expenseId)) {
			return res.status(400).json({ message: "Invalid id(s)" });
		}
		const goal = await Goal.findById(goalId);
		if (!goal) return res.status(404).json({ message: "Goal not found" });
		const expense = goal.expenses.id(expenseId);
		if (!expense) return res.status(404).json({ message: "Expense not found" });
		expense.remove();
		await goal.save();
		res.json(goal);
	} catch (_err) {
		res.status(500).json({ message: "Failed to delete expense" });
	}
});

module.exports = router;


