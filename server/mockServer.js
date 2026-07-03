const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// In-memory store: Map<playerId:key, data>
const store = new Map();

app.get("/", (req, res) =>
  res.json({ status: "ok", message: "Mock FishVN backend running" }),
);

app.post("/api/save", (req, res) => {
  try {
    const { playerId, key, data } = req.body;
    if (!playerId || !key)
      return res
        .status(400)
        .json({ success: false, error: "Missing playerId or key" });
    store.set(`${playerId}:${key}`, data === undefined ? null : data);
    return res.json({ success: true, message: "Saved (mock)", data: data });
  } catch (e) {
    console.error("Error /api/save", e);
    return res
      .status(500)
      .json({ success: false, error: "Internal mock server error" });
  }
});

app.get("/api/load", (req, res) => {
  try {
    const { playerId, key } = req.query;
    if (!playerId || !key)
      return res
        .status(400)
        .json({ success: false, error: "Missing playerId or key" });
    const val = store.has(`${playerId}:${key}`)
      ? store.get(`${playerId}:${key}`)
      : null;
    return res.json({ success: true, data: val });
  } catch (e) {
    console.error("Error /api/load", e);
    return res
      .status(500)
      .json({ success: false, error: "Internal mock server error" });
  }
});

app.post("/api/clear", (req, res) => {
  try {
    const { playerId } = req.body;
    if (!playerId)
      return res
        .status(400)
        .json({ success: false, error: "Missing playerId" });
    const prefix = `${playerId}:`;
    for (const key of Array.from(store.keys())) {
      if (key.startsWith(prefix)) store.delete(key);
    }
    return res.json({ success: true, message: "Cleared (mock)" });
  } catch (e) {
    console.error("Error /api/clear", e);
    return res
      .status(500)
      .json({ success: false, error: "Internal mock server error" });
  }
});

app.listen(PORT, () =>
  console.log(`Mock backend listening on http://localhost:${PORT}`),
);
