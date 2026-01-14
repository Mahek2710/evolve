import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { InterviewResults } from "@/utils/interview/types";

export default function InterviewFeedbackPage() {
	const router = useRouter();
	const [results, setResults] = useState<InterviewResults | null>(null);

	useEffect(() => {
		const stored = localStorage.getItem("interviewResults");
		if (!stored) return;

		setResults(JSON.parse(stored));
	}, []);

	if (!results) return null;

	const { session } = results;

	/* ================= TIME ================= */
	const totalTimeUsedSec = session.problems.reduce(
		(sum, p) => sum + (p.timeSpent || 0),
		0
	);

	const totalTimeMin = Math.max(1, Math.floor(totalTimeUsedSec / 60));
	const passedCount = session.problems.filter((p) => p.passed).length;

	return (
		<>
			<Head>
				<title>Interview Feedback · evolve</title>
			</Head>

			<main className="min-h-screen bg-dark-layer-2 text-white px-6 py-10">
				<div className="max-w-4xl mx-auto space-y-10">

					<h1 className="text-3xl font-bold">Interview Feedback</h1>

					{/* SUMMARY */}
					<div className="grid grid-cols-2 gap-6">
						<div className="bg-dark-fill-3 p-4 rounded">
							<p className="text-gray-400">Persona</p>
							<p className="text-lg">{session.persona}</p>
						</div>

						<div className="bg-dark-fill-3 p-4 rounded">
							<p className="text-gray-400">Time Used</p>
							<p className="text-lg">{totalTimeMin} min</p>
						</div>
					</div>

					{/* PROBLEM RESULTS */}
					<div>
						<h2 className="text-xl font-semibold mb-3">
							Problem Results ({passedCount}/{session.problems.length})
						</h2>

						<div className="space-y-3">
							{session.problems.map((p, i) => (
								<div
									key={p.id}
									className="bg-dark-fill-3 px-4 py-3 rounded"
								>
									<div className="flex justify-between">
										<span>Problem {i + 1}</span>
										<span
											className={
												p.passed ? "text-green-400" : "text-red-400"
											}
										>
											{p.passed ? "Passed" : "Failed"}
										</span>
									</div>

									<p className="text-sm text-gray-400 mt-1">
										Time: {Math.max(1, Math.floor(p.timeSpent / 60))} min
									</p>
								</div>
							))}
						</div>
					</div>

					{/* COMMUNICATION RESPONSES */}
					<div>
						<h2 className="text-xl font-semibold mb-2">
							Communication Responses
						</h2>

						<p className="text-gray-400 text-sm mb-4">
							Candidate-written explanations captured during the interview.
							No automated scoring applied.
						</p>

						<div className="space-y-6">
							{session.problems.map((p, i) => {
								const comm = p.communication || {};
								const hasAny =
									comm.understanding ||
									comm.approach ||
									comm.reflection;

								return (
									<div key={p.id} className="bg-dark-fill-3 p-4 rounded">
										<p className="font-semibold mb-2">
											Problem {i + 1}
										</p>

										{hasAny ? (
											<div className="space-y-3">
												{comm.understanding && (
													<div>
														<p className="text-gray-400">
															Understanding
														</p>
														<p className="leading-relaxed">
															{comm.understanding}
														</p>
													</div>
												)}

												{comm.approach && (
													<div>
														<p className="text-gray-400">
															Approach
														</p>
														<p className="leading-relaxed">
															{comm.approach}
														</p>
													</div>
												)}

												{comm.reflection && (
													<div>
														<p className="text-gray-400">
															Reflection
														</p>
														<p className="leading-relaxed">
															{comm.reflection}
														</p>
													</div>
												)}
											</div>
										) : (
											<p className="text-gray-500 text-sm">
												No communication response provided.
											</p>
										)}
									</div>
								);
							})}
						</div>
					</div>

					{/* COMMUNICATION NOTE */}
					<div className="bg-dark-fill-3 p-4 rounded">
						<h2 className="text-xl font-semibold mb-2">
							Communication Analysis
						</h2>
						<p className="text-gray-300 text-sm leading-relaxed">
							This interview evaluates communication using structured
							checkpoints:
							<br />• Problem understanding articulation
							<br />• Approach & reasoning clarity
							<br />• Reflection on trade-offs
							<br /><br />
							Responses are intentionally preserved for interviewer review or
							optional AI-assisted analysis.
							<br />
							Designed for future integration with Google Gemini / Vertex AI.
						</p>
					</div>

					{/* ACTIONS */}
					<div className="flex gap-4 pt-6">
						<button
							onClick={() => router.push("/interview/setup")}
							className="px-6 py-3 rounded bg-brand-orange hover:bg-orange-600"
						>
							Try Another Interview
						</button>

						<button
							onClick={() => router.push("/")}
							className="px-6 py-3 rounded bg-dark-fill-3 hover:bg-dark-fill-2"
						>
							Back to Home
						</button>
					</div>

				</div>
			</main>
		</>
	);
}
