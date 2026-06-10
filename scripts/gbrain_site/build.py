#!/usr/bin/env python3
"""gbrain study site builder.
Emits a multi-page site under public/gbrain/:
  index.html            landing (hero, two paths, lesson grid)
  how-it-works.html     overview of the 8-lesson arc
  lessons/00..07.html   one page per lesson, prev/next nav
  us.html               how WE actually use gbrain (real Model B setup)
Williams-livery shared CSS at assets/site.css.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from lessons import LESSONS

ROOT = "/home/hermesadmin/workspace/sonwork-astro/public/gbrain"
VER = "v0.42.37.0"
READ = "2026-06-10"

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">')


def shell(title, desc, body, css_path, active="", topbar_extra=""):
    links = [("Overview", f"{base(css_path)}how-it-works.html", "works"),
             ("Lessons", f"{base(css_path)}lessons/00.html", "lessons"),
             ("How we use it", f"{base(css_path)}us.html", "us")]
    nav = "".join(
        f'<a href="{href}" class="{"on" if active==key else ""}">{label}</a>'
        for label, href, key in links)
    return f"""<!DOCTYPE html>
<!--
  gbrain study — multi-page site. Williams livery × Lando editorial.
  Ground-truth from ~/gbrain/src @ {VER}, read {READ}. Standalone, routeless.
-->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
{FONTS}
<link rel="stylesheet" href="{css_path}">
</head>
<body>
<div class="wrap">
  <div class="topbar">
    <a class="brand" href="{base(css_path)}index.html">GBRAIN<b>.</b> STUDY</a>
    <span class="links">{nav}</span>
  </div>
{body}
</div>
<a href="#" class="totop" id="totop" aria-label="Back to top">↑</a>
<script>
(function(){{
  var sel='h2, h3, p, table, pre, .card, .model, .recap, .foot, .path, .lcard, .pnav';
  var wrap=document.querySelector('.wrap');
  var nodes=Array.prototype.slice.call(wrap.querySelectorAll(sel));
  nodes.forEach(function(n){{ if(n.classList.contains('lede')||n.classList.contains('eyebrow'))return; n.classList.add('reveal'); }});
  if(!('IntersectionObserver' in window)){{ nodes.forEach(function(n){{n.classList.add('in');}}); }}
  else{{ var io=new IntersectionObserver(function(es){{es.forEach(function(e){{if(e.isIntersecting){{e.target.classList.add('in');io.unobserve(e.target);}}}});}},{{threshold:0.08,rootMargin:'0px 0px -6% 0px'}}); nodes.forEach(function(n){{io.observe(n);}}); }}
  var btn=document.getElementById('totop');
  window.addEventListener('scroll',function(){{if(window.scrollY>700){{btn.classList.add('show');}}else{{btn.classList.remove('show');}}}},{{passive:true}});
}})();
</script>
</body>
</html>"""


def base(css_path):
    """Relative prefix back to /gbrain/ root, derived from the css path depth."""
    return "../" if css_path.startswith("../") else ""


def recap(items):
    lis = "".join(f"<li>{x}</li>" for x in items)
    return f'<div class="recap"><div class="label">Remember</div><ul>{lis}</ul></div>'


# ── landing ──────────────────────────────────────────────────────────────
def build_landing():
    cards = ""
    for L in LESSONS:
        cards += (f'<a class="lcard" href="lessons/{L["n"]}.html">'
                  f'<span class="ln">{L["n"]} · {L["kicker"]}</span>'
                  f'<span class="lt">{L["nav"]}</span>'
                  f'<span class="ld">{strip(L["model"])[:96]}…</span></a>')
    body = f"""
  <div class="eyebrow">A Study · Source-Grounded · {VER}</div>
  <h1><span class="w1">Inside</span><span class="l2">gbrain</span></h1>
  <p class="lede">Two questions, answered properly. <b>How gbrain actually works</b> — traced through the source, not the brochure. And <b>how we actually use it</b> — Son's real brain: one shared graph, isolated coding sources, {STATS}. Pick a path.</p>

  <div class="paths">
    <a class="path" href="how-it-works.html">
      <span class="pn">Path 01</span>
      <h3>How it<br>works</h3>
      <p>The engine from first principles. Schema, retrieval, the write path, embeddings, the overnight dream cycle, multi-tenant isolation, and the belief layer — eight lessons, each grounded in <code>~/gbrain/src</code>.</p>
      <span class="go">Read the lessons</span>
    </a>
    <a class="path" href="us.html">
      <span class="pn">Path 02</span>
      <h3>How we<br>use it</h3>
      <p>Son's actual setup. The <b>Model B</b> shared brain, the folder convention, the walled-off coding sources, the write-through workflow, and what the dream cycle does for us every night — with the real numbers.</p>
      <span class="go">See our brain</span>
    </a>
  </div>

  <div class="lesson"><span class="lnum">The eight lessons</span>
  <h2>The whole <span class="ac">arc</span></h2>
  <p>Read top to bottom and the machine assembles itself — storage first, then how you get data back out, then how it goes in, all the way to a brain that grades its own beliefs.</p></div>
  <div class="lgrid">{cards}</div>

  <div class="foot">
    <p class="big">A folder of markdown<br>that grades its own beliefs.</p>
    <p>Every claim on this site was traced through <b>~/gbrain/src</b> at <b>{VER}</b>, read {READ}. Not the brochure — the machine.</p>
  </div>
