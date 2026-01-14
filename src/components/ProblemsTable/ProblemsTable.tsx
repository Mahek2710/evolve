import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DBProblem } from "@/utils/types/problem";
import { problems as localProblems } from "@/utils/problems";

type ProblemsTableProps = {
	setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProblemsTable: React.FC<ProblemsTableProps> = ({ setLoadingProblems }) => {
	const problems = useGetProblems(setLoadingProblems);

	return (
		<tbody className="text-white">
			{problems.map((problem, idx) => {
				const difficultyColor =
					problem.difficulty === "Easy"
						? "text-dark-green-s"
						: problem.difficulty === "Medium"
						? "text-dark-yellow"
						: "text-dark-pink";

				return (
					<tr
						key={problem.id}
						className={`group border-b border-dark-layer-1 transition hover:bg-dark-fill-2 ${
							idx % 2 === 1 ? "bg-dark-layer-1/40" : ""
						}`}
					>
						{/* TITLE */}
						<td className="px-6 py-4 font-medium text-white w-[50%]">
							<Link
								href={`/problems/${problem.id}`}
								className="group-hover:text-brand-orange transition"
							>
								{problem.order}. {problem.title}
							</Link>
						</td>

						{/* DIFFICULTY */}
						<td className={`px-6 py-4 w-[20%] ${difficultyColor}`}>
							{problem.difficulty}
						</td>

						{/* CATEGORY */}
						<td className="px-6 py-4 w-[30%] text-gray-400">
							{problem.category}
						</td>
					</tr>
				);
			})}
		</tbody>
	);
};

export default ProblemsTable;

/* ---------------- LOCAL PROBLEMS (NO FIREBASE) ---------------- */

function useGetProblems(
	setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>
) {
	const [problems, setProblems] = useState<DBProblem[]>([]);

	useEffect(() => {
		setLoadingProblems(true);

		const tmp: DBProblem[] = Object.keys(localProblems)
			.map((key) => ({
				id: key,
				...localProblems[key],

				// ✅ DBProblem REQUIRED FIELDS
				category: localProblems[key].category || "General",
				difficulty: localProblems[key].difficulty || "Easy",
				likes: 0,
				dislikes: 0,
			}))
			.sort((a, b) => a.order - b.order);

		setProblems(tmp);
		setLoadingProblems(false);
	}, [setLoadingProblems]);

	return problems;
}
