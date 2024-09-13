# Kafka Large Data Producer with PostgreSQL

This project demonstrates the use of Apache Kafka to handle a high-frequency data producer, capable of processing large amounts of data. The project is designed to handle up to 13 requests per second by efficiently producing data to a Kafka topic. It also integrates PostgreSQL as the database with Prisma as the ORM to manage and persist the data.

## Prerequisites

- **Node.js** (Ensure [pnpm](https://pnpm.io/installation) is installed)
- **Docker** (Ensure [Docker Compose](https://docs.docker.com/compose/) is installed)

## Getting Started

### Step 1: Install Dependencies

Install all the required dependencies using pnpm:

```bash
pnpm i
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the project root and define the PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://postgres:example@localhost:5432/mydatabase"
```

### Step 3: Start Kafka and PostgreSQL with Docker

Launch Kafka, Zookeeper, and PostgreSQL using Docker Compose:

```bash
docker compose up
```

### Step 4: Initialize Prisma

Generate the Prisma client and migrate the database:

```bash
npx prisma migrate dev --name init
```

### Step 5: Create Kafka Topic

Create the necessary Kafka topic to handle incoming requests:

```bash
pnpm kafka:create-topic
```

## Data Flow

<!-- <img src="data-flow.png" style="height:500px"> -->

![data flow](data-flow.png)

1. **Request Handling**: Incoming data from API requests is sent to Kafka at a frequency of 13 requests per second.
2. **Kafka Queue**: Kafka handles the data stream and queues the data for batch processing.

3. **Batch Overflow & Bulk Insert**:

   - Once the batch size reaches a specified limit (i.e., batch overflow), the data is bulk inserted into the PostgreSQL database using Prisma.
   - This ensures efficient database operations, reducing the load caused by frequent small inserts.

4. **Periodic Flushing**:
   - A periodic flush mechanism runs every 3 seconds (ideally every second) to ensure that any unprocessed data in the current batch gets written to the database.
   - If the batch does not reach the overflow limit, but there is still unprocessed data, the periodic flush will process and insert that data into the database.

## Overview

- **Request Frequency**: The API is designed to handle more than 20 requests per second.
- **Kafka**: Used to queue and manage large volumes of data produced at high frequencies.
- **PostgreSQL**: Used as the database to store and persist data.
- **Prisma**: ORM for managing database queries and migrations.
- **Batch Processing**: Bulk inserts for efficient database operations during batch overflow.
- **Periodic Flushing**: Ensures no data is left unprocessed in the Kafka queue by flushing it every 3 seconds.

---

This setup integrates Kafka for large data handling and PostgreSQL for database operations, managed using Prisma.
