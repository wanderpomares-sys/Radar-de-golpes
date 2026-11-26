// Intermediário (Cloudflare Worker) entre o Radar e o Google Web Risk.
// Motivo: a chave do Google fica escondida aqui, e o Worker limita quem pode usar.
// Variáveis a criar no Cloudflare: WEBRISK_KEY (segredo) e ALLOWED_ORIGIN (ex.: https://wanderpomares-sys.github.io)
const THREATS = ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'];

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': origin === env.ALLOWED_ORIGIN ? origin : 'null',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Vary': 'Origin',
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (origin !== env.ALLOWED_ORIGIN) return new Response('{"error":"origem"}', { status: 403, headers: cors });

    const raw = new URL(req.url).searchParams.get('u') || '';
    let u;
    try { u = new URL(raw); } catch (e) { return new Response('{"error":"url"}', { status: 400, headers: cors }); }
    if (!/^https?:$/.test(u.protocol) || raw.length > 1000) return new Response('{"error":"url"}', { status: 400, headers: cors });

    // guarda a resposta por 1 hora, para poupar chamadas pagas
    const cache = caches.default;
    const ck = new Request('https://cache.local/' + encodeURIComponent(u.origin + u.pathname));
    let hit = await cache.match(ck);
    if (hit) return new Response(hit.body, { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } });

    const api = new URL('https://webrisk.googleapis.com/v1/uris:search');
    THREATS.forEach(t => api.searchParams.append('threatTypes', t));
    api.searchParams.set('uri', u.origin + u.pathname);
    api.searchParams.set('key', env.WEBRISK_KEY);
    const r = await fetch(api.toString());
    if (!r.ok) return new Response('{"error":"google"}', { status: 502, headers: cors });
    const j = await r.json();
    const body = JSON.stringify({ threats: (j.threat && j.threat.threatTypes) || [] }); // não guarda nem devolve o endereço
    const res = new Response(body, { headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'max-age=3600' } });
    await cache.put(ck, new Response(body, { headers: { 'Cache-Control': 'max-age=3600' } }));
    return res;
  },
};
