import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Compass,
  Download,
  Leaf,
} from 'lucide-react'
import { NlsLayout } from '@/components/NlsLayout'
import { SequenceLookup } from '@/components/SequenceLookup'
import { fields, lessons } from '@/lib/nls'

export function Landing() {
  const [selected, setSelected] = useState(fields[0])
  return (
    <NlsLayout>
      <section className="hero-section">
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <span className="section-label">
              <span className="tiny-line" /> KHÔNG GIAN HỌC & TRA CỨU
            </span>
            <h1>
              Hiểu những con số.
              <br />
              <em>Mở rộng góc nhìn.</em>
            </h1>
            <p>
              Khám phá Năng lượng số qua tám từ trường.
              <br className="desktop-break" /> Học từng bước, tra cứu từng cặp số và luôn có tài
              liệu gốc để đối chiếu.
            </p>
            <div className="hero-actions">
              <Link className="nls-button" to="/lo-trinh">
                Bắt đầu hành trình học <ArrowUpRight size={18} />
              </Link>
              <Link className="text-link" to="/thu-vien">
                <BookOpen size={17} /> Mở thư viện
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <strong>08</strong>
                <span>Từ trường</span>
              </div>
              <div>
                <strong>64</strong>
                <span>Cặp số cơ bản</span>
              </div>
              <div>
                <strong>143</strong>
                <span>Slide tài liệu gốc</span>
              </div>
            </div>
          </div>
          <div
            className="hero-visual"
            aria-label="Bản đồ tám từ trường, mỗi nhóm liên kết đến bài học tương ứng"
          >
            <div className="orbit-ring ring-outer" />
            <div className="orbit-ring ring-inner" />
            <div className="orbit-center">
              <Compass size={38} strokeWidth={1} />
              <span>BẢN ĐỒ</span>
              <strong>Năng lượng số</strong>
              <small>Từ kiến thức đến góc nhìn</small>
            </div>
            {fields.map((field, index) => (
              <Link
                key={field.id}
                to={`/tu-truong/${field.id}`}
                className={`orbit-field orbit-${index} tone-${field.theme}`}
              >
                <span className="orbit-abbr">{field.short}</span>
                <strong>{field.name}</strong>
                <small>
                  {field.pairs[0]} · {field.pairs[1]}
                </small>
              </Link>
            ))}
            <span className="orbit-caption">
              <Leaf size={14} /> Hiểu từng phần. Nhìn cả kết cấu.
            </span>
          </div>
        </div>
        <div className="site-container hero-bottom">
          <span>BIÊN SOẠN TỪ TÀI LIỆU LONG QUY TEAM</span>
          <a href="#kham-pha">
            Khám phá tiếp <ArrowDown size={14} />
          </a>
        </div>
      </section>
      <section className="site-container lookup-section" id="kham-pha">
        <SequenceLookup compact />
      </section>
      <section className="site-container section-space" id="tu-truong">
        <div className="section-heading">
          <div>
            <span className="section-label">NỀN TẢNG KIẾN THỨC</span>
            <h2>
              Tám từ trường.
              <br />
              <em>Mỗi nhóm một sắc thái.</em>
            </h2>
          </div>
          <p>
            Tìm hiểu tên gọi, cặp số và những chủ đề
            <br className="desktop-break" /> mà tài liệu gắn với từng nhóm.
          </p>
        </div>
        <div className="field-tabs" role="group" aria-label="Chọn nhóm từ trường">
          {fields.map((field) => (
            <button
              key={field.id}
              className={selected.id === field.id ? 'selected' : ''}
              onClick={() => setSelected(field)}
              aria-pressed={selected.id === field.id}
            >
              <span className={`field-dot tone-${field.theme}`} />
              {field.name}
            </button>
          ))}
        </div>
        <div className={`field-feature tone-${selected.theme}`}>
          <div className="field-feature-copy">
            <span className="section-label">{selected.short} · THEO TÀI LIỆU NGUỒN</span>
            <h3>{selected.name}</h3>
            <div className="keyword-row">
              {selected.keywords.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
            <p>{selected.description}</p>
            <div className="field-pairs">
              {selected.pairs.map((pair) => (
                <span key={pair}>{pair}</span>
              ))}
            </div>
            <Link className="text-link" to={`/tu-truong/${selected.id}`}>
              Tìm hiểu {selected.name} <ArrowUpRight size={17} />
            </Link>
          </div>
          <Link to={`/thu-vien?slide=${selected.source}`} className="field-source-preview">
            <img
              src={`/content/nls/slides/${String(selected.source).padStart(3, '0')}-1.webp`}
              alt={`Trang tài liệu gốc về ${selected.name}`}
              loading="lazy"
            />
            <span>
              <BookOpen size={15} /> Mở slide {String(selected.source).padStart(2, '0')}{' '}
              <ArrowUpRight size={16} />
            </span>
          </Link>
        </div>
      </section>
      <section className="learning-section section-space">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="section-label">MỘT LỘ TRÌNH RÕ RÀNG</span>
              <h2>
                Học từ gốc.
                <br />
                <em>Hiểu từng bước.</em>
              </h2>
            </div>
            <Link className="text-link" to="/lo-trinh">
              Xem lộ trình học <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="lesson-preview-grid">
            {lessons.map((lesson, index) => (
              <Link to={`/lo-trinh#${lesson.id}`} className="lesson-preview" key={lesson.id}>
                <span className="lesson-number">0{index + 1}</span>
                <div>
                  <small>SLIDE {lesson.range}</small>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.subtitle}</p>
                </div>
                <ArrowUpRight size={18} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="site-container source-section section-space">
        <div className="source-cover">
          <img
            src="/content/nls/slides/001-1.webp"
            alt="Bìa tài liệu Chạm đến tinh hoa cuộc sống của Long Quy Team"
            loading="lazy"
          />
          <span>
            <BookOpen size={15} /> TÀI LIỆU GỐC · 143 SLIDE
          </span>
        </div>
        <div className="source-copy">
          <span className="section-label">LUÔN CÓ NGUỒN ĐỂ ĐỐI CHIẾU</span>
          <h2>
            Đọc sâu hơn.
            <br />
            <em>Hiểu rõ hơn.</em>
          </h2>
          <p>
            Tài liệu PowerPoint đã được chuyển thành Markdown, kèm ảnh nguồn và mục lục theo từng
            slide để bạn dễ tìm lại điều đang học.
          </p>
          <ul className="check-list">
            <li>
              <Check size={16} /> Giữ thứ tự và số trang của tài liệu gốc
            </li>
            <li>
              <Check size={16} /> Tìm kiếm theo chủ đề hoặc từ khóa không dấu
            </li>
            <li>
              <Check size={16} /> Phân biệt bản OCR và phần đã đối chiếu
            </li>
          </ul>
          <div className="hero-actions">
            <Link to="/thu-vien" className="nls-button">
              Đọc tài liệu <ArrowRight size={17} />
            </Link>
            <a href="/content/nls/TINH-HOA-NLS-6868.md" download className="text-link">
              <Download size={16} /> Tải Markdown
            </a>
          </div>
        </div>
      </section>
      <section className="principle-section">
        <div className="site-container principle-inner">
          <Leaf size={28} strokeWidth={1.2} />
          <p>
            Không phán đoán vội.
            <br />
            Không hù dọa. Lắng nghe để thấu hiểu.
          </p>
          <Link to="/thu-vien?slide=5">
            Nguyên tắc tiếp cận trong tài liệu · Slide 05 <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </NlsLayout>
  )
}
