import axios from 'axios'; 
import Stripe from 'stripe';
import getRawBody from 'raw-body';

const API_BASE_URL = 'https://livesite-backend.onrender.com';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
});

const endpointSecret = process.env.WEBHOOK_SECRET;

export const config = {
    api: {
        bodyParser: false,
    },
};

const calculateTokens = (lineItems) => {
    let totalTokens = 0;
    lineItems.data.forEach(item => {
        switch (item.description) {
            case '400 Tokens':
                totalTokens += 400;
                break;
            case '1000 Tokens':
                totalTokens += 1000;
                break;
            case '2000 Tokens':
                totalTokens += 2000;
                break;
            case '4000 Tokens':
                totalTokens += 4000;
                break;
            case '10000 Tokens':
                totalTokens += 10000;
                break;
            default:
                console.warn(`Unrecognized item description: ${item.description}`);
                break;
        }
    });
    return totalTokens;
};

export default async function handler(req, res) {
    try {
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

        if (event.type === "checkout.session.completed") {
            const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
                event.data.object.id,
                {
                    expand: ["line_items"],
                }
            );

            const lineItems = sessionWithLineItems.line_items;

            if (!lineItems) {
                console.error("No line items found for the session");
                return res.status(500).send("Internal Server Error");
            }

            try {
                const username = sessionWithLineItems.client_reference_id;
                const purchasedAmount = calculateTokens(lineItems);
                const amountSpent = sessionWithLineItems.amount_total / 100;
                const currency = sessionWithLineItems.currency.toUpperCase();

                // Make an API request to update the user's purchases
                await axiosInstance.post(`/update-purchase`, {
                    username,
                    tokens: purchasedAmount,
                    amountSpent,
                    currency,
                    description: `Purchased ${purchasedAmount} tokens for ${amountSpent} ${currency}`
                });

                console.log(`Successfully processed purchase for ${username}.`);
            } catch (error) {
                console.error("Error updating user purchase data:", error);
                return res.status(500).send("Failed to update user data");
            }
        }

        res.status(200).end();
    } catch (error) {
        console.error("Unhandled error in webhook handler:", error);
        res.status(500).send("Internal Server Error");
    }
}
