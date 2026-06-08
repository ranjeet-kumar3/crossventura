import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { sendDocumentStatusEmail } from '@/lib/mail';


export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const search = (searchParams.get('search') || '').toLowerCase();

    // Fetch all KYC and Business documents
    const [kycRecords, businessRecords] = await Promise.all([
      prisma.onboardingKyc.findMany({
        include: {
          user: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.onboardingManageBusinessInfo.findMany({
        include: {
          user: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    let allDocuments: any[] = [];

    // Process KYC Records
    kycRecords.forEach((kyc) => {
      const userName = kyc.user?.name || kyc.user?.email || "Unknown User";
      const date = kyc.createdAt.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });

      const kycFields = [
        { key: 'passportUrl', name: 'Passport' },
        { key: 'panCardUrl', name: 'PAN Card' },
        { key: 'drivingLicenseUrl', name: 'Driving License' },
        { key: 'addressProofUrl', name: 'Office Address Proof' },
        { key: 'aadhaarCardUrl', name: 'Aadhaar Card' },
        { key: 'utilityBillUrl', name: 'Utility Bill' },
        { key: 'einLetterUrl', name: 'EIN Letter (SS-4 Form)' },
      ];

      const statusKeyMap: Record<string, string> = {
        passportUrl: 'passportStatus',
        panCardUrl: 'panCardStatus',
        drivingLicenseUrl: 'drivingLicenseStatus',
        addressProofUrl: 'addressProofStatus',
        aadhaarCardUrl: 'aadhaarCardStatus',
        utilityBillUrl: 'utilityBillStatus',
        einLetterUrl: 'einLetterStatus'
      };

      kycFields.forEach((field) => {
        const url = (kyc as any)[field.key];
        if (url) {
          const statusKey = statusKeyMap[field.key];
          const rawStatus = (kyc as any)[statusKey] || 'pending';
          const status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

          allDocuments.push({
            id: `kyc_${kyc.id}_${field.key}`,
            userName,
            type: "KYC",
            fileName: field.name,
            date,
            status,
            url,
            rawDate: kyc.createdAt // For sorting
          });
        }
      });
    });

    // Process Business Records
    businessRecords.forEach((biz) => {
      const userName = biz.user?.name || biz.user?.email || "Unknown User";
      const date = biz.createdAt.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });

      if (biz.documentUrls && Array.isArray(biz.documentUrls)) {
        biz.documentUrls.forEach((url, index) => {
          if (url) {
            // Try to extract a filename from the URL, otherwise default to "Business Document"
            let fileName = "Business Document";
            try {
              const urlObj = new URL(url);
              const pathParts = urlObj.pathname.split('/');
              const lastPart = pathParts[pathParts.length - 1];
              if (lastPart) fileName = decodeURIComponent(lastPart);
            } catch (e) {
              // Ignore invalid URLs
            }

            allDocuments.push({
              id: `biz_${biz.id}_${index}`,
              userName,
              type: "Business",
              fileName,
              date,
              status: "Completed", // Business docs don't have a status field directly, default to Completed
              url,
              rawDate: biz.createdAt
            });
          }
        });
      }
    });

    // Sort all documents by rawDate descending
    allDocuments.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

    // Apply Search Filter
    if (search) {
      allDocuments = allDocuments.filter(doc =>
        doc.userName.toLowerCase().includes(search) ||
        doc.fileName.toLowerCase().includes(search) ||
        doc.type.toLowerCase().includes(search)
      );
    }

    // Pagination
    const totalItems = allDocuments.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedDocs = allDocuments.slice(startIndex, startIndex + limit);

    // Format final response to remove rawDate
    const formattedDocs = paginatedDocs.map(({ rawDate, ...rest }) => rest);

    // Stats for the dashboard
    const kycCount = allDocuments.filter(d => d.type === 'KYC').length;
    const businessCount = allDocuments.filter(d => d.type === 'Business').length;

    return NextResponse.json({
      documents: formattedDocs,
      totalItems,
      totalPages,
      stats: {
        totalDocs: totalItems,
        kycCount,
        businessCount
      }
    });

  } catch (error) {
    console.error('Error fetching admin documents:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, action, reason } = await request.json();

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (id.startsWith('kyc_')) {
      // Format: kyc_${kyc.id}_${field.key}
      const parts = id.split('_');
      const kycId = parts[1];
      const fieldKey = parts.slice(2).join('_'); // handles keys like drivingLicenseUrl

      const statusField = fieldKey.replace('Url', 'Status');

      let updateData: any = {};
      if (action === 'approve') {
        updateData[statusField] = 'verified';
      } else if (action === 'reject') {
        updateData[statusField] = 'rejected';
      } else if (action === 'reupload') {
        updateData[statusField] = 'pending';
        updateData[fieldKey] = null; // Clear URL to trigger upload prompt on client
      }

      const updatedKyc = await prisma.onboardingKyc.update({
        where: { id: kycId },
        data: updateData,
        include: { user: { select: { email: true, name: true } } }
      });

      // Recalculate overall status dynamically
      const kycRecord = await prisma.onboardingKyc.findUnique({
        where: { id: kycId }
      });

      if (kycRecord) {
        const statuses = [
          kycRecord.passportUrl ? kycRecord.passportStatus : null,
          kycRecord.panCardUrl ? kycRecord.panCardStatus : null,
          kycRecord.drivingLicenseUrl ? kycRecord.drivingLicenseStatus : null,
          kycRecord.addressProofUrl ? kycRecord.addressProofStatus : null,
          kycRecord.aadhaarCardUrl ? kycRecord.aadhaarCardStatus : null,
          kycRecord.utilityBillUrl ? kycRecord.utilityBillStatus : null,
          kycRecord.einLetterUrl ? kycRecord.einLetterStatus : null,
        ].filter(Boolean);

        let overallStatus = 'pending';
        if (statuses.length > 0) {
          if (statuses.every(s => s === 'verified')) {
            overallStatus = 'verified';
          } else if (statuses.some(s => s === 'rejected')) {
            overallStatus = 'rejected';
          }
        }

        await prisma.onboardingKyc.update({
          where: { id: kycId },
          data: { status: overallStatus }
        });
      }

      // Notify the user via email dynamically
      if (updatedKyc.user?.email) {
        const docFriendlyNames: { [key: string]: string } = {
          passportUrl: 'Passport',
          panCardUrl: 'PAN Card',
          drivingLicenseUrl: 'Driving License',
          addressProofUrl: 'Office Address Proof',
          aadhaarCardUrl: 'Aadhaar Card',
          utilityBillUrl: 'Utility Bill',
          einLetterUrl: 'EIN Letter (SS-4 Form)'
        };
        const docName = docFriendlyNames[fieldKey] || 'Verification Document';
        const emailStatus = action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Re-upload Requested';

        sendDocumentStatusEmail(
          updatedKyc.user.email,
          updatedKyc.user.name || 'Valued Customer',
          docName,
          emailStatus,
          reason
        ).catch(err => console.error("Error sending email:", err));
      }

      return NextResponse.json({ success: true, message: `KYC document ${action}d successfully` });

    } else if (id.startsWith('biz_')) {
      // Format: biz_${biz.id}_${index}
      const parts = id.split('_');
      const bizId = parts[1];
      const index = parseInt(parts[2]);

      const bizRecord = await prisma.onboardingManageBusinessInfo.findUnique({
        where: { id: bizId },
        include: { user: { select: { email: true, name: true } } }
      });

      if (!bizRecord) {
        return NextResponse.json({ error: 'Business record not found' }, { status: 404 });
      }

      if (action === 'reupload' || action === 'reject') {
        const updatedUrls = [...bizRecord.documentUrls];
        updatedUrls.splice(index, 1);

        await prisma.onboardingManageBusinessInfo.update({
          where: { id: bizId },
          data: { documentUrls: updatedUrls }
        });
      }

      // Notify the user via email dynamically
      if (bizRecord.user?.email) {
        const emailStatus = action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Re-upload Requested';
        sendDocumentStatusEmail(
          bizRecord.user.email,
          bizRecord.user.name || 'Valued Customer',
          'Business Document',
          emailStatus,
          reason
        ).catch(err => console.error("Error sending email:", err));
      }

      return NextResponse.json({ success: true, message: `Business document ${action}d successfully` });
    }

    return NextResponse.json({ error: 'Invalid document ID format' }, { status: 400 });

  } catch (error) {
    console.error('Error updating document status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
