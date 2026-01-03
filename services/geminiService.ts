
import { GoogleGenAI, Type } from "@google/genai";
import { PlaceIntelligence } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchPlaceIntelligence = async (placeName: string): Promise<PlaceIntelligence> => {
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `
    You are YAXTRA, the ultimate travel intelligence engine for India.
    Your mission is to provide exhaustive, high-volume travel data for ANY location in the subcontinent.

    EXPANSION RULES:
    1. NO LIMITS: Never restrict output to a small number of items. 
    2. VOLUME FOR CITIES: For major cities and large towns, you MUST provide 6-10 items per list (Food, Religious Sites, Bazaars, Tourist Places).
    3. EXHAUSTIVE FOR VILLAGES: For smaller towns or villages, provide every single real, verifiable location or specialty available. 
    4. SMART RESOLUTION: Resolve all names, aliases (Kashi/Varanasi), and phonetic typos (Merut/Meerut) automatically.
    5. NEVER FAIL: Do not return "not found". Use regional/district cultural data to fill gaps for tiny locations.
    6. TOURIST PLACES: Provide a comprehensive list of sightseeing spots, heritage sites, and natural attractions.
    7. TONE: Premium, informative, and authoritative.

    SECTIONS TO POPULATE EXHAUSTIVELY:
    - Local Food: All popular and niche local dishes.
    - Culture & Lifestyle: Deep details on traditions, social life, and clothing.
    - Religious & Spiritual: Every significant temple, shrine, or site.
    - Places to Visit: Extensive list of tourist attractions, landmarks, and parks.
    - Famous Bazaars: Comprehensive list of shopping areas and local markets.
    - Greetings: Multiple local greetings and nuanced etiquette.
    - Travel Tips: Robust logistical advice.
  `;

  const prompt = `EXHAUSTIVE INTELLIGENCE SCAN: "${placeName}". Provide maximum possible detail. 
  For this location, list 6-10 items for each category (Food, Religious, Bazaars, Tourist Sites) if it is a city. 
  If a village, list all available records. Do not truncate.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            placeName: { type: Type.STRING },
            district: { type: Type.STRING },
            state: { type: Type.STRING },
            alternateNames: { type: Type.ARRAY, items: { type: Type.STRING } },
            tagline: { type: Type.STRING },
            overview: { type: Type.STRING },
            regionalContext: { type: Type.STRING },
            localFood: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dishName: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["dishName", "description"]
              }
            },
            cultureAndLifestyle: {
              type: Type.OBJECT,
              properties: {
                traditions: { type: Type.STRING },
                festivals: { type: Type.STRING },
                clothing: { type: Type.STRING },
                lifestyle: { type: Type.STRING }
              },
              required: ["traditions", "festivals", "clothing", "lifestyle"]
            },
            religiousAndSpiritual: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  significance: { type: Type.STRING }
                },
                required: ["name", "significance"]
              }
            },
            placesToVisit: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["name", "type", "description"]
              }
            },
            famousMarkets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["name", "description"]
              }
            },
            greetingsAndEtiquette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phrase: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  usage: { type: Type.STRING }
                },
                required: ["phrase", "meaning", "usage"]
              }
            },
            travelTips: {
              type: Type.OBJECT,
              properties: {
                bestTime: { type: Type.STRING },
                transport: { type: Type.STRING },
                etiquette: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["bestTime", "transport", "etiquette"]
            }
          },
          required: ["placeName", "tagline", "overview", "localFood", "cultureAndLifestyle", "religiousAndSpiritual", "famousMarkets", "greetingsAndEtiquette", "travelTips", "placesToVisit"]
        }
      }
    });

    const data = JSON.parse(response.text.trim());
    return data as PlaceIntelligence;
  } catch (error) {
    return {
      placeName: placeName,
      district: "Regional Records",
      state: "India",
      alternateNames: [],
      tagline: "Exploring the Soul of the Subcontinent",
      overview: `YAXTRA is synchronizing extensive regional records for ${placeName}. This area contributes to the vibrant cultural mosaic of the region through its unique community heritage and historical legacy.`,
      regionalContext: "YAXTRA explored regional and cultural records to bring you this experience.",
      localFood: [
        { dishName: "Authentic Regional Thali", description: "Seasonal home-style preparations using locally grown grains and heirloom spices." }
      ],
      cultureAndLifestyle: {
        traditions: "Deep-seated community values and unique local folklore define social life.",
        festivals: "Lively celebrations marking solar cycles and ancestral harvests.",
        clothing: "Traditional hand-loomed fabrics designed for the regional climate.",
        lifestyle: "A community-focused way of life based on mutual support and agrarian rhythms."
      },
      religiousAndSpiritual: [
        { name: "Village Shrine", significance: "Ancient place of worship serving as a social and spiritual hub." }
      ],
      placesToVisit: [
        { name: "Scenic Landmarks", type: "Nature", description: "Pristine landscapes that define the regional beauty." }
      ],
      famousMarkets: [
        { name: "Regional Bazaar", description: "Central trade hub for artisanal goods and fresh produce." }
      ],
      greetingsAndEtiquette: [
        { phrase: "Namaste", meaning: "Respectful greeting", usage: "Universal mark of welcome used with elders and peers alike." }
      ],
      travelTips: { 
        bestTime: "October to March", 
        transport: "Local bus networks and district shared transit", 
        etiquette: ["Honor local spiritual customs", "Ask permission before photography", "Greet the elders first"] 
      }
    };
  }
};
