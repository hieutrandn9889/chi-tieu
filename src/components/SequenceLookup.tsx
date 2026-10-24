import { useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Info,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  buildSequenceReport,
  findNumberKind,
  normalizeNumber,
  numberKinds,
} from "@/lib/nls";
import type { NumberKind } from "@/lib/nls";
import { SequenceReport } from "@/components/SequenceReport";

export function SequenceLookup({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<
    typeof buildSequenceReport
  > | null>(null);
  const [error, setError] = useState("");
  const [concealed, setConcealed] = useState(!compact);
  const [kind, setKind] = useState<NumberKind>("other");
  const [notes, setNotes] = useState<string[]>([]);
  const kindInfo = findNumberKind(kind);
  const inputRef = useRef<HTMLInputElement>(null);
  const formId = useId();
  const inputId = compact ? "home-sequence" : "lookup-sequence";
  function lookUp(value: string) {
    setInput(value);
    try {
      const normalized = normalizeNumber(kind, value);
      setResult(buildSequenceReport(normalized.digits));
      setNotes(normalized.notes);
      setError("");
    } catch (err) {
      setResult(null);
      setNotes([]);
      setError(
        err instanceof Error ? err.message : "Vui lòng kiểm tra lại dãy số.",
      );
    }
  }
  function onSubmit(event: FormEvent) {
    event.preventDefault();
    lookUp(input);
  }
  function clear() {
    setInput("");
    setResult(null);
    setNotes([]);
    setError("");
    setConcealed(!compact);
    inputRef.current?.focus();
  }
  const pairResults = result && (
    <>
      <div className="results-heading">
        <h3>{result.pairs.length} cặp số liên tiếp</h3>
        <span>Tách chồng lấn, giữ nguyên thứ tự</span>
      </div>
      <div className="pair-results">
        {result.pairs.map((item) =>
          item.field ? (
            <Link
              key={item.index}
              className={`pair-result tone-${item.field.theme}`}
              to={`/tu-truong/${item.field.id}`}
            >
              <span className="pair-position">
                VỊ TRÍ {item.index + 1}–{item.index + 2}
              </span>
              <strong>{item.pair}</strong>
              <span>
                {item.field.name} <ArrowRight size={13} />
              </span>
            </Link>
          ) : (
            <div key={item.index} className="pair-result special-pair">
              <span className="pair-position">
                VỊ TRÍ {item.index + 1}–{item.index + 2}
              </span>
              <strong>{item.pair}</strong>
              <span>Có số 0 hoặc 5</span>
              <Link to={`/thu-vien?slide=${item.specialSource || 28}`}>
                Đọc quy tắc riêng <ArrowRight size={12} />
              </Link>
            </div>
          ),
        )}
      </div>
      <p className="result-context">
        <BookOpen size={16} /> Kết quả phân loại theo bảng trong tài liệu. Cặp
        chứa 0/5 cần đọc riêng; không tự bỏ hoặc thay chữ số.
      </p>
    </>
  );
  return (
    <div className={`lookup-box ${compact ? "compact" : ""}`}>
      <div className="lookup-intro">
        <span className="section-label">
          <Search size={15} />{" "}
          {compact ? "THỬ TRA CỨU" : "XỬ LÝ RIÊNG TẠI THIẾT BỊ"}
        </span>
        <h2>
          {compact ? "Mỗi cặp số là một điểm bắt đầu." : "Luận giải dãy số"}
        </h2>
        <p>
          {compact
            ? "Nhập một cặp số hoặc dãy minh họa để tìm nhóm tương ứng trong tài liệu."
            : "Chọn loại số rồi nhập 2–32 chữ số để xem từng cặp và các chủ đề. Công cụ không xác thực căn cước hay tra thông tin cá nhân."}
        </p>
        {!compact && (
          <p className="lookup-privacy">
            <ShieldCheck size={15} /> Không cần CCCD thật. Dãy nhập không được
            lưu hoặc gửi lên máy chủ.
          </p>
        )}
      </div>
      <form className="sequence-form" onSubmit={onSubmit} noValidate>
        {!compact && (
          <fieldset className="number-kinds">
            <legend className="sr-only">Loại số cần luận</legend>
            {numberKinds.map((item) => (
              <label
                key={item.id}
                className={`number-kind${item.id === kind ? " active" : ""}`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name={`${formId}-kind`}
                  value={item.id}
                  checked={item.id === kind}
                  onChange={() => {
                    setKind(item.id);
                    setResult(null);
                    setNotes([]);
                    setError("");
                  }}
                />
                {item.label}
              </label>
            ))}
          </fieldset>
        )}
        <label htmlFor={inputId} className="sr-only">
          Cặp số hoặc dãy số cần tra cứu
        </label>
        <div className="sequence-input-wrap">
          <Search size={20} aria-hidden="true" />
          <input
            id={inputId}
            ref={inputRef}
            type={concealed ? "password" : "text"}
            inputMode={kind === "house" || kind === "plate" ? "text" : "numeric"}
            autoComplete="off"
            spellCheck={false}
            maxLength={80}
            placeholder={
              compact ? "Ví dụ: 14, 68 hoặc 143168" : kindInfo.placeholder
            }
            value={input}
            aria-invalid={!!error}
            aria-describedby={`${formId}-help${error ? ` ${formId}-error` : ""}`}
            onChange={(event) => {
              setInput(event.target.value);
              setError("");
              setResult(null);
            }}
          />
          {!compact && (
            <button
              className="sequence-reveal"
              type="button"
              aria-controls={inputId}
              aria-pressed={!concealed}
              aria-label={concealed ? "Hiện dãy nhập" : "Ẩn dãy nhập"}
              title={concealed ? "Hiện dãy nhập" : "Ẩn dãy nhập"}
              onClick={() => setConcealed(!concealed)}
            >
              {concealed ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          )}
          <button className="nls-button" type="submit">
            {compact ? "Tra cứu" : "Luận giải"} <ArrowRight size={17} />
          </button>
        </div>
        {error && (
          <p className="form-error" role="alert" id={`${formId}-error`}>
            {error}
          </p>
        )}
        {!compact && (
          <div className="sequence-controls">
            <button type="button" disabled={!input && !result} onClick={clear}>
              <Trash2 size={15} /> Xóa dãy và kết quả
            </button>
          </div>
        )}
        {!compact && (
          <div className="number-kind-note">
            <Info size={16} aria-hidden="true" />
            <div>
              <p>{kindInfo.hint}</p>
              <div className="number-kind-sources">
                {kindInfo.sources.map((source) => (
                  <Link
                    key={source.slide}
                    className="text-link"
                    to={`/thu-vien?slide=${source.slide}`}
                  >
                    {source.label} · Slide {source.slide}{" "}
                    <ArrowRight size={12} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="lookup-helper" id={`${formId}-help`}>
          <span>Thử nhanh:</span>
          {(compact
            ? ["14", "68", "19", "143168"]
            : kindInfo.examples
          ).map((example) => (
            <button key={example} type="button" onClick={() => lookUp(example)}>
              {example}
            </button>
          ))}
          {!compact && <span>Các ví dụ là dãy minh họa.</span>}
          <span className="privacy-note">
            <ShieldCheck size={13} /> Xử lý ngay trên trình duyệt
          </span>
        </div>
      </form>
      {result && (
        <div className="lookup-results">
          <p role="status" className="sr-only">
            Đã phân tích {result.digitCount} chữ số, gồm {result.pairs.length}{" "}
            cặp và {result.groups.length} nhóm.
          </p>
          {notes.length > 0 && (
            <ul className="normalize-notes">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
          {compact ? (
            <>
              {pairResults}
              <Link className="text-link compact-report-link" to="/tra-cuu">
                Mở công cụ luận giải chi tiết <ArrowRight size={15} />
              </Link>
            </>
          ) : (
            <SequenceReport report={result}>{pairResults}</SequenceReport>
          )}
        </div>
      )}
    </div>
  );
}
