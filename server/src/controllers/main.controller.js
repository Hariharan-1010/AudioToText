import youtubedl from 'youtube-dl-exec';
import axios from 'axios'
import fs from 'fs-extra'
import 'dotenv/config'
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

const API_KEY = process.env.API_KEY;

export async function getAudioFile(req, res, next) {
  const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
    const prefixName = Date.now();
    const output = 'audio.mp3';
    const incomingUrl = req.query.url;
    const baseUrl = 'https://api.assemblyai.com/v2'

    const headers = {
    authorization: API_KEY
    }

    const downloadVideoAsMp3 = async (url, outputPath) => {
      try {
        await youtubedl(url, {
          output: outputPath,
          extractAudio: true,
          audioFormat: 'mp3'
        });
        console.log('Download and conversion to MP3 completed');
      } catch (error) {
        console.error('Error downloading or converting video:', error);
      } finally {
        audioToText()
      }
    };
    const audioToText = async () => {
        try {
            const pathName = './audio.mp3';
            const audioData = await fs.readFile(pathName)
            const uploadResponse = await axios.post(`${baseUrl}/upload`, audioData, {
                headers
            })
            const uploadUrl = uploadResponse.data.upload_url;
            const data = {
                audio_url: uploadUrl // You can also use a URL to an audio or video file on the web
              }
            const url = `${baseUrl}/transcript`
            const response = await axios.post(url, data, { headers: headers })              
            const transcriptId = response.data.id
            const pollingEndpoint = `${baseUrl}/transcript/${transcriptId}`
            const returnData = {text: "ENOENT", name: prefixName+'audio.webm', words: []};

            while (true) {
                const pollingResponse = await axios.get(pollingEndpoint, {
                    headers: headers
                })
                const transcriptionResult = pollingResponse.data

                if (transcriptionResult.status === 'completed') {
                    returnData.text = transcriptionResult.text;
                    returnData.words = transcriptionResult.words;
                    res.status(200).json({data: returnData});
                    console.log(transcriptionResult.text)
                    console.log("\ndone\n");
                    break
                } else if (transcriptionResult.status === 'error') {
                    throw new Error(`Transcription failed: ${transcriptionResult.error}`)
                } else {
                    await new Promise((resolve) => setTimeout(resolve, 3000))
                }
            }
            } catch (error) {
                console.log(error);
                next(error);
            }
        }
    
    downloadVideoAsMp3(incomingUrl,output);
}

export async function exportCaption(req, res, next) {
    try {
        const createSRT = (words, outputPath) => {
            let srt = '';
            let index = 1;
          
            words.forEach(wordInfo => {
              const startTime = new Date(wordInfo.start * 1000).toISOString().substr(11, 12).replace('.', ',');
              const endTime = new Date(wordInfo.end * 1000).toISOString().substr(11, 12).replace('.', ',');
          
              srt += `${index}\n${startTime} --> ${endTime}\n${wordInfo.text}\n\n`;
              index++;
            });
          
            fs.writeFileSync(outputPath, srt);
            console.log('SRT file generation completed');
          };
          
          const main = async () => {
            try {
                const audioName = req.body.id;
                const words  = req.body.words;
                console.log(words);
                console.log(req.body);
                createSRT(words, audioName+'file.srt');
            } catch (error) {
              console.error('Error:', error);
            }
          };
          
          main();
    } catch (error) {
        console.log(error);
        next(error);
    }
}
