
import { Email } from "../types";

// Generator email simulasi sederhana tanpa AI
export const generateLocalSimulatedEmails = (count: number = 1, targetEmail: string): Email[] => {
  const mockTemplates = [
    { sender: "Netflix", email: "info@netflix.com", subject: "Selesaikan pendaftaran Anda", body: "Terima kasih telah mendaftar di Netflix. Gunakan kode <b>882190</b> untuk memverifikasi akun Anda." },
    { sender: "Discord", email: "noreply@discord.com", subject: "Verifikasi Alamat Email", body: "Silakan klik tombol di bawah untuk memverifikasi akun Discord Anda agar dapat mengakses server Raylan." },
    { sender: "GitHub", email: "noreply@github.com", subject: "[GitHub] Login baru terdeteksi", body: "Halo, ada upaya login baru ke akun Anda dari browser Chrome di Windows." },
    { sender: "Instagram", email: "security@mail.instagram.com", subject: "821 002 adalah kode keamanan Anda", body: "Jangan berikan kode ini kepada siapapun untuk keamanan akun Anda." }
  ];

  return Array.from({ length: count }).map((_, i) => {
    const template = mockTemplates[Math.floor(Math.random() * mockTemplates.length)];
    return {
      id: `sim-${Date.now()}-${i}`,
      sender: template.sender,
      senderEmail: template.email,
      subject: template.subject,
      snippet: template.body.substring(0, 60) + "...",
      body: `<div><p>${template.body}</p><br><p>Email ini dikirim ke <b>${targetEmail}</b></p></div>`,
      date: new Date().toISOString(),
      read: false,
      tags: ['INBOX']
    };
  });
};
