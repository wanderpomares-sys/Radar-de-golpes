# Radar de Golpes

Página leve (PWA) para checar mensagem, link, telefone, Pix ou CNPJ suspeito.

## O que faz hoje
- Detecta sinais de golpe: link encurtado, finais de endereço comuns em golpes, marca imitada, urgência, pedido de Pix ou senha.
- Guarda só um código (hash) da chave. O texto não sai do aparelho.
- Denúncia "Foi golpe / Não foi golpe" e contagem **apenas local**.
- Gera um cartão de alerta para mandar no WhatsApp.

## O que falta (dados coletivos)
Contagem entre todos os usuários exige um servidor (ex.: Supabase ou Firebase) com: uma denúncia por aparelho e chave, revisão manual de chaves muito denunciadas e política de privacidade (LGPD).

## Rodar
Abra `index.html` ou publique a pasta no GitHub Pages.
