const path = require('path');

const PORT = 8000;
const UPLOAD_DIR = path.join(__dirname, '..', 'public');
const HOST_NAME = `http://localhost:${PORT}`;
const MAX_SIZE = 200 * 1024 * 1024;
// const BIG_UPLOAD_DIR = path.resolve(__dirname, "..", "public");
module.exports = {
    PORT,
    UPLOAD_DIR,
    HOST_NAME,
    MAX_SIZE,
};
