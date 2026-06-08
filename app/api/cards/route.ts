/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Get all cards
 *     description: Returns a list of business category cards.
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: A list of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   imageBg:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 */
export async function GET() {
  const cards = [
    {
      title: "E-Commerce",
      description: "Set up your U.S. business and unlock access to international customers, payments, and marketplaces.",
      imageBg: "bg-[#F0FDF4]",
      imageUrl: "/img/image 17.svg"
    },
    {
      title: "Import-Export",
      description: "Start your U.S. entity and simplify global trade, payments, and compliance without complexity",
      imageBg: "bg-[#EFF6FF]",
      imageUrl: "/img/image 17 (1).svg"
    },
    {
      title: "IT Services",
      description: "Establish your U.S. presence and build trust with international clients while managing operations smoothly",
      imageBg: "bg-[#FEFCE8]",
      imageUrl: "/img/image 17 (2).svg"
    },
    {
      title: "Startups & Founders",
      description: "Everything you need to start and grow your business in the U.S. — from setup to ongoing support",
      imageBg: "bg-[#F1F5F9]",
      imageUrl: "/img/image 17 (3).svg"
    }
  ];

  return Response.json(cards);
}