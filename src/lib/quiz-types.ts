export type UserType = "student" | "worker" | null;
export type StudentLevel = "high-school" | "bachelor" | "masters" | "phd" | null;
export type WorkerGoal = "upskill" | "change" | null;

export interface QuizState {
  userType: UserType;
  studentLevel: StudentLevel;
  workerGoal: WorkerGoal;
  // Profile
  name: string;
  age: string;
  location: string;
  studyPreference: string;
  interests: string[];
  // Academics current
  currentEducation: string;
  currentField: string;
  performance: string;
  // Academics future
  futureField: string;
  educationType: string;
  institutionType: string;
  format: string;
  // Career current
  employmentStatus: string;
  industry: string;
  experience: string;
  skills: string[];
  // Career aspirations
  desiredField: string;
  salaryExpectation: number;
  timeline: string;
  flexibility: string;
  // Finance situation
  income: number;
  savings: number;
  support: string;
  debtComfort: number;
  // Finance budget
  budgetFlexibility: number;
  livingArrangement: string;
  weeklyCost: number;
  // Personality (8 sliders 0-100)
  personality: number[];
  // Accessibility
  supportNeeds: string[];
  // Lifestyle
  citySize: string;
  socialEnv: string;
  commute: string;
  workLifeBalance: number;
  priorities: string[];
}

export const defaultQuiz: QuizState = {
  userType: null,
  studentLevel: null,
  workerGoal: null,
  name: "",
  age: "",
  location: "",
  studyPreference: "",
  interests: [],
  currentEducation: "",
  currentField: "",
  performance: "",
  futureField: "",
  educationType: "",
  institutionType: "",
  format: "",
  employmentStatus: "",
  industry: "",
  experience: "",
  skills: [],
  desiredField: "",
  salaryExpectation: 70000,
  timeline: "",
  flexibility: "",
  income: 30000,
  savings: 10000,
  support: "",
  debtComfort: 50,
  budgetFlexibility: 50,
  livingArrangement: "",
  weeklyCost: 400,
  personality: [50, 50, 50, 50, 50, 50, 50, 50],
  supportNeeds: [],
  citySize: "",
  socialEnv: "",
  commute: "",
  workLifeBalance: 50,
  priorities: ["Career outcomes", "Affordability", "Location", "Social life", "Prestige"],
};
