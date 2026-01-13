import React from "react";
import { BsChevronUp } from "react-icons/bs";

type EditorFooterProps = {
	onRun: () => void;
	onSubmit: () => void;
	isInterviewMode?: boolean;
	hasSubmitted?: boolean;
};

const EditorFooter: React.FC<EditorFooterProps> = ({
	onRun,
	onSubmit,
	isInterviewMode = false,
	hasSubmitted = false,
}) => {
	return (
		<div className="flex bg-dark-layer-1 sticky bottom-0 z-10 w-full border-t border-dark-layer-2">
			<div className="mx-5 my-[10px] flex justify-between w-full">
				{/* LEFT – Console */}
				<div className="mr-2 flex flex-1 items-center">
					<button className="px-3 py-1.5 font-medium inline-flex items-center bg-dark-fill-3 text-sm hover:bg-dark-fill-2 text-dark-label-2 rounded-lg">
						Console
						<span className="ml-1 flex items-center">
							<BsChevronUp className="fill-dark-gray-6" />
						</span>
					</button>
				</div>

				{/* RIGHT – ACTION BUTTONS */}
				<div className="ml-auto flex items-center space-x-4">
					{/* RUN — ALWAYS AVAILABLE */}
					<button
						className="px-3 py-1.5 text-sm font-medium bg-dark-fill-3 hover:bg-dark-fill-2 text-dark-label-2 rounded-lg"
						onClick={onRun}
					>
						Run
					</button>

					{/* SUBMIT — ONLY ONCE IN INTERVIEW */}
					<button
						className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
							isInterviewMode && hasSubmitted
								? "bg-gray-600 text-gray-400 cursor-not-allowed"
								: "bg-dark-green-s hover:bg-green-3 text-white"
						}`}
						onClick={onSubmit}
						disabled={isInterviewMode && hasSubmitted}
					>
						{isInterviewMode && hasSubmitted ? "Submitted" : "Submit"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditorFooter;
