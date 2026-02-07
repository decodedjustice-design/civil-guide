import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      console.error("ELEVENLABS_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Transcription service is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get form data with audio file
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: "No audio file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Transcribing audio file: ${audioFile.name}, size: ${audioFile.size} bytes`);

    // Prepare form data for ElevenLabs
    const apiFormData = new FormData();
    apiFormData.append("file", audioFile);
    apiFormData.append("model_id", "scribe_v2");
    apiFormData.append("tag_audio_events", "false");
    apiFormData.append("diarize", "true"); // Enable speaker separation

    // Call ElevenLabs Speech-to-Text API
    const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Transcription service is busy. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Transcription quota exceeded. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Transcription failed. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const transcription = await response.json();
    console.log("Transcription completed successfully");

    // Format the response with speaker labels and timestamps
    const formattedSegments: Array<{
      speaker: string;
      text: string;
      startTime: number;
      endTime: number;
    }> = [];

    if (transcription.words && Array.isArray(transcription.words)) {
      let currentSpeaker = "";
      let currentText = "";
      let segmentStart = 0;
      let segmentEnd = 0;

      for (const word of transcription.words) {
        const speaker = word.speaker || "Speaker";
        
        if (speaker !== currentSpeaker && currentText) {
          // Save previous segment
          formattedSegments.push({
            speaker: currentSpeaker || "Speaker A",
            text: currentText.trim(),
            startTime: segmentStart,
            endTime: segmentEnd,
          });
          currentText = "";
          segmentStart = word.start || 0;
        }

        if (!currentText) {
          segmentStart = word.start || 0;
        }

        currentSpeaker = speaker;
        currentText += (word.text || "") + " ";
        segmentEnd = word.end || segmentEnd;
      }

      // Add final segment
      if (currentText) {
        formattedSegments.push({
          speaker: currentSpeaker || "Speaker A",
          text: currentText.trim(),
          startTime: segmentStart,
          endTime: segmentEnd,
        });
      }
    }

    // Map speaker IDs to friendly labels (Speaker A, Speaker B, etc.)
    const speakerMap = new Map<string, string>();
    let speakerIndex = 0;
    const speakerLabels = ["Speaker A", "Speaker B", "Speaker C", "Speaker D", "Speaker E"];

    const labeledSegments = formattedSegments.map(segment => {
      if (!speakerMap.has(segment.speaker)) {
        speakerMap.set(segment.speaker, speakerLabels[speakerIndex] || `Speaker ${speakerIndex + 1}`);
        speakerIndex++;
      }
      return {
        ...segment,
        speaker: speakerMap.get(segment.speaker) || segment.speaker,
      };
    });

    return new Response(
      JSON.stringify({
        fullText: transcription.text || "",
        segments: labeledSegments,
        wordCount: transcription.words?.length || 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Transcription error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
