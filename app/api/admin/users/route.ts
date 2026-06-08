import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get Admin Users List
 *     description: Fetches a paginated and filterable list of users with their onboarding details. Requires admin_token cookie.
 *     tags: [Admin Users]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for user name, email, or phone.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category filter (e.g. start, manage).
 *       - in: query
 *         name: service
 *         schema:
 *           type: string
 *         description: Service filter.
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       401:
 *         description: Unauthorized access (missing admin_token)
 *       500:
 *         description: Internal Server Error
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Check if admin token is present (Security Check)
    const adminToken = request.cookies.get("admin_token")?.value;
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Get search and pagination params from URL
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const category = searchParams.get("category") || null;
    const service = searchParams.get("service") || null;

    // 3. Build Prisma Query
    const skip = (page - 1) * limit;

    let whereConditions: any[] = [];

    // Search condition
    if (search) {
      whereConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } as any },
          { email: { contains: search, mode: "insensitive" } as any },
          { phone: { contains: search, mode: "insensitive" } as any },
        ],
      });
    }

    // Category condition
    if (category) {
      let dbCategory = category;
      if (category.toLowerCase().includes("start")) {
        dbCategory = "start your new business";
      } else if (category.toLowerCase().includes("manage")) {
        dbCategory = "manage your exisitng business";
      }
      whereConditions.push({
        onboardingCategory: {
          category: dbCategory
        }
      });
    }

    // Service condition
    if (service) {
      let serviceKeys: string[] = [];
      const lowerService = service.toLowerCase();
      if (lowerService.includes("ein")) {
        serviceKeys = ["ein-letter"];
      } else if (lowerService.includes("bank")) {
        serviceKeys = ["virtual-bank", "physical-bank", "payment_gateway"];
      } else if (lowerService.includes("tax")) {
        serviceKeys = ["tax_guidance", "boir-filing", "bookkeeping"];
      } else if (lowerService.includes("address") || lowerService.includes("virtual")) {
        serviceKeys = ["virtual-mailbox", "physical-address", "virtual_office", "physical_office", "warehousing"];
      } else if (lowerService.includes("trademark")) {
        serviceKeys = ["operating-agreement", "board_flex"];
      }

      if (serviceKeys.length > 0) {
        whereConditions.push({
          OR: [
            {
              onboardingCategory: {
                selectedServices: {
                  hasSome: serviceKeys
                }
              }
            },
            {
              onboardingStarter: {
                addOnServices: {
                  hasSome: serviceKeys
                }
              }
            },
            {
              onboardingPremium: {
                addOnServices: {
                  hasSome: serviceKeys
                }
              }
            }
          ]
        });
      }
    }

    const whereClause = whereConditions.length > 0 ? { AND: whereConditions } : {};

    // 4. Fetch Users with all related onboarding data
    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        onboardingDetails: true,
        onboardingBusinessDetails: true,
        onboardingPlan: true,
        onboardingConsultation: true,
        onboardingCategory: true,
        onboardingStarter: true,
        onboardingPremium: true,
        onboardingGlobal: true,
        onboardingManageBusiness: true,
      },
    });

    // 5. Format data for the frontend table
    const formattedUsers: any[] = [];

    users.forEach((user) => {
      const hasStartBusiness = !!(user.onboardingBusinessDetails || user.onboardingPlan || user.onboardingStarter || user.onboardingPremium || user.onboardingGlobal);
      const hasManageBusiness = !!user.onboardingManageBusiness;

      // Define labels for add-on services
      const serviceLabels: Record<string, string> = {
        "ein-letter": "EIN Letter",
        "virtual-mailbox": "Virtual Mailbox",
        "virtual-bank": "Virtual Bank Setup",
        "boir-filing": "BOIR Filing",
        "operating-agreement": "Operating Agreement",
        "bookkeeping": "Bookkeeping",
        "physical-address": "Physical Address",
        "google_verification": "Google Verification",
        "board_flex": "Board Flex",
        "physical_office": "Physical Office",
        "virtual_office": "Virtual Office",
        "warehousing": "Warehousing",
        "physical_bank": "Physical Bank",
        "payment_gateway": "Payment Gateway",
        "tax_guidance": "Tax Guidance"
      };

      // 1. If user has Start Business flow populated:
      if (hasStartBusiness) {
        const businessName = user.onboardingBusinessDetails?.businessName || "N/A";
        const userCategory = "start your new business";
        const planName = user.onboardingPlan?.plan?.toUpperCase() || "N/A";
        
        let services: string[] = [];
        const addons = [
          ...(user.onboardingStarter?.addOnServices || []),
          ...(user.onboardingPremium?.addOnServices || []),
        ];
        addons.forEach(s => {
          if (serviceLabels[s]) services.push(serviceLabels[s]);
        });

        formattedUsers.push({
          id: `${user.id}-start`,
          name: user.name || "N/A",
          email: user.email,
          phone: user.phone || "N/A",
          country: user.onboardingDetails?.country || "N/A",
          timezone: user.onboardingDetails?.timezone || "N/A",
          businessName: businessName,
          category: userCategory,
          plan: planName,
          services: services.length > 0 ? services.join(", ") : "Not Selected",
          consultation: user.onboardingConsultation 
            ? "Scheduled" 
            : (user.onboardingPlan?.bookConsultation ? "Pending" : "Not Booked"),
          avatar: user.image || "/default-avatar.png",
          rawDetails: {
            plan: user.onboardingPlan,
            businessDetails: user.onboardingBusinessDetails,
            starter: user.onboardingStarter,
            premium: user.onboardingPremium,
            global: user.onboardingGlobal,
            category: user.onboardingCategory,
            consultation: user.onboardingConsultation,
            manageBusiness: null,
          }
        });
      }

      // 2. If user has Manage Business flow populated:
      if (hasManageBusiness) {
        const businessName = user.onboardingManageBusiness?.businessName || "N/A";
        const userCategory = "manage your exisitng business";
        
        let planName = "Business Management";
        if (user.onboardingCategory) {
          const categoryLabels: Record<string, string> = {
            "scaling": "Post Business Setup & Scaling",
            "payments": "Payment Solutions",
            "compliances": "Compliances"
          };
          const selectedCats = ((user.onboardingCategory as any).categories as string[] || [])
            .map(cat => categoryLabels[cat] || cat);
          planName = selectedCats.length > 0 ? selectedCats.join(", ") : "Business Management";
        }

        let services: string[] = [];
        if (user.onboardingCategory?.selectedServices) {
          (user.onboardingCategory.selectedServices as string[]).forEach(s => {
            if (serviceLabels[s]) {
              services.push(serviceLabels[s]);
            }
          });
        }

        formattedUsers.push({
          id: `${user.id}-manage`,
          name: user.name || "N/A",
          email: user.email,
          phone: user.phone || "N/A",
          country: user.onboardingManageBusiness?.country || user.onboardingDetails?.country || "N/A",
          timezone: user.onboardingManageBusiness?.timezone || user.onboardingDetails?.timezone || "N/A",
          businessName: businessName,
          category: userCategory,
          plan: planName,
          services: services.length > 0 ? services.join(", ") : "Not Selected",
          consultation: user.onboardingConsultation 
            ? "Scheduled" 
            : (user.onboardingPlan?.bookConsultation ? "Pending" : "Not Booked"),
          avatar: user.image || "/default-avatar.png",
          rawDetails: {
            plan: null,
            businessDetails: null,
            starter: null,
            premium: null,
            global: null,
            category: user.onboardingCategory,
            consultation: user.onboardingConsultation,
            manageBusiness: user.onboardingManageBusiness,
          }
        });
      }

      // 3. Fallback if user has neither flow populated
      if (!hasStartBusiness && !hasManageBusiness) {
        formattedUsers.push({
          id: user.id,
          name: user.name || "N/A",
          email: user.email,
          phone: user.phone || "N/A",
          country: user.onboardingDetails?.country || "N/A",
          timezone: user.onboardingDetails?.timezone || "N/A",
          businessName: "N/A",
          category: "N/A",
          plan: "N/A",
          services: "Not Selected",
          consultation: "Not Booked",
          avatar: user.image || "/default-avatar.png",
          rawDetails: {
            plan: null,
            businessDetails: null,
            starter: null,
            premium: null,
            global: null,
            category: null,
            consultation: null,
            manageBusiness: null,
          }
        });
      }
    });

    // 6. Paginate fully formatted and split list
    const totalUsers = formattedUsers.length;
    const paginatedUsers = formattedUsers.slice(skip, skip + limit);

    // Set sequential displayIds for the paginated slice
    paginatedUsers.forEach((user, index) => {
      user.displayId = (skip + index + 1).toString().padStart(2, "0");
    });

    return NextResponse.json({
      users: paginatedUsers,
      total: totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error: any) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
