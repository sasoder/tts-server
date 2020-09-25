const express = require('express')
const { spawn } = require('child_process')
const app = express()
const fs = require('fs')

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
    const process = spawn('speech-app.exe', [
        './' + req.body.filename,
        req.body.string,
    ])
    let stdout_text = ''

    process.stdout.on('data', (data) => (stdout_text += data))

    process.on('error', (err) => {
        console.log('error', err)
        res.sendStatus(500)
    })

    process.on('close', () => {
        res.json({
            bookmarks: stdout_text,
            filename: req.body.filename,
        })
    })
})

app.get('/file-download/:filename', (req, res) => {
    let filepath = __dirname + '/' + req.params.filename
    // Send audio file to client
    res.sendFile(filepath, function (err) {
        if (err) {
            console.log(err)
            res.status(err.status).end()
        } else {
            console.log('Sent:', filepath)
            // Remove the file from the server after sent
            fs.unlink(filepath, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        }
    })
})

app.listen(80, () => {
    console.log('Server running on port 80')
})
