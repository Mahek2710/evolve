import Head from "next/head";
import Topbar from "@/components/Topbar/Topbar";
import useHasMounted from "@/hooks/useHasMounted";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
	const hasMounted = useHasMounted();
	const router = useRouter();

	// ⌨️ Keyboard shortcuts
	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;

			// Ignore typing contexts
			if (
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.isContentEditable
			) {
				return;
			}

			if (e.key.toLowerCase() === "b") {
				router.push("/build");
			}

			if (e.key.toLowerCase() === "p") {
				router.push("/interview/setup");
			}
		};

		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [router]);

	// ✅ SAFE early return (after hooks)
	if (!hasMounted) return null;

	return (
		<>
			<Head>
				<title>evolve</title>
			</Head>

			<main className="bg-dark-layer-2 min-h-screen">
				<Topbar />

				<div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">

						{/* BUILD */}
						<div
							onClick={() => router.push("/build")}
							className="cursor-pointer rounded-2xl bg-dark-layer-1 border border-dark-layer-2 
							p-10 transition-all hover:-translate-y-1 hover:border-brand-orange"
						>
							<h2 className="text-3xl font-bold text-white mb-3">
								Build
							</h2>
							<p className="text-gray-400 text-lg mb-6">
								Solve. Refine. Get better.
							</p>
							<div className="flex items-center justify-between">
								<span className="text-brand-orange font-medium">
									Start Building →
								</span>
								<span className="text-xs text-gray-500">
									Press B
								</span>
							</div>
						</div>

						{/* PERFORM */}
						<div
							onClick={() => router.push("/interview/setup")}
							className="cursor-pointer rounded-2xl bg-dark-layer-1 border border-dark-layer-2 
							p-10 transition-all hover:-translate-y-1 hover:border-brand-orange"
						>
							<h2 className="text-3xl font-bold text-white mb-3">
								Perform
							</h2>
							<p className="text-gray-400 text-lg mb-6">
								Structured interview practice.
							</p>
							<div className="flex items-center justify-between">
								<span className="text-brand-orange font-medium">
									Start Interview →
								</span>
								<span className="text-xs text-gray-500">
									Press P
								</span>
							</div>
						</div>

					</div>
				</div>
			</main>
		</>
	);
}