"""
    write("index.html", shell(
        "Inside gbrain — A Study",
        "How gbrain actually works, and how we actually use it. Source-grounded study site.",
        body, "assets/site.css", active=""))


# ── how-it-works overview ────────────────────────────────────────────────
def build_overview():
    rows = ""
    for L in LESSONS:
        rows += (f'<a class="lcard" href="lessons/{L["n"]}.html">'
                 f'<span class="ln">{L["n"]} · {L["kicker"]}</span>'
                 f'<span class="lt">{L["nav"]}</span>'
                 f'<span class="ld">{strip(L["model"])[:104]}…</span></a>')
    body = f"""
  <div class="eyebrow">Path 01 · The Engine</div>
  <h1><span class="w1">How it</span><span class="l2">works</span></h1>
  <p class="lede">gbrain turns a git-tracked folder of markdown into a <b>Postgres-backed, vector-searchable, self-maintaining knowledge graph</b>. Eight lessons take it apart — read in order, each one slots into the last.</p>

  <div class="lesson"><span class="lnum">Start here</span>
  <h2>The <span class="ac">syllabus</span></h2>
  <p>Begin with Lesson 00 for the whole-machine map, then walk 01 → 07. Or jump straight to whatever you need.</p></div>
  <div class="lgrid">{rows}</div>

  <div class="pnav">
    <a class="disabled"><span class="dir">← Back</span><span class="ttl">—</span></a>
    <a class="next" href="lessons/00.html"><span class="dir">Start →</span><span class="ttl">00 · The Machine</span></a>
  </div>
"""
    write("how-it-works.html", shell(
        "How gbrain works — Overview",
        "The eight-lesson syllabus: schema, retrieval, write path, embeddings, dream cycle, sources, belief layer.",
        body, "assets/site.css", active="works"))


# ── lesson pages ─────────────────────────────────────────────────────────
def build_lessons():
    n = len(LESSONS)
    for i, L in enumerate(LESSONS):
        dots = "".join(f'<span class="{"on" if j==i else ""}"></span>' for j in range(n))
        prev_a = ('<a class="disabled"><span class="dir">← Back</span><span class="ttl">Overview</span></a>'
                  if i == 0 else
                  f'<a href="{LESSONS[i-1]["n"]}.html"><span class="dir">← Lesson {LESSONS[i-1]["n"]}</span><span class="ttl">{LESSONS[i-1]["nav"]}</span></a>')
        if i < n - 1:
            next_a = f'<a class="next" href="{LESSONS[i+1]["n"]}.html"><span class="dir">Lesson {LESSONS[i+1]["n"]} →</span><span class="ttl">{LESSONS[i+1]["nav"]}</span></a>'
        else:
            next_a = '<a class="next" href="../us.html"><span class="dir">Next path →</span><span class="ttl">How we use it</span></a>'
        body = f"""
  <div class="progress">{dots}</div>
  <div class="eyebrow">Lesson {L['n']} — {L['kicker']}</div>
  <h1><span class="w1">{L['nav'].split()[0]}</span></h1>
  <section class="lesson" style="padding-top:1.2em;margin-top:1.2em">
    <h2>{L['title']}</h2>
    <div class="model"><div class="label">Mental model</div><p>{L['model']}</p></div>
    {L['body']}
    {recap(L['recap'])}
  </section>
  <div class="pnav">{prev_a}{next_a}</div>
"""
        write(f"lessons/{L['n']}.html", shell(
            f"gbrain · Lesson {L['n']} — {L['nav']}",
            strip(L['model'])[:150],
            body, "../assets/site.css", active="lessons"))


# ── how WE use it ────────────────────────────────────────────────────────
def build_us():
    body = US_BODY
    write("us.html", shell(
        "How we use gbrain — Son's real setup",
        "Son's actual gbrain: Model B shared brain, isolated coding sources, the daily workflow, real numbers.",
        body, "assets/site.css", active="us"))


def strip(html):
    import re
    return re.sub("<[^>]+>", "", html)


def write(rel, content):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)
    print(f"  wrote {rel} ({len(content):,} bytes)")


# real numbers (verified 2026-06-10 via `gbrain stats` / `gbrain sources list`)
STATS = "2,107 pages across 19 sources"
US_BODY = ""  # filled by us_content.py import below

if __name__ == "__main__":
    from us_content import US_BODY as _UB
    US_BODY = _UB
    print("Building gbrain study site…")
    build_landing()
    build_overview()
    build_lessons()
    build_us()
    print("Done.")
