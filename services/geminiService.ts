import { GoogleGenAI } from "@google/genai";
import { CFUser, Submission } from '../types';

let ai: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (e) {
  console.warn("Gemini API Key missing or invalid.");
}

export const generateStudyPlan = async (user: CFUser, recentSubmissions: Submission[]): Promise<string> => {
  if (!ai) {
    return "Please configure your Gemini API Key in the environment variables to use this feature.";
  }

  // Calculate some basic stats to feed to the AI
  const weakTags = new Map<string, number>();
  const strongTags = new Map<string, number>();

  recentSubmissions.forEach(sub => {
    if (sub.verdict === 'OK') {
      sub.problem.tags.forEach(t => strongTags.set(t, (strongTags.get(t) || 0) + 1));
    } else {
      sub.problem.tags.forEach(t => weakTags.set(t, (weakTags.get(t) || 0) + 1));
    }
  });

  const weakTagsStr = Array.from(weakTags.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(e => e[0])
    .join(", ");

  const prompt = `
    I am a competitive programmer on Codeforces.
    My handle is ${user.handle}.
    My current rating is ${user.rating} (${user.rank}).
    
    Based on my recent history:
    - I often struggle with these tags: ${weakTagsStr || 'General implementation'}
    
    Please generate a concise, 3-step study plan for me to improve my rating by 100 points.
    Focus on specific topics I should learn and the difficulty range of problems I should practice (e.g., rated ${user.rating + 100} to ${user.rating + 300}).
    Keep it encouraging but technical.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Could not generate study plan.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to contact AI service. Please try again later.";
  }
};