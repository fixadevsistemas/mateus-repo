# Mateus Oliveira — Landing page

Site institucional/portfólio de serviços (Analista de TI & Desenvolvedor Full-Stack).
100% estático: **HTML + CSS + JavaScript puro, sem build, sem dependências**.

🔗 **Produção:** https://mateusoliveira.fixadev.com.br/

---

## 📁 Estrutura

```
mateus-oliveira-portfolio/
├── index.html          # Página (uma só)
├── style.css           # Estilos
├── script.js           # Interações (partículas, quebra-cabeça, reveal robótico…)
├── assets/             # ⬆️ SUBIR no deploy (~300 KB)
│   ├── fotoperfil.webp        # Foto do hero (49 KB)
│   ├── fotoperfil_robo.webp   # Versão IA revelada no hover (156 KB)
│   ├── og-image.jpg           # Imagem de compartilhamento (1200×630)
│   └── favicon.svg            # Ícone da aba
├── _originals/         # 🚫 NÃO SUBIR — backup dos PNGs originais (~11 MB)
├── tools/
│   └── optimize-images.py     # Reprocessa as imagens (ver "Manutenção")
└── README.md
```

> ⚠️ **Deploy:** suba a **raiz** do projeto, mas **exclua a pasta `_originals/`** (é só backup pesado).

---

## ▶️ Rodar localmente

Como é estático, basta abrir o `index.html` no navegador.
Para testar como servidor (recomendado, evita bloqueios de `file://`):

```bash
# Python
python -m http.server 8000
# depois abra http://localhost:8000
```

---

## 🚀 Deploy

O site não tem etapa de build. Em qualquer host, configure:

- **Build command:** *(vazio)*
- **Publish / output directory:** `.` (a raiz)

### Opção recomendada — GitHub + deploy contínuo
1. Crie um repositório no GitHub e envie o projeto (sem `_originals/` — veja `.gitignore`).
2. No host (Netlify / Cloudflare Pages / Vercel), conecte o repositório.
3. Build command vazio, publish directory = raiz.
4. Aponte o domínio `mateusoliveira.fixadev.com.br` (CNAME no DNS).

**A partir daí, publicar uma alteração é só:**
```bash
git add .
git commit -m "descrição da mudança"
git push
```
O host detecta o push e republica automaticamente.

### Custo / "créditos"
Site estático **não consome build minutes** (não há build). O limite prático do plano grátis é **banda**, gasta por visitantes (a ~240 KB/acesso, ~400 mil visitas/mês no grátis do Netlify). **Cloudflare Pages** tem banda **ilimitada** no grátis, se preferir zero preocupação.

---

## 🛠️ Manutenção

### Trocar a foto
1. Coloque a nova foto (e a versão robótica) em `_originals/` como `fotoperfil.png` e `fotoperfil_robo.png`.
2. Rode o otimizador (gera os `.webp` e a `og-image.jpg`):
   ```bash
   python tools/optimize-images.py
   ```
3. Pronto — o `index.html` já aponta para os `.webp`.

> Precisa de Python com Pillow: `pip install pillow`

### Editar textos
Tudo fica no `index.html`, em blocos comentados por seção
(`HERO`, `SOBRE`, `PARA QUEM É`, `SERVIÇOS`, `CONTATO`).

- **Número de projetos entregues:** procure `data-count="23"` (seção de stats).
- **Contatos:** e-mail/telefone/WhatsApp estão na seção `CONTATO` e no link do WhatsApp (`wa.me/5584981621255`).

### Ajustar as animações (`script.js`)
- **Quebra-cabeça de entrada:** função `puzzleIntro` — `COLS`/`ROWS` (nº de peças, espelhar na grade `.puzzle` do CSS), o `3000` (duração) e o espalhamento (`85`, `55`).
- **Lanterna robótica:** a forma (blob) está na regra `.portrait__robo` do CSS (gradientes radiais); o tamanho/raios e offsets controlam o formato.

### Paleta de cores
Centralizada no `:root` do `style.css` (`--accent`, `--bg`, `--cream`…).

---

## ♿ Acessibilidade & Performance
- Respeita `prefers-reduced-motion` (desliga animações pesadas).
- Imagens otimizadas em WebP; a versão robótica carrega de forma **diferida**.
- Meta tags de compartilhamento (Open Graph / Twitter) com URL absoluta.

Após o deploy, valide o card de link em:
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) · [Meta Sharing Debugger](https://developers.facebook.com/tools/debug/)
