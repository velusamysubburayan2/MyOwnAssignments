export class APIUtils {
    constructor(apiContext) {
        this.apiContext=apiContext;
    }
    async loginToApp() {
        const response = await this.apiContext.post('https://api.eventhub.rahulshettyacademy.com/api/auth/login', {
            headers: {
                "content-type": "application/json"
            },
            data: {
                email: "mvsrayan1@gmail.com",
                password: "Boopalan@231996"
            }
        })
        const jsonDataLogin = await response.json();
        return await jsonDataLogin.token;
    }
    async createEvent(payloadCreateEvent){
        const token=await this.loginToApp();
        const responseBookingEvent = await this.apiContext.post('https://api.eventhub.rahulshettyacademy.com/api/bookings', {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        },
        data: payloadCreateEvent
    })
    const jsonDataBookingEvent=await responseBookingEvent.json();
    return jsonDataBookingEvent;
    }
}