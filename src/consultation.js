export function getConsultationContextLabel(preset = '') {
  if (!preset) return '';
  return /^\d+$/.test(preset) ? `Paket ${Number(preset).toLocaleString('id-ID')} pax` : preset;
}

export function buildConsultationWhatsAppMessage(profile, context = '') {
  const details = [
    `• Kota: ${profile.city}`,
    `• Acara: ${profile.event}`,
    `• Tanggal/bulan: ${profile.date}`,
    `• Venue: ${profile.venue}`,
    `• Nomor WhatsApp: ${profile.phone}`,
  ];

  if (context && context !== profile.event) details.push(`• Topik yang ingin didiskusikan: ${context}`);

  return [
    'Halo FMO Wedding Specialist,',
    '',
    'Saya ingin melanjutkan konsultasi berdasarkan brief yang sudah saya isi:',
    ...details,
    '',
    'Mohon panduannya untuk langkah selanjutnya. Terima kasih.',
  ].join('\n');
}

export function buildConsultationWhatsAppUrl(profile, whatsappNumber, context = '') {
  const message = buildConsultationWhatsAppMessage(profile, context);
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
