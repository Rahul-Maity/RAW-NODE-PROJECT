const environment = {};
environment.staging = {
    port: 3000,
    envName: 'staging',
    secretKey:'hsjdhsdhsjdhjshdjshd'
};
environment.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'djkdjskdjksdjksjdskjd'
};
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';
const environmentToExport = typeof environment[currentEnvironment] === 'object' ? environment[currentEnvironment] : environment.staging;
module.exports = environmentToExport;