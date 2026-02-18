import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma';
import { enrollUserInCourse } from '../services/enrollmentService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-01-28.clover',
    typescript: true,
});

// Endpoint secret from Stripe Dashboard (or ENV)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
        if (!endpointSecret || !sig) {
            throw new Error("Missing Stripe Webhook Secret or Signature");
        }
        // Verify signature (req.body must be raw buffer here)
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            console.log("Payment successful for session:", session.id);
            await handleCheckoutSessionCompleted(session);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (userId && courseId) {
        try {
            await enrollUserInCourse(userId, courseId);
        } catch (error) {
            console.error("Error enrolling user via webhook:", error);
        }
    } else {
        console.error("Missing metadata in Stripe Session");
    }
}
