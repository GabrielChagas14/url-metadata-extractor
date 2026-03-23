const cheerio = require('cheerio');


function extractMetadata(html) {
    const $ = cheerio.load(html);

    return {
        title:
            $('meta[property="og:title"]').attr("content") ||
            $("title").text(),
        description:
            $('meta[property="og:description"]').attr("content") ||
            "",
        image:
            $('meta[property="og:image"]').attr("content") || ""
    }
}

module.exports = {
    extractMetadata
}