exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const url = event.queryStringParameters.url;
  if (!url) {
    return { statusCode: 400, headers, body: 'Missing url parameter' };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { 
        statusCode: response.status, 
        headers, 
        body: `Failed to fetch target URL: ${response.statusText}` 
      };
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const arrayBuffer = await response.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': contentType
      },
      body: base64String,
      isBase64Encoded: true
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      headers, 
      body: `Error: ${error.message}` 
    };
  }
};
