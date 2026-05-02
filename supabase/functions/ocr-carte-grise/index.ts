// Edge function: OCR carte grise tunisienne via Lovable AI Gateway (Gemini Vision)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY non configuré" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { imageBase64 } = await req.json();
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return new Response(JSON.stringify({ error: "imageBase64 requis (data URL)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Tu es un expert OCR spécialisé dans les cartes grises (certificats d'immatriculation) tunisiennes.
Tu reçois une image de carte grise et tu dois extraire EXACTEMENT les informations visibles.

Règles importantes pour les cartes grises tunisiennes :
- L'immatriculation tunisienne a le format "NNN TUN NNNN" (ex: "245 TUN 7821") OU "RS NNNNNN" (immatriculations spéciales)
- Le numéro de série / VIN / châssis est une chaîne alphanumérique de 17 caractères
- La marque peut être Tesla, Peugeot, Renault, Volkswagen, CASE, etc.
- Le propriétaire est en lettres latines ou arabes - retourne en lettres latines
- Si tu ne peux pas lire un champ, mets une chaîne vide "" - ne devine JAMAIS
- N'invente AUCUNE donnée

Retourne UNIQUEMENT un appel d'outil avec les données extraites.`;

    const tools = [
      {
        type: "function",
        function: {
          name: "extract_carte_grise",
          description: "Extrait les informations d'une carte grise tunisienne",
          parameters: {
            type: "object",
            properties: {
              immatriculation: { type: "string", description: "Numéro d'immatriculation, ex: '245 TUN 7821'" },
              numChassis: { type: "string", description: "Numéro de châssis / VIN / N° série (17 caractères alphanumériques)" },
              marque: { type: "string", description: "Marque du véhicule (ex: Tesla, Peugeot, CASE)" },
              modele: { type: "string", description: "Modèle / type du véhicule" },
              proprietaire: { type: "string", description: "Nom complet du propriétaire (titulaire) en lettres latines" },
              datePremiereImmat: { type: "string", description: "Date de première mise en circulation (format JJ/MM/AAAA), vide si absent" },
              confidence: { type: "number", description: "Confiance globale entre 0 et 1" },
            },
            required: ["immatriculation", "numChassis", "marque", "modele", "proprietaire", "confidence"],
            additionalProperties: false,
          },
        },
      },
    ];

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Extrait les informations de cette carte grise tunisienne." },
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "extract_carte_grise" } },
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, errText);
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans un instant." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits Lovable AI épuisés. Ajoutez des crédits dans Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ error: "Erreur passerelle IA", details: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResp.json();
    const toolCall = aiData?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("Pas de tool_call dans la réponse IA:", JSON.stringify(aiData));
      return new Response(JSON.stringify({ error: "L'IA n'a pas pu extraire les données" }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const extracted = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify({ success: true, data: extracted }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ocr-carte-grise error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
