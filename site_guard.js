/* alleen in de site-versie: rechtsklik en de sneltoetsen voor ontwikkelaarstools uitzetten (tekstvelden blijven gewoon werken) */
(() => {
  const isField = el => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
  addEventListener('contextmenu', e => { if (!isField(e.target)) e.preventDefault(); }, { capture: true });
  addEventListener('keydown', e => {
    const k = (e.key || '').toLowerCase(), mod = e.ctrlKey || e.metaKey;
    const devtools = e.key === 'F12'
      || (mod && e.shiftKey && ['i', 'j', 'c', 'k'].includes(k))   // Ctrl+Shift+I/J/C/K (Windows/Linux)
      || (e.metaKey && e.altKey && ['i', 'j', 'c', 'u'].includes(k))   // Cmd+Opt+I/J/C/U (Mac)
      || (mod && ['u', 's'].includes(k) && !e.shiftKey);          // bron bekijken / pagina opslaan
    if (devtools) { e.preventDefault(); e.stopPropagation(); }
  }, { capture: true });
  addEventListener('dragstart', e => e.preventDefault(), { capture: true });
})();
