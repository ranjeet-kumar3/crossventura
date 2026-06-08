import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"CrossVentura" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Login OTP - CrossVentura',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Welcome to CrossVentura</h2>
        <p>Your verification code for login is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

export const sendReceiptEmail = async (email: string, customerName: string, pdfBase64: string, orderId: string, recurringDetails?: string[]) => {
  const mailOptions = {
    from: `"CrossVentura" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Invoice for Your Order - ${orderId} - CrossVentura`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
        <h2 style="color: #193D66;">Thank You for Your Order, ${customerName}!</h2>
        <p>We are excited to confirm that your payment has been successful and your business formation process has started.</p>
        
        <p>Attached to this email, you will find your official <b>Invoice for Order #${orderId}</b>.</p>

        ${recurringDetails && recurringDetails.length > 0 ? `
        <div style="margin: 20px 0; padding: 15px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px;">
          <p style="margin: 0; color: #92400e;"><b>Important Notice: Subscription Services</b></p>
          <p style="margin: 10px 0 0 0; font-size: 14px;">Your order includes the following monthly services which will be charged starting next month:</p>
          <ul style="margin: 10px 0 0 0; font-size: 14px;">
            ${recurringDetails.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px;">
          <p style="margin: 0;"><b>Next Steps:</b></p>
          <ul style="margin: 10px 0;">
            <li>Complete your KYC verification (if not already done)</li>
            <li>Wait for our team to review your documents</li>
            <li>Receive your formation updates via email</li>
          </ul>
        </div>
        <p>If you have any questions, feel free to reply to this email or contact us at support@crossventura.com.</p>
        <br/>
        <p>Best Regards,<br/><b>The CrossVentura Team</b></p>
      </div>
    `,
    attachments: [
      {
        filename: `CrossVentura-Invoice-${orderId}.pdf`,
        content: pdfBase64.split("base64,")[1] || pdfBase64,
        encoding: 'base64'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Invoice Email send error:', error);
    return false;
  }
};

export const sendBookingConfirmationEmail = async (email: string, name: string, date: string, time: string, timezone: string) => {
  const mailOptions = {
    from: `"CrossVentura" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Consultation Booked Successfully - CrossVentura',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
        <h2 style="color: #193D66;">Consultation Confirmed!</h2>
        <p>Hello ${name},</p>
        <p>Your 30-minute consultation with our experts has been successfully scheduled.</p>
        
        <div style="margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
          <p style="margin: 0 0 10px 0;"><strong>Booking Details:</strong></p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Date:</td>
              <td style="padding: 5px 0; font-weight: bold;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Time:</td>
              <td style="padding: 5px 0; font-weight: bold;">${time} (${timezone})</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Duration:</td>
              <td style="padding: 5px 0; font-weight: bold;">30 Minutes</td>
            </tr>
          </table>
        </div>

        <p>We will send you a reminder 30 minutes before the session starts.</p>
        <p>If you need to reschedule or have any questions, please contact our support team.</p>
        
        <br/>
        <p>Best Regards,<br/><b>The CrossVentura Team</b></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Booking Confirmation Email send error:', error);
    return false;
  }
};

export const sendContactEmail = async (data: {
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
}) => {
  const mailOptions = {
    from: `"CrossVentura" <${process.env.SMTP_USER}>`,
    to: 'support@crossventura.com',
    replyTo: data.email,
    subject: `New Contact Inquiry from ${data.name} (${data.country})`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #193D66 0%, #0266FF 100%); padding: 30px 40px;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">New Contact Inquiry</h1>
          <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Received via CrossVentura Contact Form</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 40px;">
          
          <!-- Sender Info -->
          <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
            <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1a202c;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 100px; vertical-align: top;">Name</td>
                <td style="padding: 8px 0; color: #1a202c; font-size: 14px; font-weight: 600;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Email</td>
                <td style="padding: 8px 0; font-size: 14px;">
                  <a href="mailto:${data.email}" style="color: #0266FF; text-decoration: none; font-weight: 600;">${data.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Phone</td>
                <td style="padding: 8px 0; color: #1a202c; font-size: 14px; font-weight: 600;">${data.phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; vertical-align: top;">Country</td>
                <td style="padding: 8px 0; color: #1a202c; font-size: 14px; font-weight: 600;">${data.country || 'Not provided'}</td>
              </tr>
            </table>
          </div>

          <!-- Message -->
          <div style="margin-bottom: 24px;">
            <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1a202c;">Message</h2>
            <div style="background: #f8fafc; border-left: 4px solid #0266FF; border-radius: 0 8px 8px 0; padding: 16px 20px;">
              <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${data.message}</p>
            </div>
          </div>

          <!-- Reply CTA -->
          <div style="text-align: center; margin-top: 28px;">
            <a href="mailto:${data.email}" style="display: inline-block; background: linear-gradient(135deg, #193D66 0%, #0266FF 100%); color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 50px; font-size: 15px; font-weight: 600;">
              Reply to ${data.name}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 20px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="margin: 0; color: #94a3b8; font-size: 13px;">This email was sent from the CrossVentura contact form. Do not reply to this email directly — use the button above.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Contact Email send error:', error);
    return false;
  }
};

export const sendBookingReminderEmail = async (email: string, name: string, date: string, time: string, timezone: string) => {
  const mailOptions = {
    from: `"CrossVentura" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reminder: Your Consultation Starts in 30 Minutes - CrossVentura',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
        <h2 style="color: #193D66;">Your Consultation is Starting Soon!</h2>
        <p>Hello ${name},</p>
        <p>This is a reminder that your scheduled consultation will begin in <b>30 minutes</b>.</p>
        
        <div style="margin: 20px 0; padding: 20px; background: #fffbeb; border-radius: 12px; border: 1px solid #fef3c7;">
          <p style="margin: 0 0 10px 0;"><strong>Details:</strong></p>
          <p style="margin: 0;">Date: <b>${date}</b></p>
          <p style="margin: 5px 0 0 0;">Time: <b>${time} (${timezone})</b></p>
        </div>

        <p>Please make sure you are in a quiet environment with a stable internet connection.</p>
        
        <br/>
        <p>See you soon!<br/><b>The CrossVentura Team</b></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Booking Reminder Email send error:', error);
    return false;
  }
};

export const sendFinalBookingReminderEmail = async (email: string, name: string, date: string, time: string, timezone: string) => {
  const mailOptions = {
    from: `"CrossVentura" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'FINAL REMINDER: Your Consultation Starts in 10 Minutes! - CrossVentura',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
        <h2 style="color: #FF1F3D;">Starting in 10 Minutes!</h2>
        <p>Hello ${name},</p>
        <p>This is your final reminder that your scheduled consultation will begin in <b>10 minutes</b>.</p>
        
        <div style="margin: 20px 0; padding: 20px; background: #fff1f2; border-radius: 12px; border: 1px solid #fecdd3;">
          <p style="margin: 0 0 10px 0;"><strong>Details:</strong></p>
          <p style="margin: 0;">Date: <b>${date}</b></p>
          <p style="margin: 5px 0 0 0;">Time: <b>${time} (${timezone})</b></p>
        </div>

        <p style="color: #3E4246; font-weight: bold;">Please join now to avoid any delays or automatic cancellation.</p>
        
        <br/>
        <p>See you in 10 minutes!<br/><b>The CrossVentura Team</b></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Final Booking Reminder Email send error:', error);
    return false;
  }
};

export const sendAdminBookingNotification = async (
  adminEmail: string,
  userDetails: { name: string; email: string; phone?: string },
  date: string,
  time: string,
  timezone: string
) => {
  const mailOptions = {
    from: `"CrossVentura Notifications" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New Consultation Booking: ${userDetails.name}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
        <h2 style="color: #0266FF;">New Booking Received</h2>
        <p>A new consultation has been scheduled by a user.</p>
        
        <div style="margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
          <p style="margin: 0 0 15px 0; border-bottom: 1px solid #e2e8f0; pb: 10px;"><strong>User Details:</strong></p>
          <p style="margin: 5px 0;">Name: <b>${userDetails.name}</b></p>
          <p style="margin: 5px 0;">Email: <b>${userDetails.email}</b></p>
          <p style="margin: 5px 0;">Phone: <b>${userDetails.phone || 'Not provided'}</b></p>
          
          <p style="margin: 20px 0 10px 0; border-bottom: 1px solid #e2e8f0; pb: 10px;"><strong>Booking Details:</strong></p>
          <p style="margin: 5px 0;">Date: <b>${date}</b></p>
          <p style="margin: 5px 0;">Time: <b>${time} (${timezone})</b></p>
        </div>

        <p>Please check the Admin Dashboard for more details.</p>
        <br/>
        <p>Best Regards,<br/><b>System Notification</b></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Admin Booking Notification error:', error);
    return false;
  }
};

export const sendRescheduleEmail = async (
  email: string,
  name: string,
  newDate: string,
  newTime: string,
  timezone: string
) => {
  const mailOptions = {
    from: `"CrossVentura" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Consultation Rescheduled - CrossVentura',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
        <h2 style="color: #0266FF;">Consultation Rescheduled!</h2>
        <p>Hello ${name},</p>
        <p>Your consultation has been rescheduled by our team. Please find the updated details below:</p>
        
        <div style="margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
          <p style="margin: 0 0 10px 0;"><strong>New Booking Details:</strong></p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Date:</td>
              <td style="padding: 5px 0; font-weight: bold;">${newDate}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #64748b;">Time:</td>
              <td style="padding: 5px 0; font-weight: bold;">${newTime} (${timezone})</td>
            </tr>
          </table>
        </div>

        <p>We look forward to seeing you at the updated time.</p>
        <p>If this new time doesn't work for you, please reach out to us at contact@crossventura.com.</p>
        
        <br/>
        <p>Best Regards,<br/><b>The CrossVentura Team</b></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Reschedule Email send error:', error);
    return false;
  }
};

export const sendDocumentStatusEmail = async (
  email: string,
  name: string,
  docName: string,
  status: 'Approved' | 'Rejected' | 'Re-upload Requested',
  reason?: string
) => {
  let statusColor = '#00A76F'; // green
  let statusText = 'Approved';
  let messageBody = `<p>We are pleased to inform you that your document <b>${docName}</b> has been successfully verified and approved! 🎉</p>`;

  if (status === 'Rejected') {
    statusColor = '#FF1F3D'; // red
    statusText = 'Rejected';
    messageBody = `
      <p>We regret to inform you that your document <b>${docName}</b> could not be verified.</p>
      <div style="margin: 20px 0; padding: 15px; background: #fff1f2; border-left: 4px solid #FF1F3D; border-radius: 4px;">
        <p style="margin: 0; color: #FF1F3D;"><b>Reason for Rejection:</b></p>
        <p style="margin: 5px 0 0 0; color: #3E4246;">${reason || 'Not specified'}</p>
      </div>
      <p>Please log in to your dashboard and upload a valid copy of this document to proceed with your business onboarding.</p>
    `;
  } else if (status === 'Re-upload Requested') {
    statusColor = '#0266FF'; // blue
    statusText = 'Re-upload Requested';
    messageBody = `
      <p>Our verification team has requested a re-upload for your document: <b>${docName}</b>.</p>
      <p>This is usually due to a blurry image or scanning issue. Please log in to your document center and submit a clearer copy.</p>
      ${reason ? `
      <div style="margin: 20px 0; padding: 15px; background: #eff6ff; border-left: 4px solid #0266FF; border-radius: 4px;">
        <p style="margin: 0; color: #0266FF;"><b>Reason for Re-upload Request:</b></p>
        <p style="margin: 5px 0 0 0; color: #3E4246;">${reason}</p>
      </div>
      ` : ''}
    `;
  }

  const mailOptions = {
    from: `"CrossVentura Verification" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Document Status Update: ${docName} - CrossVentura`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; line-height: 1.6;">
        <h2 style="color: #193D66; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Verification Update</h2>
        <p>Hello ${name},</p>
        
        ${messageBody}

        <div style="text-align: center; margin-top: 25px;">
          <a href="${process.env.NEXTAUTH_URL || 'https://crossventura.com'}/document" style="display: inline-block; background: ${statusColor}; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 600;">
            Go to Document Center
          </a>
        </div>
        
        <br/>
        <p>Best Regards,<br/><b>The CrossVentura Team</b></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Document Status Email send error:', error);
    return false;
  }
};
