import Head from "next/head";
import Topbar from "@/components/Topbar/Topbar";
import useHasMounted from "@/hooks/useHasMounted";
import { useState } from "react";
import { useRouter } from "next/router";
import {
	createInterviewSession,
	saveSession,
} from "@/utils/interview/sessionManager";
import { InterviewPersona } from "@/utils/interview/types";

export default function InterviewSetup() {
	const [duration, setDuration] = useState<string>("");
	const [persona, setPersona] = useState<string>("");
	const hasMounted = useHasMounted();
	const router = useRouter();

	if (!hasMounted) return null;

	const handleStartInterview = () => {
		if (!duration || !persona) {
			alert("Please select both duration and interviewer persona");
			return;
		}

		// ✅ CLEAR OLD CODE FROM PREVIOUS INTERVIEWS
		Object.keys(localStorage).forEach((key) => {
			if (key.startsWith("code-")) {
				localStorage.removeItem(key);
			}
		});

		// Create and save interview session
		const session = createInterviewSession(
			persona as InterviewPersona,
			parseInt(duration)
		);

		saveSession(session);
		router.push("/interview/session");
	};

	return (
		<>
			<Head>
				<title>Interview Setup - evolve</title>
			</Head>

			<main className="bg-dark-layer-2 min-h-screen">
				<Topbar />

				<div className="max-w-2xl mx-auto px-6 py-12">
					<h1 className="text-3xl text-white font-bold text-center mb-8">
						Interview Setup
					</h1>

					<div className="bg-dark-layer-1 rounded-lg p-8 space-y-8">
						{/* Duration Selection */}
						<div>
							<label className="block text-white text-lg font-medium mb-4">
								Interview Duration <span className="text-red-500">*</span>
							</label>
							<div className="grid grid-cols-3 gap-4">
								{["30", "45", "60"].map((mins) => (
									<button
										key={mins}
										onClick={() => setDuration(mins)}
										className={`px-6 py-4 rounded-lg font-medium transition ${
											duration === mins
												? "bg-brand-orange text-white"
												: "bg-dark-fill-3 text-gray-300 hover:bg-dark-fill-2"
										}`}
									>
										{mins} minutes
									</button>
								))}
							</div>
						</div>

						{/* Persona Selection */}
						<div>
							<label className="block text-white text-lg font-medium mb-4">
								Interviewer Persona <span className="text-red-500">*</span>
							</label>
							<div className="grid grid-cols-2 gap-4">
								{[
									"Product Company",
									"Startup",
									"Service-Based",
									"Senior Engineer",
								].map((p) => (
									<button
										key={p}
										onClick={() => setPersona(p)}
										className={`px-6 py-4 rounded-lg font-medium transition ${
											persona === p
												? "bg-brand-orange text-white"
												: "bg-dark-fill-3 text-gray-300 hover:bg-dark-fill-2"
										}`}
									>
										{p}
									</button>
								))}
							</div>
						</div>

						{/* Start Button */}
						<div className="pt-4">
							<button
								onClick={handleStartInterview}
								disabled={!duration || !persona}
								className="w-full bg-brand-orange text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Start Interview
							</button>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
