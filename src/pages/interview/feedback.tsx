import Head from "next/head";
import Topbar from "@/components/Topbar/Topbar";
import useHasMounted from "@/hooks/useHasMounted";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BsCheck2Circle, BsXCircle } from "react-icons/bs";
import { InterviewResults } from "@/utils/interview/types";
import { problems } from "@/utils/problems";

export default function InterviewFeedback() {
	const hasMounted = useHasMounted();
	const router = useRouter();
	const [results, setResults] = useState<InterviewResults | null>(null);

	useEffect(() => {
		const savedResults = localStorage.getItem("interviewResults");
		if (!savedResults) {
			router.push("/interview/setup");
			return;
		}

		try {
			const parsedResults: InterviewResults = JSON.parse(savedResults);
			setResults(parsedResults);
		} catch {
			router.push("/interview/setup");
		}
	}, [router]);

	if (!hasMounted || !results) return null;

	const { session, totalTimeUsed } = results;

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs < 10 ? "0" + secs : secs}`;
	};

	// Calculate scores based on actual results
	const calculateScores = () => {
		const totalProblems = session.problems.length;
		const passedProblems = session.problems.filter((p) => p.passed === true).length;
		const completedProblems = session.problems.filter(
			(p) => p.status === "completed"
		).length;

		// Correctness: 40% - based on how many problems passed
		const correctnessScore = (passedProblems / totalProblems) * 40;

		// Time Management: 20% - based on time efficiency
		const durationSeconds = session.duration * 60;
		const timeRatio = totalTimeUsed / durationSeconds;
		let timeManagementScore = 20;
		if (timeRatio > 0.95) timeManagementScore = 5; // Used almost all time
		else if (timeRatio > 0.8) timeManagementScore = 10; // Used most time
		else if (timeRatio > 0.6) timeManagementScore = 15; // Used moderate time
		else if (timeRatio > 0.4) timeManagementScore = 18; // Used less time
		else timeManagementScore = 20; // Used very little time

		// Code Quality: 20% - based on correctness (simplified heuristic)
		// If all passed problems were solved correctly, assume good quality
		const codeQualityScore = passedProblems > 0 ? 20 : 10;

		// Communication: 20% - based on interruption response
		const communicationScore = session.interruptionResponse
			? session.interruptionResponse.trim().length > 0
				? 20
				: 0
			: 0;

		const totalScore =
			correctnessScore + timeManagementScore + codeQualityScore + communicationScore;

		return {
			correctness: Math.round(correctnessScore * 10) / 10,
			timeManagement: Math.round(timeManagementScore * 10) / 10,
			codeQuality: Math.round(codeQualityScore * 10) / 10,
			communication: Math.round(communicationScore * 10) / 10,
			total: Math.round(totalScore * 10) / 10,
		};
	};

	const scores = calculateScores();

	const ScoreBar = ({
		label,
		score,
		maxScore,
	}: {
		label: string;
		score: number;
		maxScore: number;
	}) => {
		const percentage = Math.min(100, (score / maxScore) * 100);
		return (
			<div className="space-y-2">
				<div className="flex justify-between text-sm">
					<span className="text-gray-400">{label}</span>
					<span className="text-white font-medium">
						{score.toFixed(1)}/{maxScore}
					</span>
				</div>
				<div className="w-full bg-dark-fill-3 rounded-full h-3">
					<div
						className="bg-brand-orange h-3 rounded-full transition-all"
						style={{ width: `${percentage}%` }}
					/>
				</div>
			</div>
		);
	};

	return (
		<>
			<Head>
				<title>Interview Feedback - evolve</title>
			</Head>

			<main className="bg-dark-layer-2 min-h-screen">
				<Topbar />

				<div className="max-w-4xl mx-auto px-6 py-12">
					<h1 className="text-3xl text-white font-bold text-center mb-8">
						Interview Feedback
					</h1>

					<div className="bg-dark-layer-1 rounded-lg p-8 space-y-8">
						{/* Summary */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="bg-dark-fill-3 p-4 rounded-lg">
								<div className="text-gray-400 text-sm mb-1">Duration</div>
								<div className="text-white text-xl font-semibold">
									{session.duration} min
								</div>
							</div>
							<div className="bg-dark-fill-3 p-4 rounded-lg">
								<div className="text-gray-400 text-sm mb-1">Persona</div>
								<div className="text-white text-xl font-semibold">
									{session.persona}
								</div>
							</div>
							<div className="bg-dark-fill-3 p-4 rounded-lg">
								<div className="text-gray-400 text-sm mb-1">Time Used</div>
								<div className="text-white text-xl font-semibold">
									{formatTime(totalTimeUsed)}
								</div>
							</div>
							<div className="bg-dark-fill-3 p-4 rounded-lg">
								<div className="text-gray-400 text-sm mb-1">Problems</div>
								<div className="text-white text-xl font-semibold">
									{session.problems.filter((p) => p.passed === true).length}/
									{session.problems.length} passed
								</div>
							</div>
						</div>

						{/* Per-Problem Results */}
						<div>
							<h2 className="text-2xl text-white font-bold mb-6">
								Problem Results
							</h2>
							<div className="space-y-4">
								{session.problems.map((problemData, index) => {
									const problem = problems[problemData.id];
									const problemTitle = problem?.title || problemData.id;
									const problemDifficulty = problem?.difficulty || "Unknown";

									return (
										<div
											key={problemData.id}
											className="bg-dark-fill-3 p-4 rounded-lg"
										>
											<div className="flex items-center justify-between mb-2">
												<div>
													<div className="text-white font-medium">
														Problem {index + 1}: {problemTitle}
													</div>
													<div className="text-gray-400 text-sm mt-1">
														{problemDifficulty} • Time:{" "}
														{formatTime(problemData.timeSpent)}
													</div>
												</div>
												<div className="flex items-center gap-2">
													{problemData.passed === true ? (
														<>
															<BsCheck2Circle className="text-green-500 text-xl" />
															<span className="text-green-500 font-semibold">
																Passed
															</span>
														</>
													) : problemData.passed === false ? (
														<>
															<BsXCircle className="text-red-500 text-xl" />
															<span className="text-red-500 font-semibold">
																Failed
															</span>
														</>
													) : (
														<span className="text-gray-500 font-semibold">
															{problemData.status === "skipped"
																? "Skipped"
																: "Not Submitted"}
														</span>
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Scorecard */}
						<div>
							<h2 className="text-2xl text-white font-bold mb-6">Scorecard</h2>
							<div className="space-y-6">
								<ScoreBar
									label="Correctness"
									score={scores.correctness}
									maxScore={40}
								/>
								<ScoreBar
									label="Time Management"
									score={scores.timeManagement}
									maxScore={20}
								/>
								<ScoreBar
									label="Code Quality"
									score={scores.codeQuality}
									maxScore={20}
								/>
								<ScoreBar
									label="Communication"
									score={scores.communication}
									maxScore={20}
								/>
							</div>

							<div className="mt-8 pt-6 border-t border-dark-layer-2">
								<div className="flex justify-between items-center">
									<span className="text-xl text-white font-bold">
										Total Score
									</span>
									<span className="text-3xl text-brand-orange font-bold">
										{scores.total.toFixed(1)}/100
									</span>
								</div>
							</div>
						</div>

						{/* Interruption Response */}
						{session.interruptionResponse && (
							<div className="bg-dark-fill-3 p-6 rounded-lg">
								<h3 className="text-xl text-white font-bold mb-4">
									Your Response to Interviewer Question
								</h3>
								<p className="text-gray-300">{session.interruptionResponse}</p>
							</div>
						)}

						{/* Actions */}
						<div className="flex gap-4">
							<button
								onClick={() => router.push("/interview/setup")}
								className="flex-1 bg-brand-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
							>
								Try Another Interview
							</button>
							<button
								onClick={() => router.push("/")}
								className="flex-1 bg-dark-fill-3 text-white px-6 py-3 rounded-lg font-medium hover:bg-dark-fill-2 transition"
							>
								Back to Home
							</button>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
