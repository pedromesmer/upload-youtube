const getInformations = require('./functions/info-video')
const authenticateWithOAuth = require('./functions/authentication-oauth')
const uploadVideo = require('./functions/upload-video')

async function start() {
    
    getInformations()
    await authenticateWithOAuth()
    await uploadVideo()

    const finalizar = readline.question("tecle algo...");

}

start();

