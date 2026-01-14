import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

type InterruptionModalProps = {
	isOpen: boolean;
	question: string;
	onSubmit: (response: string) => void;
};

const InterruptionModal: React.FC<InterruptionModalProps> = ({
	isOpen,
	question,
	onSubmit,
}) => {
	const [response, setResponse] = useState("");

	// Reset text when modal opens/closes
	useEffect(() => {
		if (isOpen) setResponse("");
	}, [isOpen]);

	if (!isOpen) return null;

	const handleSubmit = () => {
		// ✅ Submit response (empty allowed)
		onSubmit(response.trim());
	};

	const handleSkip = () => {
		// ✅ Explicit skip → empty response
		onSubmit("");
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/70" />

			<div className="relative bg-dark-layer-1 p-6 rounded-lg max-w-2xl w-full mx-4 z-50">
				{/* CLOSE / SKIP */}
				<IoClose
					fontSize={30}
					className="cursor-pointer absolute -top-10 right-0 text-white hover:text-red-400 transition"
					onClick={handleSkip}
				/>

				<div className="space-y-4">
					<h2 className="text-2xl font-bold text-white">
						Interviewer Question
					</h2>

					<div className="bg-dark-fill-3 p-4 rounded-lg">
						<p className="text-white text-lg">{question}</p>
					</div>

					<div>
						<label className="block text-white text-sm font-medium mb-2">
							Your Response
						</label>
						<textarea
							value={response}
							onChange={(e) => setResponse(e.target.value)}
							placeholder="Explain your thought process ..."
							className="w-full bg-dark-fill-3 text-white p-4 rounded-lg border border-dark-layer-2 focus:outline-none focus:border-brand-orange min-h-[120px] resize-none"
							autoFocus
						/>
					</div>

					<button
						onClick={handleSubmit}
						className="w-full bg-brand-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
					>
						Continue Interview
					</button>
				</div>
			</div>
		</div>
	);
};

export default InterruptionModal;
