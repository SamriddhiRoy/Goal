"use strict";

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoMemoryServer } = require("mongodb-memory-server");

dotenv.config();

const goalsRouter = require("./routes/goals");

const app = express();

	app.use(cors({
		origin: (origin, callback) => {
			// Allow non-browser requests (no Origin) and any localhost/127.0.0.1 port in dev
			if (!origin) return callback(null, true);
			const isLocal = /^http:\/\/localhost(?::\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(?::\d+)?$/.test(origin);
			return callback(null, isLocal);
		},
		credentials: true
	}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
	res.json({ status: "ok" });
});

app.use("/api/goals", goalsRouter);

const PORT = process.env.PORT || 4000;

async function connectDatabase() {
	const configuredUri = process.env.MONGODB_URI;
	if (configuredUri && configuredUri.trim().length > 0) {
		await mongoose.connect(configuredUri);
		console.log("Connected to MongoDB");
		return;
	}
	// Fallback to in-memory MongoDB for local/dev without Mongo installed
	const mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	await mongoose.connect(uri);
	console.log("Started in-memory MongoDB");
}

connectDatabase()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Failed to start server:", err);
		process.exit(1);
	});


