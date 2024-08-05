import {
	PoseLandmarker,
	FilesetResolver,
	DrawingUtils,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";
const demosSection = document.getElementById("demos");
let poseLandmarker = undefined;
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;
const videoHeight = "360px";
const videoWidth = "480px";
const landmarkNames = [
	"nose",
	"left eye (inner)",
	"left eye",
	"left eye (outer)",
	"right eye (inner)",
	"right eye",
	"right eye (outer)",
	"left ear",
	"right ear",
	"mouth (left)",
	"mouth (right)",
	"left shoulder",
	"right shoulder",
	"left elbow",
	"right elbow",
	"left wrist",
	"right wrist",
	"left pinky",
	"right pinky",
	"left index",
	"right index",
	"left thumb",
	"right thumb",
	"left hip",
	"right hip",
	"left knee",
	"right knee",
	"left ankle",
	"right ankle",
	"left heel",
	"right heel",
	"left foot index",
	"right foot index",
];
// Before we can use PoseLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createPoseLandmarker = async () => {
	const vision = await FilesetResolver.forVisionTasks(
		"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
	);
	poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
		baseOptions: {
			modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task`,
			delegate: "GPU",
		},
		runningMode: runningMode,
		numPoses: 2,
	});
	demosSection.classList.remove("invisible");
};
createPoseLandmarker();
/********************************************************************
// Demo 1: Grab a bunch of images from the page and detection them
// upon click.
********************************************************************/
// const imageContainers = document.getElementsByClassName("detectOnClick");
// for (let i = 0; i < imageContainers.length; i++) {
//     imageContainers[i].children[0].addEventListener("click", handleClick);
// }
// async function handleClick(event) {
//     if (!poseLandmarker) {
//         console.log("Wait for poseLandmarker to load before clicking!");
//         return;
//     }
//     if (runningMode === "VIDEO") {
//         runningMode = "IMAGE";
//         await poseLandmarker.setOptions({ runningMode: "IMAGE" });
//     }
//     const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
//     for (var i = allCanvas.length - 1; i >= 0; i--) {
//         const n = allCanvas[i];
//         n.parentNode.removeChild(n);
//     }
//     poseLandmarker.detect(event.target, (result) => {
//         const canvas = document.createElement("canvas");
//         canvas.setAttribute("class", "canvas");
//         canvas.setAttribute("width", event.target.naturalWidth + "px");
//         canvas.setAttribute("height", event.target.naturalHeight + "px");
//         canvas.style =
//             "left: 0px;" +
//                 "top: 0px;" +
//                 "width: " +
//                 event.target.width +
//                 "px;" +
//                 "height: " +
//                 event.target.height +
//                 "px;";
//         event.target.parentNode.appendChild(canvas);
//         const canvasCtx = canvas.getContext("2d");
//         const drawingUtils = new DrawingUtils(canvasCtx);
//         for (const landmark of result.landmarks) {
//             drawingUtils.drawLandmarks(landmark, {
//                 radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
//             });
//             drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
//         }
//         logLandmarks(result.landmarks);
//     });
// }
/********************************************************************
// Demo 2: Continuously grab image from webcam stream and detect it.
********************************************************************/
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const drawingUtils = new DrawingUtils(canvasCtx);
const hasGetUserMedia = () => {
	var _a;
	return !!((_a = navigator.mediaDevices) === null || _a === void 0
		? void 0
		: _a.getUserMedia);
};
if (hasGetUserMedia()) {
	enableWebcamButton = document.getElementById("webcamButton");
	enableWebcamButton.addEventListener("click", enableCam);
} else {
	console.warn("getUserMedia() is not supported by your browser");
}
function enableCam(event) {
	if (!poseLandmarker) {
		console.log("Wait! poseLandmaker not loaded yet.");
		return;
	}
	if (webcamRunning === true) {
		webcamRunning = false;
		enableWebcamButton.innerText = "ENABLE PREDICTIONS";
	} else {
		webcamRunning = true;
		enableWebcamButton.innerText = "DISABLE PREDICTIONS";
	}
	const constraints = {
		video: true,
	};
	navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
		video.srcObject = stream;
		video.addEventListener("loadeddata", predictWebcam);
	});
}
let lastVideoTime = -1;
async function predictWebcam() {
	canvasElement.style.height = videoHeight;
	video.style.height = videoHeight;
	canvasElement.style.width = videoWidth;
	video.style.width = videoWidth;
	if (runningMode === "IMAGE") {
		runningMode = "VIDEO";
		await poseLandmarker.setOptions({ runningMode: "VIDEO" });
	}
	let startTimeMs = performance.now();
	if (lastVideoTime !== video.currentTime) {
		lastVideoTime = video.currentTime;
		poseLandmarker.detectForVideo(video, startTimeMs, async (result) => {
			//  console.log(result);

			let { worldLandmarks } = result;
			// console.log(res);
			//  console.log(worldLandmarks);

             let wl2 = worldLandmarks[0];
            // console.log(wl2);

			// let leftElbow = worldLandmarks[13];
			// console.log(leftElbow);
            // console.log(wl2[21]);

            let llv = document.querySelector(".landmark-values");
            
            let {x, y, z} = wl2[21];
            await new Promise(resolve => setTimeout(resolve, 2000));

                  llv.innerText =`X: ${(x*100).toFixed(0)}, Y: ${(y*100).toFixed(0)}, Z: ${(z*100).toFixed(0)}`
						// Update the content of the HTML element with the values
						console.log(
							`X: ${(x * 100).toFixed(0)}, Y: ${(y * 100).toFixed(
								0
							)}, Z: ${(z * 100).toFixed(0)}`
						);
            
			canvasCtx.save();
			canvasCtx.clearRect(
				0,
				0,
				canvasElement.width,
				canvasElement.height
			);
			for (const landmark of result.landmarks) {
				drawingUtils.drawLandmarks(landmark, {
					radius: (data) =>
						DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
				});
				drawingUtils.drawConnectors(
					landmark,
					PoseLandmarker.POSE_CONNECTIONS
				);
			}
			canvasCtx.restore();
			logLandmarks(result.landmarks);
		});
	}
	if (webcamRunning === true) {
		window.requestAnimationFrame(predictWebcam);
	}
}
function logLandmarks(landmarks) {
	landmarks.forEach((landmark, index) => {
		// console.log(`${landmarkNames[index]}: ${JSON.stringify(landmark)}`);
	});
}