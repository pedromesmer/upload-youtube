const express = require('express');
const google = require('googleapis').google;
const OAuth2 = google.auth.OAuth2;
const open = require('open');


module.exports = async function authenticateWithOAuth() {
    const webServer = await startWebServer();
    const OAuthClient = await createOAuthClient();
    requestUserConsent(OAuthClient);
    const authorizationToken = await waitForGoogleCallback(webServer);
    await requestGoogleForAccessTokens(OAuthClient, authorizationToken);
    await setGlobalGoogleAuthentication(OAuthClient);
    await stopWebServer(webServer);

    // Inicia o web server
    async function startWebServer() {
        return new Promise((resolve, reject) => {
            const port = 3000;
            const app = express();

            const server = app.listen(port, () => {
                console.log(`> Listing on http://localhost:${port}`)

                resolve({
                    app,
                    server
                })
            })
        })
    }

    // Cria o autenticardor OAuth
    async function createOAuthClient() {
        const credentials = require('./../credentials/google-youtube.json');

        const OAuthClient = new OAuth2 (
            credentials.web.client_id,
            credentials.web.client_secret,
            credentials.web.redirect_uris[0]
        )

        return OAuthClient
    }

    // Solicita o concentimento do usuário
    async function requestUserConsent(OAuthClient) {
        const consentUrl = OAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/youtube']
        })

        console.log(`Please, give your consent: ${consentUrl}`);
        await open(consentUrl);
        
    }

    // Aguarda callback
    async function waitForGoogleCallback(webServer) {
        return new Promise((resolve, reject) => {
            console.log('> Waiting for user consent...');

            webServer.app.get('/oauth2callback',(req, res) => {
                const authCode = req.query.code;
                console.log(`> consent given: ${authCode}`);

                res.send('<h1>Thank you!</h1><p>Now, close this tab.</p>')
                resolve(authCode);
            })
        })
    }

    // Solicita tokens ao google
    async function requestGoogleForAccessTokens(OAuthClient, authorizationToken) {
        return new Promise((resolve, reject) => {
            OAuthClient.getToken(authorizationToken, (error, tokens) => {
                if (error) {
                    return reject(error);
                }
                console.log('> Access Tokens: ');
                console.log(tokens);

                OAuthClient.setCredentials(tokens);
                resolve();
            })
        })
    }

    // Define os tokens como globais no objeto google
    function setGlobalGoogleAuthentication(OAuthClient) {
        console.log('Seting global google authentication')
        google.options({
            auth: OAuthClient
        })
    }
    
    // Fecha o webs server
    async function stopWebServer(webServer) {
        return new Promise((resolve, reject) => {
            webServer.server.close(() => {
                resolve();
            })
        })
    }
}

module.exports.youtube = google.youtube({version: 'v3'})
