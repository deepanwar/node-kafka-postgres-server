import kafka from "../utils/kafka-client.js";
import prisma from "../utils/prisma-client.js";

export const RIDER_COORDINATES_TOPIC = "rider-coordinates-topic";

const consumer = kafka.consumer({ groupId: "rider-coordinates-group" });

let messageBuffer = [];
const BATCH_SIZE = 50;

const insertCoordinatesBatch = async (from, batch) => {
  try {
    await prisma.riderCoordinates.createMany({
      data: batch,
    });
    console.log(`>>> Inserted ${batch.length} coordinates into DB from ${from}`);
  } catch (error) {
    console.error(`Error inserting batch into DB from ${from}`, error);
  }
};

const runConsumer = async () => {
  await consumer.connect();

  // Subscribe to the rider coordinates topic
  await consumer.subscribe({
    topic: RIDER_COORDINATES_TOPIC,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = JSON.parse(message.value.toString());

      const { riderId, latitude, longitude, timestamp } = value;

      // console.log(`Received coordinates for rider: ${riderId}`);

      messageBuffer.push({
        riderId: riderId,
        latitude: latitude,
        longitude: longitude,
        timestamp: new Date(timestamp),
      });

      if (messageBuffer.length >= BATCH_SIZE) {
        const batch = [...messageBuffer];
        messageBuffer = [];
        await insertCoordinatesBatch("OVERFLOW", batch);
      }
    },
  });

  setInterval(async () => {
    if (messageBuffer.length > 0) {
      const batch = [...messageBuffer];
      messageBuffer = [];
      await insertCoordinatesBatch("PERIODIC_FLUSH", batch);
    }
  }, 5000);
};

export { runConsumer };
