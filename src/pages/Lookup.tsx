import { useState } from "react";
import { NlsLayout } from "@/components/NlsLayout";
import { ReadingIntake } from "@/components/ReadingIntake";
import { SequenceLookup } from "@/components/SequenceLookup";
import { hasHandedOffSequence } from "@/lib/sequence-handoff";

type Mode = "intake" | "quick";

const modes: { id: Mode; label: string }[] = [
  { id: "intake", label: "Phiếu luận theo tài liệu" },
  { id: "quick", label: "Tra nhanh một dãy" },
];

export function Lookup() {
  // A sequence sent from the home page opens the quick lookup that reads it.
  const [mode, setMode] = useState<Mode>(() =>
    hasHandedOffSequence() ? "quick" : "intake",
  );
  return (
    <NlsLayout>
      <div className="site-container page-heading">
        <span className="section-label">CÔNG CỤ HỌC TẬP</span>
        <h1>
          Tra cứu <em>Năng lượng số.</em>
        </h1>
        <p>
          Điền phiếu thông tin như tài liệu hướng dẫn (slide 3, 36) để luận
          nhiều dãy số cùng lúc, hoặc tra nhanh một dãy bất kỳ.
        </p>
      </div>
      <section className="site-container section-bottom">
        <div className="lookup-modes" role="tablist" aria-label="Cách luận">
          {modes.map((item) => (
            <button
              key={item.id}
              id={`lookup-mode-${item.id}`}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              aria-controls="lookup-mode-panel"
              className={`number-kind${mode === item.id ? " active" : ""}`}
              onClick={() => setMode(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          id="lookup-mode-panel"
          role="tabpanel"
          aria-labelledby={`lookup-mode-${mode}`}
        >
          {mode === "intake" ? <ReadingIntake /> : <SequenceLookup />}
        </div>
      </section>
    </NlsLayout>
  );
}
