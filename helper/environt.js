const environment = {};
environment.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'hsjdhsdhsjdhjshdjshd',
    maxchecks: 5,
    twilio:{
        fromPhone: '+911234567890',
        accountSid: 'AC488dd508457687f848baf973f3609ef0',
        authToken:'928dffebb9cda7311a0edd80dbd257b9'
    
    }
};
environment.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'djkdjskdjksdjksjdskjd',
    twilio: {
        fromPhone: '+911234567890',
        accountSid: 'AC488dd508457687f848baf973f3609ef0',
        authToken:'928dffebb9cda7311a0edd80dbd257b9'
    
    }
};
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';
const environmentToExport = typeof environment[currentEnvironment] === 'object' ? environment[currentEnvironment] : environment.staging;
module.exports = environmentToExport;