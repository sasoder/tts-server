const express = require('express')
const { spawn } = require('child_process')
const app = express()
const fs = require('fs')
const tmp = require('tmp')

const bodyParser = require('body-parser')
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(
    bodyParser.urlencoded({
        // to support URL-encoded bodies
        extended: true,
    })
)

app.post('/synthesize', (req, res) => {
    // Generate the sound and bookmarks
    tmp.file(function _tempFileCreated(err, filepath, _fd, manualCleanup) {
        let fullPath = filepath + '.wav'
        if (err) throw err
        const process = spawn('speech-app.exe', [fullPath, req.body.string])

        let stdout_text = ''
        process.stdout.on('data', (data) => (stdout_text += data))

        process.on('error', (err) => {
            console.log('error', err)
            res.sendStatus(500)
        })

        process.on('close', () => {
            let data = fs.readFileSync(fullPath)
            // Send base64 encoding of audio
            res.json({
                bookmarks: stdout_text,
                base64audio: data.toString('base64'),
            })
            
            manualCleanup()
        })
    })
})

app.listen(80, () => {
    console.log('Server running on port 80')
})
