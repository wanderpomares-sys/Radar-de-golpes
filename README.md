# Radar de Golpes

Página leve (PWA) para checar mensagem, link, telefone, Pix ou CNPJ suspeito.

## O que faz hoje
- Detecta sinais de golpe: link encurtado, finais de endereço comuns em golpes, marca imitada, urgência, pedido de Pix ou senha.
- Guarda só um código (hash) da chave. O texto não sai do aparelho.
- Denúncia "Foi golpe / Não foi golpe" e contagem **apenas local**.
- Gera um cartão de alerta para mandar no WhatsApp.
- Assinatura R$ 2,99/mês (modo teste, sem cobrança real): ilimitado e sem vídeos. Integrar Google Play Billing e validar no servidor.
- Créditos: 1 verificação = 1 crédito. Começa com 5, ganha +3 por semana, +3 por vídeo (máx. 2 por sessão) e +1 ao denunciar. O vídeo é simulado (modo teste); trocar `showRewardedAd()` por AdMob ao empacotar como app Android.

## O que falta (dados coletivos)
Contagem entre todos os usuários exige um servidor (ex.: Supabase ou Firebase) com: uma denúncia por aparelho e chave, revisão manual de chaves muito denunciadas e política de privacidade (LGPD).

## Rodar
Abra `index.html` ou publique a pasta no GitHub Pages.
