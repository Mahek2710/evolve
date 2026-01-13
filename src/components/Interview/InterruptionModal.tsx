import React, { useState } from "react";
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
	const [response, setResponse] = useState<string>("");

	if (!isOpen) return null;

	const handleSubmit = () => {
		if (response.trim()) {
			onSubmit(response.trim());
			setResponse("");
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black opacity-70" />
			<div className="relative bg-dark-layer-1 p-6 rounded-lg max-w-2xl w-full mx-4 z-50">
				<IoClose
					fontSize={32}
					className="cursor-pointer absolute -top-10 right-0 text-white hover:text-red-500 transition"
					onClick={() => handleSubmit()}
				/>
				<div className="space-y-4">
					<h2 className="text-2xl font-bold text-white mb-4">
						Interviewer Question
					</h2>
					<div className="bg-dark-fill-3 p-4 rounded-lg">
						<p className="text-white text-lg">{question}</p>
					</div>
					<div>
						<label className="block text-white text-sm font-medium mb-2">
							Your Response:
						</label>
						<textarea
							value={response}
							onChange={(e) => setResponse(e.target.value)}
							placeholder="Type your response here..."
							className="w-full bg-dark-fill-3 text-white p-4 rounded-lg border border-dark-layer-2 focus:outline-none focus:border-brand-orange min-h-[120px] resize-none"
							autoFocus
						/>
					</div>
					<button
						onClick={handleSubmit}
						disabled={!response.trim()}
						className="w-full bg-brand-orange text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Submit Response
					</button>
				</div>
			</div>
		</div>
	);
};

export default InterruptionModal;
