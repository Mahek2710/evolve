import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiFillYoutube } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import YouTube from "react-youtube";
import { DBProblem } from "@/utils/types/problem";
import { problems as localProblems } from "@/utils/problems";

type ProblemsTableProps = {
	setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProblemsTable: React.FC<ProblemsTableProps> = ({ setLoadingProblems }) => {
	const [youtubePlayer, setYoutubePlayer] = useState({
		isOpen: false,
		videoId: "",
	});

	const problems = useGetProblems(setLoadingProblems);

	const closeModal = () => {
		setYoutubePlayer({ isOpen: false, videoId: "" });
	};

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeModal();
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, []);

	return (
		<>
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
							<td className="px-6 py-4 font-medium text-white w-[40%]">
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
							<td className="px-6 py-4 w-[20%] text-gray-400">
								{problem.category || "—"}
							</td>

							{/* SOLUTION */}
							<td className="px-6 py-4 w-[20%]">
								{problem.videoId ? (
									<AiFillYoutube
										fontSize={26}
										className="cursor-pointer text-gray-400 hover:text-red-500 transition"
										onClick={() =>
											setYoutubePlayer({
												isOpen: true,
												videoId: problem.videoId as string,
											})
										}
									/>
								) : (
									<span className="italic text-gray-500">
										Coming soon
									</span>
								)}
							</td>
						</tr>
					);
				})}
			</tbody>

			{/* YOUTUBE MODAL */}
			{youtubePlayer.isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div
						className="absolute inset-0 bg-black opacity-70"
						onClick={closeModal}
					/>

					<div className="relative bg-dark-layer-1 p-4 rounded-lg max-w-3xl w-full z-50">
						<IoClose
							fontSize={32}
							className="cursor-pointer absolute -top-10 right-0 text-white"
							onClick={closeModal}
						/>
						<YouTube
							videoId={youtubePlayer.videoId}
							iframeClassName="w-full min-h-[420px]"
						/>
					</div>
				</div>
			)}
		</>
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

		const tmp = Object.keys(localProblems)
			.map((key) => ({
				id: key,
				...localProblems[key],
			}))
			.sort((a, b) => a.order - b.order) as DBProblem[];

		setProblems(tmp);
		setLoadingProblems(false);
	}, [setLoadingProblems]);

	return problems;
}
