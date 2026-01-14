import Head from "next/head";
import Topbar from "@/components/Topbar/Topbar";
import ProblemsTable from "@/components/ProblemsTable/ProblemsTable";
import useHasMounted from "@/hooks/useHasMounted";
import { useState } from "react";

export default function BuildPage() {
	const hasMounted = useHasMounted();
	const [loadingProblems, setLoadingProblems] = useState(true);

	if (!hasMounted) return null;

	return (
		<>
			<Head>
				<title>Build • evolve</title>
			</Head>

			<main className="bg-dark-layer-2 min-h-screen">
				<Topbar />

				<div className="max-w-5xl mx-auto px-6 py-10">
					<h1 className="text-2xl text-white font-semibold mb-6">
						Build
					</h1>

					<table className="w-full text-sm text-left text-gray-400">
						<ProblemsTable setLoadingProblems={setLoadingProblems} />
					</table>
				</div>
			</main>
		</>
	);
}
