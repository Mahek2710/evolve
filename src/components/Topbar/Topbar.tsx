import { auth } from "@/firebase/firebase";
import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Logout from "../Buttons/Logout";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Timer from "../Timer/Timer";
import { useRouter } from "next/router";
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problem";

type TopbarProps = {
	problemPage?: boolean;
};

const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
	const [user] = useAuthState(auth);
	const router = useRouter();

	const handleProblemChange = (isForward: boolean) => {
		const { order } = problems[router.query.pid as string] as Problem;
		const direction = isForward ? 1 : -1;
		const nextOrder = order + direction;

		const nextKey = Object.keys(problems).find(
			(key) => problems[key].order === nextOrder
		);

		if (!nextKey) {
			const fallbackKey = isForward
				? Object.keys(problems).find((k) => problems[k].order === 1)
				: Object.keys(problems).find(
						(k) => problems[k].order === Object.keys(problems).length
				  );
			router.push(`/problems/${fallbackKey}`);
		} else {
			router.push(`/problems/${nextKey}`);
		}
	};

	return (
		<nav className="w-full bg-dark-layer-1 border-b border-dark-layer-2">
			<div
				className={`h-[64px] mx-auto flex items-center px-6 ${
					!problemPage ? "max-w-[1100px]" : ""
				}`}
			>
				{/* LEFT — LOGO */}
				<Link href="/" className="flex items-center">
					<Image
						src="/logo-full.png"
						alt="Evolve"
						width={150}
						height={40}
						priority
						className="object-contain"
					/>
				</Link>

				{/* CENTER — PROBLEM NAV */}
				{problemPage && (
					<div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
						<button
							onClick={() => handleProblemChange(false)}
							className="h-8 w-8 rounded flex items-center justify-center bg-dark-fill-3 hover:bg-dark-fill-2"
						>
							<FaChevronLeft />
						</button>

						<Link
							href="/"
							className="flex items-center gap-2 text-sm font-medium text-dark-gray-8 hover:text-white"
						>
							<BsList />
							<span>Problem List</span>
						</Link>

						<button
							onClick={() => handleProblemChange(true)}
							className="h-8 w-8 rounded flex items-center justify-center bg-dark-fill-3 hover:bg-dark-fill-2"
						>
							<FaChevronRight />
						</button>
					</div>
				)}

				{/* RIGHT — ACTIONS */}
				<div className="ml-auto flex items-center gap-4">
					<a
						href="https://tenor.com/view/jethalal-sab-changa-c-gif-22723898"
						target="_blank"
						rel="noreferrer"
						className="bg-dark-fill-3 px-3 py-1.5 rounded text-brand-orange text-sm hover:bg-dark-fill-2"
					>
						Premium
					</a>

					{/* 🔑 SIGN IN FIX */}
					{!user && (
						<Link href="/auth">
							<button className="bg-dark-fill-3 px-3 py-1.5 rounded text-sm hover:bg-dark-fill-2">
								Sign In
							</button>
						</Link>
					)}

					{user && problemPage && <Timer />}

					{user && (
						<div className="relative group">
							<Image
								src="/avatar.png"
								alt="Avatar"
								width={32}
								height={32}
								className="rounded-full cursor-pointer"
							/>
							<div className="absolute top-10 left-1/2 -translate-x-1/2 bg-dark-layer-1 text-brand-orange px-3 py-1.5 rounded shadow-lg scale-0 group-hover:scale-100 transition">
								<p className="text-xs">{user.email}</p>
							</div>
						</div>
					)}

					{user && <Logout />}
				</div>
			</div>
		</nav>
	);
};

export default Topbar;
