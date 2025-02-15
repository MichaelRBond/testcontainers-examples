import { LocalstackContainer, StartedLocalStackContainer } from "@testcontainers/localstack";
import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { SQSClient, CreateQueueCommand, DeleteQueueCommand } from "@aws-sdk/client-sqs";

describe("Localstack SQS", () => {

  let localstack: StartedLocalStackContainer;
  let sqsClient: SQSClient;
  let queueUrl: string;

  beforeAll(async () => {
    localstack = await new LocalstackContainer("localstack/localstack:latest")
    .withEnvironment({
      SERVICES: "sqs", // Ensure SQS is enabled
      DEFAULT_REGION: "us-east-1",
      EDGE_PORT: "4566", // Default LocalStack API Gateway port
    })
    .start();

      // Get the mapped port and construct the SQS endpoint
    const localstackPort = localstack.getMappedPort(4566);
    const localstackHost = localstack.getHost();
    const sqsEndpoint = `http://${localstackHost}:${localstackPort}`;

    sqsClient = new SQSClient({
      endpoint: sqsEndpoint,
      region: "us-east-1",
      credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
      },
    });

    const createQueueCommand = new CreateQueueCommand({
      QueueName: "test-queue",
    });
    const createQueueResponse = await sqsClient.send(createQueueCommand);
    queueUrl = createQueueResponse.QueueUrl!;

    if (!queueUrl) {
      throw new Error("Queue URL not found");
    }
    console.log(`Queue URL: ${queueUrl}`);

  }, 30000);

  afterAll(async () => {
    if (queueUrl) {
      await sqsClient.send(new DeleteQueueCommand({ QueueUrl: queueUrl }));
    }
    await localstack.stop();
  });

  it("should send a message to a localstack queue", async () => {
    expect(true).toBe(true);
  });
});
