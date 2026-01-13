import { problems } from "../problems";
import { Problem } from "../types/problem";
import { InterviewPersona } from "./types";

type ProblemWithId = Problem & { id: string };

const getAllProblems = (): ProblemWithId[] => {
	return Object.keys(problems).map((id) => ({
		id,
		...problems[id],
	}));
};

const getProblemsByDifficulty = (
	allProblems: ProblemWithId[],
	difficulty: "Easy" | "Medium" | "Hard"
): ProblemWithId[] => {
	return allProblems.filter((p) => p.difficulty === difficulty);
};

const shuffleArray = <T>(array: T[]): T[] => {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
};

export const selectProblemsForPersona = (
	persona: InterviewPersona
): string[] => {
	const allProblems = getAllProblems();
	const easyProblems = getProblemsByDifficulty(allProblems, "Easy");
	const mediumProblems = getProblemsByDifficulty(allProblems, "Medium");
	const hardProblems = getProblemsByDifficulty(allProblems, "Hard");

	let selectedIds: string[] = [];

	switch (persona) {
		case "Product Company":
			// 1 Easy + 2 Medium
			selectedIds = [
				...shuffleArray(easyProblems).slice(0, Math.min(1, easyProblems.length)),
				...shuffleArray(mediumProblems).slice(0, Math.min(2, mediumProblems.length)),
			].map((p) => p.id);
			// Fill with any available if not enough
			if (selectedIds.length < 3) {
				const remaining = shuffleArray(allProblems)
					.filter((p) => !selectedIds.includes(p.id))
					.slice(0, 3 - selectedIds.length)
					.map((p) => p.id);
				selectedIds = [...selectedIds, ...remaining];
			}
			break;

		case "Startup":
			// 2 Medium + 1 Hard
			selectedIds = [
				...shuffleArray(mediumProblems).slice(0, Math.min(2, mediumProblems.length)),
				...shuffleArray(hardProblems).slice(0, Math.min(1, hardProblems.length)),
			].map((p) => p.id);
			// Fill with any available if not enough
			if (selectedIds.length < 3) {
				const remaining = shuffleArray(allProblems)
					.filter((p) => !selectedIds.includes(p.id))
					.slice(0, 3 - selectedIds.length)
					.map((p) => p.id);
				selectedIds = [...selectedIds, ...remaining];
			}
			break;

		case "Service-Based":
			// 2 Easy + 1 Medium
			selectedIds = [
				...shuffleArray(easyProblems).slice(0, Math.min(2, easyProblems.length)),
				...shuffleArray(mediumProblems).slice(0, Math.min(1, mediumProblems.length)),
			].map((p) => p.id);
			// Fill with any available if not enough
			if (selectedIds.length < 3) {
				const remaining = shuffleArray(allProblems)
					.filter((p) => !selectedIds.includes(p.id))
					.slice(0, 3 - selectedIds.length)
					.map((p) => p.id);
				selectedIds = [...selectedIds, ...remaining];
			}
			break;

		case "Senior Engineer":
			// 1 Medium + 2 Hard
			selectedIds = [
				...shuffleArray(mediumProblems).slice(0, Math.min(1, mediumProblems.length)),
				...shuffleArray(hardProblems).slice(0, Math.min(2, hardProblems.length)),
			].map((p) => p.id);
			// Fill with any available if not enough
			if (selectedIds.length < 3) {
				const remaining = shuffleArray(allProblems)
					.filter((p) => !selectedIds.includes(p.id))
					.slice(0, 3 - selectedIds.length)
					.map((p) => p.id);
				selectedIds = [...selectedIds, ...remaining];
			}
			break;
	}

	// Shuffle final selection for randomness
	return shuffleArray(selectedIds).slice(0, 3); // Ensure exactly 3 problems
};
