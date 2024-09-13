import { RIDER_COORDINATES_TOPIC } from "../services/kafka-consumer.js";
import { produceMessage } from "../services/kafka-producer.js";
import prisma from "../utils/prisma-client.js";

const createRider = async (req, res) => {
  try {
    const rider = await prisma.rider.create({
      data: {
        name: req.body.name,
      },
    });
    return res.status(201).json(rider);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to send rider coordinates");
  }
};

const addRiderCoordinates = async (req, res) => {
  const { riderId, latitude, longitude, timestamp } = req.body;

  try {
    const value = JSON.stringify({ riderId, latitude, longitude, timestamp });
    await produceMessage(RIDER_COORDINATES_TOPIC, riderId, value);

    // return res.status(200).json({
    //   message: "Rider coordinates sent to Kafka",
    //   values: req.body,
    // });
    return res.status(200).send("Rider coordinates sent to Kafka");
  } catch (error) {
    return res.status(500).send("Failed to send rider coordinates");
  }
};

export { createRider, addRiderCoordinates };
