import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  ArrowRight,
  ClipboardList,
  Eye,
  EyeOff,
  Info,
  Plus,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  MAX_PAST_PHONES,
  buildNeedBlocks,
  combineIntake,
  intakeNeeds,
  intakeSupplementLabel,
  occupations,
  readIntake,
  usageSpans,
  verifyIntake,
} from "@/lib/intake";
import type {
  IntakeEntry,
  IntakeNumber,
  IntakeSummary,
  NeedBlock,
  NeedId,
  Occupation,
  UsageSpan,
} from "@/lib/intake";
import { revealResults } from "@/lib/reveal-results";
import { SequenceReport } from "@/components/SequenceReport";
import { PairResults } from "@/components/SequenceLookup";

interface PhoneField {
  key: number;
  value: string;
  usage?: UsageSpan;
}

const shortLabel = (label: string) => label.replace("Số điện thoại", "SĐT");

// Slides 3 and 36: the numbers and needs a coach collects before reading.
export function ReadingIntake() {
  const formId = useId();
  const [cccd, setCccd] = useState("");
  const [current, setCurrent] = useState<PhoneField>({ key: 0, value: "" });
  const [past, setPast] = useState<PhoneField[]>([{ key: 1, value: "" }]);
  const [house, setHouse] = useState("");
  const [needs, setNeeds] = useState<NeedId[]>([]);
  const [occupation, setOccupation] = useState<Occupation | "">("");
  const [concealed, setConcealed] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    entries: IntakeEntry[];
    summary: IntakeSummary;
  } | null>(null);
  const [active, setActive] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const pendingReveal = useRef(false);
  const nextKey = useRef(2);

  const numbers = (): IntakeNumber[] => [
    { id: "cccd", role: "cccd", value: cccd },
    {
      id: "phone-current",
      role: "phone-current",
      value: current.value,
      usage: current.usage,
    },
    ...past.map((phone) => ({
      id: `phone-past-${phone.key}`,
      role: "phone-past" as const,
      value: phone.value,
      usage: phone.usage,
    })),
    { id: "house", role: "house", value: house },
  ];

  // A changed number invalidates the reading; needs only re-pick the blocks.
  function edited(id: string) {
    setResult(null);
    setErrors((previous) => {
      const next = { ...previous };
      delete next[id];
      delete next.form;
      return next;
    });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const read = readIntake(numbers());
    setErrors(read.errors);
    if (Object.keys(read.errors).length > 0) {
      setResult(null);
      const first = Object.keys(read.errors)[0];
      document
        .getElementById(
          first === "form" ? `${formId}-cccd` : `${formId}-${first}`,
        )
        ?.focus();
      return;
    }
    setResult({ entries: read.entries, summary: combineIntake(read.entries) });
    setActive(read.entries[0].id);
    pendingReveal.current = true;
  }

  useEffect(() => {
    if (!result || !resultsRef.current || !pendingReveal.current) return;
    pendingReveal.current = false;
    revealResults(resultsRef.current, null);
  }, [result]);

  function clear() {
    setCccd("");
    setCurrent({ key: 0, value: "" });
    setPast([{ key: 1, value: "" }]);
    setHouse("");
    setNeeds([]);
    setOccupation("");
    setErrors({});
    setResult(null);
    setConcealed(true);
    document.getElementById(`${formId}-cccd`)?.focus();
  }

  const fieldProps = (id: string, house = false) => ({
    id: `${formId}-${id}`,
    type: concealed ? "password" : "text",
    inputMode: house ? ("text" as const) : ("numeric" as const),
    autoComplete: "off",
    spellCheck: false,
    maxLength: house ? 80 : 40,
    "aria-invalid": !!errors[id],
    "aria-describedby": errors[id] ? `${formId}-${id}-error` : undefined,
  });
  const fieldError = (id: string) =>
    errors[id] && (
      <p className="form-error" role="alert" id={`${formId}-${id}-error`}>
        {errors[id]}
      </p>
    );
  const usageSelect = (
    id: string,
    value: UsageSpan | undefined,
    onChange: (usage?: UsageSpan) => void,
  ) => (
    <select
      className="intake-usage"
      aria-label="Thời gian đã dùng"
      value={value ?? ""}
      onChange={(event) =>
        onChange((event.target.value || undefined) as UsageSpan | undefined)
      }
      id={`${formId}-${id}-usage`}
    >
      <option value="">Thời gian đã dùng</option>
      {usageSpans.map((span) => (
        <option key={span} value={span}>
          {span}
        </option>
      ))}
    </select>
  );

  return (
    <div className="lookup-box intake-box">
      <div className="lookup-intro">
        <span className="section-label">
          <ClipboardList size={15} /> PHIẾU THÔNG TIN LUẬN
        </span>
        <h2>Luận theo phiếu của tài liệu</h2>
        <p>
          Slide 3 và 36 liệt kê thông tin cần có trước khi luận: CCCD, các số
          điện thoại đã và đang dùng cùng thời gian dùng, số nhà, công việc và
          mong muốn. Điền phần nào có; mỗi dãy được luận riêng rồi tổng hợp.
        </p>
        <p className="lookup-privacy">
          <ShieldCheck size={15} /> Xử lý ngay trên trình duyệt. Các dãy không
          được lưu, không gửi lên máy chủ và mất khi tải lại trang.
        </p>
      </div>

      <form className="intake-form" onSubmit={onSubmit} noValidate>
        <fieldset className="intake-fieldset">
          <legend>Các dãy số</legend>
          <button
            className="intake-reveal"
            type="button"
            aria-pressed={!concealed}
            onClick={() => setConcealed(!concealed)}
          >
            {concealed ? <Eye size={16} /> : <EyeOff size={16} />}
            {concealed ? "Hiện các dãy số" : "Ẩn các dãy số"}
          </button>

          <div className="intake-field">
            <label htmlFor={`${formId}-cccd`}>CCCD</label>
            <input
              {...fieldProps("cccd")}
              placeholder="12 chữ số"
              value={cccd}
              onChange={(event) => {
                setCccd(event.target.value);
                edited("cccd");
              }}
            />
            {fieldError("cccd")}
          </div>

          <div className="intake-field">
            <label htmlFor={`${formId}-phone-current`}>
              Số điện thoại đang dùng
            </label>
            <div className="intake-row">
              <input
                {...fieldProps("phone-current")}
                placeholder="10 chữ số hoặc +84…"
                value={current.value}
                onChange={(event) => {
                  setCurrent({ ...current, value: event.target.value });
                  edited("phone-current");
                }}
              />
              {usageSelect("phone-current", current.usage, (usage) =>
                setCurrent({ ...current, usage }),
              )}
            </div>
            {fieldError("phone-current")}
          </div>

          <div className="intake-field">
            <span className="intake-label" id={`${formId}-past-label`}>
              Số điện thoại đã dùng trước đây
            </span>
            {past.map((phone, index) => {
              const id = `phone-past-${phone.key}`;
              return (
                <div key={phone.key}>
                  <div className="intake-row">
                    <input
                      {...fieldProps(id)}
                      aria-label={`Số điện thoại đã dùng ${index + 1}`}
                      placeholder={`Số đã dùng ${index + 1}`}
                      value={phone.value}
                      onChange={(event) => {
                        setPast(
                          past.map((item) =>
                            item.key === phone.key
                              ? { ...item, value: event.target.value }
                              : item,
                          ),
                        );
                        edited(id);
                      }}
                    />
                    {usageSelect(id, phone.usage, (usage) =>
                      setPast(
                        past.map((item) =>
                          item.key === phone.key ? { ...item, usage } : item,
                        ),
                      ),
                    )}
                    {past.length > 1 && (
                      <button
                        className="intake-remove"
                        type="button"
                        aria-label={`Bỏ số đã dùng ${index + 1}`}
                        title="Bỏ số này"
                        onClick={() => {
                          setPast(
                            past.filter((item) => item.key !== phone.key),
                          );
                          edited(id);
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {fieldError(id)}
                </div>
              );
            })}
            <button
              className="intake-add"
              type="button"
              disabled={past.length >= MAX_PAST_PHONES}
              onClick={() =>
                setPast([...past, { key: nextKey.current++, value: "" }])
              }
            >
              <Plus size={15} /> Thêm số đã dùng
              {past.length >= MAX_PAST_PHONES && ` (tối đa ${MAX_PAST_PHONES})`}
            </button>
          </div>

          <div className="intake-field">
            <label htmlFor={`${formId}-house`}>
              Số nhà <span className="intake-optional">không bắt buộc</span>
            </label>
            <input
              {...fieldProps("house", true)}
              placeholder="Ví dụ: 143/16"
              value={house}
              onChange={(event) => {
                setHouse(event.target.value);
                edited("house");
              }}
            />
            {fieldError("house")}
          </div>
        </fieldset>

        <fieldset className="intake-fieldset">
          <legend>Mong muốn luận</legend>
          <p className="intake-hint">
            Chọn một hoặc nhiều mục. Phần tổng hợp đưa nội dung và câu hỏi đối
            chiếu (slide 37) của các mục này lên trước; không chọn thì đọc theo
            “Hiểu bản thân”.
          </p>
          <div className="number-kinds">
            {intakeNeeds.map((need) => {
              const checked = needs.includes(need.id);
              return (
                <label
                  key={need.id}
                  className={`number-kind${checked ? " active" : ""}`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() =>
                      setNeeds(
                        checked
                          ? needs.filter((id) => id !== need.id)
                          : [...needs, need.id],
                      )
                    }
                  />
                  {need.label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="intake-fieldset">
          <legend>Công việc, tình trạng hiện tại</legend>
          <p className="intake-hint">
            Chỉ để bạn tự đối chiếu với phần công việc; không làm thay đổi kết
            quả luận.
          </p>
          <div className="number-kinds">
            {(["", ...occupations] as const).map((item) => (
              <label
                key={item || "none"}
                className={`number-kind${occupation === item ? " active" : ""}`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name={`${formId}-occupation`}
                  checked={occupation === item}
                  onChange={() => setOccupation(item)}
                />
                {item || "Không nêu"}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="number-kind-note">
          <Info size={16} aria-hidden="true" />
          <p>
            Slide 3 và 36 còn thu họ tên, ngày giờ sinh. Phiếu không hỏi các
            thông tin này vì phần slide đã hiệu đính chưa có quy tắc dùng chúng
            để luận. Biển số chỉ xuất hiện ở bước tư vấn (slide 36), không phải
            thông tin đầu vào.
          </p>
        </div>

        {errors.form && (
          <p className="form-error" role="alert">
            {errors.form}
          </p>
        )}
        <div className="intake-actions">
          <button className="nls-button" type="submit">
            Luận theo phiếu <ArrowRight size={17} />
          </button>
          <button className="intake-clear" type="button" onClick={clear}>
            <Trash2 size={15} /> Xóa phiếu
          </button>
        </div>
      </form>

      {result && (
        <div
          className="lookup-results"
          ref={resultsRef}
          tabIndex={-1}
          role="region"
          aria-label="Kết quả luận theo phiếu"
        >
          <IntakeResults
            entries={result.entries}
            summary={result.summary}
            blocks={buildNeedBlocks(result.summary, needs)}
            occupation={occupation || null}
            active={active}
            onSelect={setActive}
          />
        </div>
      )}
    </div>
  );
}

export function IntakeResults({
  entries,
  summary,
  blocks,
  occupation,
  active,
  onSelect,
}: {
  entries: IntakeEntry[];
  summary: IntakeSummary;
  blocks: NeedBlock[];
  occupation: Occupation | null;
  active: string;
  onSelect: (id: string) => void;
}) {
  const check = verifyIntake(summary, blocks);
  const selected = entries.find((entry) => entry.id === active) ?? entries[0];
  function onTabKey(event: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const index = entries.findIndex((entry) => entry.id === selected.id);
    const next = entries[(index + step + entries.length) % entries.length];
    onSelect(next.id);
    document.getElementById(`intake-tab-${next.id}`)?.focus();
  }

  return (
    <>
      <section
        className="intake-summary"
        aria-labelledby="intake-summary-title"
      >
        <span className="section-label">TỔNG HỢP THEO TÀI LIỆU</span>
        <h3 id="intake-summary-title">Các dãy số trong phiếu</h3>
        {check.ok ? (
          <>
            <p className="summary-headline">{summary.headline}</p>
            <div className="intake-table-wrap">
              <table className="intake-table">
                <caption className="sr-only">Các dãy đã luận</caption>
                <thead>
                  <tr>
                    <th scope="col">Dãy</th>
                    <th scope="col">Số (đã che)</th>
                    <th scope="col">Đã dùng</th>
                    <th scope="col">Cặp</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.entries.map((entry) => (
                    <tr key={entry.id}>
                      <th scope="row">{shortLabel(entry.label)}</th>
                      <td className="intake-masked">{entry.masked}</td>
                      <td>
                        {entry.role === "cccd" || entry.role === "house"
                          ? "—"
                          : (entry.usage ?? "Chưa chọn")}
                      </td>
                      <td>{entry.report.pairs.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {summary.themes.length > 0 && (
              <div className="intake-table-wrap">
                <table className="intake-table intake-matrix">
                  <caption>Số cặp của từng nhóm trong mỗi dãy</caption>
                  <thead>
                    <tr>
                      <th scope="col">Nhóm</th>
                      {summary.entries.map((entry) => (
                        <th scope="col" key={entry.id}>
                          {shortLabel(entry.label)}
                        </th>
                      ))}
                      <th scope="col">Số dãy có</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.themes.map((theme) => (
                      <tr
                        key={theme.field.id}
                        className={`tone-${theme.field.theme}`}
                      >
                        <th scope="row">{theme.field.name}</th>
                        {theme.counts.map((count, index) => (
                          <td key={summary.entries[index].id}>
                            {count || "–"}
                          </td>
                        ))}
                        <td>
                          <strong>
                            {theme.numbers}/{summary.entries.length}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {summary.split.length > 0 && (
              <ul className="summary-list">
                {summary.split.map((line) => (
                  <li key={line}>Trong cặp chứa 0/5 vẫn đọc được · {line}</li>
                ))}
              </ul>
            )}
            <p className="quiet-note">
              Tài liệu chưa có quy tắc gộp nhiều dãy số, nên bảng trên là phép
              đếm của công cụ, không phải quy tắc của tài liệu. Thời gian dùng
              được ghi lại như slide 3 và 36 yêu cầu nhưng không dùng để tính.
            </p>

            {occupation && (
              <p className="intake-occupation">
                Tình trạng bạn chọn: <strong>{occupation}</strong>. Đối chiếu
                với phần công việc và học tập bên dưới; tài liệu không có quy
                tắc nối nghề với dãy số.
              </p>
            )}

            {blocks.map((block) => (
              <div className="intake-need" key={block.id}>
                <h4>{block.label}</h4>
                {block.note && <p className="quiet-note">{block.note}</p>}
                {block.items.map((item) => (
                  <div
                    className={`intake-need-item tone-${item.field.theme}`}
                    key={item.field.id}
                  >
                    <strong>{item.field.name}</strong>
                    <dl>
                      {item.parts.map((part) => (
                        <div key={part.label}>
                          <dt>{part.label}</dt>
                          <dd>{part.text}</dd>
                        </div>
                      ))}
                    </dl>
                    {item.supplement && (
                      <p className="supplement-note">
                        <span>{intakeSupplementLabel}:</span> {item.supplement}
                      </p>
                    )}
                    <Link
                      className="text-link"
                      to={`/thu-vien?slide=${item.source}`}
                    >
                      Nguồn · Slide {item.source} <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
                {block.questions.length > 0 && (
                  <>
                    <p className="intake-questions-title">
                      Câu hỏi để tự đối chiếu
                      {block.questionSource &&
                        ` · Slide ${block.questionSource}`}
                    </p>
                    <ul className="summary-list">
                      {block.questions.map((question) => (
                        <li key={question}>{question}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </>
        ) : (
          <p className="verify-hidden" role="note">
            <TriangleAlert size={16} /> Phần tổng hợp bị ẩn vì không qua kiểm
            tra: {check.detail}
          </p>
        )}
        {summary.unverified.length > 0 && (
          <p className="verify-hidden" role="note">
            <TriangleAlert size={16} /> Không đưa vào tổng hợp vì báo cáo không
            qua kiểm chứng: {summary.unverified.join(", ")}.
          </p>
        )}
      </section>

      <section
        className="intake-reports"
        aria-labelledby="intake-reports-title"
      >
        <span className="section-label">TỪNG DÃY</span>
        <h3 id="intake-reports-title">Báo cáo từng dãy số</h3>
        <div
          className="intake-tabs"
          role="tablist"
          aria-label="Chọn dãy số"
          onKeyDown={onTabKey}
        >
          {entries.map((entry) => (
            <button
              key={entry.id}
              id={`intake-tab-${entry.id}`}
              type="button"
              role="tab"
              aria-selected={entry.id === selected.id}
              aria-controls="intake-panel"
              tabIndex={entry.id === selected.id ? 0 : -1}
              className={`number-kind${entry.id === selected.id ? " active" : ""}`}
              onClick={() => onSelect(entry.id)}
            >
              {shortLabel(entry.label)}
            </button>
          ))}
        </div>
        <div
          id="intake-panel"
          role="tabpanel"
          aria-labelledby={`intake-tab-${selected.id}`}
        >
          {selected.notes.length > 0 && (
            <ul className="normalize-notes">
              {selected.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
          <SequenceReport
            key={selected.id}
            report={selected.report}
            numberKind={selected.kind}
          >
            <PairResults result={selected.report} />
          </SequenceReport>
        </div>
      </section>
    </>
  );
}
