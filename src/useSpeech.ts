/// <reference types="dom-speech-recognition/index.d.ts" />
/// <reference types="../polyfill.d.ts" />

import { SetStateAction, useState } from "react";

window.SpeechRecognition =
	window.SpeechRecognition ||
	window.webkitSpeechRecognition ||
	window.mozSpeechRecognition ||
	window.msSpeechRecognition ||
	window.oSpeechRecognition;

const recognition = new window.SpeechRecognition();

export type UseSpeechOptions = {
	initialLanguage?: `${string}-${Uppercase<string>}`;
	isContinuous?: boolean;
	exceptions?: string[];
	debug?: boolean;
};

export type UseSpeech = {
	noMatch: string;
	error: string;
	continuousRecognitionStarted: boolean;
	recognitionStarted: boolean;
	transcript: string | null | undefined;
	confidence: string;
	setLanguage: (
		language: SetStateAction<`${string}-${Uppercase<string>}`>,
	) => void;
	setIsContinuous: (isContinuous: SetStateAction<boolean>) => void;
	startRecognition: () => void;
	stopRecognition: () => void;
	clearTranscript: () => void;
};

function useSpeech(options?: UseSpeechOptions): UseSpeech {
	if (!window.SpeechRecognition) {
		console.error("=== BROWSER NOT SUPPORTED FOR SPEECH RECOGNITION ===");
	}
	const [language, setLanguage] = useState(
		options?.initialLanguage || "pt-PT",
	);
	const [continuous, setIsContinuous] = useState(
		options?.isContinuous || false,
	);
	const [noMatch, setNoMatch] = useState("");
	const [error, setError] = useState("");

	const [continuousRecognitionStarted, setContinuousRecognitionStarted] =
		useState(false);
	const [recognitionStarted, setRecognitionStarted] = useState(false);

	const [transcript, setTranscript] = useState<string | null>(null);
	const [confidence, setConfidence] = useState<string>("0%");

	recognition.lang = language;
	recognition.continuous = continuous;

	recognition.onresult = (event) => {
		const result = recognition.continuous
			? event.results[event.results.length - 1][0].transcript
			: event.results[0][0].transcript;
		const confidence = recognition.continuous
			? event.results[event.results.length - 1][0].confidence
			: event.results[0][0].confidence;

		setTranscript(result);
		setConfidence(`${(confidence * 100).toFixed(2)}%`);
		options?.debug &&
			console.log({
				result,
				confidence: `${(confidence * 100).toFixed(2)}%`,
			});
	};

	recognition.onspeechend = () => {
		if (!continuous) {
			recognition.stop();
		}
		options?.debug && console.log("speech ended");
	};

	recognition.onnomatch = () => {
		setNoMatch("Could not recognize");
		options?.debug && console.log("no match");
	};

	recognition.onerror = (event) => {
		setError(`Error occurred in recognition: ${event.error}`);
		options?.debug && console.log("error occured");
	};

	function startRecognition() {
		if (recognitionStarted) {
			return;
		}

		recognition.start();
		if (continuous) {
			options?.debug && console.log("recognition started, continuous");
			setContinuousRecognitionStarted(true);
		}
		if (!continuous) {
			options?.debug && console.log("recognition started");
			setRecognitionStarted(true);
		}
	}
	function stopRecognition() {
		recognition.stop();
		setTranscript(null);
		if (continuous) {
			options?.debug &&
				console.log("recognition stopped, it was continuous");
			setContinuousRecognitionStarted(false);
		}
		if (!continuous) {
			options?.debug && console.log("recognition stopped");
			setRecognitionStarted(false);
		}
	}

	function clearTranscript() {
		setTranscript(null);
	}

	return {
		noMatch,
		error,
		continuousRecognitionStarted,
		recognitionStarted,
		transcript:
			options?.exceptions && transcript
				? options.exceptions
						.map((el) => el.trim())
						.includes(transcript?.trim())
					? null
					: transcript?.trim()
				: transcript?.trim(),
		confidence,
		setLanguage,
		setIsContinuous,
		startRecognition,
		stopRecognition,
		clearTranscript,
	};
}

export { useSpeech };
