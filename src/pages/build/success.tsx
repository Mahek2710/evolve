import { useRouter } from "next/router";
import Head from "next/head";
import Topbar from "@/components/Topbar/Topbar";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function BuildSuccess() {
	const router = useRouter();
	const { title, pid } = router.query;

	const [showConfetti, setShowConfetti] = useState(true);
	const [windowSize, setWindowSize] = useState({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});

		const timeout = setTimeout(() => {
			setShowConfetti(false);
		}, 4500);

		return () => clearTimeout(timeout);
	}, []);

	const handleRetry = () => {
		if (!pid) return;

		// 🧹 clear all language variants safely
		["javascript", "java", "python", "cpp"].forEach((lang) => {
			localStorage.removeItem(`code-${pid}-${lang}`);
		});

		router.push(`/problems/${pid}`);
	};

	return (
		<>
			<Head>
				<title>Solved · evolve</title>
			</Head>

			{showConfetti && (
				<Confetti
					width={windowSize.width}
					height={windowSize.height}
					gravity={0.35}
					numberOfPieces={350}
					recycle={false}
				/>
			)}

			<main className="bg-dark-layer-2 min-h-screen">
				<Topbar />

				<div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center">
					<div className="text-5xl mb-4">🎉</div>

					<h1 className="text-3xl font-bold text-white mb-2">
						Problem Solved
					</h1>

					{title && (
						<p className="text-gray-400 text-lg mb-8">
							{title}
						</p>
					)}

					<div className="flex gap-4">
						<button
							onClick={() => router.push("/build")}
							className="px-6 py-3 rounded-lg bg-dark-fill-3 hover:bg-dark-fill-2 text-white transition"
						>
							Back to Build
						</button>

						{pid && (
							<button
								onClick={handleRetry}
								className="px-6 py-3 rounded-lg bg-brand-orange text-white hover:bg-orange-600 transition"
							>
								Retry Problem
							</button>
						)}
					</div>
				</div>
			</main>
		</>
	);
}
