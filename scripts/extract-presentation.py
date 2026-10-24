"""Extract the supplied presentation without executing any of its content.

Usage: python scripts/extract-presentation.py "path/to/source.pptx"
Writes ordered slide metadata and small, lossless-to-read WebP references.
Original images stay in the ignored local cache for OCR and comparison.
"""

import argparse
import hashlib
import json
import posixpath
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZipFile

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def relationships(archive, part):
    rel_path = posixpath.join(posixpath.dirname(part), "_rels", posixpath.basename(part) + ".rels")
    if rel_path not in archive.namelist():
        return {}
    return {
        rel.attrib["Id"]: posixpath.normpath(posixpath.join(posixpath.dirname(part), rel.attrib["Target"]))
        for rel in ET.fromstring(archive.read(rel_path))
        if rel.attrib.get("TargetMode") != "External"
    }


def paragraphs(root):
    return [
        text
        for p in root.findall(".//a:p", NS)
        if (text := "".join(t.text or "" for t in p.findall(".//a:t", NS)).strip())
    ]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    args = parser.parse_args()
    original_dir = ROOT / ".cache/nls-source"
    web_dir = ROOT / "public/content/nls/slides"
    docs_dir = ROOT / "docs/nls"
    for directory in (original_dir, web_dir, docs_dir):
        directory.mkdir(parents=True, exist_ok=True)
    slides = []
    extracted = {}
    with ZipFile(args.source) as archive:
        presentation = ET.fromstring(archive.read("ppt/presentation.xml"))
        rels = relationships(archive, "ppt/presentation.xml")
        for index, slide_id in enumerate(presentation.findall("p:sldIdLst/p:sldId", NS), 1):
            part = rels[slide_id.attrib[f"{{{NS['r']}}}id"]]
            root = ET.fromstring(archive.read(part))
            slide_rels = relationships(archive, part)
            images = []
            for blip in root.findall(".//a:blip", NS):
                target = slide_rels.get(blip.attrib.get(f"{{{NS['r']}}}embed"))
                if not target or not target.startswith("ppt/media/"):
                    continue
                if target not in extracted:
                    original = original_dir / posixpath.basename(target)
                    original.write_bytes(archive.read(target))
                    web_name = f"{index:03d}-{len(images) + 1}.webp"
                    with Image.open(original) as image:
                        width, height = image.size
                        image.thumbnail((1600, 1600))
                        image.convert("RGB").save(web_dir / web_name, "WEBP", quality=85, method=6)
                    extracted[target] = {"original": str(original.relative_to(ROOT)).replace("\\", "/"), "web": f"/content/nls/slides/{web_name}", "width": width, "height": height}
                images.append(extracted[target])
            notes = []
            for target in slide_rels.values():
                if target.startswith("ppt/notesSlides/") and target.endswith(".xml"):
                    notes = paragraphs(ET.fromstring(archive.read(target)))
            slides.append({"slide": index, "text": paragraphs(root), "notes": notes, "images": images, "hidden": root.attrib.get("show") == "0"})
    manifest = {"source": args.source.name, "sha256": hashlib.file_digest(args.source.open("rb"), "sha256").hexdigest(), "slideCount": len(slides), "slides": slides}
    (docs_dir / "slides-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"slides": len(slides), "uniqueImages": len(extracted), "imageSlides": sum(bool(s["images"]) for s in slides), "nativeTextSlides": sum(bool(s["text"]) for s in slides), "manifest": str(docs_dir / "slides-manifest.json")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
