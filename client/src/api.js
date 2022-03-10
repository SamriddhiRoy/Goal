const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function apiGet(path) {
	const res = await fetch(`${BASE_URL}${path}`);
	if (!res.ok) {
		let message = `GET ${path} failed`;
		try {
			const data = await res.json();
			if (data && data.message) message = data.message;
		} catch (_) {}
		throw new Error(message);
	}
	return res.json();
}

export async function apiPost(path, body) {
	const res = await fetch(`${BASE_URL}${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		let message = `POST ${path} failed`;
		try {
			const data = await res.json();
			if (data && data.message) message = data.message;
		} catch (_) {}
		throw new Error(message);
	}
	return res.json();
}

export async function apiPut(path, body) {
	const res = await fetch(`${BASE_URL}${path}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		let message = `PUT ${path} failed`;
		try {
			const data = await res.json();
			if (data && data.message) message = data.message;
		} catch (_) {}
		throw new Error(message);
	}
	return res.json();
}

export async function apiDelete(path) {
	const res = await fetch(`${BASE_URL}${path}`, { method: "DELETE" });
	if (!res.ok) {
		let message = `DELETE ${path} failed`;
		try {
			const data = await res.json();
			if (data && data.message) message = data.message;
		} catch (_) {}
		throw new Error(message);
	}
	return res.json();
}


