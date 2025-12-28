const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/message");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req: any, res: any) => {
  res.json({ status: "OK", message: "Backend running" });
});

const PORT = process.env.PORT || 4000;
app.use("/api/conversation", conversationRoutes);
app.use("/api/messages", messageRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
