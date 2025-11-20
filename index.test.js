const t = require("tap");

// Set emulator host before importing PubSub to avoid metadata lookup
process.env.PUBSUB_EMULATOR_HOST = "127.0.0.1:8085";

t.test("pubsub test", async (t) => {
  const { PubSub } = require("@google-cloud/pubsub");
  const TOPIC_NAME = "demo-topic";
  const SUBSCRIPTION_NAME = "demo-subscription";

  const pubsub = new PubSub({
    projectId: "test-project",
    emulatorMode: true,
  });

  const [topic] = await pubsub.topic(TOPIC_NAME).get({ autoCreate: true });

  const [subscription] = await topic
    .subscription(SUBSCRIPTION_NAME)
    .get({ autoCreate: true });

  let receivedMessage = false;
  subscription.on("message", () => (receivedMessage = true));

  await topic.publishMessage({ data: Buffer.from("test message") });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  t.ok(receivedMessage, "message should be received");

  // await subscription.close();
  // await pubsub.close();
});
