import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-node-producer",
  brokers: ["localhost:9092"],
});

const admin = kafka.admin();

const createTopic = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      {
        topic: "rider-coordinates-topic",
        numPartitions: 2,
        replicationFactor: 1,
      },
    ],
  });

  // const topics = await admin.listTopics();
  // console.log("Topics:", topics);

  await admin.disconnect();
};

createTopic().catch(console.error);
