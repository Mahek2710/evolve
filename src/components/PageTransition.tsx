import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

const pageVariants = {
	initial: { opacity: 0.99 },
animate: { opacity: 1, transition: { duration: 0.1 } },
exit: { opacity: 0.99, transition: { duration: 0.08 } },
};

export default function PageTransition({ children }: Props) {
	const router = useRouter();

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={router.asPath}
				variants={pageVariants}
				initial="initial"
				animate="animate"
				exit="exit"
				className="min-h-screen"
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
