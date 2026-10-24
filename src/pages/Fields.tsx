import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, BookOpen, Lightbulb } from 'lucide-react'
import { NlsLayout } from '@/components/NlsLayout'
import { fields } from '@/lib/nls'

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
