import { authModalState } from "@/atoms/authModalAtom";
import { auth, firestore } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
	const setAuthModalState = useSetRecoilState(authModalState);
	const router = useRouter();

	const [inputs, setInputs] = useState({
		email: "",
		displayName: "",
		password: "",
	});

	const [createUserWithEmailAndPassword, user, loading, error] =
		useCreateUserWithEmailAndPassword(auth);

	const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!inputs.email || !inputs.password || !inputs.displayName) {
			toast.error("Please fill all fields", { position: "top-center" });
			return;
		}

		try {
			toast.loading("Creating your account...", {
				position: "top-center",
				toastId: "signup-loading",
			});

			const newUser = await createUserWithEmailAndPassword(
				inputs.email,
				inputs.password
			);

			if (!newUser) return;

			const userData = {
				uid: newUser.user.uid,
				email: newUser.user.email,
				displayName: inputs.displayName,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				likedProblems: [],
				dislikedProblems: [],
				solvedProblems: [],
				starredProblems: [],
			};

			await setDoc(
				doc(firestore, "users", newUser.user.uid),
				userData
			);

			// ✅ CLOSE MODAL AFTER SUCCESSFUL SIGNUP
			setAuthModalState({
				isOpen: false,
				type: "login",
			});

			router.push("/");
		} catch (err: any) {
			toast.error(err.message || "Signup failed", {
				position: "top-center",
			});
		} finally {
			toast.dismiss("signup-loading");
		}
	};

	useEffect(() => {
		if (error) {
			toast.error(error.message, { position: "top-center" });
		}
	}, [error]);

	return (
		<form className="space-y-6 px-6 pb-4" onSubmit={handleRegister}>
			<h3 className="text-xl font-medium text-white">
				Register to evolve
			</h3>

			<div>
				<label className="text-sm font-medium block mb-2 text-gray-300">
					Email
				</label>
				<input
					onChange={handleChangeInput}
					type="email"
					name="email"
					className="border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5
					bg-gray-600 border-gray-500 text-white"
				/>
			</div>

			<div>
				<label className="text-sm font-medium block mb-2 text-gray-300">
					Display Name
				</label>
				<input
					onChange={handleChangeInput}
					type="text"
					name="displayName"
					className="border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5
					bg-gray-600 border-gray-500 text-white"
				/>
			</div>

			<div>
				<label className="text-sm font-medium block mb-2 text-gray-300">
					Password
				</label>
				<input
					onChange={handleChangeInput}
					type="password"
					name="password"
					className="border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5
					bg-gray-600 border-gray-500 text-white"
				/>
			</div>

			<button
				type="submit"
				className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5
				bg-brand-orange hover:bg-brand-orange-s"
			>
				{loading ? "Registering..." : "Register"}
			</button>

			<div className="text-sm font-medium text-gray-300">
				Already have an account?{" "}
				<button
					type="button"
					onClick={() =>
						setAuthModalState((prev) => ({
							...prev,
							type: "login",
						}))
					}
					className="text-blue-500 hover:underline"
				>
					Log In
				</button>
			</div>
		</form>
	);
};

export default Signup;
