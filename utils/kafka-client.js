import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-node-producer",
  brokers: ["localhost:9092"],
});

export default kafka;
