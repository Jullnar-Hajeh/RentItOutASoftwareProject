const paypal = require('@paypal/checkout-server-sdk');

// Configure the PayPal environment with your client ID and secret
function environment() {
    const clientId = 'ARdx9GgYvFbFlQ6uT04LoTnBzpnlzyIMYxXuGn3MBPegq9a6qv8XadM9X8JwPuvrhjnJ1igPon3RWIK9';
    const clientSecret = 'ENTswqtGJOn1FMWN7KAribcAXE3XOis1q4Ghn3ouczZprr3bMoEFM3sJ4arVbOerALBIiX1N_XpGK9W6';
    
    return new paypal.core.SandboxEnvironment(clientId, clientSecret); // Use LiveEnvironment for production
}

// Create a new PayPal client
function client() {
    return new paypal.core.PayPalHttpClient(environment());
}

module.exports = { client };
