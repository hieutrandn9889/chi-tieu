import { useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { buildSequenceReport } from "@/lib/nls";
import { SequenceReport } from "@/components/SequenceReport";

export function SequenceLookup({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<
    typeof buildSequenceReport
  > | null>(null);
  const [error, setError] = useState("");
  const [concealed, setConcealed] = useState(!compact);
  const inputRef = useRef<HTMLInputElement>(null);
  const formId = useId();
  const inputId = compact ? "home-sequence" : "lookup-sequence";
  function lookUp(value: string) {
    setInput(value);
    try {
      setResult(buildSequenceReport(value));
      setError("");
    } catch (err) {
      setResult(null);
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
            : "Nhập 2–32 chữ số để xem từng cặp và các chủ đề. Có thể dùng dãy 12 chữ số; công cụ không xác thực căn cước hay tra thông tin cá nhân."}
        </p>
        {!compact && (
          <p className="lookup-privacy">
            <ShieldCheck size={15} /> Không cần CCCD thật. Dãy nhập không được
            lưu hoặc gửi lên máy chủ.
          </p>
        )}
      </div>
      <form className="sequence-form" onSubmit={onSubmit} noValidate>
        <label htmlFor={inputId} className="sr-only">
          Cặp số hoặc dãy số cần tra cứu
        </label>
        <div className="sequence-input-wrap">
          <Search size={20} aria-hidden="true" />
          <input
            id={inputId}
            ref={inputRef}
            type={concealed ? "password" : "text"}
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            maxLength={80}
            placeholder="Ví dụ: 14, 68 hoặc 143168"
            value={input}
            aria-invalid={!!error}
            aria-describedby={`${formId}-help${error ? ` ${formId}-error` : ""}`}
            onChange={(event) => {
              setInput(event.target.value);
              setError("");
              setResult(null);
            }}
          />
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
            <button
              type="button"
              aria-controls={inputId}
              onClick={() => setConcealed(!concealed)}
            >
              {concealed ? <Eye size={15} /> : <EyeOff size={15} />}
              {concealed ? "Hiện dãy nhập" : "Ẩn dãy nhập"}
            </button>
            <button type="button" disabled={!input && !result} onClick={clear}>
              <Trash2 size={15} /> Xóa dãy và kết quả
            </button>
          </div>
        )}
        <div className="lookup-helper" id={`${formId}-help`}>
          <span>Thử nhanh:</span>
          {(compact
            ? ["14", "68", "19", "143168"]
            : ["143168", "001431681414", "105014"]
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
