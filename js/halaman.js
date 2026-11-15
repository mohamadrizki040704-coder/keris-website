// Dipakai halaman selain beranda: mengisi tautan WhatsApp
const linkUmum = `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent("Halo, saya ingin bertanya tentang koleksi keris.")}`;
["link-wa", "bar-wa"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.href = linkUmum;
});