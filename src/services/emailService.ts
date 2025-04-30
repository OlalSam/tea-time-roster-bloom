
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
  // Generate HTML template for schedule
  return `
    <h2>Your Schedule for the Week</h2>
    <table>
      <tr>
        <th>Date</th>
        <th>Shift</th>
        <th>Time</th>
      </tr>
      ${schedule.shifts.map((shift: any) => `
        <tr>
          <td>${new Date(shift.shift_date).toLocaleDateString()}</td>
          <td>${shift.shift_type.name}</td>
          <td>${shift.shift_type.start_time} - ${shift.shift_type.end_time}</td>
        </tr>
      `).join('')}
    </table>
  `;
}
