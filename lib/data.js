const fs = require('fs');
const path = require('path');
const lib={}
lib.basedir = path.join(__dirname, '/../.data/');
//write data to the file
lib.create = (dir, file, data, callback) => {
    //open file for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDiscriptor) => {
        if (!err && fileDiscriptor) {
            const stringData = JSON.stringify(data);
            //write to the file and close it
            fs.writeFile(fileDiscriptor, stringData, (err2) => {
                if (!err2) {
                    //finally close the file
                    fs.close(fileDiscriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        }
                        else {
                            callback('error closing the new file');
                        }
                    });
                }
                else {
                    callback('Error writing to new file');
                }
            });
        
        }
        else {
            callback('there was an error,file may already exists');
        }
    });
};
module.exports = lib;