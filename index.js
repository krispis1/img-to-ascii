const density = "@QB#NgWM8RDHdOKq9$6khEPXwmeZaoS2yjufF]}{tx1zv7lciL/\\|?*>r^;:_\"~,'.-`";
var asciiImage = "";

const clearAscii = () => {
    asciiImage = "";
    const p = document.getElementById('ascii');
    p.innerHTML = "";
}

const clearAsciiVideo = () => {
    asciiImage = "";
    const p = document.getElementById('asciiVideo');
    p.innerHTML = "";
}

const clearAndReload = () => {
    location.reload();
}

const loadFile = (event) => {
    clearAscii();

    const canvas = document.getElementById('output');
    const widthInput = document.getElementById('width');
    const image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    image.onload = () => {

        var asciiWidth;
        if (widthInput.value != "" && !isNaN(widthInput.value)) {
            asciiWidth = Math.floor(parseInt(widthInput.value, 10));
        } else {
            asciiWidth = 90;
        }
        const asciiHeight = Math.floor((asciiWidth * 100 / image.width) * image.height / 100 * 0.45);

        context.drawImage(image, 0, 0, asciiWidth, asciiHeight);

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    image.src = URL.createObjectURL(blob);
                }
            },
            "image/png",
            100
        );
        image.onload = () => {
            const imgData = context.getImageData(0, 0, asciiWidth, asciiHeight);
            const data = imgData.data;

            for (let i = 0; i < data.length; i += 4) {
                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];

                const brightness = parseInt(0.2126 * red + 0.7152 * green + 0.0722 * blue, 10);
                const brightnessPercent = brightness * 100 / 255;
                const asciiCalc = density.length * brightnessPercent / 100;
                const asciiMatch = parseInt(asciiCalc, 10);

                if (asciiMatch != 0) {
                    asciiImage += density[asciiMatch - 1];
                } else {
                    asciiImage += density[0];
                }

                if ((i + 4) % (asciiWidth * 4) == 0) {
                    asciiImage += "\n";
                }

                if ((i + 4) >= data.length) {
                    const p = document.getElementById('ascii');
                    p.innerHTML = asciiImage;
                    const f = document.getElementById('file');
                    f.value = "";
                }
            }
        }
    }
};

var video = document.getElementById("webcam");

const asciiVideo = () => {
    clearAsciiVideo();

    const canvas = document.getElementById('output');
    const widthInput = document.getElementById('width');
    const context = canvas.getContext("2d", { willReadFrequently: true });
    var asciiWidth;
    if (widthInput.value != "" && !isNaN(widthInput.value)) {
        asciiWidth = Math.floor(parseInt(widthInput.value, 10));
    } else {
        asciiWidth = 90;
    }
    const asciiHeight = Math.floor((asciiWidth * 100 / video.videoWidth) * video.videoHeight / 100 * 0.45);

    context.drawImage(video, 0, 0, asciiWidth, asciiHeight);

    const imgData = context.getImageData(0, 0, asciiWidth, asciiHeight);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        const brightness = parseInt(0.2126 * red + 0.7152 * green + 0.0722 * blue, 10);
        const brightnessPercent = brightness * 100 / 255;
        const asciiCalc = density.length * brightnessPercent / 100;
        const asciiMatch = parseInt(asciiCalc, 10);

        if (asciiMatch != 0) {
            asciiImage += density[asciiMatch - 1];
        } else {
            asciiImage += density[0];
        }

        if ((i + 4) % (asciiWidth * 4) == 0) {
            asciiImage += "\n";
        }

        if ((i + 4) >= data.length) {
            const p = document.getElementById('asciiVideo');
            p.innerHTML = asciiImage;
        }
    }

};

var startDrawingASCIIVideo = function () {
    var fps = 30;
    setInterval(asciiVideo, Math.round(1000 / fps));
}

const startVideo = () => {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
                startDrawingASCIIVideo();
                console.log("video started");
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}