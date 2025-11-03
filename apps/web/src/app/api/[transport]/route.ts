import "server-only";
import { getUserInfoTool } from "./tools";
import { usernameSchema } from "@/core/mcp/mcp.schema";
import { createMcpHandler } from "@vercel/mcp-adapter";

const handler = createMcpHandler(
  (server) => {
    // @ts-expect-error - TS inference too deep in MCPServer tool
    server.tool(
      "getUserInfo",
      "Give user's info based on username",
      {
        username: usernameSchema,
      },
      getUserInfoTool
    );
  },
  {
    capabilities: {
      tools: {
        getUserInfo: {
          description: "Give user's info based on username",
        },
      },
    },
  },
  { basePath: "/api" }
);

export { handler as GET, handler as POST, handler as DELETE };
