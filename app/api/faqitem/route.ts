import { NextResponse } from 'next/server';

type FAQItem = {
    question: string;
    answer: string;
};

const faqData: FAQItem[] = [
    {
        question: "What services does CrossVentura provide?",
        answer:
            "Juris is your comprehensive partner for launching and managing your U.S. business. From company formation and ensuring compliance to handling bookkeeping and providing continuous support, Juris covers all the essential services to help your business thrive.",
    },
    {
        question: "Do I need to be a U.S. citizen to start a business?",
        answer:
            "No, you don’t have to be a U.S. citizen to get started. We specialize in helping founders from all over the world establish and manage their U.S.-based companies with ease.",
    },
    {
        question: "How long does it take to start my U.S. business?",
        answer:
            "Most businesses are typically set up within just a few days, although the exact timing can vary depending on the state and specific legal requirements involved.",
    },
    {
        question: "What information do I need to get started?",
        answer:
            "Typically, you need your business name, personal identification details, preferred state of registration, and some information about your business activity.",
    },
    {
        question: "Do you help with EIN and bank account setup?",
        answer:
            "Yes, support can include EIN guidance and assistance with business bank account setup requirements.",
    },
    {
        question: "Will you handle compliance and filings?",
        answer:
            "Yes, ongoing compliance support may include annual filings, reminders, and basic maintenance assistance depending on the service package.",
    },
    {
        question: "What types of businesses can you support?",
        answer:
            "We can support freelancers, startups, e-commerce businesses, agencies, consultants, and many other business types.",
    },
    {
        question: "How much does it cost to get started?",
        answer:
            "Pricing depends on the state, business type, and services included. You can provide your requirements to get an exact estimate.",
    },
    {
        question: "Still have a question?",
        answer:
            "You can contact our team directly and we’ll help you with the next steps.",
    },
];

/**
 * @swagger
 * /api/faqitem:
 *   get:
 *     summary: Get FAQ items
 *     description: Returns a list of frequently asked questions and answers.
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: A list of FAQ items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   question:
 *                     type: string
 *                   answer:
 *                     type: string
 */
export async function GET() {
    return NextResponse.json(faqData);
}