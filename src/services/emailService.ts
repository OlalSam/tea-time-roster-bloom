
import nodemailer from 'nodemailer';
import { supabase } from '@/integrations/supabase/client';

interface EmailConfig {
  senderEmail: string;
  appPassword: string;
}

let emailConfig: EmailConfig | null = null;

export async function initializeEmailService() {
  const { data, error } = await supabase
    .from('email_config')
    .select('*')
    .single();
    
  if (error) throw error;
  emailConfig = data as EmailConfig;
}

export async function sendScheduleEmail(recipientEmail: string, weeklySchedule: any) {
  if (!emailConfig) await initializeEmailService();
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailConfig?.senderEmail,
      pass: emailConfig?.appPassword
    }
  });

  const mailOptions = {
    from: emailConfig?.senderEmail,
    to: recipientEmail,
    subject: 'Your Weekly Schedule',
    html: generateScheduleHtml(weeklySchedule)
  };

  return transporter.sendMail(mailOptions);
}

function generateScheduleHtml(schedule: any) {
  const title = schedule.isAdminSummary 
    ? 'Weekly Schedule Summary (Admin View)'
    : 'Your Schedule for the Week';

  const style = `
    <style>
      table { border-collapse: collapse; width: 100%; }
      th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
      th { background-color: #f4f4f4; }
      .header { margin-bottom: 20px; }
      .footer { margin-top: 20px; font-size: 12px; color: #666; }
    </style>
  `;

  return `
    ${style}
    <div class="header">
      <h2>${title}</h2>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
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
          <td>${shift.shift_type.name}</td>
          <td>${shift.shift_type.start_time} - ${shift.shift_type.end_time}</td>
          ${schedule.isAdminSummary ? `<td>${shift.employee?.first_name} ${shift.employee?.last_name}</td>` : ''}
        </tr>
      `).join('')}
    </table>
    <div class="footer">
      <p>This is an automated message from your scheduling system.</p>
    </div>
  `;
}
