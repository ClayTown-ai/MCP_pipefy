import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pipefyRequest } from "../../../pipefy/client.js";
import { M_CREATE_AUTOMATION_SIMULATION } from "../../../pipefy/mutations.js";
import { Q_AUTOMATION_SIMULATION } from "../../../pipefy/queries.js";
import { jsonResult, errorResult } from "../../../pipefy/mapper.js";
import { PipefyApiError } from "../../../core/errors.js";

export function registerSimulateAutomation(server: McpServer) {
  server.tool(
    "simulate_automation",
    "Dry-run an automation: creates a simulation and returns its result. Two-step process.",
    {
      automation_id: z.string().describe("Automation ID to simulate"),
      card_id: z.string().optional().describe("Card ID to use as context"),
    },
    async (input) => {
      try {
        const simData = await pipefyRequest<{ createAutomationSimulation: { automationSimulation: { id: string } } }>(
          M_CREATE_AUTOMATION_SIMULATION,
          { input: { automation_id: input.automation_id, ...(input.card_id && { card_id: input.card_id }) } },
        );
        const simId = simData.createAutomationSimulation.automationSimulation.id;

        const result = await pipefyRequest<{ automationSimulation: any }>(Q_AUTOMATION_SIMULATION, { id: simId });
        return jsonResult(result.automationSimulation);
      } catch (e) {
        if (e instanceof PipefyApiError) return errorResult(e.type, e.message);
        throw e;
      }
    },
  );
}
