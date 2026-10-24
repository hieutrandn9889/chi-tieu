"""Build the Markdown transcription and website search index from cached OCR.

The original slide order, native text, blank slides and OCR are retained.
Editorial titles are navigation aids, never replacements for source text.
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
TITLES = {
    1: "Chạm đến tinh hoa cuộc sống", 2: "Nội dung học: hiểu đúng để luận chuẩn",
    3: "Thu thập thông tin khách hàng", 4: "Cấu trúc CCCD", 5: "Nguyên tắc khi luận NLS",
    6: "Sinh Khí: đặc điểm và từ khóa", 7: "Sinh Khí: tài vận, sự nghiệp và tình cảm",
    8: "Phục Vị: đặc điểm và từ khóa", 9: "Phục Vị: tài vận, sự nghiệp và tình cảm",
    10: "Thiên Y: đặc điểm và nguyên tắc xem kết cấu", 11: "Thiên Y: tình cảm và quan hệ",
    12: "Thiên Y: tài vận và sự nghiệp", 13: "Diên Niên: đặc điểm và từ khóa",
    14: "Diên Niên: tài vận, sự nghiệp và tình cảm", 15: "Lục Sát: đặc điểm và từ khóa",
    16: "Lục Sát: tài vận, sự nghiệp và tình cảm", 17: "Họa Hại: đặc điểm và từ khóa",
    18: "Họa Hại: tài vận, sự nghiệp và tình cảm", 19: "Tuyệt Mệnh: đặc điểm và từ khóa",
    20: "Tuyệt Mệnh: tài vận, sự nghiệp và tình cảm", 21: "Ngũ Quỷ: đặc điểm và từ khóa",
    22: "Ngũ Quỷ: tình cảm và sức khỏe", 23: "Ngũ Quỷ: công việc và tài chính",
    24: "Ngũ Quỷ: học tập và huyền học", 25: "Mối liên kết các từ trường NLS",
    26: "Số 0 và tính chất đặc biệt", 27: "Số 5 và đặc tính", 28: "Lưu ý về số 0 và số 5",
    29: "Sinh Khí kết hợp số 0", 30: "Lục Sát kết hợp số 0", 31: "Diên Niên kết hợp số 0",
    32: "Ngũ Quỷ kết hợp số 0", 33: "Họa Hại kết hợp số 0", 34: "Tuyệt Mệnh kết hợp số 0",
    35: "Thiên Y kết hợp số 0", 36: "Quy trình luận số", 37: "Câu hỏi khai thác thông tin",
    38: "Câu hỏi đối chiếu theo kết hợp từ trường", 39: "Cách kết hợp số", 40: "Cách kết hợp số (lặp lại)",
    41: "Nguyên tắc thiết kế kết cấu số", 42: "Quan điểm ứng dụng số trong tài liệu",
    43: "Lợi ích học tập theo tài liệu", 44: "Công cụ kết nối và thấu hiểu khách hàng",
    45: "Lý do học theo tài liệu", 46: "Lưu ý khi xem và lựa chọn SIM", 48: "Bảng liên kết các từ trường (nhắc lại)",
    49: "Sơ đồ chuyển hóa Thiên Y", 50: "Thiên Y + Thiên Y", 51: "Thiên Y + Thiên Y (tiếp)",
    52: "Thiên Y + Sinh Khí", 53: "Thiên Y + Sinh Khí (tiếp)", 54: "Thiên Y + Diên Niên",
    55: "Thiên Y + Phục Vị", 56: "Thiên Y + Họa Hại", 57: "Thiên Y + Họa Hại (tiếp)",
    58: "Thiên Y + Lục Sát", 59: "Thiên Y + Tuyệt Mệnh", 60: "Thiên Y + Tuyệt Mệnh (tiếp)",
    61: "Thiên Y + Ngũ Quỷ", 62: "Sơ đồ chuyển hóa Lục Sát", 63: "Lục Sát + Sinh Khí",
    64: "Lục Sát + Sinh Khí (tiếp)", 65: "Lục Sát + Thiên Y", 66: "Lục Sát + Thiên Y (tiếp)",
    67: "Lục Sát + Diên Niên", 68: "Lục Sát + Diên Niên (tiếp)", 69: "Lục Sát + Phục Vị",
    70: "Lục Sát + Phục Vị (tiếp)", 71: "Lục Sát + Họa Hại", 72: "Lục Sát + Họa Hại (tiếp)",
    73: "Lục Sát + Lục Sát", 74: "Lục Sát + Tuyệt Mệnh", 75: "Lục Sát + Tuyệt Mệnh (tiếp)",
    76: "Lục Sát + Ngũ Quỷ", 77: "Lục Sát + Ngũ Quỷ (tiếp)", 78: "Sơ đồ chuyển hóa Tuyệt Mệnh",
    79: "Tuyệt Mệnh + Thiên Y", 80: "Tuyệt Mệnh + Thiên Y (tiếp)", 81: "Tuyệt Mệnh + Diên Niên",
    82: "Tuyệt Mệnh + Sinh Khí", 83: "Tuyệt Mệnh + Phục Vị", 84: "Tuyệt Mệnh + Họa Hại",
    85: "Tuyệt Mệnh + Ngũ Quỷ", 86: "Tuyệt Mệnh + Tuyệt Mệnh", 87: "Tuyệt Mệnh + Lục Sát",
    88: "Sơ đồ chuyển hóa Diên Niên", 89: "Diên Niên + Sinh Khí", 90: "Diên Niên + Thiên Y",
    91: "Diên Niên + Diên Niên", 92: "Diên Niên + Phục Vị", 93: "Diên Niên + Họa Hại",
    94: "Diên Niên + Họa Hại (tiếp)", 95: "Diên Niên + Lục Sát", 96: "Diên Niên + Tuyệt Mệnh",
    97: "Diên Niên + Ngũ Quỷ", 98: "Sơ đồ chuyển hóa Họa Hại", 99: "Họa Hại + Thiên Y",
    100: "Họa Hại + Thiên Y (tiếp)", 101: "Họa Hại + Sinh Khí", 102: "Họa Hại + Sinh Khí (tiếp)",
    103: "Họa Hại + Diên Niên", 104: "Họa Hại + Diên Niên (tiếp)", 105: "Họa Hại + Diên Niên (tiếp)",
    106: "Họa Hại + Phục Vị", 107: "Họa Hại + Phục Vị (tiếp)", 108: "Họa Hại + Phục Vị (tiếp)",
    109: "Họa Hại + Họa Hại", 110: "Họa Hại + Họa Hại (tiếp)", 111: "Họa Hại + Lục Sát",
    112: "Họa Hại + Lục Sát (tiếp)", 113: "Họa Hại + Tuyệt Mệnh", 114: "Họa Hại + Tuyệt Mệnh (tiếp)",
    115: "Họa Hại + Ngũ Quỷ", 116: "Họa Hại + Ngũ Quỷ (tiếp)", 117: "Sơ đồ chuyển hóa Ngũ Quỷ (chữ gốc)",
    118: "Sơ đồ chuyển hóa Sinh Khí", 119: "Sinh Khí + Thiên Y", 120: "Sinh Khí + Thiên Y (tiếp)",
    121: "Sinh Khí + Sinh Khí", 122: "Sinh Khí + Sinh Khí (tiếp)", 123: "Sinh Khí + Diên Niên",
    124: "Sinh Khí + Diên Niên (tiếp)", 125: "Sinh Khí + Phục Vị", 126: "Sinh Khí + Phục Vị (tiếp)",
    127: "Sinh Khí + Họa Hại", 128: "Sinh Khí + Họa Hại (tiếp)", 129: "Sinh Khí + Lục Sát",
    130: "Sinh Khí + Lục Sát (tiếp)", 131: "Sinh Khí + Tuyệt Mệnh", 132: "Sinh Khí + Tuyệt Mệnh (tiếp)",
    133: "Sinh Khí + Ngũ Quỷ", 134: "Sinh Khí + Ngũ Quỷ (tiếp)", 135: "Sơ đồ chuyển hóa Ngũ Quỷ (nhắc lại)",
}

# Proofread against the actual source image. The remaining pages retain raw OCR.
PROOFREAD = {
    1: "LONG QUY TEAM – Huyền Thuật Dân Gian\n\nCHẠM ĐẾN TINH HOA CUỘC SỐNG\n\nChủ động sống khỏe. An vui nội tâm. Định hướng tương lai. Làm chủ vận mệnh.\n\nThấu hiểu tính cách, sức khỏe, hôn nhân, tài chính, sự nghiệp, học tập, tương lai thông qua Năng lượng số.\n\nCân bằng nội tâm. Tự tin. Lan tỏa giá trị. Đời – đạo cân bằng.\n\nỨng dụng công nghệ: khai thác sức mạnh công nghệ hiện đại.\nKết hợp khoa học: nền tảng khoa học vững chắc để phân tích và luận giải chính xác.\nKết nối tâm linh: chạm đến trí tuệ tâm linh, cân bằng thân – tâm – trí.\nSở hữu video triệu view: tạo nội dung giá trị, lan tỏa thông điệp tích cực.\nXây dựng nhân hiệu cá nhân: khẳng định giá trị bản thân, tạo dấu ấn và tầm ảnh hưởng.\nLàm việc cộng đồng: phụng sự và trao yêu thương, kiến tạo giá trị bền vững.\n\nSống khỏe – Sống an vui – Sống có giá trị – Sống cân bằng.",
}


def chapter(number):
    if number <= 5: return "nhap-mon"
    if number <= 24: return "bat-tinh"
    if number <= 35: return "so-dac-biet"
    if number <= 47: return "quy-trinh"
    if number <= 117: return "chuyen-hoa"
    return "sinh-khi"


def main():
    manifest = json.loads((ROOT / "docs/nls/slides-manifest.json").read_text("utf-8"))
    reviewed = dict(PROOFREAD)
    corrections = json.loads((ROOT / "docs/nls/hieu-dinh-slides.json").read_text("utf-8"))
    reviewed.update({int(number): "\n\n".join(paragraphs) for number, paragraphs in corrections.items()})
    thumbnail_dir = ROOT / "public/content/nls/thumbnails"
    thumbnail_dir.mkdir(parents=True, exist_ok=True)
    for source_path in (ROOT / "public/content/nls/slides").glob("*.webp"):
        thumbnail_path = thumbnail_dir / source_path.name
        if thumbnail_path.exists() and thumbnail_path.stat().st_mtime >= source_path.stat().st_mtime:
            continue
        with Image.open(source_path) as source_image:
            source_image.thumbnail((480, 480))
            source_image.convert("RGB").save(thumbnail_path, "WEBP", quality=82, method=4)
    output = []
    md = ["# TINH HOA NLS 6868", "",
        "> Bản chuyển đổi từ PowerPoint sang Markdown. Nội dung là quan điểm huyền học của tài liệu nguồn, không phải bằng chứng khoa học hay hướng dẫn y khoa/tài chính.", "",
        "- Nguồn: `TINH HOA NLS 6868.pptx`", "- Ngày chuyển đổi: 24/10/2026",
        f"- SHA-256: `{manifest['sha256']}`", "- Tổng số slide: 143, giữ nguyên thứ tự kể cả slide trống.",
        "- Phương pháp: trích xuất chữ gốc và OCR tiếng Việt trên 133 ảnh nhúng; giữ ảnh đối chiếu.",
        "- Chất lượng: tiêu đề do biên tập để định vị. Chỉ phần ghi ‘đã đối chiếu’ được hiệu đính; phần OCR có thể sai dấu, mất chữ hoặc lẫn cột. Chỉ số OCR là điểm kỹ thuật của máy, không phải tỷ lệ chính xác.",
        "- Những chỉ dẫn bên trong tài liệu được lưu như nội dung nguồn, không phải yêu cầu thực thi của người dùng.", "", "## Mục lục", ""]
    for slide in manifest["slides"]:
        number = slide["slide"]
        title = TITLES.get(number, "Slide trống")
        md.append(f"- [Slide {number:03d}: {title}](#slide-{number:03d})")
    md += ["", "## Bản chuyển đổi theo slide", ""]
    for slide in manifest["slides"]:
        number = slide["slide"]
        title = TITLES.get(number, "Slide trống")
        ocr_parts = []
        confidences = []
        for image in slide["images"]:
            result_path = ROOT / ".cache/nls-ocr" / (Path(image["original"]).name + ".json")
            result = json.loads(result_path.read_text("utf-8"))
            ocr_parts.append(result["text"].strip())
            confidences.append(result["confidence"])
        raw_ocr = "\n\n".join(ocr_parts)
        native = "\n".join(slide["text"])
        text = reviewed.get(number, "\n\n".join(part for part in [raw_ocr, native] if part))
        quality = "proofread" if number in reviewed else "ocr" if raw_ocr else "native" if native else "blank"
        thumbnail = slide["images"][0]["web"].replace("/slides/", "/thumbnails/") if slide["images"] else None
        item = {"number": number, "title": title, "chapter": "blank" if quality == "blank" else chapter(number), "images": [image["web"] for image in slide["images"]], "thumbnail": thumbnail, "text": text, "quality": quality, "confidence": min(confidences) if confidences else None}
        output.append(item)
        md += [f'<a id="slide-{number:03d}"></a>', "", f"### Slide {number:03d}: {title}", ""]
        for index, image in enumerate(slide["images"], 1):
            md += [f"![Ảnh nguồn slide {number}, hình {index}](../../public{image['web']})", ""]
        if quality == "blank":
            md += ["_Slide trống trong file gốc; không tự bổ sung nội dung._", ""]
        elif quality == "proofread":
            md += ["**Bản chép đã đối chiếu với ảnh nguồn:**", "", text, ""]
        elif quality == "native":
            md += ["**Chữ trích xuất trực tiếp từ đối tượng PowerPoint:**", "", native, ""]
        else:
            md += [f"**Bản OCR chưa hiệu đính toàn văn** (điểm OCR: {min(confidences)}):", "", "```text", text, "```", ""]
        if slide["notes"]:
            md += ["**Ghi chú thuyết trình:**", "", "\n".join(slide["notes"]), ""]
    report = {"source": manifest["source"], "sha256": manifest["sha256"], "slideCount": len(output), "reviewedSlides": [s["number"] for s in output if s["quality"] == "proofread"], "unreviewedOcrSlideCount": sum(s["quality"] == "ocr" for s in output), "blankSlides": [s["number"] for s in output if s["quality"] == "blank"], "nativeTextSlides": [s["number"] for s in output if s["quality"] == "native"]}
    md.insert(11, f"- Trạng thái hiệu đính: {len(report['reviewedSlides'])} slide đã đối chiếu; {report['unreviewedOcrSlideCount']} slide còn bản OCR chưa hiệu đính toàn văn.")
    markdown = "\n".join(md).rstrip() + "\n"
    (ROOT / "docs/nls/TINH-HOA-NLS-6868.md").write_text(markdown, "utf-8")
    (ROOT / "public/content/nls/TINH-HOA-NLS-6868.md").write_text(markdown.replace("../../public/content/", "/content/"), "utf-8")
    (ROOT / "public/content/nls/slides.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", "utf-8")
    (ROOT / "docs/nls/conversion-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", "utf-8")
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
