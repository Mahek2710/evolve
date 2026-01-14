import { useState } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import { Problem } from "@/utils/types/problem";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";

type WorkspaceProps = {
	problem: Problem;
	isInterviewMode?: boolean;
	onSubmissionComplete?: (isCorrect: boolean) => void;
	problemId?: string;

	// 🗣️ interview communication hook
	onFirstRun?: () => void;
};

const Workspace: React.FC<WorkspaceProps> = ({
	problem,
	isInterviewMode = false,
	onSubmissionComplete,
	problemId,
	onFirstRun,
}) => {
	const { width, height } = useWindowSize();
	const [success, setSuccess] = useState(false);
	const [solved, setSolved] = useState(false);

	return (
		<div className="h-[calc(100vh-64px)]">
			<Split className="h-full split" minSize={0}>
				<ProblemDescription problem={problem} _solved={solved} />

				<div className="bg-dark-fill-2 h-full relative">
					{/* 🔥 CRITICAL FIX: key forces reset per problem */}
					<Playground
						key={problem.id}
						problem={problem}
						setSuccess={setSuccess}
						setSolved={setSolved}
						isInterviewMode={isInterviewMode}
						onSubmissionComplete={onSubmissionComplete}
						problemId={problemId}
						onFirstRun={onFirstRun}
					/>

					{/* 🎉 CONFETTI — BUILD MODE ONLY */}
					{success && !isInterviewMode && (
						<Confetti
							width={width}
							height={height}
							numberOfPieces={350}
							recycle={false}
							gravity={0.25}
						/>
					)}
				</div>
			</Split>
		</div>
	);
};

export default Workspace;
