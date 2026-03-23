const { getMetadata } = require('./services/metadataService');

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { url } = body;

        if (!url) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "URL is required" })
            };
        }

        const metadata = await getMetadata(url);

        return {
            statusCode: 200,
            body: JSON.stringify(metadata)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Internal server error",
                details: error.message
            })
        };
    }
}