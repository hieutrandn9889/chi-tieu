import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Download,
  FileText,
  Search,
  X,
} from 'lucide-react'
import { NlsLayout } from '@/components/NlsLayout'
import { lessons, normalizeSearch } from '@/lib/nls'
import type { SourceSlide } from '@/lib/nls'

export function Library() {
  const [slides, setSlides] = useState<SourceSlide[]>([])
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [search, setSearch] = useState('')
  const [chapter, setChapter] = useState('all')
  const [limit, setLimit] = useState(24)
  const [params, setParams] = useSearchParams()
  const readerRef = useRef<HTMLElement>(null)
  const requestedSlide = Number(params.get('slide'))
  const selected = slides.find((slide) => slide.number === requestedSlide)
  const query = normalizeSearch(search)
  const filtered = useMemo(
    () =>
      slides.filter(
        (slide) =>
          (chapter === 'all' || slide.chapter === chapter) &&
          (!query ||
            normalizeSearch(`${slide.number} ${slide.title} ${slide.text}`).includes(query)),
      ),
    [slides, chapter, query],
  )
  useEffect(() => {
    const controller = new AbortController()
    setError('')
    fetch('/content/nls/slides.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Không tải được tài liệu. Vui lòng thử lại.')
        return response.json() as Promise<SourceSlide[]>
      })
      .then(setSlides)
      .catch((err: unknown) => {
        if (!controller.signal.aborted)
          setError(err instanceof Error ? err.message : 'Không tải được tài liệu.')
      })
    return () => controller.abort()
  }, [attempt])
  useEffect(() => {
    setLimit(24)
  }, [search, chapter])
  useEffect(() => {
    if (selected) readerRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [selected])
  function openSlide(number: number) {
    setParams({ slide: String(number) })
  }
  return (
    <NlsLayout>
      <div className="site-container page-heading library-page-heading">
        <div>
          <span className="section-label">TÀI LIỆU ĐỂ ĐỐI CHIẾU</span>
          <h1>
            Thư viện <em>Năng lượng số.</em>
          </h1>
          <p>143 slide theo đúng thứ tự file gốc, kèm ảnh và bản chép.</p>
        </div>
        <a href="/content/nls/TINH-HOA-NLS-6868.md" download className="nls-button outline">
          <Download size={16} /> Tải Markdown
        </a>
      </div>
      <div className="site-container library-layout section-bottom">
        <aside className="library-sidebar">
          <label className="library-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm từ khóa, số slide…"
              aria-label="Tìm trong tài liệu"
            />
          </label>
          <span className="section-label">CHỦ ĐỀ</span>
          <nav aria-label="Lọc chủ đề tài liệu">
            <button className={chapter === 'all' ? 'active' : ''} onClick={() => setChapter('all')}>
              Tất cả tài liệu <span>143</span>
            </button>
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                className={chapter === lesson.id ? 'active' : ''}
                onClick={() => setChapter(lesson.id)}
              >
                {lesson.title}
                <span>{slides.filter((slide) => slide.chapter === lesson.id).length || '—'}</span>
              </button>
            ))}
            <button
              className={chapter === 'blank' ? 'active' : ''}
              onClick={() => setChapter('blank')}
            >
              Slide trống trong nguồn <span>9</span>
            </button>
          </nav>
          <div className="library-source-note">
            <FileText size={20} />
            <strong>Về bản chuyển đổi</strong>
            <p>
              Chữ trong ảnh đã qua OCR tiếng Việt. Phần chưa hiệu đính có thể sai hoặc thiếu chữ. Mở
              ảnh nguồn để kiểm tra.
            </p>
            <p>9 slide trống vẫn giữ nguyên số trang. Slide 117 có chữ gốc từ PowerPoint.</p>
          </div>
        </aside>
        <div className="library-main">
          {error ? (
            <div className="empty-state" role="alert">
              <p>{error}</p>
              <button className="nls-button small" onClick={() => setAttempt((value) => value + 1)}>
                Thử tải lại
              </button>
            </div>
          ) : slides.length === 0 ? (
            <p className="empty-state" role="status">
              Đang tải chỉ mục tài liệu…
            </p>
          ) : (
            <>
              {params.has('slide') && !selected && (
                <div className="source-notice" role="status">
                  Không có slide này. Chọn một slide từ 1 đến 143.
                  <button className="text-link" onClick={() => setParams({})}>
                    Đóng thông báo
                  </button>
                </div>
              )}
              {selected && (
                <article className="source-reader" ref={readerRef} id="doc-tai-lieu">
                  <div className="reader-header">
                    <span className="section-label">
                      SLIDE {String(selected.number).padStart(3, '0')} / 143
                    </span>
                    <button
                      className="icon-button"
                      aria-label="Đóng trang đang đọc"
                      onClick={() => setParams({})}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <h2>{selected.title}</h2>
                  {selected.images.length > 0 ? (
                    selected.images.map((src, index) => (
                      <a
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="reader-image"
                        key={src}
                      >
                        <img
                          src={src}
                          alt={`Ảnh nguồn slide ${selected.number}, hình ${index + 1}: ${selected.title}`}
                        />
                        <span>
                          Mở ảnh lớn <ArrowUpRight size={14} />
                        </span>
                      </a>
                    ))
                  ) : (
                    <div className="native-slide">
                      {selected.quality === 'blank' ? (
                        <>
                          <FileText size={35} strokeWidth={1} />
                          <p>Slide này trống trong file gốc.</p>
                        </>
                      ) : (
                        <>
                          <BookOpen size={30} strokeWidth={1} />
                          <h3>Sơ đồ từ đối tượng chữ PowerPoint</h3>
                          <p className="native-text">{selected.text}</p>
                        </>
                      )}
                    </div>
                  )}
                  <details className="transcription">
                    <summary>
                      <FileText size={16} />
                      {selected.quality === 'proofread'
                        ? 'Bản chép đã đối chiếu ảnh'
                        : selected.quality === 'native'
                          ? 'Chữ trích xuất trực tiếp'
                          : selected.quality === 'blank'
                            ? 'Thông tin slide trống'
                            : 'Bản OCR · Chưa hiệu đính toàn văn'}
                    </summary>
                    {selected.quality === 'ocr' && (
                      <p className="quiet-note">
                        OCR có thể sai dấu, mất chữ hoặc trộn các cột. Dùng ảnh bên trên làm nguồn
                        đối chiếu.
                      </p>
                    )}
                    <pre>{selected.text || 'Không có nội dung trong slide gốc.'}</pre>
                  </details>
                  <div className="reader-navigation">
                    <button
                      className="nls-button outline small"
                      disabled={selected.number === 1}
                      onClick={() => openSlide(selected.number - 1)}
                    >
                      <ArrowLeft size={15} /> Trang trước
                    </button>
                    <span>{selected.number} / 143</span>
                    <button
                      className="nls-button outline small"
                      disabled={selected.number === 143}
                      onClick={() => openSlide(selected.number + 1)}
                    >
                      Trang sau <ArrowRight size={15} />
                    </button>
                  </div>
                </article>
              )}
              <div className="library-results-heading">
                <span>
                  {filtered.length} slide
                  {query
                    ? ` cho “${search}”`
                    : chapter !== 'all'
                      ? ' trong chủ đề'
                      : ' trong tài liệu'}
                </span>
                {(query || chapter !== 'all') && (
                  <button
                    className="text-link"
                    onClick={() => {
                      setSearch('')
                      setChapter('all')
                    }}
                  >
                    Xóa bộ lọc <X size={13} />
                  </button>
                )}
              </div>
              {filtered.length > 0 ? (
                <div className="slide-grid">
                  {filtered.slice(0, limit).map((slide) => (
                    <button
                      className={`slide-card ${selected?.number === slide.number ? 'selected' : ''}`}
                      key={slide.number}
                      onClick={() => openSlide(slide.number)}
                    >
                      <div className="slide-thumbnail">
                        {slide.images[0] ? (
                          <img src={slide.thumbnail || slide.images[0]} loading="lazy" alt="" />
                        ) : (
                          <FileText size={30} strokeWidth={1} />
                        )}
                        <span>{String(slide.number).padStart(3, '0')}</span>
                      </div>
                      <small>
                        {slide.quality === 'blank'
                          ? 'SLIDE TRỐNG'
                          : slide.quality === 'native'
                            ? 'CHỮ GỐC'
                            : 'TÀI LIỆU NGUỒN'}
                      </small>
                      <h3>{slide.title}</h3>
                      <span className="slide-open">
                        Mở tài liệu <ArrowUpRight size={13} />
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Search size={28} strokeWidth={1} />
                  <h3>Chưa tìm thấy nội dung phù hợp</h3>
                  <p>Thử từ khóa ngắn hơn như “Sinh Khí”, “so 0” hoặc số slide.</p>
                </div>
              )}
              {limit < filtered.length && (
                <button
                  className="nls-button outline load-more"
                  onClick={() => setLimit((value) => value + 24)}
                >
                  Xem thêm {Math.min(24, filtered.length - limit)} slide <ArrowRight size={16} />
                </button>
              )}
              <p className="quiet-note library-bottom-note">
                Nội dung phản ánh quan điểm huyền học của tài liệu gốc. Các phát biểu về sức khỏe,
                tài chính và hôn nhân không phải kết luận được website kiểm chứng.{' '}
                <Link to="/lo-trinh">Đọc theo lộ trình.</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </NlsLayout>
  )
}
