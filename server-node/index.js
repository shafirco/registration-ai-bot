const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Node.js server is running" });
});

app.listen(4000, () => console.log("✅ Node server running on port 4000"));
