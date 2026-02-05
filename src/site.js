require('./common')
require('./images/logo.png')
require('./images/radar_legend.png')
require('./analytics.js')

const Factory = require('./util/factory')

Factory().build()

// --- Status-Filter (DOM-Filter) ---

(function initStatusFilter() {
  // Sicherstellen, dass die Buttons existieren
  const btns = document.querySelectorAll('.status-filter__btn');
  if (!btns || !btns.length) return;

  let current = 'all';

  // Helper: aktiven Button visuell markieren
  function setActive(key) {
    btns.forEach(b => b.classList.toggle('is-active', b.dataset.key === key));
  }

  // Blips nach Status aus-/einblenden
  function applyFilter(key) {
    // Viele Builds nutzen <g class="blip"> für den Blip-Container.
    // Falls bei dir <a class="blip"> oder <circle class="blip"> genutzt wird:
    // Selektor hier anpassen (z. B. 'g.blip, a.blip, circle.blip').
    const sel = d3.selectAll('.blip');

    sel.style('display', function() {
      // D3 bindet die Daten am DOM-Node -> this.__data__
      const d = this.__data__ || {};
      // Je nach Modell ist status eine Eigenschaft oder via getter zugreifbar:
      const raw = (typeof d.status === 'function') ? d.status() :
                  (d.status ?? d.data?.status ?? '');
      const st = String(raw).toLowerCase();

      if (key === 'all') return null;           // Standard: sichtbar
      return (st === key) ? null : 'none';      // andere ausblenden
    });
  }

  // Event-Handler für Klicks
  btns.forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.key; // 'all' | 'new' | 'moved in' | 'moved out' | 'no change'
      current = key;
      setActive(current);
      applyFilter(current);
    });
  });

  // Initialzustand
  setActive(current);
})();
