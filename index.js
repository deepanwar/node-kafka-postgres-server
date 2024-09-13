import express from "express";
import morgan from "morgan";
import {
  addRiderCoordinates,
  createRider,
} from "./controllers/rider.controller.js";
// import {
//   connectProducer,
//   disconnectProducer,
// } from "./services/kafka-producer.js";
// import { runConsumer } from "./services/kafka-consumer.js";

const app = express();

const PORT = 8000;

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/rider", createRider);
app.post("/rider/coordinates", addRiderCoordinates);

// process.on("SIGINT", async () => {
//   await disconnectProducer();
//   process.exit();
// });

app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}!`);
  // await connectProducer();
  // runConsumer().catch(console.error);
});
