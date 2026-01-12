import React from "react";
import { Problem } from "@/utils/types/problem";
import { BsCheck2Circle } from "react-icons/bs";

type ProblemDescriptionProps = {
	problem: Problem;
	_solved: boolean;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem, _solved }) => {
	return (
		<div className="bg-dark-layer-1">
			{/* TAB */}
			<div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white">
				<div className="bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs">
					Description
				</div>
			</div>

			<div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
				<div className="px-5 w-full">
					{/* Header */}
					<div className="flex items-center space-x-4">
						<h1 className="text-lg text-white font-medium">
							{problem.order}. {problem.title}
						</h1>
						{_solved && (
							<span className="text-green-500 text-xl">
								<BsCheck2Circle />
							</span>
						)}
					</div>

					{/* Difficulty + Category */}
					<div className="flex items-center mt-3 gap-3">
						<span className="px-3 py-1 rounded-full text-xs bg-dark-green-s/20 text-dark-green-s">
							{problem.difficulty}
						</span>
						<span className="text-sm text-gray-400">
							{problem.category}
						</span>
					</div>

					{/* Problem Statement */}
					<div className="text-white text-sm mt-6">
						<div dangerouslySetInnerHTML={{ __html: problem.problemStatement }} />
					</div>

					{/* Examples */}
					<div className="mt-6">
						{problem.examples.map((example, index) => (
							<div key={example.id} className="mt-4">
								<p className="font-medium text-white">
									Example {index + 1}:
								</p>
								<pre className="bg-dark-fill-3 p-4 rounded-lg mt-2 text-gray-300 text-sm">
									Input: {example.inputText}
									{"\n"}
									Output: {example.outputText}
									{example.explanation && (
										<>
											{"\n"}Explanation: {example.explanation}
										</>
									)}
								</pre>
							</div>
						))}
					</div>

					{/* Constraints */}
					<div className="my-8 pb-4">
						<p className="text-white text-sm font-medium">
							Constraints:
						</p>
						<ul className="text-white ml-5 list-disc text-sm mt-2">
							<div
								dangerouslySetInnerHTML={{ __html: problem.constraints }}
							/>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProblemDescription;
