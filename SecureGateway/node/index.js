const http = require('http');

exports.handler = async (event) => {
    console.log(`Event: ${JSON.stringify(event)}`);

    if (event.httpMethod == 'OPTIONS' ) {
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": "Content-Type,X-Ongoing-Account,X-Ongoing-App,X-Ongoing-Secret",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
        };
        const res = response;
        console.log(`Returning 200 OK for options: ${JSON.stringify(res)}`);
        return res; 
    }

    return new Promise(async (resolve, reject) => {
        const options = {
            hostname: '20.90.255.64',
            port: 8080,
            path: '/',
            method: 'POST',
            'headers': {
                'x-ongoing-account': event.headers['x-ongoing-account'],
                'x-ongoing-app':     event.headers['x-ongoing-app'],
                'x-ongoing-secret':  event.headers['x-ongoing-secret'],
                'content-type':      event.headers['content-type']
            },
        };
        console.log(`params: ${JSON.stringify(options)}`);
        const req = http.request(options, (res) => {
            let body = '';
            console.log('Status:', res.statusCode);
            console.log('Headers:', JSON.stringify(res.headers));

            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(`Error (${res.statusCode} - ${res.statusMessage})`);
            }

            res.setEncoding('utf8');
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                console.log('Response: ', body);
                resolve({
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Headers": "Content-Type,X-Ongoing-Account,X-Ongoing-App,X-Ongoing-Secret",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                    },
                    body: body,
                });
            });
        });
        req.write(event.body);

        req.on('error', (e) => {
            console.log(`error in req.on('error'): ${e.message}`);
            return reject(`error: ${e.message}`);
        });

        req.end();
    });
};
