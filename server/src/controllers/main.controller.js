import youtubedl from 'youtube-dl-exec';
import axios from 'axios'
import fs from 'fs-extra'
import 'dotenv/config'

const API_KEY = process.env;
console.log(API_KEY);
export async function getAudioFile(req, res, next) {
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
      }
    };
    const audioToText = async () => {
        try {
            const path = './audio2.webm';
            const audioData = await fs.readFile(path)
            const uploadResponse = await axios.post(`${baseUrl}/upload`, audioData, {
                headers
            })
            const uploadUrl = uploadResponse.data.upload_url;
            const data = {
                audio_url: uploadUrl,
                speech_model: 'nano',
                language_code: 'ta' // You can also use a URL to an audio or video file on the web
              }
            const url = `${baseUrl}/transcript`
            const response = await axios.post(url, data, { headers: headers })              
            const transcriptId = response.data.id
            const pollingEndpoint = `${baseUrl}/transcript/${transcriptId}`

            while (true) {
                const pollingResponse = await axios.get(pollingEndpoint, {
                    headers: headers
                })
                const transcriptionResult = pollingResponse.data

                if (transcriptionResult.status === 'completed') {
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
            }
        }

    const videoUrl = 'https://youtu.be/PiRW6KOaM5c?feature=shared';
    const output = 'audio2.mp3';
    
    downloadVideoAsMp3(videoUrl, output);
    audioToText()
}
