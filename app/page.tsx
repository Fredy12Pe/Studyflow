"use client";

import { useState } from "react";

export default function Home() {
  const [pdfText, setPdfText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkText, setLinkText] = useState("");
  const [aiOutput, setAiOutput] = useState<any>(null);
  const [loading, setLoading] = useState<{ pdf?: boolean; link?: boolean; gen?: boolean }>({});
  const [error, setError] = useState<string>("");

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading((s) => ({ ...s, pdf: true }));
      const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to parse PDF");
      setPdfText(data.text || "");
    } catch (err: any) {
      setError(err.message || "Error parsing PDF");
    } finally {
      setLoading((s) => ({ ...s, pdf: false }));
    }
  }

  async function handleParseLink() {
    setError("");
    if (!linkUrl) return;
    try {
      setLoading((s) => ({ ...s, link: true }));
      const res = await fetch("/api/parse-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to parse link");
      setLinkTitle(data.title || "");
      setLinkText(data.text || "");
    } catch (err: any) {
      setError(err.message || "Error parsing link");
    } finally {
      setLoading((s) => ({ ...s, link: false }));
    }
  }

  async function handleGenerate() {
    setError("");
    const text = `${pdfText}\n\n${linkText}`.trim();
    if (!text) return;
    try {
      setLoading((s) => ({ ...s, gen: true }));
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate");
      setAiOutput(data.output || null);
    } catch (err: any) {
      setError(err.message || "Error generating output");
    } finally {
      setLoading((s) => ({ ...s, gen: false }));
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-6">
      <main className="w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold">Studyflow</h1>

        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 text-red-700 p-3 text-sm">{error}</div>
        )}

        <section className="space-y-2">
          <h2 className="font-medium">Upload PDF</h2>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            className="block w-full text-sm file:mr-4 file:rounded-md file:border file:border-gray-300 file:bg-white file:px-3 file:py-2 file:hover:bg-gray-50"
          />
          <div className="text-xs text-gray-500">{loading.pdf ? "Parsing PDF..." : pdfText ? "PDF text extracted" : ""}</div>
        </section>

        <section className="space-y-2">
          <h2 className="font-medium">Paste Link</h2>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/article"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              onClick={handleParseLink}
              className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
              disabled={!linkUrl || !!loading.link}
            >
              {loading.link ? "Parsing..." : "Parse"}
            </button>
          </div>
          {linkTitle && <div className="text-sm text-gray-700">Title: {linkTitle}</div>}
        </section>

        <section className="space-y-2">
          <h2 className="font-medium">Generate AI Notes & Flashcards</h2>
          <button
            onClick={handleGenerate}
            className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
            disabled={!(pdfText || linkText) || !!loading.gen}
          >
            {loading.gen ? "Generating..." : "Generate"}
          </button>
        </section>

        <section className="space-y-2">
          <h3 className="font-medium">Extracted Text Preview</h3>
          <div className="rounded-md border p-3 text-sm max-h-64 overflow-auto whitespace-pre-wrap">
            {(pdfText || linkText) ? (pdfText + (pdfText && linkText ? "\n\n" : "") + linkText) : (
              <span className="text-gray-400">No text extracted yet.</span>
            )}
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="font-medium">AI Output</h3>
          <div className="rounded-md border p-3 text-sm space-y-4">
            {aiOutput ? (
              <div className="space-y-4">
                {aiOutput.notes && (
                  <div>
                    <div className="font-semibold mb-1">Notes</div>
                    <pre className="whitespace-pre-wrap text-sm">{aiOutput.notes}</pre>
                  </div>
                )}
                {Array.isArray(aiOutput.flashcards) && aiOutput.flashcards.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-semibold">Flashcards</div>
                    <ul className="space-y-2">
                      {aiOutput.flashcards.map((fc: any, idx: number) => (
                        <li key={idx} className="rounded border p-2">
                          <div className="text-sm"><span className="font-medium">Q:</span> {fc.question}</div>
                          <div className="text-sm"><span className="font-medium">A:</span> {fc.answer}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-gray-400">No AI output yet.</span>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
