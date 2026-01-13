import Head from "next/head";
import Workspace from "@/components/Workspace/Workspace";
import InterviewTimer from "@/components/Interview/InterviewTimer";
import useHasMounted from "@/hooks/useHasMounted";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problem";
import {
	createInterviewSession,
	loadSession,
	saveSession,
	clearSession,
	updateProblemStatus,
	moveToNextProblem,
} from "@/utils/interview/sessionManager";
import { InterviewSession } from "@/utils/interview/types";

export default function InterviewSessionPage() {
	const hasMounted = useHasMounted();
	const router = useRouter();

	const [session, setSession] = useState<InterviewSession | null>(null);
	const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);

	const [timerRunning, setTimerRunning] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(0);

	// 🔹 UX states
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [showProblemChange, setShowProblemChange] = useState(false);

	// ================= INITIAL LOAD =================
	useEffect(() => {
		let currentSession = loadSession();

		if (!currentSession) {
			const oldConfig = localStorage.getItem("interviewConfig");
			if (oldConfig) {
				const config = JSON.parse(oldConfig);
				currentSession = createInterviewSession(config.persona, config.duration);
				saveSession(currentSession);
			} else {
				router.push("/interview/setup");
				return;
			}
		}

		setSession(currentSession);
		loadCurrentProblem(currentSession);

		const durationSeconds = currentSession.duration * 60;
		const elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
		const remaining = Math.max(0, durationSeconds - elapsed);

		setTimeRemaining(remaining);
		setTimerRunning(true);

		const timerInterval = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					handleTimeUp();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		const problemTimeInterval = setInterval(() => {
			setSession((prev) => {
				if (!prev) return prev;
				const cp = prev.problems[prev.currentProblemIndex];
				if (cp?.status === "in-progress") {
					const updated = updateProblemStatus(prev, prev.currentProblemIndex, {
						timeSpent: Math.floor((Date.now() - cp.startTime) / 1000),
					});
					saveSession(updated);
					return updated;
				}
				return prev;
			});
		}, 1000);

		return () => {
			clearInterval(timerInterval);
			clearInterval(problemTimeInterval);
		};
	}, [router]);

	// ================= LOAD PROBLEM =================
	const loadCurrentProblem = (s: InterviewSession) => {
		const cp = s.problems[s.currentProblemIndex];
		if (!cp) return finishInterview();

		const problem = problems[cp.id];
		if (!problem || typeof problem.handlerFunction === "string") {
			console.error("Invalid problem or handler");
			return finishInterview();
		}

		setCurrentProblem(problem);
	};

	// ================= TIME UP =================
	const handleTimeUp = () => {
		setTimerRunning(false);

		if (session) {
			const updated = { ...session };
			updated.problems.forEach((p, i) => {
				if (p.status === "pending" || p.status === "in-progress") {
					updated.problems[i] = {
						...p,
						status: p.status === "in-progress" ? "completed" : "skipped",
						passed: false,
						endTime: Date.now(),
					};
				}
			});
			saveSession(updated);
		}
		finishInterview();
	};

	// ================= SUBMISSION =================
	const handleSubmissionComplete = (isCorrect: boolean) => {
		if (!session) return;

		const cp = session.problems[session.currentProblemIndex];

		let updated = updateProblemStatus(session, session.currentProblemIndex, {
			status: "completed",
			passed: isCorrect,
			timeSpent: Math.floor((Date.now() - cp.startTime) / 1000),
			endTime: Date.now(),
		});

		const nextIndex = session.currentProblemIndex + 1;

		if (nextIndex < updated.problems.length) {
			// 🔥 UX TRANSITION
			setShowProblemChange(true);
			setIsTransitioning(true);

			setTimeout(() => {
				updated = moveToNextProblem(updated);
				saveSession(updated);
				setSession(updated);
				loadCurrentProblem(updated);

				setShowProblemChange(false);
				setIsTransitioning(false);
			}, 800);
		} else {
			saveSession(updated);
			finishInterview();
		}
	};

	// ================= FINISH =================
	const finishInterview = () => {
		if (!session) return;

		const totalTimeUsed = Math.floor((Date.now() - session.startTime) / 1000);

		localStorage.setItem(
			"interviewResults",
			JSON.stringify({
				session,
				endTime: Date.now(),
				totalTimeUsed,
			})
		);

		clearSession();
		router.push("/interview/feedback");
	};

	if (!hasMounted || !session || !currentProblem) return null;

	const problemNumber = session.currentProblemIndex + 1;
	const totalProblems = session.problems.length;
	const currentProblemData = session.problems[session.currentProblemIndex];

	return (
		<>
			<Head>
				<title>Interview Session - evolve</title>
			</Head>

			{/* 🔥 TRANSITION OVERLAY */}
			{showProblemChange && (
				<div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
					<div className="bg-dark-layer-1 px-8 py-6 rounded-lg text-white text-lg animate-pulse">
						Loading next problem…
					</div>
				</div>
			)}

			<nav className="w-full bg-dark-layer-1 border-b border-dark-layer-2">
				<div className="h-[64px] px-6 flex justify-between items-center">
					<div className="text-white font-medium">
						Interview: {session.persona} | Problem {problemNumber}/{totalProblems}
					</div>
					<InterviewTimer
						durationMinutes={session.duration}
						isRunning={timerRunning}
						timeRemaining={timeRemaining}
						onTimeUp={handleTimeUp}
					/>
				</div>
			</nav>

			<Workspace
				problem={currentProblem}
				isInterviewMode
				onSubmissionComplete={handleSubmissionComplete}
				problemId={currentProblemData.id}
			/>
		</>
	);
}
