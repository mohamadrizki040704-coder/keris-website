const $grid = document.getElementById("grid");
const $filter = document.getElementById("filter");
const $modal = document.getElementById("modal");
const $isi = document.getElementById("modal-isi");
const labelLuk = l => (l === 0 ? "Lurus" : `Luk ${l}`);

// "gambar" boleh satu foto (teks) atau banyak foto (daftar)
const fotoList = k => (Array.isArray(k.gambar) ? k.gambar : [k.gambar]);

function slider(k) {
  const f = fotoList(k);
  const imgs = f.map((src, n) => `<img src="${src}" alt="${k.nama} – foto ${n + 1}" loading="lazy" draggable="false">`).join("");
  if (f.length < 2) return `<div class="slider"><div class="jalur">${imgs}</div></div>`;
  return `<div class="slider"><div class="jalur">${imgs}</div>
    <button class="geser kiri" aria-label="Foto sebelumnya">&#8249;</button>
    <button class="geser kanan" aria-label="Foto berikutnya">&#8250;</button>
    <span class="hitung">1 / ${f.length}</span></div>`;
}

function linkWA(k) {
  const pesan = k
    ? `Halo, saya tertarik membeli keris ini:\n\n*${k.nama}*\nHarga: ${k.harga}\n\nApakah masih tersedia?`
    : "Halo, saya ingin bertanya tentang koleksi keris.";
  return `https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`;
}

function buatKartu(k, i) {
  return `
  <article class="kartu-keris" data-i="${i}">
    ${slider(k)}
    <div class="info">
      <h3>${k.nama}</h3>
      <p class="asal">${k.asal}</p>
      <span class="chip">Pamor ${k.pamor}</span>
      <dl class="detail">
        <dt>Dhapur</dt><dd>${k.dhapur}</dd>
        <dt>Luk</dt><dd>${k.luk === 0 ? "Lurus" : k.luk}</dd>
        <dt>Tangguh</dt><dd>${k.tangguh}</dd>
        <dt>Pamor</dt><dd>${k.pamor}</dd>
      </dl>
      <p class="harga">${k.harga}</p>
    </div>
    <div class="aksi">
      <button class="btn-detail" data-i="${i}">Lihat Detail</button>
      <a class="btn-wa" href="${linkWA(k)}" target="_blank" rel="noopener">Beli via WhatsApp</a>
    </div>
  </article>`;
}

function tampilkan(luk = "semua") {
  $grid.innerHTML = DAFTAR_KERIS
    .map((k, i) => ({ k, i }))
    .filter(({ k }) => luk === "semua" || k.luk === luk)
    .map(({ k, i }) => buatKartu(k, i))
    .join("");
}

function bukaDetail(i) {
  const k = DAFTAR_KERIS[i];
  $isi.innerHTML = `
    <button class="tutup" aria-label="Tutup">&times;</button>
    ${slider(k)}
    <div class="modal-teks">
      <h3 id="modal-judul">${k.nama}</h3>
      <p class="asal">${k.asal}</p>
      <p>${k.deskripsi}</p>
      <dl class="detail">
        <dt>Dhapur</dt><dd>${k.dhapur}</dd>
        <dt>Luk</dt><dd>${k.luk === 0 ? "Lurus" : k.luk}</dd>
        <dt>Tangguh</dt><dd>${k.tangguh}</dd>
        <dt>Pamor</dt><dd>${k.pamor}</dd>
        <dt>Panjang bilah</dt><dd>${k.panjang}</dd>
        <dt>Warangka</dt><dd>${k.warangka}</dd>
        <dt>Kondisi</dt><dd>${k.kondisi}</dd>
      </dl>
      <p class="harga">${k.harga}</p>
      <a class="btn-wa" href="${linkWA(k)}" target="_blank" rel="noopener">Beli via WhatsApp</a>
    </div>`;
  $modal.showModal();
}

// Tombol filter dibuat otomatis dari data
const daftarLuk = [...new Set(DAFTAR_KERIS.map(k => k.luk))].sort((a, b) => a - b);
$filter.innerHTML = ["semua", ...daftarLuk]
  .map(v => `<button data-luk="${v}" aria-pressed="${v === "semua"}">${v === "semua" ? "Semua" : labelLuk(v)}</button>`)
  .join("");

$filter.addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  $filter.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
  tampilkan(b.dataset.luk === "semua" ? "semua" : Number(b.dataset.luk));
});

$grid.addEventListener("click", e => {
  if (e.target.closest(".btn-wa, .geser")) return;
  const kartu = e.target.closest(".kartu-keris");
  if (kartu) bukaDetail(kartu.dataset.i);
});

// Tutup dialog: tombol ×, ketuk area gelap di luar
$modal.addEventListener("click", e => {
  if (e.target === $modal || e.target.closest(".tutup")) $modal.close();
});

// Ketuk foto di panel detail -> tampil besar (layar penuh)
const $zoom = document.getElementById("zoom");
const $zoomImg = document.getElementById("zoom-img");
$isi.addEventListener("click", e => {
  const img = e.target.closest(".jalur img");
  if (!img) return;
  $zoomImg.src = img.src;
  $zoomImg.alt = img.alt;
  $zoom.showModal();
});
$zoom.addEventListener("click", () => $zoom.close());

// Slider foto: tombol panah (untuk desktop) dan penanda "1 / 3"
document.addEventListener("click", e => {
  const b = e.target.closest(".geser");
  if (!b) return;
  const jalur = b.parentElement.querySelector(".jalur");
  jalur.scrollBy({ left: (b.classList.contains("kanan") ? 1 : -1) * jalur.clientWidth, behavior: "smooth" });
});
document.addEventListener("scroll", e => {
  const j = e.target;
  if (!j.classList || !j.classList.contains("jalur")) return;
  if (!j.clientWidth) return;
  const h = j.parentElement.querySelector(".hitung");
  if (h) h.textContent = `${Math.round(j.scrollLeft / j.clientWidth) + 1} / ${j.children.length}`;
}, true);

// Tautan WA umum (footer & bar bawah)
const umum = linkWA(null);
document.getElementById("link-wa").href = umum;
document.getElementById("bar-wa").href = umum;

tampilkan();