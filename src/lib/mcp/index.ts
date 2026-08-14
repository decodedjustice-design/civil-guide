import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listCasesTool from "./tools/list-cases";
import listTimelineEntriesTool from "./tools/list-timeline-entries";
import addTimelineEntryTool from "./tools/add-timeline-entry";
import listNotesTool from "./tools/list-notes";
import createNoteTool from "./tools/create-note";
import listEvidenceTool from "./tools/list-evidence";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "decoded-justice",
  title: "Decoded Justice",
  version: "0.1.0",
  instructions:
    "Tools for Decoded Justice, a trauma-aware civil rights documentation workspace (educational use only, not legal advice). Read and add the signed-in user's cases, timeline entries, notes, and evidence metadata. Never give legal advice or predict outcomes.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listCasesTool,
    listTimelineEntriesTool,
    addTimelineEntryTool,
    listNotesTool,
    createNoteTool,
    listEvidenceTool,
  ],
});
