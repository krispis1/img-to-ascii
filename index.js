const density = "@QB#NgWM8RDHdOKq9$6khEPXwmeZaoS2yjufF]}{tx1zv7lciL/\\|?*>r^;:_\"~,'.-`";

const loadFile = (event) => {
    var asciiImage = "";
    var canvas = document.getElementById('output');
    let image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);
    var context = canvas.getContext("2d", {willReadFrequently: true});
    image.onload = () => {
        const asciiWidth = 90;
        const asciiHeight = Math.floor((asciiWidth*100/image.width) * image.height / 100 * 0.45);

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

                const brightness = parseInt(0.2126*red + 0.7152*green + 0.0722*blue, 10);
                const brightnessPercent = brightness * 100 / 255;
                const asciiCalc = density.length * brightnessPercent / 100;
                const asciiMatch = parseInt(asciiCalc, 10);

                if (asciiMatch != 0) {
                    asciiImage += density[asciiMatch - 1];
                } else {
                    asciiImage += density[0];
                }

                if ((i + 4) % (asciiWidth*4) == 0) {
                    asciiImage += "\n";
                }

                if ((i + 4) >= data.length) {
                    var p = document.getElementById('ascii');
                    p.innerHTML = asciiImage;
                }
            }
        }
    }
};