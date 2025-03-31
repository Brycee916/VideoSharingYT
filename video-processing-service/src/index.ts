import express from "express";

const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);

const app = express();
app.use(express.json());

app.post("/process-video", (req, res) => {
    //get path of the input video file from the request body
    const { inputFilePath, outputFilePath } = req.body;
    if (!inputFilePath){
        res.status(400).send("Bad request: Missing input file path.");
    }
    if (!outputFilePath){
        res.status(400).send("Bad request: Missing output file path.");
    }

    console.log(`Processing video: ${inputFilePath} -> ${outputFilePath}`);

    //convert video, vf=video file, scale video to 360p
    ffmpeg()
        .input(inputFilePath)
        .outputOptions('-vf', 'scale=-1:360') // 360p
        .on('end', function() {
            console.log('Processing finished successfully');
            res.status(200).send('Processing finished successfully');
        })
        .on('error', function(err: any) {
            console.log('An error occurred: ' + err.message);
            res.status(500).send('An error occurred: ' + err.message);
        })
        .saveToFile(outputFilePath);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service running at http://localhost:${port}`);
});

