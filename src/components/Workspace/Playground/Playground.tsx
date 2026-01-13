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

	const [fontSize] = useLocalStorage("lcc-fontSize", "16px");

	const [settings, setSettings] = useState<ISettings>({
		fontSize,
		settingsModalIsOpen: false,
		dropdownIsOpen: false,
	});

	const {
		query: { pid },
	} = useRouter();

	// ================= RUN (ALLOWED ALWAYS) =================
	const handleRun = async () => {
		try {
			const extractedCode = userCode.slice(
				userCode.indexOf(problem.starterFunctionName)
			);

			const userFn = new Function(`return ${extractedCode}`)();

			const currentProblemId = propProblemId || (pid as string);
			if (!currentProblemId) throw new Error("Problem ID missing");

			const problemData = problems[currentProblemId];
			if (!problemData) throw new Error("Problem not found");

			const handler = problemData.handlerFunction;
			if (typeof handler !== "function") {
				throw new Error("Invalid handler");
			}

			const success = handler(userFn);

			if (success) {
				toast.success("All test cases passed!", {
					position: "top-center",
					theme: "dark",
				});
			} else {
				toast.error("Test cases failed", {
					position: "top-center",
					theme: "dark",
				});
			}
		} catch (error: any) {
			toast.error(error?.message || "Execution error", {
				position: "top-center",
				theme: "dark",
			});
		}
	};

	// ================= SUBMIT (ONCE IN INTERVIEW) =================
	const handleSubmit = async () => {
		if (isInterviewMode && hasSubmitted) {
			toast.error("You can only submit once in interview mode", {
				position: "top-center",
				theme: "dark",
			});
			return;
		}

		let success = false;

		try {
			const extractedCode = userCode.slice(
				userCode.indexOf(problem.starterFunctionName)
			);

			const userFn = new Function(`return ${extractedCode}`)();

			const currentProblemId = propProblemId || (pid as string);
			if (!currentProblemId) throw new Error("Problem ID missing");

			const problemData = problems[currentProblemId];
			if (!problemData) throw new Error("Problem not found");

			const handler = problemData.handlerFunction;
			if (typeof handler !== "function") {
				throw new Error("Invalid handler");
			}

			success = handler(userFn);

			if (success) {
				toast.success("Submitted successfully!", {
					position: "top-center",
					theme: "dark",
				});
				setSuccess(true);
				setSolved(true);
				setTimeout(() => setSuccess(false), 4000);
			} else {
				toast.error("Submission failed", {
					position: "top-center",
					theme: "dark",
				});
			}
		} catch (error: any) {
			toast.error(error?.message || "Execution error", {
				position: "top-center",
				theme: "dark",
			});
		}

		if (isInterviewMode) {
			setHasSubmitted(true);
			onSubmissionComplete?.(success);
		}
	};

	// ================= LOAD SAVED CODE =================
	useEffect(() => {
		const currentProblemId = propProblemId || (pid as string);
		if (!currentProblemId) return;

		const saved = localStorage.getItem(`code-${currentProblemId}`);
		setUserCode(saved ? JSON.parse(saved) : problem.starterCode);
	}, [pid, propProblemId, problem.starterCode]);

	const onChange = (value: string) => {
		setUserCode(value);
		const currentProblemId = propProblemId || (pid as string);
		if (currentProblemId) {
			localStorage.setItem(`code-${currentProblemId}`, JSON.stringify(value));
		}
	};

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
						extensions={[javascript()]}
						style={{ fontSize: settings.fontSize }}
						readOnly={isInterviewMode && hasSubmitted}
					/>
				</div>

				<div className="px-5 overflow-auto">
					<div className="text-sm font-medium text-white mt-2">Testcases</div>

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
