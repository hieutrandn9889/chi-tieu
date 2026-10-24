import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Layers3,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { SequenceReportData } from "@/lib/nls";

export function SequenceReport({
  report,
  children,
}: {
  report: SequenceReportData;
  children: ReactNode;
}) {
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

      <nav className="reading-navigation" aria-label="Mục lục bản luận">
        <a href="#report-overview-title">Tổng hợp</a>
        {report.chains.length > 0 && (
          <a href="#report-structure-title">Kết cấu dãy</a>
        )}
        {report.groups.length > 0 && (
          <a href="#report-themes-title">Luận từng nhóm</a>
        )}
        <a href="#report-order-title">Luận kết hợp</a>
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

      <section className="report-section" aria-labelledby="report-order-title">
        <span className="section-label">03 · THỨ TỰ KẾT HỢP</span>
        <h3 id="report-order-title">Luận sâu từng chiều kết hợp</h3>
        <p>
          Hai cặp chồng lấn tạo một cửa sổ ba chữ số. Mỗi chiều A + B có nội
          dung riêng. Các tổ hợp giống nhau được gộp bài luận, vẫn giữ đủ vị trí
          xuất hiện.
        </p>
        {report.transitions.length > 0 ? (
          <ol className="report-transitions deep-transitions">
            {report.orderedCombinations.map((transition) => (
              <li key={`${transition.first.short}>${transition.second.short}`}>
                <div>
                  <span className="pair-position">
                    {transition.occurrences.length} MỐI NỐI ·{" "}
                    {transition.occurrences
                      .map(
                        (item) =>
                          `VỊ TRÍ ${item.index + 1}–${item.index + 3} (${item.window})`,
                      )
                      .join(" · ")}
                  </span>
                  <strong>
                    {transition.first.name} + {transition.second.name}
                  </strong>
                </div>
                {transition.reading && (
                  <div className="combination-interpretation">
                    <h4>{transition.reading.theme}</h4>
                    <p>{transition.reading.interpretation}</p>
                    <details>
                      <summary>Câu hỏi đối chiếu và cách thực hành</summary>
                      <dl>
                        <div>
                          <dt>Đối chiếu thực tế</dt>
                          <dd>{transition.reading.question}</dd>
                        </div>
                        <div>
                          <dt>Gợi ý thực hành</dt>
                          <dd>{transition.reading.practice}</dd>
                        </div>
                      </dl>
                    </details>
                    <span className="report-quality">
                      Phần tóm lược chủ đề đã đối chiếu ảnh slide{" "}
                      {transition.reading.source}
                    </span>
                  </div>
                )}
                {transition.source ? (
                  <Link
                    className="text-link"
                    to={`/thu-vien?slide=${transition.source}`}
                  >
                    Đọc slide {transition.source} <ArrowUpRight size={14} />
                  </Link>
                ) : (
                  <span className="report-missing">
                    Chưa có bài riêng cho chiều này
                  </span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="report-empty">
            {report.pairs.length === 1
              ? "Dãy mới có một cặp, chưa đủ hai nhóm liền nhau để tìm bài kết hợp."
              : "Chưa có hai cặp đã phân loại nằm liền nhau. Không nối qua cặp chứa 0/5 để tạo kết hợp."}
          </p>
        )}
        <p className="quiet-note">
          Đã đối chiếu phần tóm lược dùng trong 48 chiều kết hợp. Toàn văn OCR
          vẫn cần hiệu đính; phần luận không bao gồm dự báo bệnh tật, tai nạn
          hoặc biến cố. Bài còn thiếu không được lấy chiều ngược để thay thế.
          Nếu mô tả không khớp trải nghiệm, hãy ghi nhận sự không khớp.
        </p>
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
