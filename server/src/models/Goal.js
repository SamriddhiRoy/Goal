"use strict";

const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
	{
		description: { type: String, required: true, trim: true },
		amount: { type: Number, required: true, min: 0 },
		date: { type: Date, default: Date.now }
	},
	{ _id: true }
);

const GoalSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		totalBudget: { type: Number, required: true, min: 0 },
		expenses: [ExpenseSchema]
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

GoalSchema.virtual("totalSpent").get(function () {
	const sum = (this.expenses || []).reduce((acc, e) => acc + (e.amount || 0), 0);
	return Math.max(0, sum);
});

GoalSchema.virtual("remaining").get(function () {
	const total = this.totalBudget || 0;
	return Math.max(0, total - this.totalSpent);
});

module.exports = mongoose.model("Goal", GoalSchema);


