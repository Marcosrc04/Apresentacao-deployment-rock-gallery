// Para usar suas fotos: coloque os arquivos em /img e preencha "img": "img/arquivo.jpg".
// Enquanto "img" estiver vazio, a galeria mostra um fundo em degradê.
const photos = [
  { band: "Noite de Estrada", info: "Palco principal, 1973", style: "classico", c: [38, 20],  size: "tall", img: "" },
  { band: "Rua 13",           info: "Clube pequeno, 1977",   style: "punk",    c: [350, 10], size: "",     img: "" },
  { band: "Chuva de Seattle", info: "Turnê, 1992",           style: "grunge",  c: [200, 5],  size: "wide", img: "" },
  { band: "Ferro Velho",      info: "Festival, 1986",        style: "metal",   c: [0, 0],    size: "tall", img: "" },
  { band: "Amplificador",     info: "Ensaio, 1969",          style: "classico",c: [28, 25],  size: "",     img: "" },
  { band: "Cuspe & Cola",     info: "Pôster, 1979",          style: "punk",    c: [320, 15], size: "",     img: "" },
  { band: "Flanela",          info: "Garagem, 1994",         style: "grunge",  c: [150, 8],  size: "",     img: "" },
  { band: "Martelo Negro",    info: "Arena, 1988",           style: "metal",   c: [270, 5],  size: "wide", img: "" }
];

const art = p => p.img
  ? `url('${p.img}')`
  : `linear-gradient(145deg, hsl(${p.c[0]} 70% 45%), hsl(${(p.c[0] + 40) % 360} 60% 15%))`;

const grid = document.getElementById("grid");
grid.innerHTML = photos.map((p, i) => `
  <button class="tile ${p.size}" data-style="${p.style}" data-i="${i}" aria-label="Ampliar ${p.band}">
    <span class="art" style="background-image:${art(p)}"></span>
    <span class="label"><span class="band">${p.band}</span><span class="meta">${p.info}</span></span>
  </button>`).join("");

// Filtros
const chips = document.querySelectorAll(".chip");
chips.forEach(chip => chip.addEventListener("click", () => {
  chips.forEach(c => c.classList.remove("is-active"));
  chip.classList.add("is-active");
  const f = chip.dataset.filter;
  document.querySelectorAll(".tile").forEach(t => { t.hidden = f !== "todos" && t.dataset.style !== f; });
}));

// Lightbox
const lb = document.getElementById("lightbox");
const lbArt = document.getElementById("lb-art");
const lbCap = document.getElementById("lb-caption");
let current = 0, lastFocus = null;

function visibleIndexes() {
  return [...document.querySelectorAll(".tile:not([hidden])")].map(t => +t.dataset.i);
}
function show(i) {
  current = i;
  lbArt.style.backgroundImage = art(photos[i]);
  lbCap.textContent = `${photos[i].band} — ${photos[i].info}`;
}
function openLb(i) {
  lastFocus = document.activeElement;
  show(i); lb.hidden = false;
  lb.querySelector(".lb-close").focus();
}
function closeLb() { lb.hidden = true; lastFocus && lastFocus.focus(); }
function step(dir) {
  const list = visibleIndexes();
  show(list[(list.indexOf(current) + dir + list.length) % list.length]);
}

grid.addEventListener("click", e => {
  const tile = e.target.closest(".tile");
  if (tile) openLb(+tile.dataset.i);
});
lb.querySelector(".lb-close").addEventListener("click", closeLb);
lb.querySelector(".lb-prev").addEventListener("click", () => step(-1));
lb.querySelector(".lb-next").addEventListener("click", () => step(1));
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

// Formulário (demonstração: não envia dados a lugar nenhum)
document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault();
  const status = document.getElementById("form-status");
  if (!e.target.checkValidity()) { status.textContent = "Preencha nome, e-mail e mensagem."; return; }
  status.textContent = "Mensagem enviada. Obrigado!";
  e.target.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
