"""
Reprocessa as imagens do site: gera os .webp otimizados e a og-image.jpg.

Uso (na raiz do projeto):
    pip install pillow
    python tools/optimize-images.py

Fontes esperadas em _originals/:
    fotoperfil.png       (foto do hero)
    fotoperfil_robo.png  (versão robótica/IA)

Saída em assets/:
    fotoperfil.webp, fotoperfil_robo.webp, og-image.jpg
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_originals")
ASSETS = os.path.join(ROOT, "public", "assets")
BASE = os.path.join(SRC, "fotoperfil.png")
ROBO = os.path.join(SRC, "fotoperfil_robo.png")


def to_webp(src, dst, max_w, quality):
    im = Image.open(src).convert("RGB")
    if im.width > max_w:
        h = round(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    im.save(dst, "WEBP", quality=quality, method=6)
    print(f"  {os.path.basename(dst)}: {os.path.getsize(dst)/1024:.0f} KB  ({im.width}x{im.height})")


def load_font(names, size):
    for n in names:
        p = os.path.join(r"C:\Windows\Fonts", n)
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


def build_og():
    BG, CREAM, DIM, VIOLET = (9, 7, 15), (236, 233, 245), (150, 146, 170), (139, 108, 255)
    W, H = 1200, 630
    og = Image.new("RGB", (W, H), BG)

    glow = Image.new("RGB", (W, H), BG)
    ImageDraw.Draw(glow).ellipse([-200, -260, 520, 360], fill=(30, 22, 60))
    og = Image.blend(og, glow.filter(ImageFilter.GaussianBlur(120)), 0.9)

    photo = Image.open(BASE).convert("RGB")
    panel_w = 470
    scale = max(panel_w / photo.width, H / photo.height)
    photo = photo.resize((int(photo.width * scale), int(photo.height * scale)), Image.LANCZOS)
    top = max(0, (photo.height - H) // 2)
    photo = photo.crop((0, top, panel_w, top + H))
    px = W - panel_w
    og.paste(photo, (px, 0))

    grad = Image.new("L", (180, H), 0)
    for x in range(180):
        grad.paste(int(255 * (1 - x / 180)), (x, 0, x + 1, H))
    og.paste(Image.new("RGB", (180, H), BG), (px, 0), grad)

    d = ImageDraw.Draw(og)
    X = 72
    d.text((X, 118), "TECNOLOGIA · DESENVOLVIMENTO · AUTOMAÇÃO", font=load_font(["seguisb.ttf", "segoeui.ttf"], 22), fill=VIOLET)
    d.text((X, 165), "Mateus Oliveira", font=load_font(["segoeuib.ttf", "arialbd.ttf"], 74), fill=CREAM)
    d.text((X, 268), "Analista de TI & Desenvolvedor Full-Stack", font=load_font(["segoeui.ttf", "arial.ttf"], 33), fill=CREAM)
    d.text((X, 330), "Sites · Landing Pages · Dashboards · Automação · Chatbots", font=load_font(["seguisb.ttf", "segoeui.ttf"], 27), fill=VIOLET)
    d.text((X, 470), "Natal/RN · Atendimento remoto, Brasil e exterior", font=load_font(["segoeui.ttf", "arial.ttf"], 22), fill=DIM)
    d.rectangle([X, 150, X + 46, 156], fill=VIOLET)

    dst = os.path.join(ASSETS, "og-image.jpg")
    og.save(dst, "JPEG", quality=88)
    print(f"  og-image.jpg: {os.path.getsize(dst)/1024:.0f} KB")


if __name__ == "__main__":
    print("Otimizando imagens...")
    to_webp(BASE, os.path.join(ASSETS, "fotoperfil.webp"), 900, 82)
    to_webp(ROBO, os.path.join(ASSETS, "fotoperfil_robo.webp"), 900, 80)
    build_og()
    print("Concluído.")
