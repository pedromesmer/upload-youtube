const youtube = require('./authentication-oauth').youtube
const content = require('./info-video').content
const fs = require('fs')
const open = require('open');

module.exports = async function uploadVideo() {
    console.log('> Authentication ok\nBegin this Upload...')
    const videoFilePath = content.pathFile;
    const videoFileSize = fs.statSync(videoFilePath).size;
    const videoTitle = `Aula de ${content.schoolSubject} - ${content.date}`;
    const videoDescription = `Aula de ${content.schoolSubject}\nProfª Janete`;

    const requestParameters = {
        part: 'snippet, status',
        requestBody: {
            snippet: {
                title: videoTitle,
                description: videoDescription
            },
            status: {
                privacyStatus: 'unlisted',
                selfDeclaredMadeForKids: true
            }
        },
        media: {
            body: fs.createReadStream(videoFilePath)
        }
    }


    const youtubeResponse = await youtube.videos.insert(requestParameters, {
        onUploadProgress: onUploadProgress
    })

    const linkVideo = `https://youtu.be/${youtubeResponse.data.id}`;
    console.log(`> Video Available at: ${linkVideo}`);
    await open(linkVideo);
    return youtubeResponse.data;

    function onUploadProgress(event) {
        const progress = Math.round( (event.bytesRead/videoFileSize) * 100)
        console.log(`> ${progress}% completed`)
    }
}
