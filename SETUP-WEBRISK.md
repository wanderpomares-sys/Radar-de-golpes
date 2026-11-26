# Ligar a consulta de sites perigosos (Google Web Risk)

Hoje o Radar só analisa o formato do endereço. Com isto ligado, ele também pergunta ao Google se o site está em lista de ameaças (golpe, vírus). Se o Google listar, o resultado vira "Parece golpe".

**Custo:** as primeiras 100.000 consultas por mês são grátis. Depois, US$ 0,50 a cada 1.000 (preço do Google, confira em cloud.google.com/web-risk/pricing). Use o Web Risk, não a API "Safe Browsing" comum: ela é só para uso sem fins comerciais, e o Radar tem anúncios.

## Passo a passo (uns 20 minutos)
1. **Google Cloud:** crie um projeto em console.cloud.google.com, ative a **Web Risk API** e crie uma **chave de API**. Restrinja a chave só à Web Risk API. Em "Cotas", coloque um limite diário (por exemplo, 3.000 consultas) para um abuso não gerar conta alta. Ative cobrança (exigida mesmo para o uso grátis) e crie um alerta de orçamento.
2. **Cloudflare:** crie conta gratuita. Na pasta `worker/` rode:
   - `npx wrangler login`
   - `npx wrangler secret put WEBRISK_KEY` (cole a chave)
   - `npx wrangler deploy`
   Anote o endereço gerado, algo como `https://radar-webrisk.SEU-USUARIO.workers.dev`.
3. **No app:** em `index.html`, troque `const CHECK_ENDPOINT='';` por `const CHECK_ENDPOINT='https://radar-webrisk.SEU-USUARIO.workers.dev';` e envie para o GitHub.
4. **Teste:** cole `https://testsafebrowsing.appspot.com/s/malware.html` (página de teste do Google). O Radar deve responder "Parece golpe" citando o Google.

## Privacidade
- O app envia só `domínio + caminho` do link (sem `?parâmetros` e sem `#`). Nunca envia texto de mensagem, prints, nomes ou números.
- O Worker não guarda o endereço, só uma cópia temporária da resposta por 1 hora.
- Os Termos já mencionam essa consulta, que só se aplica quando `CHECK_ENDPOINT` estiver preenchido.
- Se a consulta falhar ou demorar mais de 4 segundos, o Radar segue sem ela.

## Limites
O Google não lista todo golpe, principalmente os recém-criados. "Nada listado" não é aval: o Radar continua dizendo "Não consigo garantir este site" para endereços que ele não conhece.
