// ----- UTILIDADES -----
function fmt(x, unit) {
    // Valor por defecto manual
    if (typeof unit === "undefined") unit = "";

    // Validación numérica clásica (sin Number.isFinite en navegadores viejos)
    if (isNaN(x) || !isFinite(x)) return "—";

    var abs = Math.abs(x);

    if (abs >= 1e6) return (x / 1e6).toFixed(3) + " M" + unit;
    if (abs >= 1e3) return (x / 1e3).toFixed(3) + " k" + unit;
    if (abs < 1 && abs >= 1e-3) return (x * 1e3).toFixed(3) + " m" + unit;
    if (abs < 1e-3) return (x * 1e6).toFixed(3) + " u" + unit; // µ → cambiado a u para evitar errores

    return Number(x.toPrecision(12)).toString() + (unit ? " " + unit : "");
}
// -------------------- LEY DE OHM --------------------
document.getElementById('ohm-calc-vi').addEventListener('click', () => {
  const V = parseFloat(document.getElementById('ohm-volt').value);
  const R = parseFloat(document.getElementById('ohm-res').value);
  const outI = document.getElementById('ohm-out-i');
  if (!isFinite(V) || !isFinite(R) || R === 0) { outI.textContent = 'Datos inválidos'; return; }
  outI.textContent = fmt(V / R, 'A');
});

document.getElementById('ohm-calc-vr').addEventListener('click', () => {
  const I = parseFloat(document.getElementById('ohm-current').value);
  const R = parseFloat(document.getElementById('ohm-res').value);
  const outV = document.getElementById('ohm-out-v');
  if (!isFinite(I) || !isFinite(R)) { outV.textContent = 'Datos inválidos'; return; }
  outV.textContent = fmt(I * R, 'V');
});

document.getElementById('ohm-calc-rv').addEventListener('click', () => {
  const V = parseFloat(document.getElementById('ohm-volt').value);
  const I = parseFloat(document.getElementById('ohm-current').value);
  const outR = document.getElementById('ohm-out-r');
  if (!isFinite(V) || !isFinite(I) || I === 0) { outR.textContent = 'Datos inválidos'; return; }
  outR.textContent = fmt(V / I, 'Ω');
});

document.getElementById('ohm-calc-p').addEventListener('click', () => {
  const V = parseFloat(document.getElementById('ohm-volt').value);
  const I = parseFloat(document.getElementById('ohm-current').value);
  const outP = document.getElementById('ohm-out-p');
  if (!isFinite(V) || !isFinite(I)) { outP.textContent = 'Datos inválidos'; return; }
  outP.textContent = fmt(V * I, 'W');
});

// -------------------- CALCULADORA DE COLORES --------------------
function drawResistorFromSelects() {
  const canvas = document.getElementById('col-canvas');
  const parentWidth = canvas.parentElement.offsetWidth;

  // Tamaño base 480x90 → escalamos
  const scale = parentWidth / 480;

  canvas.width = 480 * scale;
  canvas.height = 90 * scale;

  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  // Leer colores como siempre
  const getColor = sel => sel.options[sel.selectedIndex]?.getAttribute('data-color') || 'transparent';

  const c1 = getColor(document.getElementById('col-b1'));
  const c2 = getColor(document.getElementById('col-b2'));
  const c3 = getColor(document.getElementById('col-b3'));
  const c4 = getColor(document.getElementById('col-b4'));
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = '#deb887';
  ctx.fillRect(60, 20, 320, 50);

  ctx.strokeStyle = '#444';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0,45); ctx.lineTo(60,45); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(380,45); ctx.lineTo(460,45); ctx.stroke();

  const bands = [c1,c2,c3,c4];
  const positions = [90, 170, 250, 340];
  for (let i=0;i<4;i++){
    ctx.fillStyle = bands[i];
    ctx.fillRect(positions[i], 20, 20, 50);
  }
}

document.getElementById('col-draw').addEventListener('click', drawResistorFromSelects);

document.getElementById('col-calc').addEventListener('click', () => {
  const b1 = document.getElementById('col-b1').value;
  const b2 = document.getElementById('col-b2').value;
  const mult = document.getElementById('col-b3').value;
  const tol = document.getElementById('col-b4').value;

  const out = document.getElementById('col-result');
  if (b1 === '' || b2 === '' || mult === '') { out.textContent = 'Selecciona las 3 primeras bandas.'; return; }

  const base = parseInt(b1 + b2, 10);
  const value = base * parseFloat(mult);

  let disp;
  if (value >= 1e6) disp = (value/1e6).toFixed(3) + ' MΩ';
  else if (value >= 1e3) disp = (value/1e3).toFixed(3) + ' kΩ';
  else disp = value.toFixed(3) + ' Ω';

  out.textContent = `${disp}  (${tol})`;
  drawResistorFromSelects();
});

drawResistorFromSelects();

// -------------------- ESTRELLA ↔ DELTA --------------------
document.getElementById('sd-d2y').addEventListener('click', () => {

  const Rab = parseFloat(document.getElementById('sd_rab').value);
  const Rbc = parseFloat(document.getElementById('sd_rbc').value);
  const Rac = parseFloat(document.getElementById('sd_rac').value); // ← renombrado

  const outRa = document.getElementById('sd_ra');
  const outRb = document.getElementById('sd_rb');
  const outRc = document.getElementById('sd_rc');

  if (![Rab, Rbc, Rac].every(Number.isFinite)) {
    outRa.textContent = outRb.textContent = outRc.textContent = 'Datos inválidos';
    return;
  }

  const S = Rab + Rbc + Rac;

  // Fórmulas correctas
  const Ra = (Rab * Rac) / S; 
  const Rb = (Rab * Rbc) / S; 
  const Rc = (Rbc * Rac) / S; 

  outRa.textContent = fmt(Ra, 'Ω');
  outRb.textContent = fmt(Rb, 'Ω');
  outRc.textContent = fmt(Rc, 'Ω');
});


// -------------------- Y → Δ --------------------
document.getElementById('sd-y2d').addEventListener('click', () => {

  const Ra = parseFloat(document.getElementById('sd_ra_in').value);
  const Rb = parseFloat(document.getElementById('sd_rb_in').value);
  const Rc = parseFloat(document.getElementById('sd_rc_in').value);

  const outRab = document.getElementById('sd_rab_out');
  const outRbc = document.getElementById('sd_rbc_out');
  const outRac = document.getElementById('sd_rac_out'); // ← renombrado

  if (![Ra,Rb,Rc].every(Number.isFinite)) {
    outRab.textContent = outRbc.textContent = outRac.textContent = 'Datos inválidos';
    return;
  }

  const M = Ra*Rb + Rb*Rc + Rc*Ra;

  outRab.textContent = fmt(M / Rc, 'Ω');
  outRbc.textContent = fmt(M / Ra, 'Ω');
  outRac.textContent = fmt(M / Rb, 'Ω'); // ← AC en lugar de CA
});

