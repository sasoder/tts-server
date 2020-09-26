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

    let { bookmarks, base64audio } = res.data
    // Save base64 encoded audio (remove base64 metadata first or else file will be unplayable)
    fs.writeFileSync(
        'file.wav',
        Buffer.from(
            base64audio.replace('data:audio/wav; codecs=opus;base64,', ''),
            'base64'
        )
    )

    // Print bookmark data to console
    console.log(bookmarks)
}

main()
