import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, BookOpen, Lightbulb, NotebookPen } from 'lucide-react'
import { NlsLayout } from '@/components/NlsLayout'
import { fields } from '@/lib/nls'
import { findPairNote, groupNotes, supplementSource } from '@/lib/nls-supplement'

export function Fields() {
  const { id } = useParams()
  const field = fields.find((item) => item.id === id)
  if (!field) return <Navigate to="/tu-truong/sinh-khi" replace />
  return (
    <NlsLayout>
      <div className="site-container page-heading">
        <Link to="/" className="back-link">
          <ArrowLeft size={15} /> Khám phá kiến thức
        </Link>
        <span className="section-label">TÁM TỪ TRƯỜNG</span>
        <h1>
          Mỗi nhóm, <em>một góc nhìn.</em>
        </h1>
        <p>Tên gọi và từ khóa theo hệ diễn giải của tài liệu Năng lượng số.</p>
      </div>
      <div className="site-container field-page section-bottom">
        <nav className="field-sidebar" aria-label="Các từ trường">
          {fields.map((item) => (
            <Link
              to={`/tu-truong/${item.id}`}
              className={field.id === item.id ? 'active' : ''}
              key={item.id}
            >
              <span className={`field-initial tone-${item.theme}`}>{item.short}</span>
              {item.name}
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </nav>
        <article className={`field-article tone-${field.theme}`}>
          <div className="field-article-heading">
            <div>
              <span className="section-label">
                {field.short} · SLIDE {field.source}–{field.sourceEnd}
              </span>
              <h2>{field.name}</h2>
            </div>
            <span className="field-large-initial">{field.short}</span>
          </div>
          <div className="keyword-row">
            {field.keywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
          <p className="field-description">{field.description}</p>
          <h3>Các cặp số cơ bản</h3>
          <div className="field-pairs large">
            {field.pairs.map((pair) => (
              <span key={pair}>{pair}</span>
            ))}
          </div>
          <div className="reflection-box">
            <Lightbulb size={22} />
            <div>
              <h3>Gợi ý tự suy ngẫm</h3>
              <p>{field.reflection}</p>
            </div>
          </div>
          <p className="field-note">{field.note}</p>
          <section className="supplement-panel" aria-labelledby="field-supplement-title">
            <span className="section-label">
              <NotebookPen size={15} /> {supplementSource.label.toUpperCase()} · NGOÀI SLIDE
            </span>
            <h3 id="field-supplement-title">Ghi chép thêm về {field.name}</h3>
            <dl>
              <div>
                <dt>Tính cách</dt>
                <dd>{groupNotes[field.short].personality}</dd>
              </div>
              <div>
                <dt>Công việc</dt>
                <dd>{groupNotes[field.short].work}</dd>
              </div>
              <div>
                <dt>Học tập</dt>
                <dd>{groupNotes[field.short].study}</dd>
              </div>
            </dl>
            <h4>Ý nghĩa riêng từng cặp</h4>
            <dl>
              {[...new Set(field.pairs.map((pair) => findPairNote(pair)))].map((note) =>
                note ? (
                  <div key={note.pairs.join('/')}>
                    <dt>{note.pairs.join(' / ')}</dt>
                    <dd>{note.note}</dd>
                  </div>
                ) : null,
              )}
            </dl>
            <p className="quiet-note">{supplementSource.note}</p>
          </section>
          <Link to={`/thu-vien?slide=${field.source}`} className="field-full-source">
            <img
              src={`/content/nls/slides/${String(field.source).padStart(3, '0')}-1.webp`}
              alt={`Slide nguồn về ${field.name}`}
            />
            <span>
              <BookOpen size={17} /> Đối chiếu ảnh slide {field.source}
              <ArrowUpRight size={17} />
            </span>
          </Link>
          <p className="quiet-note">
            Nội dung tóm lược quan điểm huyền học trong tài liệu. Bảng cặp số không xác định tính
            cách hay dự báo cuộc sống của một cá nhân.
          </p>
        </article>
      </div>
    </NlsLayout>
  )
}
