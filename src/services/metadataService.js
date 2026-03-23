const axios = require('axios');
const { extractMetadata } = require('../utils/parser');

async function getMetadata(url) {

    const response = await axios.get(url, {
        timeout: 5000
    });

    const html = response.data;

    return extractMetadata(html);

}

module.exports = { getMetadata };