import { Problem } from "../types/problem";

export type InterviewPersona =
	| "Product Company"
	| "Startup"
	| "Service-Based"
	| "Senior Engineer";

export type InterviewProblemStatus = "pending" | "in-progress" | "completed" | "skipped";

export interface InterviewProblem {
	id: string;
	status: InterviewProblemStatus;
	timeSpent: number; // seconds
	passed: boolean | null; // null if not submitted
	startTime: number; // timestamp
	endTime?: number; // timestamp
}

export interface InterviewSession {
	mode: "interview";
	persona: InterviewPersona;
	duration: number; // minutes
	startTime: number; // timestamp
	problems: InterviewProblem[];
	currentProblemIndex: number;
	interruptionResponse?: string;
}

export interface InterviewResults {
	session: InterviewSession;
	endTime: number;
	totalTimeUsed: number; // seconds
}
