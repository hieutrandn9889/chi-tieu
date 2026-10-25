import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Layers3,
  Lightbulb,
  ListChecks,
  MessageCircleQuestion,
  NotebookPen,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { buildReportSummary } from "@/lib/nls";
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
  nqPairQuestions,
  zeroGroupSlides,
} from "@/lib/nls-slide-notes";

export function SequenceReport({
  report,
  numberKind = "other",
  children,
}: {
  report: SequenceReportData;
  numberKind?: NumberKind;
  children: ReactNode;
}) {
  const summary = buildReportSummary(report);
  const phoneCheck =
    numberKind === "phone"
      ? checkPhonePattern(
          report.pairs[0].pair +
            report.pairs.map((pair) => pair.pair[1]).slice(1).join(""),
          report.pairs,
        )
      : null;
  const zeroGroups = [
    ...new Set(
      report.specialNotes
        .filter((note) => note.digit === "0" && note.group)
        .map((note) => note.group!),
    ),
  ].filter((group) => zeroGroupSlides[group]);
  const groupName = (short: string) =>
    report.pairs.find((pair) => pair.field?.short === short)?.field?.name ??
    short;
  // Slide 38 questions apply to a group followed by Ngũ Quỷ (A + NQ).
  const nqQuestions = report.orderedCombinations
    .filter((item) => item.second.short === "NQ")
    .flatMap((item) =>
      nqPairQuestions
        .filter((entry) => entry.first === item.first.short)
        .map((entry) => ({ ...entry, combination: item })),
    );
  return (
    <article className="sequence-report" aria-label="Bản luận giải dãy số">
      <header className="report-heading">
        <span className="section-label">
          <BookOpen size={15} /> THEO TÀI LIỆU NĂNG LƯỢNG SỐ
        </span>
        <h2>Bản luận giải dãy số</h2>
        <p>
          Tổng hợp chủ đề để tự đối chiếu. Nội dung huyền học mang tính tham
          khảo, không xác định tính cách hay cuộc đời một người từ số CCCD.
        </p>
      </header>

      <section className="report-summary" aria-labelledby="report-summary-title">
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
          Tóm tắt rút gọn từ các phần chi tiết bên dưới. Số lần xuất hiện không
          phải điểm tốt/xấu hay kết luận về một người.
        </p>
      </section>

      <nav className="reading-navigation" aria-label="Mục lục bản luận">
        <a href="#report-overview-title">Tổng hợp</a>
        {report.chains.length > 0 && (
          <a href="#report-structure-title">Kết cấu dãy</a>
        )}
        {report.groups.length > 0 && (
          <a href="#report-themes-title">Luận từng nhóm</a>
        )}
        <a href="#report-questions-title">Câu hỏi đối chiếu</a>
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

      {report.specialPairs.length > 0 && (
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
                      {groupName(group)} + 0 · Slide {slide.source}
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
              Các số 0/5 trong dãy không đứng sau hoặc chen giữa một cặp đã
              phân loại, nên slide 26–28 chưa có câu giải thích riêng cho vị trí
              này.
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

      {phoneCheck && (
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
                <p>Không thấy hai hung tinh đứng cạnh nhau hay số 0 ngoài đầu số.</p>
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
                <p>Không thấy hai cát tinh đứng cạnh nhau hay đoạn chuyển từ hung sang cát.</p>
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

      {report.groups.length > 0 && (
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

      <section
        className="report-section"
        aria-labelledby="report-questions-title"
      >
        <span className="section-label">
          <MessageCircleQuestion size={15} /> 03 · CÂU HỎI KHAI THÁC VÀ ĐỐI
          CHIẾU
        </span>
        <h3 id="report-questions-title">Câu hỏi để trò chuyện và tự đối chiếu</h3>
        <p>
          Tài liệu dùng câu hỏi để hiểu bối cảnh trước khi nhận định (slide 5,
          36–38). Câu hỏi không phải lời khẳng định: trả lời “không” cũng là một
          kết quả đối chiếu.
        </p>
        {nqQuestions.length > 0 && (
          <div className="question-block">
            <h4>Câu hỏi riêng theo dãy · Slide 38</h4>
            {nqQuestions.map((entry) => (
              <div key={`${entry.first}:${entry.topic}`}>
                <span className="pair-position">
                  {entry.combination.first.name} + {entry.combination.second.name}{" "}
                  ·{" "}
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
          <summary>Bộ câu hỏi chung · Slide {generalQuestions.source}</summary>
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
            Bộ câu hỏi chung còn {generalQuestions.hidden} câu về sức khỏe, tâm
            linh và người thứ ba không hiển thị.
          </p>
        </details>
        <p className="question-closing">
          <strong>Câu hỏi chốt (slide 37):</strong> {generalQuestions.closing}
        </p>
        {!nqQuestions.length && (
          <p className="quiet-note">
            Câu hỏi riêng ở slide 38 dành cho nhóm đứng ngay trước Ngũ Quỷ; dãy
            này không có cặp như vậy.
          </p>
        )}
      </section>

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
