// API Response Wrappers
export interface CFResponse<T> {
  status: "OK" | "FAILED";
  result?: T;
  comment?: string;
}

// User Interface
export interface CFUser {
  handle: string;
  email?: string;
  vkId?: string;
  openId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
}

// Rating History
export interface RatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

// Contest Interface
export interface Contest {
  id: number;
  name: string;
  type: "CF" | "IOI" | "ICPC";
  phase: "BEFORE" | "CODING" | "PENDING_SYSTEM_TEST" | "SYSTEM_TEST" | "FINISHED";
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds?: number;
  relativeTimeSeconds?: number;
}

// Problem Interface
export interface Problem {
  contestId?: number;
  problemsetName?: string;
  index: string;
  name: string;
  type: "PROGRAMMING" | "QUESTION";
  points?: number;
  rating?: number;
  tags: string[];
}

// Submission/Status
export interface Submission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: Problem;
  author: {
    contestId: number;
    members: { handle: string }[];
    participantType: string;
    ghost: boolean;
    room?: number;
    startTimeSeconds?: number;
  };
  programmingLanguage: string;
  verdict?: "FAILED" | "OK" | "PARTIAL" | "COMPILATION_ERROR" | "RUNTIME_ERROR" | "WRONG_ANSWER" | "PRESENTATION_ERROR" | "TIME_LIMIT_EXCEEDED" | "MEMORY_LIMIT_EXCEEDED" | "IDLENESS_LIMIT_EXCEEDED" | "SECURITY_VIOLATED" | "CRASHED" | "INPUT_PREPARATION_CRASHED" | "CHALLENGED" | "SKIPPED" | "TESTING" | "REJECTED";
  testset?: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

// Navigation Tabs
export enum Tab {
  DASHBOARD = 'DASHBOARD',
  CONTESTS = 'CONTESTS',
  PROBLEMS = 'PROBLEMS',
  STUDY_PLAN = 'STUDY_PLAN'
}