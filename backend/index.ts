import express from "express";
import clientRouter from "./routes/client";
import taskRouter from "./routes/task";
const app = express();
app.use(express.json());

app.use("/health", (req, res) => {
  res.json({
    message: "OK",
  });
});

app.use("/api/v1/clients", clientRouter);
app.use("/api/v1/tasks", taskRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
