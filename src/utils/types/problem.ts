export type Example = {
	id: number;
	inputText: string;
	outputText: string;
	explanation?: string;
	img?: string;
};

/* ================= LANGUAGE SUPPORT ================= */

export type SupportedLanguage = "javascript" | "java" | "python" | "cpp";

export type StarterCodeMap = {
	javascript: string;
	java: string;
	python: string;
	cpp: string;
};

export type StarterFunctionNameMap = {
	javascript: string;
	java: string;
	python: string;
	cpp: string;
};

/* ================= PROBLEM TYPES ================= */

/**
 * Base problem definition
 * Used by:
 * - localProblems
 * - editor
 * - execution engine
 */
export type Problem = {
	id: string;
	title: string;
	problemStatement: string;
	examples: Example[];
	constraints: string;
	order: number;

	// Backward compatible:
	// can be string (JS only) OR multi-language map
	starterCode: string | StarterCodeMap;

	// JS handler OR string reference
	handlerFunction: ((fn: any) => boolean) | string;

	// Backward compatible
	starterFunctionName: string | StarterFunctionNameMap;

	// ✅ OPTIONAL metadata (may exist in localProblems)
	category?: string;
	difficulty?: "Easy" | "Medium" | "Hard";
};

/**
 * DBProblem = Problem + platform metadata
 * Used by:
 * - problem table
 * - listings
 * - future DB (Firebase / Supabase)
 */
export type DBProblem = Problem & {
	category: string;
	difficulty: "Easy" | "Medium" | "Hard";
	likes: number;
	dislikes: number;
	videoId?: string;
	link?: string;
};
