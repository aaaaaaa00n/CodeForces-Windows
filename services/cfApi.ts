import { CFResponse, CFUser, RatingChange, Contest, Problem, Submission } from '../types';

const BASE_URL = "https://codeforces.com/api";

// Fix: Allow boolean in params to support flags like 'gym'
async function fetchCF<T>(endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, String(params[key])));
  
  try {
    const response = await fetch(url.toString());
    const data: CFResponse<T> = await response.json();
    
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Codeforces API Error");
    }
    
    if (!data.result) {
      throw new Error("No result returned from API");
    }
    
    return data.result;
  } catch (error) {
    console.error(`API Call failed for ${endpoint}:`, error);
    throw error;
  }
}

export const cfApi = {
  getUserInfo: (handles: string) => 
    fetchCF<CFUser[]>("user.info", { handles }),
    
  getUserRating: (handle: string) => 
    fetchCF<RatingChange[]>("user.rating", { handle }),
    
  getUserStatus: (handle: string, count: number = 20) => 
    fetchCF<Submission[]>("user.status", { handle, from: 1, count }),
    
  getContests: (gym: boolean = false) => 
    fetchCF<Contest[]>("contest.list", { gym }),
    
  getProblems: () => 
    fetchCF<{ problems: Problem[], problemStatistics: any[] }>("problemset.problems", {}),
};