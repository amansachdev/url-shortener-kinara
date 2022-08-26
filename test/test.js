// Requiring module
const assert = require('assert');

// We can group similar tests inside a describe block
describe("Simple Calculations", () => {
    before(() => {
        $ = require('jquery');
        global.$ = $;
        console.log("This part executes once before all tests");
    });

    after(() => {
    });

    // We can add nested blocks for different tests
    describe("Test1", () => {
        beforeEach(() => {
            console.log("executes before every test");
        });

        it("Is returning the domain url", async () => {
            const fetch = require("node-fetch");
            var myHeaders = new fetch.Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("fullUrl", "https://account.mongodb.com/account/login?n=%2Fv2%2F62f7e9f12a97ae0e9726586a%23metrics%2FreplicaSet%2F62f7ea4f4d6d245aa7b91b6e%2Fexplorer%2Ftest%2Fshorturls%2Ffind");
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };
            var response_url;
            var res = await fetch("http://urlshortner-env.eba-eygk9hex.us-east-1.elasticbeanstalk.com/short", requestOptions)
                .then(response => {
                    response_url = response.url
                    response.text()
                })
                .catch(error => console.log('error', error));
            assert.equal(response_url, 'http://urlshortner-env.eba-eygk9hex.us-east-1.elasticbeanstalk.com/basic');
        });
    });

});
