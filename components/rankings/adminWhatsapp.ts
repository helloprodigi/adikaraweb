export const ADMIN_WHATSAPP_NUMBER = "6281313853065";

const ADMIN_MESSAGE_CLOSING =
  "Mohon informasi terkait link registrasi ulang dan grup WhatsApp finalis untuk tahap selanjutnya.";

export function getAdminWhatsAppUrl(categoryLabel: string) {
  const lines =
    categoryLabel === "Competitive Programming"
      ? [
          "Halo Admin ADIKARA 2026!",
          "Saya ingin melakukan registrasi ulang sebagai finalis ADIKARA 2026.",
          "Nama Peserta: ",
          `Cabang Lomba: ${categoryLabel}`,
          ADMIN_MESSAGE_CLOSING,
          "Terima kasih!",
        ]
      : [
          "Halo Admin ADIKARA 2026!",
          "Kami ingin melakukan registrasi ulang sebagai finalis ADIKARA 2026.",
          "Nama Ketua Tim: ",
          "Nama Tim: ",
          `Divisi Lomba: ${categoryLabel}`,
          ADMIN_MESSAGE_CLOSING,
          "Terima kasih!",
        ];

  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
