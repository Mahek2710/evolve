import React, { useEffect, useState } from "react";

type InterviewTimerProps = {
	durationMinutes: number;
	onTimeUp: () => void;
	isRunning: boolean;
	timeRemaining?: number; // Optional prop for external time management
};

const InterviewTimer: React.FC<InterviewTimerProps> = ({
	durationMinutes,
	onTimeUp,
	isRunning,
	timeRemaining: externalTimeRemaining,
}) => {
	const [internalTimeRemaining, setInternalTimeRemaining] = useState<number>(
		durationMinutes * 60
	);

	const timeRemaining = externalTimeRemaining ?? internalTimeRemaining;

	useEffect(() => {
		if (!isRunning || externalTimeRemaining !== undefined) return;

		const intervalId = setInterval(() => {
			setInternalTimeRemaining((prev) => {
				if (prev <= 1) {
					onTimeUp();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(intervalId);
	}, [isRunning, onTimeUp, externalTimeRemaining]);

	const formatTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${
				secs < 10 ? "0" + secs : secs
			}`;
		}
		return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
	};

	const getColorClass = () => {
		const percentage = timeRemaining / (durationMinutes * 60);
		if (percentage <= 0.2) return "text-red-500";
		if (percentage <= 0.5) return "text-yellow-500";
		return "text-white";
	};

	return (
		<div className={`flex items-center space-x-2 ${getColorClass()}`}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="1em"
				height="1em"
				fill="currentColor"
				className="h-6 w-6"
			>
				<path
					fillRule="evenodd"
					d="M12 4a9 9 0 110 18 9 9 0 010-18zm0 2a7 7 0 100 14 7 7 0 000-14zm0 1.634a1 1 0 01.993.883l.007.117-.001 3.774 2.111 1.162a1 1 0 01.445 1.253l-.05.105a1 1 0 01-1.254.445l-.105-.05-2.628-1.447a1 1 0 01-.51-.756L11 13V8.634a1 1 0 011-1zM16.235 2.4a1 1 0 011.296-.269l.105.07 4 3 .095.08a1 1 0 01-1.19 1.588l-.105-.069-4-3-.096-.081a1 1 0 01-.105-1.319zM7.8 2.4a1 1 0 01-.104 1.319L7.6 3.8l-4 3a1 1 0 01-1.296-1.518L2.4 5.2l4-3a1 1 0 011.4.2z"
					clipRule="evenodd"
				></path>
			</svg>
			<div className="font-mono text-lg font-semibold">
				{formatTime(timeRemaining)}
			</div>
		</div>
	);
};

export default InterviewTimer;
