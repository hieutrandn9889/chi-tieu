import { NlsLayout } from "@/components/NlsLayout";
import { SequenceLookup } from "@/components/SequenceLookup";

export function Lookup() {
  return (
    <NlsLayout>
      <div className="site-container page-heading">
        <span className="section-label">CÔNG CỤ HỌC TẬP</span>
        <h1>
          Tra cứu <em>Năng lượng số.</em>
        </h1>
        <p>
          Luận giải dãy số theo tài liệu, đọc từng chủ đề và đối chiếu nguồn.
        </p>
      </div>
      <section className="site-container section-bottom">
        <SequenceLookup />
      </section>
    </NlsLayout>
  );
}
