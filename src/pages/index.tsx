import Head from "next/head";
import ProblemsTable from "@/components/ProblemsTable/ProblemsTable";
import Topbar from "@/components/Topbar/Topbar";
import useHasMounted from "@/hooks/useHasMounted";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
	const [loadingProblems, setLoadingProblems] = useState(true);
	const hasMounted = useHasMounted();
	const router = useRouter();

	if (!hasMounted) return null;

	return (
		<>
			<Head>
				<title>evolve</title>
			</Head>

			<main className="bg-dark-layer-2 min-h-screen">
				<Topbar />

				{/* Heading */}
				<h1 className="text-xl text-center text-gray-400 font-medium uppercase mt-8 mb-10">
					" Quality over Quantity "
				</h1>

				{/* Start Interview Button */}
				<div className="flex justify-center mb-8">
					<button
						onClick={() => router.push("/interview/setup")}
						className="bg-brand-orange text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-600 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
					>
						Start Interview
					</button>
				</div>

				{/* TABLE WRAPPER */}
				<div className="relative overflow-x-auto mx-auto pb-10">
					{loadingProblems && (
						<div className="max-w-[900px] mx-auto w-full animate-pulse">
							{[...Array(6)].map((_, idx) => (
								<LoadingSkeleton key={idx} />
							))}
						</div>
					)}

					<table className="text-sm text-left text-gray-400 w-full max-w-[900px] mx-auto border-collapse">
						{!loadingProblems && (
							<thead className="text-xs uppercase border-b border-dark-layer-1">
								<tr>
									<th className="px-6 py-3 font-medium">Title</th>
									<th className="px-6 py-3 font-medium">Difficulty</th>
									<th className="px-6 py-3 font-medium">Category</th>
									<th className="px-6 py-3 font-medium">Solution</th>
								</tr>
							</thead>
						)}

						<ProblemsTable setLoadingProblems={setLoadingProblems} />
					</table>
				</div>
			</main>
		</>
	);
}

const LoadingSkeleton = () => {
	return (
		<div className="flex items-center space-x-6 mt-4 px-6">
			<div className="h-4 w-40 rounded bg-dark-layer-1"></div>
			<div className="h-4 w-24 rounded bg-dark-layer-1"></div>
			<div className="h-4 w-28 rounded bg-dark-layer-1"></div>
			<div className="h-4 w-24 rounded bg-dark-layer-1"></div>
		</div>
	);
};
