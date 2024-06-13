async function setupCamera() {
    const video = document.getElementById('videoElement');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function main() {
    const video = await setupCamera();
    video.play();

    const model = await handpose.load();
    console.log('Handpose model loaded');

    const canvas = document.getElementById('outputCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    async function detectHands() {
        const predictions = await model.estimateHands(video, true);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (predictions.length > 0) {
            predictions.forEach(prediction => {
                const landmarks = prediction.landmarks;
                
                console.log('Detected Hand Landmarks:', landmarks);

                landmarks.forEach(point => {
                    const x = (point[0] + canvas.width / 2);
                    const y = (point[1] + canvas.height / 2);

                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = 'blue';
                    ctx.fill();
                });
            });
        }

        requestAnimationFrame(detectHands);
    }

    detectHands();
}

main();
