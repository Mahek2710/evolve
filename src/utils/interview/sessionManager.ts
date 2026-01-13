import { InterviewSession, InterviewProblem, InterviewPersona } from "./types";
import { problems } from "@/utils/problems";

const STORAGE_KEY = "interviewSession";

/**
 * Safely select interview problems
 * 1 Easy + 1 Medium (random but deterministic enough)
 */
const selectInterviewProblems = (): string[] => {
	const easy = Object.values(problems).filter(p => p.difficulty === "Easy");
	const medium = Object.values(problems).filter(p => p.difficulty === "Medium");

	if (easy.length === 0 || medium.length === 0) {
		throw new Error("Not enough problems to create interview");
	}

	const pickRandom = (arr: any[]) =>
		arr[Math.floor(Math.random() * arr.length)];

	return [
		pickRandom(easy).id,
		pickRandom(medium).id,
	];
};

export const createInterviewSession = (
	persona: InterviewPersona,
	duration: number
): InterviewSession => {
	const problemIds = selectInterviewProblems();

	const problemsList: InterviewProblem[] = problemIds.map((id, index) => ({
		id,
		status: index === 0 ? "in-progress" : "pending",
		timeSpent: 0,
		passed: null,
		startTime: index === 0 ? Date.now() : 0,
	}));

	return {
		mode: "interview",
		persona,
		duration,
		startTime: Date.now(),
		problems: problemsList,
		currentProblemIndex: 0,
	};
};

export const saveSession = (session: InterviewSession): void => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const loadSession = (): InterviewSession | null => {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (!saved) return null;

		const parsed = JSON.parse(saved);
		if (!parsed?.problems || !Array.isArray(parsed.problems)) {
			return null;
		}

		return parsed as InterviewSession;
	} catch {
		return null;
	}
};

export const clearSession = (): void => {
	localStorage.removeItem(STORAGE_KEY);
};

export const updateProblemStatus = (
	session: InterviewSession,
	index: number,
	updates: Partial<InterviewProblem>
): InterviewSession => {
	const updated = structuredClone(session);

	if (!updated.problems[index]) return updated;

	updated.problems[index] = {
		...updated.problems[index],
		...updates,
	};

	return updated;
};

export const moveToNextProblem = (
	session: InterviewSession
): InterviewSession => {
	const updated = structuredClone(session);
	const currentIndex = updated.currentProblemIndex;

	if (updated.problems[currentIndex]) {
		updated.problems[currentIndex].status = "completed";
		updated.problems[currentIndex].endTime = Date.now();
	}

	const nextIndex = currentIndex + 1;
	if (nextIndex < updated.problems.length) {
		updated.currentProblemIndex = nextIndex;
		updated.problems[nextIndex].status = "in-progress";
		updated.problems[nextIndex].startTime = Date.now();
	}

	return updated;
};
	