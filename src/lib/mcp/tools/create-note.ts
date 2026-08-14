import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_note",
  title: "Create note",
  description: "Create a private case note for the signed-in user.",
  inputSchema: {
    title: z.string().trim().min(1).max(200).describe("Note title."),
    content: z.string().trim().max(20000).optional().describe("Note body text."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ title, content }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("notes")
      .insert({ user_id: ctx.getUserId()!, title, content: content ?? null })
      .select("id, title, content")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Created note "${data.title}".` }],
      structuredContent: { note: data },
    };
  },
});
