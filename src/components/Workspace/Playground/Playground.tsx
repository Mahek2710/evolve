import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "./EditorFooter";
import { Problem } from "@/utils/types/problem";
import { toast } from "react-toastify";
import { problems } from "@/utils/problems";
import { useRouter } from "next/router";
import useLocalStorage from "@/hooks/useLocalStorage";

/* ================= TYPES ================= */

type Language = "javascript" | "java" | "python" | "cpp";

type PlaygroundProps = {
	problem: Problem;
	setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
	setSolved: React.Dispatch<React.SetStateAction<boolean>>;
	isInterviewMode?: boolean;
	onSubmissionComplete?: (isCorrect: boolean) => void;
	problemId?: string;
};

export interface ISettings {
	fontSize: string;
	settingsModalIsOpen: boolean;
	dropdownIsOpen: boolean;
}

/* ================= COMPONENT ================= */

const Playground: React.FC<PlaygroundProps> = ({
	problem,
	setSuccess,
	setSolved,
	isInterviewMode = false,
	onSubmissionComplete,
	problemId: propProblemId,
}) => {
	const [activeTestCaseId, setActiveTestCaseId] = useState(0);
	const [userCode, setUserCode] = useState(problem.starterCode);
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [isSolved, setIsSolved] = useState(false);

	// 🌍 Language state
	const [language, setLanguage] = useState<Language>("javascript");

	const router = useRouter();
	const { pid } = router.query;

	const [fontSize] = useLocalStorage("lcc-fontSize", "16px");

	const [settings, setSettings] = useState<ISettings>({
		fontSize,
		settingsModalIsOpen: false,
		dropdownIsOpen: false,
	});

	/* ================= HELPERS ================= */

	const isJS = language === "javascript";

	const showLangComingSoon = () => {
		toast.info("Execution for this language is coming soon.", {
			position: "top-center",
			theme: "dark",
		});
	};

	const validateUserCode = (): string => {
		const startIndex = userCode.indexOf(problem.starterFunctionName);
		if (startIndex === -1) return "Please write your solution before running.";

		const extracted = userCode.slice(startIndex);
		const stripped = extracted
			.replace(problem.starterFunctionName, "")
			.replace(/[{}()\s;]/g, "");

		if (!stripped) return "Please write your solution before running.";
		return "";
	};

	/* ================= RUN ================= */

	const handleRun = async () => {
		if (!isJS) {
			showLangComingSoon();
			return;
		}

		try {
			const validationError = validateUserCode();
			if (validationError) {
				toast.error(validationError, { theme: "dark" });
				return;
			}

			const extractedCode = userCode.slice(
				userCode.indexOf(problem.starterFunctionName)
			);
			const userFn = new Function(`return ${extractedCode}`)();

			const currentProblemId = propProblemId || (pid as string);
			const problemData = problems[currentProblemId];

			if (!problemData || typeof problemData.handlerFunction !== "function") {
				throw new Error();
			}

			const success = problemData.handlerFunction(userFn);

			success
				? toast.success("All test cases passed!", { theme: "dark" })
				: toast.error("Test cases failed. Try again.", { theme: "dark" });
		} catch {
			toast.error("Execution failed.", { theme: "dark" });
		}
	};

	/* ================= SUBMIT ================= */

	const handleSubmit = async () => {
		if (!isJS) {
			showLangComingSoon();
			return;
		}

		if (isInterviewMode && hasSubmitted) {
			toast.error("You can only submit once in interview mode", {
				theme: "dark",
			});
			return;
		}

		let success = false;

		try {
			const validationError = validateUserCode();
			if (validationError) {
				toast.error(validationError, { theme: "dark" });
				return;
			}

			const extractedCode = userCode.slice(
				userCode.indexOf(problem.starterFunctionName)
			);
			const userFn = new Function(`return ${extractedCode}`)();

			const currentProblemId = propProblemId || (pid as string);
			const problemData = problems[currentProblemId];

			if (!problemData || typeof problemData.handlerFunction !== "function") {
				throw new Error();
			}

			success = problemData.handlerFunction(userFn);

			if (success) {
				toast.success("Submitted successfully!", { theme: "dark" });
				setSuccess(true);
				setSolved(true);
				setIsSolved(true);

				setTimeout(() => {
					router.push({
						pathname: "/build/success",
						query: {
							pid: propProblemId || pid,
							title: problem.title,
						},
					});
				}, 500);
			} else {
				toast.error("Submission failed.", { theme: "dark" });
			}
		} catch {
			toast.error("Execution failed.", { theme: "dark" });
		}

		if (isInterviewMode) {
			setHasSubmitted(true);
			onSubmissionComplete?.(success);
		}
	};

	/* ================= LOAD CODE ================= */

	useEffect(() => {
		const currentProblemId = propProblemId || (pid as string);
		if (!currentProblemId) return;

		const saved = localStorage.getItem(`code-${currentProblemId}-${language}`);
		setUserCode(saved ? JSON.parse(saved) : problem.starterCode);

		setIsSolved(false);
		setHasSubmitted(false);
	}, [pid, propProblemId, problem.starterCode, language]);

	const onChange = (value: string) => {
		setUserCode(value);
		const currentProblemId = propProblemId || (pid as string);
		if (currentProblemId) {
			localStorage.setItem(
				`code-${currentProblemId}-${language}`,
				JSON.stringify(value)
			);
		}
	};

	/* ================= NEXT PROBLEM ================= */

	const handleNextProblem = () => {
		const nextOrder = problem.order + 1;
		const next = Object.values(problems).find(
			(p) => p.order === nextOrder
		);
		if (next) router.push(`/problems/${next.id}`);
		else router.push("/build");
	};

	/* ================= UI ================= */

	return (
		<div className="flex flex-col bg-dark-layer-1 h-full relative">
			<PreferenceNav settings={settings} setSettings={setSettings} />

			{/* SOLVED STRIP (PRACTICE MODE) */}
			{isSolved && !isInterviewMode && (
				<div className="bg-dark-fill-2 border-b border-dark-layer-2 px-6 py-4 flex items-center justify-between">
					<div className="text-green-400 font-medium">✓ Solved</div>
					<div className="flex gap-4">
						<button
							onClick={handleNextProblem}
							className="text-brand-orange hover:underline"
						>
							Next Problem →
						</button>
						<button
							onClick={() => router.push("/build")}
							className="text-gray-400 hover:text-white"
						>
							Back to Build
						</button>
					</div>
				</div>
			)}

			{/* LANGUAGE BAR */}
			<div className="flex gap-3 px-5 py-2 border-b border-dark-layer-2 text-sm">
				{[
					{ id: "javascript", label: "JavaScript" },
					{ id: "java", label: "Java" },
					{ id: "python", label: "Python" },
					{ id: "cpp", label: "C++" },
				].map((lang) => (
					<button
						key={lang.id}
						onClick={() => setLanguage(lang.id as Language)}
						className={`px-3 py-1 rounded-md ${
							language === lang.id
								? "bg-dark-fill-2 text-white"
								: "text-gray-400 hover:text-white"
						}`}
					>
						{lang.label}
					</button>
				))}
			</div>

			<Split
				className="h-[calc(100vh-130px)]"
				direction="vertical"
				sizes={[60, 40]}
				minSize={60}
			>
				<div className="overflow-auto">
					<CodeMirror
						value={userCode}
						theme={vscodeDark}
						onChange={onChange}
						extensions={isJS ? [javascript()] : []}
						style={{ fontSize: settings.fontSize }}
						readOnly={isSolved || (isInterviewMode && hasSubmitted)}
					/>
				</div>

				<div className="px-5 overflow-auto">
					<div className="text-sm font-medium text-white mt-2">
						Testcases
					</div>

					<div className="flex mt-2">
						{problem.examples.map((example, index) => (
							<div
								key={example.id}
								onClick={() => setActiveTestCaseId(index)}
								className={`mr-2 px-4 py-1 rounded-lg cursor-pointer ${
									activeTestCaseId === index
										? "bg-dark-fill-2 text-white"
										: "bg-dark-fill-3 text-gray-400"
								}`}
							>
								Case {index + 1}
							</div>
						))}
					</div>

					<div className="mt-4 text-white text-sm">
						<p className="font-medium">Input:</p>
						<div className="bg-dark-fill-3 p-2 rounded mt-1">
							{problem.examples[activeTestCaseId].inputText}
						</div>

						<p className="font-medium mt-3">Output:</p>
						<div className="bg-dark-fill-3 p-2 rounded mt-1">
							{problem.examples[activeTestCaseId].outputText}
						</div>
					</div>
				</div>
			</Split>

			<EditorFooter
				onRun={handleRun}
				onSubmit={handleSubmit}
				isInterviewMode={isInterviewMode}
				hasSubmitted={hasSubmitted}
			/>
		</div>
	);
};

export default Playground;
