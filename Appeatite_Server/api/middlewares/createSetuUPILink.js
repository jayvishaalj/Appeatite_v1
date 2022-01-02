const axios = require('axios');
const { setuSandboxURL, setuProdURL } = require('../../config/urls');


module.exports = async (token, orderDetails, merchantId, uniqueId) => {
    const API_URL = process.env.DEVELOPMENT ? setuSandboxURL : setuProdURL;
    const body = {
        "name": `${orderDetails.user_id}_${orderDetails.rest_id}_${orderDetails.id}`,
        "amount": {
            "value": parseInt(orderDetails.order_amount),
            "currencyCode": "INR"
        },
        "billerBillID": uniqueId,
        "amountExactness": "EXACT",
        "additionalInfo": {
            "order_id": orderDetails.id,
            "user_id": orderDetails.user_id,
            "rest_id": orderDetails.rest_id
        }
    }
    try {
        const response = await axios.post(`${API_URL}/v2/payment-links`, body, {
            headers: {
                'authorization': `Bearer ${token}`,
                'X-Setu-Product-Instance-ID': merchantId
            }
        });
        return response.data.data;
    } catch (error) {
        console.log(error, JSON.stringify(error.response.data))
    }

}
