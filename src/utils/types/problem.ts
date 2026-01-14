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

// Local problem data (used in editor / execution)
export type Problem = {
	id: string;
	title: string;
	problemStatement: string;
	examples: Example[];
	constraints: string;
	order: number;

	// ✅ Backward compatible:
	// can be string (JS only) OR multi-language map
	starterCode: string | StarterCodeMap;

	// ✅ JS handler remains same
	handlerFunction: ((fn: any) => boolean) | string;

	// ✅ Backward compatible
	starterFunctionName: string | StarterFunctionNameMap;
};

// Used for problem table / listings
export type DBProblem = {
	id: string;
	title: string;
	category: string;
	difficulty: string;
	likes: number;
	dislikes: number;
	order: number;
	videoId?: string;
	link?: string;
};
