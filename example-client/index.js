const axios = require('axios')
require('dotenv').config()
const fs = require('fs')
const ttsServer = axios.create({
    baseURL: process.env.SERVER_URL,
    timeout: 5000,
})

async function main() {
    // Send request with SSML data and filename
    const res = await ttsServer.post('/synthesize', {
        string: `
        <speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-GB">
            <voice name="ScanSoft Daniel_Full_22kHz">
                Hello! I"m <mark name="bookmark0"/> Daniel and I like <mark name="bookmark1"/> speaking
            </voice>
        </speak>
        `,
        filename: 'speech.wav',
    })

    let { bookmarks, filename } = res.data

    // Download the audio file generated by the server
    const fileRes = await ttsserver.get('/file-download/' + filename, {
        responseType: 'stream',
    })

    // Save response to file
    fileRes.data.pipe(fs.createWriteStream(__dirname + '/' + filename))

    // Prints bookmarks data to console
    console.log(bookmarks)
}

main()
