type Tab = { id: number; title: string; content: string };

/**
 * Builds a complete, standalone HTML document that will open in any browser.
 * - Inline CSS only (no classes, no <style> tags)
 * - Escapes user-provided titles/contents
 * - Max 15 tabs
 */
export function generateInlineHTML(input: Tab[]): string {
  const tabs: Tab[] = (Array.isArray(input) && input.length ? input : [{ id: 1, title: "Tab 1", content: "" }]).slice(0, 15);

  const escapeHtml = (s: string): string =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const buttons: string = tabs
    .map(
      (t, i) =>
        `<button onclick="showTab(${i})" style="padding:8px 12px;border:1px solid #aaa;border-radius:8px;margin-right:8px;cursor:pointer;background:#f5f5f5;">${escapeHtml(
          t.title || `Tab ${i + 1}`
        )}</button>`
    )
    .join("");

  const panels: string = tabs
    .map(
      (t, i) =>
        `<div id="tab-content-${i}" style="display:${i === 0 ? "block" : "none"};padding:12px;border:1px solid #ddd;border-radius:12px;margin-top:8px;white-space:pre-wrap;">${escapeHtml(
          t.content || ""
        )}</div>`
    )
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Exported Tabs</title>
  </head>
  <body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;padding:16px;margin:0;">
    <h1 style="margin-top:0;">Tabs</h1>
    <div id="btns" style="margin-bottom:8px;">${buttons}</div>
    ${panels}
    <script>
      function highlight(index){
        var btns=document.querySelectorAll('#btns > button');
        for(var i=0;i<btns.length;i++){
          btns[i].style.background = (i===index) ? '#dbeafe' : '#f5f5f5';
        }
      }
      function showTab(index){
        var len=${tabs.length};
        for(var i=0;i<len;i++){
          var el=document.getElementById('tab-content-'+i);
          el.style.display = (i===index) ? 'block' : 'none';
        }
        highlight(index);
      }
      highlight(0);
    </script>
  </body>
</html>`;
}
