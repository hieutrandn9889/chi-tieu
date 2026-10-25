import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CircleCheck,
  CircleX,
  FileDown,
  ClipboardList,
  Layers3,
  Lightbulb,
  Microscope,
  ListChecks,
  MessageCircleQuestion,
  NotebookPen,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  buildReportSummary,
  describeSplitGroups,
  fieldName,
  splitSources,
} from "@/lib/nls";
import type { NumberKind, SequenceReportData } from "@/lib/nls";
import {
  checkPhonePattern,
  findPairNote,
  groupNotes,
  supplementSource,
} from "@/lib/nls-supplement";
import {
  generalQuestions,
  ngQuyZeroQuestions,
  zeroGroupSlides,
} from "@/lib/nls-slide-notes";
import {
  buildAnalysisTrace,
  buildReportPlan,
  selectReportExtras,
  verifyReport,
} from "@/lib/report-verification";
import type { ReportSection } from "@/lib/report-verification";
import { buildExportData } from "@/lib/report-export";
import { PrintableReport } from "@/components/PrintableReport";

export function SequenceReport({
  report,
  numberKind = "other",
  children,
}: {
  report: SequenceReportData;
  numberKind?: NumberKind;
  children: ReactNode;
}) {
  // The print-only copy mounts after hydration, straight under <body>, so the
  // print stylesheet can show it alone; server rendering never sees the portal.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const generatedAt = useMemo(() => new Date(), [report]);
  const exportData = useMemo(
    () => buildExportData(report, numberKind, generatedAt),
    [report, numberKind, generatedAt],
  );
  const [pdfState, setPdfState] = useState<"idle" | "working" | "error">(
    "idle",
  );
  // Builds the PDF in the browser and downloads it; the library loads on click.
  async function exportPdf() {
    setPdfState("working");
    try {
      const { downloadReportPdf } = await import("@/lib/report-pdf");
      await downloadReportPdf(buildExportData(report, numberKind, new Date()));
      setPdfState("idle");
    } catch {
      setPdfState("error");
    }
  }
  const summary = buildReportSummary(report);
  const phoneCheck =
    numberKind === "phone"
      ? checkPhonePattern(
          report.pairs[0].pair +
            report.pairs
              .map((pair) => pair.pair[1])
              .slice(1)
              .join(""),
          report.pairs,
        )
      : null;
  const { zeroGroups, nqQuestions } = selectReportExtras(report);
  const plan = buildReportPlan(report, numberKind);
  const verification = verifyReport(report, numberKind);
  const trace = buildAnalysisTrace(report, numberKind);
  const passed = verification.checks.filter((check) => check.ok).length;
  const shown = (section: ReportSection) => !verification.failed.has(section);
  // A section that fails its check is replaced by a note, never shown wrong.
  const hiddenNote = (
    section: ReportSection,
    title: string,
    anchor?: string,
  ) => (
    <p className="verify-hidden" role="note" id={anchor}>
      <TriangleAlert size={16} /> Mục “{title}” bị ẩn vì không qua kiểm tra:{" "}
      {
        verification.checks.find(
          (check) => check.section === section && !check.ok,
        )?.detail
      }
    </p>
  );
  const heading = (
    <header className="report-heading">
      <span className="section-label">
        <BookOpen size={15} /> THEO TÀI LIỆU NĂNG LƯỢNG SỐ
      </span>
      <h2>Bản luận giải dãy số</h2>
      <p>
        Tổng hợp chủ đề để tự đối chiếu. Nội dung huyền học mang tính tham khảo,
        không xác định tính cách hay cuộc đời một người từ số CCCD.
      </p>
    </header>
  );
  const verificationBlock = (
    <section className="report-verify" aria-labelledby="report-verify-title">
      <span className="section-label">
        <BadgeCheck size={15} /> KIỂM CHỨNG KẾT QUẢ
      </span>
      <h3 id="report-verify-title">
        {passed}/{verification.checks.length} kiểm tra đạt
      </h3>
      <p>
        Công cụ tra lại toàn bộ kết quả trên chính dãy vừa nhập trước khi hiển
        thị. Mục nào không đạt sẽ bị ẩn thay vì hiện sai.
      </p>
      <ul className="verify-list">
        {verification.checks.map((check) => (
          <li className={check.ok ? "ok" : "failed"} key={check.id}>
            {check.ok ? <CircleCheck size={17} /> : <CircleX size={17} />}
            <div>
              <strong>{check.label}</strong>
              <span>{check.detail}</span>
            </div>
          </li>
        ))}
      </ul>
      <h4>Chưa kiểm chứng được</h4>
      <ul className="summary-list">
        {verification.unverified.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
  if (verification.coreFailed)
    return (
      <article className="sequence-report" aria-label="Bản luận giải dãy số">
        {heading}
        <section className="verify-failed" role="alert">
          <h3>
            <TriangleAlert size={18} /> Không hiển thị bản luận
          </h3>
          <p>
            Kết quả phân tích không qua bước kiểm chứng, nên công cụ dừng lại
            thay vì đưa ra một bản luận có thể sai. Hãy kiểm tra lại dãy số hoặc
            báo lỗi này.
          </p>
        </section>
        {verificationBlock}
      </article>
    );
  return (
    <article className="sequence-report" aria-label="Bản luận giải dãy số">
      {heading}

      <div className="report-export">
        <button
          className="nls-button"
          type="button"
          onClick={exportPdf}
          disabled={pdfState === "working"}
          aria-busy={pdfState === "working"}
        >
          <FileDown size={16} />{" "}
          {pdfState === "working" ? "Đang tạo PDF…" : "Xuất báo cáo PDF"}
        </button>
        <p className="quiet-note" role="status">
          {pdfState === "error"
            ? "Chưa tạo được file PDF. Hãy thử lại; nếu vẫn lỗi, dùng Ctrl + P để in hoặc lưu PDF."
            : "Tải về file PDF có biểu đồ, tạo ngay trên trình duyệt. Dãy số được che, chỉ hiện 2 số cuối."}
        </p>
      </div>
      {mounted &&
        createPortal(
          <div className="print-root">
            <PrintableReport data={exportData} />
          </div>,
          document.body,
        )}

      <section className="report-plan" aria-labelledby="report-plan-title">
        <span className="section-label">
          <ClipboardList size={15} /> KẾ HOẠCH LUẬN
        </span>
        <h3 id="report-plan-title">Báo cáo này dựa trên gì</h3>
        <p className="plan-input">{plan.input}</p>
        <ol className="plan-steps">
          {plan.steps.map((step) => (
            <li key={step.label}>
              <span>{step.label}</span>
              <span className="plan-source">{step.source}</span>
            </li>
          ))}
        </ol>
        <p className="quiet-note">
          Không áp dụng: {plan.notApplied.join("; ")}.
        </p>
      </section>

      <section
        className="report-analysis"
        aria-labelledby="report-analysis-title"
      >
        <span className="section-label">
          <Microscope size={15} /> PHÂN TÍCH CHI TIẾT
        </span>
        <h3 id="report-analysis-title">Các bước đã thực hiện</h3>
        <p>
          Mỗi bước ứng với một dòng của kế hoạch: đầu vào, cách làm và kết quả
          dùng cho các phần bên dưới.
        </p>
        <ol className="analysis-steps">
          <li>
            <h4>Bước 1 · Tách cặp và xếp nhóm</h4>
            <p>
              Lấy hai chữ số liền nhau, dịch từng vị trí một:{" "}
              {trace.pairs.length} cặp chồng lấn. {trace.classified} cặp tra
              được trong bảng 64 cặp; {trace.special} cặp chứa 0/5 chuyển sang
              bước 2.
            </p>
            <details>
              <summary>Xem bảng từng cặp</summary>
              <div className="analysis-table-wrap">
                <table className="analysis-table">
                  <thead>
                    <tr>
                      <th>Vị trí</th>
                      <th>Cặp</th>
                      <th>Nhóm</th>
                      <th>Cát/hung</th>
                      <th>Nguồn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trace.pairs.map((row) => (
                      <tr key={row.position}>
                        <td>{row.position}</td>
                        <td>
                          <b>{row.pair}</b>
                        </td>
                        <td>{row.note || row.group}</td>
                        <td>{row.tone}</td>
                        <td>{row.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="quiet-note">
                Cát/hung theo ghi chép bổ sung; Phục Vị để trung tính theo slide
                8.
              </p>
            </details>
          </li>
          <li>
            <h4>Bước 2 · Đọc số 0 và số 5</h4>
            {trace.specialDigits.length > 0 ? (
              <ul className="summary-list">
                {trace.specialDigits.map((item) => (
                  <li key={item.position}>
                    Vị trí {item.position} (số {item.digit}):{" "}
                    {item.rules.length > 0
                      ? item.rules
                          .map((rule) => `${rule.rule}, slide ${rule.source}`)
                          .join("; ")
                      : numberKind === "phone" && item.position === 1
                        ? "số 0 đầu của nhà mạng, không đọc theo quy tắc"
                        : "không đứng sau hay chen giữa một cặp đã phân loại, slide 26–28 không có quy tắc cho vị trí này"}
                    .
                  </li>
                ))}
              </ul>
            ) : (
              <p>Dãy không có số 0 hoặc số 5, bỏ qua bước này.</p>
            )}
          </li>
          <li>
            <h4>Bước 3 · Thống kê nhóm và mạch đọc</h4>
            <p>
              {trace.counts.length > 0
                ? `Số cặp theo nhóm: ${trace.counts
                    .map(
                      (item) => `${item.name} ${item.count} (${item.share}%)`,
                    )
                    .join(
                      ", ",
                    )}. Xuất hiện nhiều nhất: ${trace.leading.join(", ")}.`
                : "Chưa có cặp nào được phân loại nên không có thống kê nhóm."}
            </p>
            {(trace.chains.length > 0 || trace.repetitions.length > 0) && (
              <ul className="summary-list">
                {trace.chains.map((chain) => (
                  <li key={chain}>{chain}</li>
                ))}
                {trace.repetitions.map((run) => (
                  <li key={run}>{run}</li>
                ))}
              </ul>
            )}
          </li>
          <li>
            <h4>Bước 4 · Chọn câu hỏi đối chiếu</h4>
            <ul className="summary-list">
              {trace.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </li>
          <li>
            <h4>Bước 5 · Ghi chép bổ sung</h4>
            <ul className="summary-list">
              {trace.supplement.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        </ol>
      </section>

      {!shown("summary") && hiddenNote("summary", "Tóm tắt nhanh")}
      {shown("summary") && (
        <section
          className="report-summary"
          aria-labelledby="report-summary-title"
        >
          <span className="section-label">
            <ListChecks size={15} /> TÓM TẮT NHANH
          </span>
          <h3 id="report-summary-title">Những điểm chính</h3>
          <p className="summary-headline">{summary.headline}</p>
          <div className="summary-grid">
            {summary.themes.length > 0 && (
              <div className="summary-block">
                <h4>Chủ đề theo tài liệu</h4>
                <ul className="summary-themes">
                  {summary.themes.map(({ field, count }) => (
                    <li className={`tone-${field.theme}`} key={field.id}>
                      <strong>{field.name}</strong>
                      <span className="summary-count">
                        {count}/{report.pairs.length} cặp
                      </span>
                      <span className="summary-keywords">
                        {field.keywords.join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {summary.flow.length > 0 && (
              <div className="summary-block">
                <h4>Mạch đọc theo thứ tự</h4>
                {summary.flow.map((segment) => (
                  <p key={segment.start}>
                    <span className="pair-position">
                      VỊ TRÍ {segment.start}–{segment.end}
                    </span>
                    {segment.text}
                  </p>
                ))}
              </div>
            )}
            {summary.split.length > 0 && (
              <div className="summary-block">
                <h4>Nhóm trong cặp bị 0/5 chen giữa</h4>
                {summary.split.map((item) => (
                  <p key={item.start}>
                    <span className="pair-position">
                      VỊ TRÍ {item.start}–{item.end}
                    </span>
                    {item.field.name} · {item.effect} · Slide {item.source}
                  </p>
                ))}
              </div>
            )}
            {summary.cautions.length > 0 && (
              <div className="summary-block">
                <h4>Cần lưu ý</h4>
                <ul className="summary-list">
                  {summary.cautions.map((caution) => (
                    <li key={caution}>{caution}</li>
                  ))}
                </ul>
              </div>
            )}
            {summary.questions.length > 0 && (
              <div className="summary-block">
                <h4>Câu hỏi để tự đối chiếu</h4>
                {summary.questions.map(({ field, question }) => (
                  <p key={field.id}>
                    <strong>{field.name}:</strong> {question}
                  </p>
                ))}
              </div>
            )}
          </div>
          <p className="quiet-note">
            Tóm tắt rút gọn từ các phần chi tiết bên dưới. Số lần xuất hiện
            không phải điểm tốt/xấu hay kết luận về một người.
          </p>
        </section>
      )}

      <nav className="reading-navigation" aria-label="Mục lục bản luận">
        <a href="#report-analysis-title">Phân tích</a>
        <a href="#report-overview-title">Tổng hợp</a>
        {report.chains.length > 0 && (
          <a href="#report-structure-title">Kết cấu dãy</a>
        )}
        {report.groups.length > 0 && (
          <a href="#report-themes-title">Luận từng nhóm</a>
        )}
        <a href="#report-questions-title">Câu hỏi đối chiếu</a>
        <a href="#report-verify-title">Kiểm chứng</a>
      </nav>

      <dl className="report-stats">
        <div>
          <dt>Chữ số được giữ nguyên</dt>
          <dd>{report.digitCount}</dd>
        </div>
        <div>
          <dt>Cặp đã phân loại</dt>
          <dd>
            {report.matchedCount}
            <small> / {report.pairs.length}</small>
          </dd>
        </div>
        <div>
          <dt>Nhóm xuất hiện</dt>
          <dd>
            {report.groups.length}
            <small> / 8</small>
          </dd>
        </div>
        <div>
          <dt>Cặp cần đọc quy tắc 0/5</dt>
          <dd>{report.specialPairs.length}</dd>
        </div>
      </dl>

      <section
        className="report-overview"
        aria-labelledby="report-overview-title"
      >
        <h3 id="report-overview-title">Góc nhìn tổng hợp</h3>
        <p>{report.overview}</p>
        {report.groups.length > 0 && (
          <p className="report-keywords">
            Chủ đề trong nguồn:{" "}
            {report.leadingGroups
              .map(
                ({ field }) => `${field.name} (${field.keywords.join(", ")})`,
              )
              .join("; ")}
            .
          </p>
        )}
        <p className="quiet-note">
          Số lần xuất hiện chỉ mô tả các cặp trong dãy; không đo độ mạnh, mức
          tốt/xấu hay mức độ đúng của một mô tả về bạn.
        </p>
        <Link className="text-link" to="/thu-vien?slide=5">
          Đọc nguyên tắc tiếp cận · Slide 5 <ArrowUpRight size={14} />
        </Link>
      </section>

      {report.chains.length > 0 && (
        <section
          className="report-section"
          aria-labelledby="report-structure-title"
        >
          <span className="section-label">ĐỌC TOÀN KẾT CẤU</span>
          <h3 id="report-structure-title">Các chủ đề nối nhau như thế nào?</h3>
          <p>
            Đọc từ trái sang phải theo vị trí trong dãy. Các đoạn bị ngắt bởi
            cặp 0/5 được giữ riêng; vị trí không được quy đổi thành tuổi hoặc
            các giai đoạn cuộc đời.
          </p>
          <div className="reading-chains">
            {report.chains.map((chain) => (
              <div className="reading-chain" key={chain.start}>
                <span className="pair-position">
                  VỊ TRÍ {chain.start}–{chain.end}
                </span>
                <p>{chain.fields.map((field) => field.name).join(" → ")}</p>
              </div>
            ))}
          </div>
          {report.repetitions.length > 0 && (
            <div className="reading-repetitions">
              <h4>Chủ đề lặp liền nhau</h4>
              {report.repetitions.map((run) => (
                <p key={run.start}>
                  <strong>{run.field.name}</strong> có {run.count} cặp liền
                  nhau, ở vị trí {run.start}–{run.end}. {run.field.description}{" "}
                  <Link
                    className="text-link"
                    to={`/thu-vien?slide=${run.field.source}`}
                  >
                    Nguồn · Slide {run.field.source} <ArrowUpRight size={13} />
                  </Link>
                </p>
              ))}
              <p className="quiet-note">
                Lặp lại giúp nhận ra một chủ đề trong kết cấu; không có phép
                nhân độ mạnh hoặc độ chính xác từ số lần lặp.
              </p>
            </div>
          )}
        </section>
      )}

      {report.groups.length > 0 && (
        <section
          className="report-section"
          aria-labelledby="report-frequency-title"
        >
          <span className="section-label">01 · PHÂN BỐ TRONG DÃY</span>
          <h3 id="report-frequency-title">Các nhóm xuất hiện bao nhiêu lần?</h3>
          <p>
            Mỗi thanh tính trên tổng {report.pairs.length} cặp chồng lấn, bao
            gồm cả cặp chứa 0/5.
          </p>
          <ul className="report-distribution">
            {report.groups.map(({ field, count }) => (
              <li className={`tone-${field.theme}`} key={field.id}>
                <span className="distribution-name">{field.name}</span>
                <span className="distribution-track" aria-hidden="true">
                  <span
                    style={{ width: `${(count / report.pairs.length) * 100}%` }}
                  />
                </span>
                <span className="distribution-count">
                  {count}/{report.pairs.length} cặp
                </span>
              </li>
            ))}
            {report.specialPairs.length > 0 && (
              <li>
                <span className="distribution-name">Chứa 0/5</span>
                <span className="distribution-track" aria-hidden="true">
                  <span
                    style={{
                      width: `${(report.specialPairs.length / report.pairs.length) * 100}%`,
                    }}
                  />
                </span>
                <span className="distribution-count">
                  {report.specialPairs.length}/{report.pairs.length} cặp
                </span>
              </li>
            )}
          </ul>
          {report.splitGroups.length > 0 && (
            <p className="quiet-note">
              Không tính vào các thanh trên: trong cặp chứa 0/5 vẫn đọc được{" "}
              {describeSplitGroups(report.splitGroups)}, theo slide{" "}
              {splitSources(report.splitGroups)}.
            </p>
          )}
        </section>
      )}

      <details className="report-details" open>
        <summary>
          <span>
            <Layers3 size={17} /> Từng cặp và vị trí trong dãy
          </span>
          <span>{report.pairs.length} cặp</span>
        </summary>
        <div className="report-details-body">{children}</div>
      </details>

      {report.specialPairs.length > 0 &&
        !shown("special") &&
        hiddenNote("special", "Giữ nguyên số 0 và số 5")}
      {report.specialPairs.length > 0 && shown("special") && (
        <section
          className="report-special"
          aria-labelledby="report-special-title"
        >
          <h3 id="report-special-title">Giữ nguyên số 0 và số 5</h3>
          <p>
            {report.specialPairs.length} cặp chưa được gán nhóm:{" "}
            {report.specialPairs
              .map(
                (pair) =>
                  `${pair.pair} (vị trí ${pair.index + 1}–${pair.index + 2})`,
              )
              .join("; ")}
            .
          </p>
          <p>Không bỏ hoặc thay chữ số để tạo cặp mới.</p>
          {report.specialNotes.length > 0 ? (
            <ul className="special-notes">
              {report.specialNotes.map((note) => (
                <li key={`${note.start}:${note.window}:${note.source}`}>
                  <span className="pair-position">
                    {note.window === "0"
                      ? `VỊ TRÍ ${note.start + 1}`
                      : `VỊ TRÍ ${note.start + 1}–${note.start + 3} (${note.window})`}
                  </span>
                  {note.text}{" "}
                  <Link
                    className="text-link"
                    to={`/thu-vien?slide=${note.source}`}
                  >
                    Slide {note.source} <ArrowUpRight size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {zeroGroups.length > 0 && (
            <div className="zero-group-details">
              {zeroGroups.map((group) => {
                const slide = zeroGroupSlides[group];
                return (
                  <div key={group}>
                    <h4>
                      {fieldName(group)} + 0 · Slide {slide.source}
                    </h4>
                    <ul className="summary-list">
                      {slide.items.map((item) => (
                        <li key={item.heading}>
                          <strong>{item.heading}</strong>
                          {item.detail ? `: ${item.detail}` : ""}
                        </li>
                      ))}
                    </ul>
                    <p className="quiet-note">
                      Slide còn {slide.hidden} ý về sức khỏe, hôn nhân đổ vỡ
                      hoặc tâm linh không hiển thị.{" "}
                      <Link
                        className="text-link"
                        to={`/thu-vien?slide=${slide.source}`}
                      >
                        Xem slide {slide.source} <ArrowUpRight size={13} />
                      </Link>
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          {report.specialNotes.length === 0 && (
            <p className="quiet-note">
              Các số 0/5 trong dãy không đứng sau hoặc chen giữa một cặp đã phân
              loại, nên slide 26–28 chưa có câu giải thích riêng cho vị trí này.
            </p>
          )}
          <p className="quiet-note">
            Câu trích là quan điểm của tài liệu, không phải dự báo về người mang
            dãy số. Phân nhóm cát/hung để áp câu về số 5 lấy từ ghi chép bổ
            sung; Phục Vị theo slide 8.
          </p>
          <div className="report-source-links">
            {[
              ...new Set(
                report.specialPairs.map((pair) => pair.specialSource!),
              ),
            ]
              .sort((a, b) => a - b)
              .map((source) => (
                <Link
                  className="text-link"
                  key={source}
                  to={`/thu-vien?slide=${source}`}
                >
                  {source === 26
                    ? "Số 0"
                    : source === 27
                      ? "Số 5"
                      : "Ví dụ 0/5"}{" "}
                  · Slide {source} <ArrowUpRight size={14} />
                </Link>
              ))}
          </div>
        </section>
      )}

      {phoneCheck &&
        !shown("phone") &&
        hiddenNote("phone", "Nhận biết số điện thoại theo ghi chép")}
      {phoneCheck && shown("phone") && (
        <section
          className="report-section supplement-section"
          aria-labelledby="report-phone-title"
        >
          <span className="section-label">
            <Smartphone size={15} /> {supplementSource.label.toUpperCase()}
          </span>
          <h3 id="report-phone-title">Nhận biết số điện thoại theo ghi chép</h3>
          <p>
            Các quy tắc dưới đây lấy từ ghi chép bổ sung, không thuộc slide.
            Slide 46 nhắc rằng tốt hay xấu còn tùy vị trí các cặp và kết cấu
            chuyển hóa, nên đây chỉ là điểm để tự đối chiếu.
          </p>
          <div className="phone-check-grid">
            <div className="summary-block">
              <h4>Dấu hiệu cần xem lại</h4>
              {phoneCheck.warnings.length > 0 ? (
                <ul className="summary-list">
                  {phoneCheck.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  Không thấy hai hung tinh đứng cạnh nhau hay số 0 ngoài đầu số.
                </p>
              )}
            </div>
            <div className="summary-block">
              <h4>Dấu hiệu quý cách</h4>
              {phoneCheck.strengths.length > 0 ? (
                <ul className="summary-list">
                  {phoneCheck.strengths.map((strength) => (
                    <li key={strength}>{strength}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  Không thấy hai cát tinh đứng cạnh nhau hay đoạn chuyển từ hung
                  sang cát.
                </p>
              )}
            </div>
          </div>
          <ul className="summary-list quiet-note">
            {phoneCheck.notAutomated.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
      )}

      {report.groups.length > 0 &&
        !shown("themes") &&
        hiddenNote("themes", "Đọc sâu từng chủ đề", "report-themes-title")}
      {report.groups.length > 0 && shown("themes") && (
        <section
          className="report-section"
          aria-labelledby="report-themes-title"
        >
          <span className="section-label">02 · DIỄN GIẢI CÓ NGUỒN</span>
          <h3 id="report-themes-title">Đọc sâu từng chủ đề</h3>
          <p>
            Các mô tả bên dưới tóm lược tài liệu. Phần tự đối chiếu, câu hỏi và
            thực hành là gợi ý biên soạn để kiểm tra với trải nghiệm thật, không
            phải lời phán về người mang dãy số.
          </p>
          <div className="report-field-grid">
            {report.groups.map(({ field, reading, count, occurrences }) => (
              <article
                className={`report-field-card tone-${field.theme}`}
                key={field.id}
              >
                <div className="report-field-heading">
                  <span className="field-initial">{field.short}</span>
                  <div>
                    <h4>{field.name}</h4>
                    <span>{count} cặp trong dãy</span>
                  </div>
                </div>
                <div className="keyword-row">
                  {field.keywords.map((keyword) => (
                    <span key={keyword}>{keyword}</span>
                  ))}
                </div>
                <p>{field.description}</p>
                <dl className="reading-dimensions">
                  <div>
                    <dt>Tiềm năng theo tài liệu</dt>
                    <dd>{reading.potential}</dd>
                  </div>
                  <div>
                    <dt>Khi đi quá đà</dt>
                    <dd>{reading.pressure}</dd>
                  </div>
                  <div>
                    <dt>Công việc và học tập</dt>
                    <dd>{reading.work}</dd>
                  </div>
                  <div>
                    <dt>Giao tiếp và quan hệ</dt>
                    <dd>{reading.relationships}</dd>
                  </div>
                  <div>
                    <dt>Cách ra quyết định</dt>
                    <dd>{reading.decision}</dd>
                  </div>
                </dl>
                <div
                  className="report-occurrences"
                  aria-label={`Vị trí các cặp ${field.name}`}
                >
                  {occurrences.map((pair) => (
                    <span key={pair.index}>
                      <b>{pair.pair}</b> · Vị trí {pair.index + 1}–
                      {pair.index + 2}
                    </span>
                  ))}
                </div>
                <div className="report-reflection">
                  <Lightbulb size={17} />
                  <div>
                    <strong>Câu hỏi kiểm chứng với thực tế</strong>
                    <p>{reading.question}</p>
                  </div>
                </div>
                <details className="supplement-note">
                  <summary>
                    <NotebookPen size={15} /> {supplementSource.label} (ngoài
                    slide)
                  </summary>
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
                    {[
                      ...new Map(
                        occurrences.map((pair) => [
                          findPairNote(pair.pair),
                          pair.pair,
                        ]),
                      ),
                    ].map(([note, pair]) =>
                      note ? (
                        <div key={pair}>
                          <dt>Cặp {note.pairs.join("/")}</dt>
                          <dd>{note.note}</dd>
                        </div>
                      ) : null,
                    )}
                  </dl>
                  <p>{supplementSource.note}</p>
                </details>
                <p className="report-field-note">{field.note}</p>
                <Link
                  className="text-link"
                  to={`/thu-vien?slide=${field.source}`}
                >
                  Đối chiếu ảnh slide {field.source} <ArrowUpRight size={14} />
                </Link>
                <span className="report-quality">
                  Bảng cặp số đã đối chiếu ảnh nguồn
                </span>
              </article>
            ))}
          </div>
        </section>
      )}

      {!shown("questions") &&
        hiddenNote(
          "questions",
          "Câu hỏi để trò chuyện và tự đối chiếu",
          "report-questions-title",
        )}
      {shown("questions") && (
        <section
          className="report-section"
          aria-labelledby="report-questions-title"
        >
          <span className="section-label">
            <MessageCircleQuestion size={15} /> 03 · CÂU HỎI KHAI THÁC VÀ ĐỐI
            CHIẾU
          </span>
          <h3 id="report-questions-title">
            Câu hỏi để trò chuyện và tự đối chiếu
          </h3>
          <p>
            Tài liệu dùng câu hỏi để hiểu bối cảnh trước khi nhận định (slide 5,
            36–38). Câu hỏi không phải lời khẳng định: trả lời “không” cũng là
            một kết quả đối chiếu.
          </p>
          {nqQuestions.length > 0 && (
            <div className="question-block">
              <h4>Câu hỏi riêng theo dãy · Slide 38</h4>
              {nqQuestions.map((entry) => (
                <div key={`${entry.first}:${entry.topic}`}>
                  <span className="pair-position">
                    {entry.combination.first.name} +{" "}
                    {entry.combination.second.name} ·{" "}
                    {entry.combination.occurrences
                      .map(
                        (item) =>
                          `vị trí ${item.index + 1}–${item.index + 3} (${item.window})`,
                      )
                      .join(", ")}{" "}
                    · {entry.topic}
                  </span>
                  <ul className="summary-list">
                    {entry.questions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {zeroGroups.includes("NQ") && (
            <div className="question-block">
              <h4>{ngQuyZeroQuestions.topic} · Slide 37</h4>
              <ul className="summary-list">
                {ngQuyZeroQuestions.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          )}
          <details className="question-block">
            <summary>
              Bộ câu hỏi chung · Slide {generalQuestions.source}
            </summary>
            {generalQuestions.groups.map((group) => (
              <div key={group.topic}>
                <h4>{group.topic}</h4>
                <ul className="summary-list">
                  {group.questions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="quiet-note">
              Bộ câu hỏi chung còn {generalQuestions.hidden} câu về sức khỏe,
              tâm linh và người thứ ba không hiển thị.
            </p>
          </details>
          <p className="question-closing">
            <strong>Câu hỏi chốt (slide 37):</strong> {generalQuestions.closing}
          </p>
          {!nqQuestions.length && (
            <p className="quiet-note">
              Câu hỏi riêng ở slide 38 dành cho nhóm đứng ngay trước Ngũ Quỷ;
              dãy này không có cặp như vậy.
            </p>
          )}
        </section>
      )}

      {verificationBlock}

      <footer className="report-privacy">
        <ShieldCheck size={18} />
        <p>
          Dãy số chỉ được xử lý trong bộ nhớ trình duyệt, không gửi lên máy chủ,
          không lưu vào lịch sử tra cứu. Dùng “Xóa dãy và kết quả” khi xem xong.
        </p>
      </footer>
    </article>
  );
}
