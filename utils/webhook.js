const Stripe = require("stripe");
const getRawBody = require("raw-body");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
});

const endpointSecret = process.env.WEBHOOK_SECRET;

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    try {
        console.log("req.headers", req.headers);
        if (req.method !== "POST") {
            return res.status(405).send("Only POST requests allowed");
        }

        const sig = req.headers["stripe-signature"];
        const rawBody = await getRawBody(req);  

        let event;

        try {
            event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
        } catch (err) {
            console.error(`Webhook Error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.log("event.type", JSON.stringify(event.type));

        if (event.type === "checkout.session.completed") {
            const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
                event.data.object.id,
                {
                    expand: ["line_items"],
                }
            );

            const lineItems = sessionWithLineItems.line_items;

            if (!lineItems) {
                return res.status(500).send("Internal Server Error");
            }

            try {
                // Your custom logic for handling the completed session
                console.log("Send user tokens and say thanks");
            } catch (error) {
                console.error("Error sending tokens to user", error);
            }
        }

        res.status(200).end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}
