import { useState, useEffect, useRef } from "react";
import { HiChevronDown } from "react-icons/hi";
import {
	AiOutlineFullscreen,
	AiOutlineFullscreenExit,
	AiOutlineSetting,
} from "react-icons/ai";
import { ISettings } from "../Playground";
import SettingsModal from "@/components/Modals/SettingsModal";

type PreferenceNavProps = {
	settings: ISettings & { language?: string };
	setSettings: React.Dispatch<
		React.SetStateAction<ISettings & { language?: string }>
	>;
};

const LANGUAGES = ["JavaScript", "Java", "Python", "C++"];

const PreferenceNav: React.FC<PreferenceNavProps> = ({
	setSettings,
	settings,
}) => {
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [isLangOpen, setIsLangOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	/* ================= FULLSCREEN ================= */

	const handleFullScreen = () => {
		if (isFullScreen) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}
		setIsFullScreen(!isFullScreen);
	};

	useEffect(() => {
		const exitHandler = () =>
			setIsFullScreen(!!document.fullscreenElement);

		document.addEventListener("fullscreenchange", exitHandler);
		return () =>
			document.removeEventListener("fullscreenchange", exitHandler);
	}, []);

	/* ================= LANGUAGE ================= */

	useEffect(() => {
		const savedLang = localStorage.getItem("editor-language");
		setSettings((prev) => ({
			...prev,
			language: savedLang || "JavaScript",
		}));
	}, [setSettings]);

	const selectLanguage = (lang: string) => {
		localStorage.setItem("editor-language", lang);
		setSettings((prev) => ({ ...prev, language: lang }));
		setIsLangOpen(false);
	};

	/* ================= CLOSE ON OUTSIDE CLICK ================= */

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsLangOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const currentLanguage = settings.language || "JavaScript";

	return (
		<div className="flex items-center justify-between bg-dark-layer-2 h-11 w-full px-2">
			{/* LEFT – LANGUAGE */}
			<div className="relative" ref={dropdownRef}>
				<button
					onClick={() => setIsLangOpen((p) => !p)}
					className="flex items-center gap-2 rounded bg-dark-fill-3 px-3 py-1.5 
					text-sm text-dark-label-2 hover:bg-dark-fill-2"
				>
					<span>{currentLanguage}</span>
					<HiChevronDown
						className={`transition-transform ${
							isLangOpen ? "rotate-180" : ""
						}`}
					/>
				</button>

				{isLangOpen && (
					<div className="absolute top-10 left-0 z-50 w-36 rounded 
					bg-dark-layer-1 border border-dark-layer-2 shadow-lg">
						{LANGUAGES.map((lang) => (
							<button
								key={lang}
								onClick={() => selectLanguage(lang)}
								className={`w-full px-3 py-2 text-left text-sm 
								hover:bg-dark-fill-2 ${
									lang === currentLanguage
										? "text-brand-orange"
										: "text-gray-300"
								}`}
							>
								{lang}
							</button>
						))}
					</div>
				)}
			</div>

			{/* RIGHT – ACTIONS */}
			<div className="flex items-center gap-2">
				<button
					className="preferenceBtn group"
					onClick={() =>
						setSettings({ ...settings, settingsModalIsOpen: true })
					}
				>
					<AiOutlineSetting />
					<div className="preferenceBtn-tooltip">Settings</div>
				</button>

				<button
					className="preferenceBtn group"
					onClick={handleFullScreen}
				>
					{!isFullScreen ? (
						<AiOutlineFullscreen />
					) : (
						<AiOutlineFullscreenExit />
					)}
					<div className="preferenceBtn-tooltip">Full Screen</div>
				</button>
			</div>

			{settings.settingsModalIsOpen && (
				<SettingsModal settings={settings} setSettings={setSettings} />
			)}
		</div>
	);
};

export default PreferenceNav;
