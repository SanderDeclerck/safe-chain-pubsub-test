const t = require("tap");

t.test("pubsub test", async () => {
  const { PubSub } = require("@google-cloud/pubsub");
  process.env.PUBSUB_EMULATOR_HOST = "127.0.0.1:8085";
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

  await new Promise((resolve) => setTimeout(resolve, 5000));

  t.ok(receivedMessage);

  await subscription.close();
  await pubsub.close();
});
