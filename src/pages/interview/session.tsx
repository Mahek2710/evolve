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

	/* ================= INITIAL LOAD ================= */
	useEffect(() => {
		let currentSession = loadSession();

		if (!currentSession) {
			const cfg = localStorage.getItem("interviewConfig");
			if (!cfg) {
				router.push("/interview/setup");
				return;
			}

			const { persona, duration } = JSON.parse(cfg);
			currentSession = createInterviewSession(persona, duration);
			saveSession(currentSession);
		}

		setSession(currentSession);
		loadCurrentProblem(currentSession);

		const durationSec = currentSession.duration * 60;
		const elapsed = Math.floor(
			(Date.now() - currentSession.startTime) / 1000
		);

		setTimeRemaining(Math.max(0, durationSec - elapsed));
		setTimerRunning(true);

		const timer = setInterval(() => {
			setTimeRemaining((t) => {
				if (t <= 1) {
					handleTimeUp(currentSession!);
					return 0;
				}
				return t - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	/* ================= LOAD PROBLEM ================= */
	const loadCurrentProblem = (s: InterviewSession) => {
		const p = s.problems[s.currentProblemIndex];
		if (!p) {
			finishInterview(s);
			return;
		}

		const problem = problems[p.id];
		setCurrentProblem(problem);
	};

	/* ================= TIME UP ================= */
	const handleTimeUp = (s: InterviewSession) => {
		const updated = { ...s };

		updated.problems = updated.problems.map((p) => ({
			...p,
			status: "completed",
			passed: false,
			endTime: Date.now(),
		}));

		saveSession(updated);
		finishInterview(updated);
	};

	/* ================= SUBMIT ================= */
	const handleSubmissionComplete = (isCorrect: boolean) => {
		if (!session) return;

		const idx = session.currentProblemIndex;
		const prob = session.problems[idx];

		const updated = updateProblemStatus(session, idx, {
			status: "completed",
			passed: isCorrect,
			timeSpent: Math.floor(
				(Date.now() - prob.startTime) / 1000
			),
			endTime: Date.now(),
		});

		const nextIndex = idx + 1;

		if (nextIndex < updated.problems.length) {
			const moved = moveToNextProblem(updated);
			saveSession(moved);
			setSession(moved);
			loadCurrentProblem(moved);
		} else {
			finishInterview(updated);
		}
	};

	/* ================= FINISH (CRITICAL FIX) ================= */
	const finishInterview = (finalSession: InterviewSession) => {
		const totalTimeUsed = Math.floor(
			(Date.now() - finalSession.startTime) / 1000
		);

		// ✅ STORE RESULTS (DO NOT DELETE)
		localStorage.setItem(
			"interviewResults",
			JSON.stringify({
				session: finalSession,
				endTime: Date.now(),
				totalTimeUsed,
			})
		);

		// ❌ ONLY clear live session
		clearSession();

		// ✅ PUSH (not replace)
		router.push("/interview/feedback");
	};

	if (!hasMounted || !session || !currentProblem) return null;

	return (
		<>
			<Head>
				<title>Interview Session · evolve</title>
			</Head>

			<nav className="w-full bg-dark-layer-1 border-b border-dark-layer-2">
				<div className="h-[64px] px-6 flex justify-between items-center">
					<div className="text-white font-medium">
						Interview: {session.persona} | Problem{" "}
						{session.currentProblemIndex + 1}/
						{session.problems.length}
					</div>
					<InterviewTimer
						durationMinutes={session.duration}
						isRunning={timerRunning}
						timeRemaining={timeRemaining}
						onTimeUp={() => handleTimeUp(session)}
					/>
				</div>
			</nav>

			<Workspace
				problem={currentProblem}
				isInterviewMode
				onSubmissionComplete={handleSubmissionComplete}
				problemId={session.problems[session.currentProblemIndex].id}
			/>
		</>
	);
}
