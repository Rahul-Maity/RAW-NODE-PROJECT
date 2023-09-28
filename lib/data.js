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
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

//updating existing file
lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDiscriptor) => {
        if (!err && fileDiscriptor) {
            const stringData = JSON.stringify(data);
            //truncate the file
            fs.ftruncate(fileDiscriptor, (err1) => {
                if (!err1) {
                    //write to the file and close it
                    fs.writeFile(fileDiscriptor, stringData, (err2) => {
                        if (!err2) {
                            //closing the file
                            fs.close(fileDiscriptor, (err3) => {
                                if (!err3) {
                                    callback(false);
                                }
                                else {
                                    callback('Error closing the file');
                                }
                            });
                        }
                        else {
                            callback('error writing the file');
                        }
                    });
                   
                }
                else {
                    callback('error truncating the fie');
                }
            });
        }
        else {
            console.log('error updating,file may not exists');
        }
    });
};

// /delete existing file
lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        }
        else {
            callback('error deleting file');
        }
    });
};
module.exports = lib;