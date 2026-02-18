import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-01-28.clover', // Use latest API version
});

export const createCheckoutSession = async (
    courseId: string,
    courseTitle: string,
    price: number,
    userId: string,
    userEmail: string
) => {
    return await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: courseTitle,
                    },
                    unit_amount: price * 100, // Stripe expects amount in cents/paisa
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/dashboard/courses?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/courses/${courseId}?canceled=true`,
        customer_email: userEmail,
        metadata: {
            courseId,
            userId,
        },
    });
};

export default stripe;
