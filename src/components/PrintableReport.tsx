import type { ReactNode } from "react";
import { EXPORT_COLORS, EXPORT_TONE_LABELS, inkOn } from "@/lib/report-export";
import type { ExportData, ExportTone } from "@/lib/report-export";

// Print-only A4 report. It renders from ExportData, which carries no digits of
// the sequence beyond the masked form, and uses fixed light colors because a
// printed page is always light.

const INK = "#0b0b0b";
const INK_SECONDARY = "#52514e";
const AXIS = "#c3c2b7";

const fillFor = (tone: ExportTone) =>
  tone === "special" ? "url(#pr-hatch)" : EXPORT_COLORS[tone];

// Declared once per document; every chart refers to it as url(#pr-hatch).
function HatchPattern() {
  return (
    <svg
      className="pr-defs"
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id="pr-hatch"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="6" height="6" fill={EXPORT_COLORS.special} />
          <line x1="0" y1="0" x2="0" y2="6" stroke="#5f5d58" strokeWidth="2" />
        </pattern>
      </defs>
    </svg>
  );
}

function DistributionChart({ rows }: { rows: ExportData["distribution"] }) {
  const labelWidth = 104;
  const plotWidth = 470;
  const rowHeight = 24;
  const barHeight = 14;
  const max = Math.max(1, ...rows.map((row) => row.count));
  const height = rows.length * rowHeight + 8;
  // Room for the "+n trong cặp 0/5" note after the longest bar.
  const noteWidth = rows.some((row) => row.split > 0) ? 110 : 0;
  return (
    <svg
      className="pr-chart"
      viewBox={`0 0 ${labelWidth + plotWidth + 40 + noteWidth} ${height}`}
      role="img"
      aria-label="Số cặp theo nhóm"
    >
      <line
        x1={labelWidth}
        y1="0"
        x2={labelWidth}
        y2={height}
        stroke={AXIS}
        strokeWidth="1"
      />
      {rows.map((row, index) => {
        const y = index * rowHeight + (rowHeight - barHeight) / 2 + 4;
        const width = (row.count / max) * plotWidth;
        const radius = Math.min(4, width / 2);
        const x = labelWidth;
        return (
          <g key={row.short}>
            <text
              x={labelWidth - 8}
              y={y + barHeight - 3}
              textAnchor="end"
              fill={INK_SECONDARY}
              fontSize="11"
            >
              {row.name}
            </text>
            {width > 0 && (
              // Square at the baseline, 4px rounded data end.
              <path
                d={`M${x},${y} H${x + width - radius} Q${x + width},${y} ${x + width},${y + radius} V${y + barHeight - radius} Q${x + width},${y + barHeight} ${x + width - radius},${y + barHeight} H${x} Z`}
                fill={fillFor(row.tone)}
              />
            )}
            <text
              x={x + width + 6}
              y={y + barHeight - 3}
              fill={INK}
              fontSize="11"
              fontWeight="600"
            >
              {row.count}
            </text>
            {row.split > 0 && (
              <text
                x={x + width + 6 + String(row.count).length * 7 + 6}
                y={y + barHeight - 3}
                fill={INK_SECONDARY}
                fontSize="10"
              >
                +{row.split} trong cặp 0/5
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function PositionStrip({ cells }: { cells: ExportData["cells"] }) {
  const width = 614;
  const gap = 2;
  const cellWidth = Math.min(
    40,
    (width - gap * (cells.length - 1)) / cells.length,
  );
  const cellHeight = 34;
  const small = cellWidth < 24;
  return (
    <svg
      className="pr-chart"
      viewBox={`0 0 ${width} ${cellHeight + 22}`}
      role="img"
      aria-label="Bản đồ vị trí các cặp trong dãy"
    >
      {cells.map((cell, index) => {
        const x = index * (cellWidth + gap);
        return (
          <g key={cell.position}>
            <rect
              x={x}
              y="0"
              width={cellWidth}
              height={cellHeight}
              rx="3"
              fill={fillFor(cell.tone)}
            />
            <text
              x={x + cellWidth / 2}
              y={cellHeight / 2 + 4}
              textAnchor="middle"
              fontSize={small ? 8 : 11}
              fontWeight="700"
              fill={
                cell.tone === "special"
                  ? "#ffffff"
                  : inkOn(EXPORT_COLORS[cell.tone])
              }
            >
              {cell.short}
            </text>
            <text
              x={x + cellWidth / 2}
              y={cellHeight + 15}
              textAnchor="middle"
              fontSize={small ? 8 : 10}
              fill={INK_SECONDARY}
            >
              {cell.position}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="pr-section">
      <h2>
        <span>{String(number).padStart(2, "0")}</span> {title}
      </h2>
      {children}
    </section>
  );
}

export function PrintableReport({ data }: { data: ExportData }) {
  let number = 0;
  const next = () => ++number;
  return (
    <article className="pr-document" aria-label="Bản báo cáo để in">
      <HatchPattern />
      <header className="pr-cover">
        <p className="pr-eyebrow">
          TINH HOA NĂNG LƯỢNG SỐ · THEO TÀI LIỆU NLS 6868
        </p>
        <h1>{data.title}</h1>
        <dl className="pr-meta">
          <div>
            <dt>Loại số</dt>
            <dd>{data.kind}</dd>
          </div>
          <div>
            <dt>Dãy số</dt>
            <dd className="pr-masked">{data.masked}</dd>
          </div>
          <div>
            <dt>Quy mô</dt>
            <dd>
              {data.digitCount} chữ số · {data.pairCount} cặp
            </dd>
          </div>
          <div>
            <dt>Ngày tạo</dt>
            <dd>{data.generatedAt}</dd>
          </div>
        </dl>
        <p className="pr-disclaimer">
          Nội dung tóm lược quan điểm huyền học của tài liệu (
          {data.proofreadSlides} slide đã hiệu đính) để tự đối chiếu, không xác
          định tính cách hay cuộc đời một người và không dự báo sức khỏe. Dãy số
          được che, chỉ hiện 2 số cuối; bản xuất không ghi chữ số của từng cặp.
        </p>
      </header>

      <Section number={next()} title="Kế hoạch luận">
        <p className="pr-strong">{data.plan.input}</p>
        <ol className="pr-steps">
          {data.plan.steps.map((step) => (
            <li key={step.label}>
              {step.label} <span className="pr-muted">· {step.source}</span>
            </li>
          ))}
        </ol>
        <p className="pr-muted">
          Không áp dụng: {data.plan.notApplied.join("; ")}.
        </p>
      </Section>

      {data.summary && (
        <Section number={next()} title="Tóm tắt">
          <p className="pr-lead">{data.summary.headline}</p>
          {data.summary.flow.map((segment) => (
            <p key={segment.start}>
              <span className="pr-muted">
                Vị trí {segment.start}–{segment.end}:
              </span>{" "}
              {segment.text}
            </p>
          ))}
          {data.summary.split.map((item) => (
            <p key={item.range}>
              <span className="pr-muted">
                Trong cặp chứa 0/5, vị trí {item.range}:
              </span>{" "}
              {item.name} · {item.effect} (slide {item.source})
            </p>
          ))}
          {data.summary.cautions.length > 0 && (
            <ul className="pr-list">
              {data.summary.cautions.map((caution) => (
                <li key={caution}>{caution}</li>
              ))}
            </ul>
          )}
        </Section>
      )}

      <Section number={next()} title="Hình ảnh tổng quan">
        <div className="pr-tiles">
          {data.toneTotals.map((item) => (
            <div key={item.tone} className="pr-tile">
              <svg width="10" height="10" aria-hidden="true">
                <rect width="10" height="10" rx="2" fill={fillFor(item.tone)} />
              </svg>
              <span>{item.label}</span>
              <strong>
                {item.count}
                <small> / {data.pairCount} cặp</small>
              </strong>
              {item.split > 0 && (
                <small>+{item.split} nhóm trong cặp 0/5</small>
              )}
            </div>
          ))}
        </div>
        {/* The tiles above double as the color legend for both charts. */}
        <figure className="pr-figure">
          <figcaption>Số cặp theo nhóm</figcaption>
          <DistributionChart rows={data.distribution} />
        </figure>
        <figure className="pr-figure">
          <figcaption>
            Bản đồ vị trí: mỗi ô là một cặp chồng lấn, theo thứ tự trong dãy
          </figcaption>
          <PositionStrip cells={data.cells} />
        </figure>
        <p className="pr-muted">
          Màu theo chú giải ở các ô số liệu phía trên: cát tinh, hung tinh,
          trung tính hay chứa 0/5; chữ trong ô là nhóm. Phân nhóm cát/hung theo
          ghi chép bổ sung, Phục Vị theo slide 8. Số liệu đầy đủ ở bảng mục kế
          tiếp.
          {data.toneTotals.some((item) => item.split > 0) &&
            " Nhóm đọc được trong cặp bị 0/5 chen giữa (dạng X0Y, X5Y) ghi riêng là “trong cặp 0/5”, không cộng vào số cặp."}
        </p>
      </Section>

      <Section number={next()} title="Phân tích chi tiết">
        <h3>Bước 1 · Tách cặp và xếp nhóm</h3>
        <table className="pr-table">
          <thead>
            <tr>
              <th>Vị trí</th>
              <th>Nhóm</th>
              <th>Cát/hung</th>
              <th>Nguồn</th>
            </tr>
          </thead>
          <tbody>
            {data.cells.map((cell) => (
              <tr key={cell.position}>
                <td>
                  {cell.position}–{cell.position + 1}
                </td>
                <td>{cell.name}</td>
                <td>{EXPORT_TONE_LABELS[cell.tone]}</td>
                <td>Slide {cell.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Bước 2 · Đọc số 0 và số 5</h3>
        {data.specialDigits.length > 0 ? (
          <ul className="pr-list">
            {data.specialDigits.map((item) => (
              <li key={item.position}>
                Vị trí {item.position} (số {item.digit}):{" "}
                {item.rules.join("; ")}.
              </li>
            ))}
          </ul>
        ) : (
          <p>Dãy không có số 0 hoặc số 5.</p>
        )}
        <h3>Bước 3 · Mạch đọc</h3>
        <ul className="pr-list">
          {data.chains.map((chain) => (
            <li key={chain.range}>
              Vị trí {chain.range}: {chain.text}
            </li>
          ))}
          {data.repetitions.map((run) => (
            <li key={run}>{run}</li>
          ))}
          {data.chains.length === 0 && <li>Chưa có cặp nào được phân loại.</li>}
        </ul>
      </Section>

      {data.special && (
        <Section number={next()} title="Số 0 và số 5 theo tài liệu">
          <ul className="pr-list">
            {data.special.notes.map((note) => (
              <li key={`${note.range}:${note.text}`}>
                <span className="pr-muted">Vị trí {note.range}:</span>{" "}
                {note.text}
              </li>
            ))}
          </ul>
          {data.special.groups.map((group) => (
            <div key={group.name} className="pr-card">
              <h3>
                {group.name} · Slide {group.source}
              </h3>
              <ul className="pr-list">
                {group.items.map((item) => (
                  <li key={item.heading}>
                    <strong>{item.heading}</strong>
                    {item.detail ? `: ${item.detail}` : ""}
                  </li>
                ))}
              </ul>
              <p className="pr-muted">
                Slide còn {group.hidden} ý về sức khỏe, hôn nhân đổ vỡ hoặc tâm
                linh không đưa vào báo cáo.
              </p>
            </div>
          ))}
        </Section>
      )}

      {data.themes && (
        <Section number={next()} title="Luận từng nhóm">
          {data.themes.map((theme) => (
            <div key={theme.short} className="pr-card">
              <h3>
                <svg width="10" height="10" aria-hidden="true">
                  <rect
                    width="10"
                    height="10"
                    rx="2"
                    fill={EXPORT_COLORS[theme.tone]}
                  />
                </svg>{" "}
                {theme.name} · {theme.count} cặp
                <span className="pr-muted">
                  {" "}
                  · vị trí {theme.positions.join(", ")}
                </span>
              </h3>
              <p className="pr-muted">{theme.keywords.join(" · ")}</p>
              <p>{theme.description}</p>
              <dl className="pr-dimensions">
                {theme.dimensions.map(([label, text]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
              <p>
                <strong>Câu hỏi kiểm chứng:</strong> {theme.question}
              </p>
              <div className="pr-supplement">
                <strong>{data.supplementLabel} (ngoài slide)</strong>
                <p>Tính cách: {theme.supplement.personality}</p>
                <p>Công việc: {theme.supplement.work}</p>
                <p>Học tập: {theme.supplement.study}</p>
              </div>
              <p className="pr-muted">
                {theme.note} Nguồn: slide {theme.source}.
              </p>
            </div>
          ))}
        </Section>
      )}

      {data.phone && (
        <Section
          number={next()}
          title="Nhận biết số điện thoại (ghi chép bổ sung)"
        >
          <h3>Dấu hiệu cần xem lại</h3>
          <ul className="pr-list">
            {data.phone.warnings.length > 0 ? (
              data.phone.warnings.map((item) => <li key={item}>{item}</li>)
            ) : (
              <li>Không thấy dấu hiệu nào.</li>
            )}
          </ul>
          <h3>Dấu hiệu quý cách</h3>
          <ul className="pr-list">
            {data.phone.strengths.length > 0 ? (
              data.phone.strengths.map((item) => <li key={item}>{item}</li>)
            ) : (
              <li>Không thấy dấu hiệu nào.</li>
            )}
          </ul>
        </Section>
      )}

      {data.questions && (
        <Section number={next()} title="Câu hỏi để tự đối chiếu">
          {data.summary && data.summary.questions.length > 0 && (
            <ul className="pr-list">
              {data.summary.questions.map((item) => (
                <li key={item.name}>
                  <strong>{item.name}:</strong> {item.question}
                </li>
              ))}
            </ul>
          )}
          {data.questions.specific.map((entry) => (
            <div key={entry.title} className="pr-card">
              <h3>
                {entry.title}{" "}
                <span className="pr-muted">
                  · vị trí {entry.positions} · slide 38
                </span>
              </h3>
              <ul className="pr-list">
                {entry.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          ))}
          {data.questions.ngQuyZero.length > 0 && (
            <div className="pr-card">
              <h3>
                Ngũ Quỷ đi cùng 0: Sứ mệnh – Áp lực{" "}
                <span className="pr-muted">· slide 37</span>
              </h3>
              <ul className="pr-list">
                {data.questions.ngQuyZero.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          )}
          <p>
            <strong>Câu hỏi chốt (slide 37):</strong> {data.questions.closing}
          </p>
        </Section>
      )}

      <Section number={next()} title="Kiểm chứng kết quả">
        <p className="pr-strong">
          {data.verification.passed}/{data.verification.total} kiểm tra đạt
        </p>
        <ul className="pr-checks">
          {data.verification.checks.map((check) => (
            <li key={check.label}>
              <span aria-hidden="true">{check.ok ? "✓" : "✗"}</span>
              <div>
                <strong>{check.label}</strong>
                <span className="pr-muted"> {check.detail}</span>
              </div>
            </li>
          ))}
        </ul>
        <h3>Chưa kiểm chứng được</h3>
        <ul className="pr-list">
          {data.verification.unverified.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <footer className="pr-footer">
        Tạo trên trình duyệt lúc {data.generatedAt}. Dãy số không được gửi lên
        máy chủ. Tinh Hoa Năng Lượng Số ·
        tinh-hoa-nang-luong-so.hieutrantaskflow.workers.dev
      </footer>
    </article>
  );
}
