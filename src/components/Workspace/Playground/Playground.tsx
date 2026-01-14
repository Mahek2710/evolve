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
	language?: string;
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

	const router = useRouter();
	const { pid } = router.query;

	const [fontSize] = useLocalStorage("lcc-fontSize", "16px");

	const [settings, setSettings] = useState<ISettings>({
		fontSize,
		settingsModalIsOpen: false,
		dropdownIsOpen: false,
		language: "JavaScript",
	});

	const language = (settings.language || "JavaScript").toLowerCase() as Language;
	const isJS = language === "javascript";

	/* ================= HELPERS ================= */

	const showLangComingSoon = () => {
		toast.info("Execution for this language is coming soon.", {
			theme: "dark",
		});
	};

	const validateUserCode = (): string => {
		const startIndex = userCode.indexOf(problem.starterFunctionName);
		if (startIndex === -1) return "Please write your solution before submitting.";

		const extracted = userCode.slice(startIndex);
		const stripped = extracted
			.replace(problem.starterFunctionName, "")
			.replace(/[{}()\s;]/g, "");

		if (!stripped) return "Please write your solution before submitting.";
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
		// Interview: only once
		if (isInterviewMode && hasSubmitted) {
			toast.error("You can only submit once in interview mode", {
				theme: "dark",
			});
			return;
		}

		if (!isJS) {
			showLangComingSoon();
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

			/* ================= BUILD MODE ================= */
			if (!isInterviewMode) {
				if (success) {
					toast.success("Problem solved 🎉", { theme: "dark" });

					// redirect to build success page
					router.push({
						pathname: "/build/success",
						query: {
							pid: currentProblemId,
							title: problem.title,
						},
					});
				} else {
					toast.error("Submission failed.", { theme: "dark" });
				}
				return;
			}
		} catch {
			toast.error("Execution failed.", { theme: "dark" });
		}

		/* ================= INTERVIEW FINALIZE ================= */
		if (isInterviewMode) {
			setHasSubmitted(true);
			onSubmissionComplete?.(success);
		}
	};

	/* ================= LOAD CODE ================= */

	useEffect(() => {
		const currentProblemId = propProblemId || (pid as string);
		if (!currentProblemId) return;

		const saved = localStorage.getItem(
			`code-${currentProblemId}-${language}`
		);
		setUserCode(saved ? JSON.parse(saved) : problem.starterCode);
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

	/* ================= UI ================= */

	return (
		<div className="flex flex-col bg-dark-layer-1 h-full relative">
			<PreferenceNav settings={settings} setSettings={setSettings} />

			<Split
				className="h-[calc(100vh-94px)]"
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
						readOnly={isInterviewMode && hasSubmitted}
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
