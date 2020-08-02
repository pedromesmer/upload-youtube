const fs = require('fs');
const readline = require('readline-sync');

const content = {};

module.exports =  function getInformations() {
    
    content.schoolSubject = readline.question('Informe a materia: ');
    content.date = readline.question('Informe a data, separado por /: ');

    
    // Search file in folder -> /../../video-file/
    const pathFolder = process.cwd()+'/../../video-file/';
    fs.readdir(pathFolder, function (err, files) {
        if (err) {
            console.log(err);
            return;
        }
        else if (files) {
            content.pathFile = pathFolder + files[0];
            console.log(content);
        }

    });

}

module.exports.content = content;