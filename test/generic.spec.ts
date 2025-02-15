import { GenericContainer } from "testcontainers";
import { test} from "vitest";

test("Testcontainers should be able to start a basic container", async () => {
  process.env.TESTCONTAINERS_RYUK_DISABLED = "true"; // Disable Ryuk (can cause issues)
  process.env.DOCKER_HOST = "unix:///var/run/docker.sock"; // Ensure correct Docker socket
  process.env.TESTCONTAINERS_CHECKS_DISABLE = "true";

  const container = await new GenericContainer("hello-world").start();
  console.log("Testcontainer started successfully");
  await container.stop();
}, 30000);
