import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, BookOpen, Check, CircleCheck, RotateCcw } from 'lucide-react'
import { NlsLayout } from '@/components/NlsLayout'
import { lessons } from '@/lib/nls'

const storageKey = 'nls-learning-progress-v1'
function readProgress(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(saved)
      ? [
          ...new Set(
            saved.filter(
              (id): id is string =>
                typeof id === 'string' && lessons.some((lesson) => lesson.id === id),
            ),
          ),
        ]
      : []
  } catch {
    return []
  }
}
export function Learning() {
  const [completed, setCompleted] = useState(readProgress)
  const [storageError, setStorageError] = useState(false)
  const { hash } = useLocation()
  const next = lessons.find((lesson) => !completed.includes(lesson.id))
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completed))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [completed])
  useEffect(() => {
    if (hash)
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [hash])
  function toggle(id: string) {
    setCompleted((previous) =>
      previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id],
    )
  }
  return (
    <NlsLayout>
      <div className="site-container page-heading">
        <span className="section-label">HÀNH TRÌNH TÌM HIỂU</span>
        <h1>
          Học có lộ trình.
          <br />
          <em>Hiểu từ nền tảng.</em>
        </h1>
        <p>
          Sáu chủ đề để đọc tài liệu theo một trình tự rõ ràng.
          <br />
          Mỗi bài có nguồn đối chiếu và một câu hỏi để tự kiểm tra.
        </p>
      </div>
      <div className="site-container learning-layout section-bottom">
        <aside className="progress-card">
          <CircleCheck size={29} strokeWidth={1.2} />
          <span className="section-label">TIẾN ĐỘ CỦA BẠN</span>
          <strong>
            {completed.length}
            <small> / {lessons.length} bài</small>
          </strong>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Tiến độ học"
            aria-valuenow={completed.length}
            aria-valuemin={0}
            aria-valuemax={lessons.length}
          >
            <span style={{ width: `${(completed.length / lessons.length) * 100}%` }} />
          </div>
          <p>
            {next
              ? `Tiếp theo: ${next.title}`
              : 'Bạn đã đánh dấu hoàn thành cả sáu bài. Hãy mở lại những phần cần ôn tập.'}
          </p>
          <nav aria-label="Mục lục bài học">
            {lessons.map((lesson, index) => (
              <a key={lesson.id} href={`#${lesson.id}`}>
                <span>{completed.includes(lesson.id) ? <Check size={13} /> : `0${index + 1}`}</span>
                {lesson.title}
              </a>
            ))}
          </nav>
          <p className="quiet-note">
            {storageError
              ? 'Trình duyệt không cho lưu tiến độ. Bạn vẫn học được trong phiên này.'
              : 'Tiến độ được lưu trên trình duyệt này.'}
          </p>
          {completed.length > 0 && (
            <button className="text-link reset-progress" onClick={() => setCompleted([])}>
              <RotateCcw size={13} /> Đặt lại tiến độ học
            </button>
          )}
        </aside>
        <div className="lesson-articles">
          {lessons.map((lesson, index) => (
            <article className="lesson-article" id={lesson.id} key={lesson.id}>
              <div className="lesson-topline">
                <span className="section-label">
                  BÀI 0{index + 1} · SLIDE {lesson.range}
                </span>
                {completed.includes(lesson.id) && (
                  <span className="completed-label">
                    <Check size={13} /> Đã học
                  </span>
                )}
              </div>
              <h2>{lesson.title}</h2>
              <p className="lesson-subtitle">{lesson.subtitle}</p>
              {lesson.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <details className="self-check">
                <summary>Tự kiểm tra: {lesson.question}</summary>
                <p>{lesson.answer}</p>
              </details>
              <div className="lesson-footer">
                <Link className="text-link" to={`/thu-vien?slide=${lesson.source}`}>
                  <BookOpen size={16} /> Đọc nguồn <ArrowUpRight size={14} />
                </Link>
                <button
                  className={`nls-button small ${completed.includes(lesson.id) ? 'outline' : ''}`}
                  onClick={() => toggle(lesson.id)}
                  aria-pressed={completed.includes(lesson.id)}
                >
                  <Check size={15} />{' '}
                  {completed.includes(lesson.id) ? 'Đã học · Bỏ đánh dấu' : 'Đánh dấu đã học'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </NlsLayout>
  )
}
