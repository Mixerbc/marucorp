"""Optimiza las fotos de marucorpimg/ a img/maru/ (JPG + WebP)."""
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "marucorpimg"
OUT = ROOT / "img" / "maru"

NAMES = {
    "FOTO (1).png": "presentacion",
    "FOTO (2).png": "sala-juntas",
    "FOTO (3).png": "asesoria",
    "FOTO (4).png": "recepcion",
    "FOTO (5).png": "edificio",
    "FOTO (6).png": "revision-documentos",
    "FOTO (7).png": "equipo-junta",
    "FOTO (8).png": "analisis-escritorio",
}

MAX_W = 1600


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for src_name, slug in NAMES.items():
        img = ImageOps.exif_transpose(Image.open(SRC / src_name)).convert("RGB")
        if img.width > MAX_W:
            img = img.resize((MAX_W, round(img.height * MAX_W / img.width)), Image.LANCZOS)
        img.save(OUT / f"{slug}.jpg", "JPEG", quality=80, optimize=True, progressive=True)
        img.save(OUT / f"{slug}.webp", "WEBP", quality=78, method=6)
        jpg_kb = (OUT / f"{slug}.jpg").stat().st_size // 1024
        webp_kb = (OUT / f"{slug}.webp").stat().st_size // 1024
        print(f"{slug}: {img.width}x{img.height}  jpg {jpg_kb} KB  webp {webp_kb} KB")


if __name__ == "__main__":
    main()
