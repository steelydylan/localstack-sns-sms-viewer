const express = require("express");
const path = require("path");

const app = express();

const LOCALSTACK_HOST =
  process.env.LOCALSTACK_HOST || "http://localhost:4566";
const PORT = process.env.PORT || 3006;
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || "5000", 10);
const AWS_REGION = process.env.AWS_REGION || "";

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/config", (req, res) => {
  res.json({
    localstackHost: LOCALSTACK_HOST,
    pollInterval: POLL_INTERVAL,
    region: AWS_REGION,
  });
});

app.get("/api/sms-messages", async (req, res) => {
  try {
    const region = req.query.region || AWS_REGION;
    const queryParams = region ? `?region=${region}` : "";
    const url = `${LOCALSTACK_HOST}/_aws/sns/sms-messages${queryParams}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`LocalStack responded with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching SMS messages:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/sms-messages", async (req, res) => {
  try {
    const region = req.query.region || AWS_REGION;
    const queryParams = region ? `?region=${region}` : "";
    const url = `${LOCALSTACK_HOST}/_aws/sns/sms-messages${queryParams}`;
    const response = await fetch(url, { method: "DELETE" });

    if (!response.ok) {
      throw new Error(`LocalStack responded with status ${response.status}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error clearing SMS messages:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`SMS Viewer running at http://localhost:${PORT}`);
  console.log(`LocalStack host: ${LOCALSTACK_HOST}`);
});
