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
};

const Workspace: React.FC<WorkspaceProps> = ({
	problem,
	isInterviewMode = false,
	onSubmissionComplete,
	problemId,
}) => {
	const { width, height } = useWindowSize();
	const [success, setSuccess] = useState(false);
	const [solved, setSolved] = useState(false);

	return (
	<div className="h-[calc(100vh-64px)]"> {/* minus Topbar height */}
		<Split className="h-full split" minSize={0}>
			<ProblemDescription problem={problem} _solved={solved} />

			<div className="bg-dark-fill-2 h-full relative">
				<Playground
					problem={problem}
					setSuccess={setSuccess}
					setSolved={setSolved}
					isInterviewMode={isInterviewMode}
					onSubmissionComplete={onSubmissionComplete}
					problemId={problemId}
				/>

				{success && !isInterviewMode && (
					<Confetti
						gravity={0.3}
						tweenDuration={4000}
						width={width}
						height={height}
					/>
				)}
			</div>
		</Split>
	</div>
);

};
export default Workspace;
