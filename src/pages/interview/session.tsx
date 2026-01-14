import Head from "next/head";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Workspace from "@/components/Workspace/Workspace";
import InterviewTimer from "@/components/Interview/InterviewTimer";
import InterruptionModal from "@/components/Interview/InterruptionModal";
import useHasMounted from "@/hooks/useHasMounted";
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problem";
import {
	createInterviewSession,
	loadSession,
	saveSession,
	clearSession,
	updateProblemStatus,
	moveToNextProblem,
	saveCommunicationResponse,
	getCommunicationProgress,
} from "@/utils/interview/sessionManager";
import { InterviewSession } from "@/utils/interview/types";

export default function InterviewSessionPage() {
	const hasMounted = useHasMounted();
	const router = useRouter();

	const [session, setSession] = useState<InterviewSession | null>(null);
	const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);

	const [timeRemaining, setTimeRemaining] = useState(0);
	const [timerRunning, setTimerRunning] = useState(false);

	const [activeQuestion, setActiveQuestion] =
		useState<"understanding" | "approach" | "reflection" | null>(null);

	const [hasRunOnce, setHasRunOnce] = useState(false);

	/* ================= FINISH ================= */
	const finishInterview = useCallback(
		(finalSession: InterviewSession) => {
			const totalTimeUsed = finalSession.problems.reduce(
				(sum, p) => sum + (p.timeSpent || 0),
				0
			);

			localStorage.setItem(
				"interviewResults",
				JSON.stringify({
					session: finalSession,
					endTime: Date.now(),
					totalTimeUsed,
				})
			);

			clearSession();
			router.replace("/interview/feedback");
		},
		[router]
	);

	/* ================= TIME UP ================= */
	const handleTimeUp = useCallback(
		(s: InterviewSession) => {
			const updated = structuredClone(s);

			updated.problems.forEach((p) => {
				if (p.status !== "completed") {
					p.status = "completed";
					p.passed = false;
					p.endTime = Date.now();
				}
			});

			saveSession(updated);
			finishInterview(updated);
		},
		[finishInterview]
	);

	/* ================= LOAD PROBLEM ================= */
	const loadProblem = useCallback(
		(s: InterviewSession) => {
			const idx = s.currentProblemIndex;
			const p = s.problems[idx];
			if (!p) {
				finishInterview(s);
				return;
			}

			const full = problems[p.id];
			if (!full) {
				finishInterview(s);
				return;
			}

			setCurrentProblem(full);
			setHasRunOnce(false);

			const progress = getCommunicationProgress(s, idx);
			if (!progress.understandingDone) {
				setActiveQuestion("understanding");
			}
		},
		[finishInterview]
	);

	/* ================= INIT ================= */
	useEffect(() => {
		let s = loadSession();

		if (!s) {
			const cfg = localStorage.getItem("interviewConfig");
			if (!cfg) {
				router.replace("/interview/setup");
				return;
			}
			const parsed = JSON.parse(cfg);
			s = createInterviewSession(parsed.persona, parsed.duration);
			saveSession(s);
		}

		setSession(s);
		loadProblem(s);

		const totalSeconds = s.duration * 60;
		const elapsed = Math.floor((Date.now() - s.startTime) / 1000);
		setTimeRemaining(Math.max(0, totalSeconds - elapsed));
		setTimerRunning(true);

		const interval = setInterval(() => {
			setTimeRemaining((t) => {
				if (t <= 1) {
					handleTimeUp(s!);
					return 0;
				}
				return t - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [router, loadProblem, handleTimeUp]);

	/* ================= APPROACH POPUP ================= */
	useEffect(() => {
		if (!session || hasRunOnce) return;

		const fortyPercent = session.duration * 60 * 0.6;
		if (timeRemaining <= fortyPercent) {
			const progress = getCommunicationProgress(
				session,
				session.currentProblemIndex
			);
			if (!progress.approachDone) {
				setActiveQuestion("approach");
			}
		}
	}, [timeRemaining, session, hasRunOnce]);

	/* ================= SUBMIT ================= */
	const handleSubmissionComplete = (isCorrect: boolean) => {
		if (!session) return;

		const idx = session.currentProblemIndex;
		const p = session.problems[idx];

		const timeSpent = Math.floor((Date.now() - p.startTime) / 1000);

		let updated = updateProblemStatus(session, idx, {
			status: "completed",
			passed: isCorrect,
			timeSpent,
			endTime: Date.now(),
		});

		saveSession(updated);

		const progress = getCommunicationProgress(updated, idx);
		if (!progress.reflectionDone) {
			setSession(updated);
			setActiveQuestion("reflection");
			return;
		}

		const next = idx + 1;
		if (next < updated.problems.length) {
			const moved = moveToNextProblem(updated);
			saveSession(moved);
			setSession(moved);
			loadProblem(moved);
		} else {
			finishInterview(updated);
		}
	};

	/* ================= COMMUNICATION ================= */
	const handleCommunicationSubmit = (response: string) => {
		if (!session || !activeQuestion) return;

		const idx = session.currentProblemIndex;
		const updated = saveCommunicationResponse(
			session,
			idx,
			activeQuestion,
			response
		);

		saveSession(updated);
		setSession(updated);
		setActiveQuestion(null);
	};

	if (!hasMounted || !session || !currentProblem) return null;

	return (
		<>
			<Head>
				<title>Interview Session - evolve</title>
			</Head>

			{activeQuestion && (
				<InterruptionModal
					isOpen
					question={
						activeQuestion === "understanding"
							? "Explain your understanding of the problem."
							: activeQuestion === "approach"
							? "What approach are you taking and why?"
							: "Reflect on your solution and trade-offs."
					}
					onSubmit={handleCommunicationSubmit}
				/>
			)}

			<nav className="w-full bg-dark-layer-1 border-b border-dark-layer-2">
				<div className="h-[64px] px-6 flex justify-between items-center">
					<div className="text-white font-medium">
						Interview: {session.persona} | Problem{" "}
						{session.currentProblemIndex + 1}/{session.problems.length}
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
				onFirstRun={() => setHasRunOnce(true)}
			/>
		</>
	);
}
