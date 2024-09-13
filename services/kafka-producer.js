import kafka from "../utils/kafka-client.js";

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer connected");
  } catch (error) {
    console.error("Error connecting Kafka Producer:", error);
  }
};

const produceMessage = async (topic, key, value) => {
  try {
    await producer.send({
      topic: topic,
      messages: [{ key, value }],
    });

    console.log(`Message sent: ${key}`);
  } catch (err) {
    console.error("Error sending message", err);
  }
};

const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    console.log("Kafka Producer disconnected");
  } catch (error) {
    console.error("Error disconnecting Kafka Producer:", error);
  }
};

export { produceMessage, connectProducer, disconnectProducer };
