import { supabase } from '@/integrations/supabase/client';

// Placeholder implementation for email service
// In production, you would use Supabase Edge Functions with a proper email service

interface ScheduleEmailParams {
  shifts: Array<{
    shift_date: string;
    shift_type: {
      name: string;
      start_time: string;
      end_time: string;
    };
  }>;
  isAdminSummary: boolean;
}

export async function sendScheduleEmail(to: string, params: ScheduleEmailParams) {
  const { shifts, isAdminSummary } = params;

  // Format the email content
  const subject = isAdminSummary 
    ? 'Schedule Summary - Admin Report'
    : 'Your Schedule Update';

  const shiftList = shifts.map(shift => `
    Date: ${shift.shift_date}
    Shift: ${shift.shift_type.name}
    Time: ${shift.shift_type.start_time} - ${shift.shift_type.end_time}
  `).join('\n');

  const text = isAdminSummary
    ? `Schedule Summary Report\n\n${shiftList}`
    : `Your Schedule Update\n\n${shiftList}`;

  const html = `
    <h2>${isAdminSummary ? 'Schedule Summary Report' : 'Your Schedule Update'}</h2>
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      ${shifts.map(shift => `
        <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #eee; border-radius: 4px;">
          <p><strong>Date:</strong> ${shift.shift_date}</p>
          <p><strong>Shift:</strong> ${shift.shift_type.name}</p>
          <p><strong>Time:</strong> ${shift.shift_type.start_time} - ${shift.shift_type.end_time}</p>
        </div>
      `).join('')}
    </div>
  `;

  try {
    // Send the email through our API endpoint
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        text,
        html
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Email API error:', errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export function generateScheduleHtml(schedule: any) {
  const title = schedule.isAdminSummary 
    ? 'Weekly Schedule Summary (Admin View)'
    : 'Your Schedule for the Week';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          h2 { color: #2563eb; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8fafc; }
          tr:hover { background-color: #f1f5f9; }
          .footer { margin-top: 30px; font-size: 0.9em; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
      <h2>${title}</h2>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
      <table>
        <tr>
          <th>Date</th>
          <th>Shift</th>
          <th>Time</th>
          ${schedule.isAdminSummary ? '<th>Employee</th>' : ''}
        </tr>
        ${schedule.shifts.map((shift: any) => `
          <tr>
            <td>${new Date(shift.shift_date).toLocaleDateString()}</td>
            <td>${shift.shift_type?.name || 'Unknown'}</td>
            <td>${shift.shift_type?.start_time || '00:00'} - ${shift.shift_type?.end_time || '00:00'}</td>
            ${schedule.isAdminSummary ? `<td>${shift.employee?.first_name || ''} ${shift.employee?.last_name || ''}</td>` : ''}
          </tr>
        `).join('')}
      </table>
          <div class="footer">
      <p>This is an automated message from your scheduling system.</p>
            <p>Please do not reply to this email.</p>
          </div>
    </div>
      </body>
    </html>
  `;
}
