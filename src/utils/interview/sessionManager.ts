import { InterviewSession, InterviewProblem, InterviewPersona } from "./types";
import { problems } from "@/utils/problems";

const STORAGE_KEY = "interviewSession";

/* ================= PROBLEM SELECTION ================= */

const selectInterviewProblems = (): string[] => {
	const easy = Object.values(problems).filter(p => p.difficulty === "Easy");
	const medium = Object.values(problems).filter(p => p.difficulty === "Medium");

	if (!easy.length || !medium.length) {
		throw new Error("Not enough problems");
	}

	const pick = (arr: any[]) =>
		arr[Math.floor(Math.random() * arr.length)];

	return [pick(easy).id, pick(medium).id];
};

/* ================= SESSION ================= */

export const createInterviewSession = (
	persona: InterviewPersona,
	duration: number
): InterviewSession => {
	const ids = selectInterviewProblems();

	return {
		mode: "interview",
		persona,
		duration,
		startTime: Date.now(),
		currentProblemIndex: 0,
		problems: ids.map((id, i) => ({
			id,
			status: i === 0 ? "in-progress" : "pending",
			timeSpent: 0,
			passed: null,
			startTime: i === 0 ? Date.now() : 0,
			endTime: undefined,
			communication: {},
		})),
	};
};

export const saveSession = (session: InterviewSession) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

export const loadSession = (): InterviewSession | null => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
};

export const clearSession = () => {
	localStorage.removeItem(STORAGE_KEY);
};

/* ================= PROBLEM STATE ================= */

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
	const i = updated.currentProblemIndex;

	// close current problem
	if (updated.problems[i]) {
		updated.problems[i].status = "completed";
		updated.problems[i].endTime = Date.now();
	}

	const next = i + 1;

	if (updated.problems[next]) {
		updated.currentProblemIndex = next;
		updated.problems[next].status = "in-progress";
		updated.problems[next].startTime = Date.now();
	}

	return updated;
};

/* ================= COMMUNICATION (FIXED) ================= */

/**
 * ✅ IMPORTANT FIX:
 * Communication is saved using EXPLICIT problemIndex
 * so responses never overwrite other problems
 */
export const saveCommunicationResponse = (
	session: InterviewSession,
	problemIndex: number,
	type: "understanding" | "approach" | "reflection",
	response: string
): InterviewSession => {
	const updated = structuredClone(session);
	const cp = updated.problems[problemIndex];

	if (!cp) return updated;

	if (!cp.communication) cp.communication = {};
	cp.communication[type] = response;

	return updated;
};

export const getCommunicationProgress = (
	session: InterviewSession,
	problemIndex: number
) => {
	const cp = session.problems[problemIndex];
	const comm = cp?.communication || {};

	return {
		understandingDone: Boolean(comm.understanding),
		approachDone: Boolean(comm.approach),
		reflectionDone: Boolean(comm.reflection),
	};
};
