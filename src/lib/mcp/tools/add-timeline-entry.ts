import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "add_timeline_entry",
  title: "Add timeline entry",
  description: "Add a dated event to the signed-in user's case timeline.",
  inputSchema: {
    title: z.string().trim().min(1).max(200).describe("Short event title."),
    event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Event date as YYYY-MM-DD."),
    description: z.string().trim().max(4000).optional().describe("Optional details about the event."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ title, event_date, description }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("timeline_entries")
      .insert({ user_id: ctx.getUserId()!, title, event_date, description: description ?? null })
      .select("id, title, event_date, description")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Added timeline entry "${data.title}" on ${data.event_date}.` }],
      structuredContent: { entry: data },
    };
  },
});
