import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { validateConfig } from "./infra/config.js";
import { logger } from "./infra/logger.js";
import { createServer } from "./mcp/server.js";

async function main() {
  validateConfig();
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("Pipefy MCP Server running on stdio (167 tools registered)");
}

main().catch((err) => {
  logger.fatal(err, "Failed to start MCP server");
  process.exit(1);
});
