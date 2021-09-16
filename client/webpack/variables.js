const { env } = process;

module.exports = {
    apiUri : env.API_URI || 'http://localhost:3000',
    mode : env.NODE_ENV
};