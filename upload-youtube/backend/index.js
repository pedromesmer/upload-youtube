const getInformations = require('./functions/info-video')
const authenticateWithOAuth = require('./functions/authentication-oauth')
const uploadVideo = require('./functions/upload-video')
const readline = require('readline-sync');
const open = require('open')


const express = require('express')
const http = require('http')
const formidable = require('formidable')
const fs = require('fs')

const app = express()
const server = http.createServer(app)
const port = 4000

const content = {}


app.use(express.static('../public'))
server.listen(port, () => {
    console.log('> Ativo na porta 3000')
    open(`http://localhost:${port}`)
})

app.post('/data', (req, res) => {

    const form = new formidable.IncomingForm()
    form.maxFileSize = 2000 * 1024 * 1024 // 2gb max por upload
    form.parse(req,  (err, fields, file) => {

        //console.log(file)

        const tempData = fields.data.split('-')
        content.date = tempData.reverse().join('/')
                
        content.schoolSubject = fields.materia
        console.log(content.date, fields.data)
        content.tempPath = file.video.path
        content.newPath = '../../video-file/' + file.video.name
        fs.rename(content.tempPath, content.newPath, (err) => {
            if (err) throw err
            console.log(content)
            res.write('<h1>Upload completo</h1>')
            res.write('<p>Feche essa janela para continuar...</p>')
            res.end()

            return new Promise((resolve, reject) => {
                server.close(() => {
                    resolve()
                    console.log('> Server encerrado')
                })
                start()
            })
        })     
    })    
})

async function start() {
     
    console.log('> start')
    //return
    //getInformations()
    await authenticateWithOAuth()
    await uploadVideo(content)
    //const finalizar = readline.question("tecle algo...");
    fs.unlink(content.newPath, (err) => {
        if (err) throw err
        console.log(`O arquivo foi deletado`)
    })


}



//start();

