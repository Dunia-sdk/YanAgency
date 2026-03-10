const axios = require('axios');

async function test() {
    try {
        const payload = {
            name: "Test Agency",
            eMail: "test" + Date.now() + "@test.com",
            nbrPhone: "0600000000",
            lastName: "Test",
            firstMame: "Test",
            address: "",
            idCity: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        };
        console.log("Sending payload:", payload);
        const res = await axios.post('https://yancarz-be.azurewebsites.net/api/portal/Agency', payload);
        console.log("Response:", res.data);
    } catch (err) {
        if (err.response) {
            console.error("API Error Status:", err.response.status);
            console.error("API Error Data:", err.response.data);
        } else {
            console.error("Error:", err.message);
        }
    }
}
test();
