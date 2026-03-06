'use client';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

type Submission = { keyword: string; html_code: string };

export function PortfolioDownloadButton({ studentName, submissions }: { studentName: string; submissions: Submission[] }) {
  async function downloadZip() {
    const zip = new JSZip();
    submissions.forEach((submission) => {
      zip.file(`${studentName}_${submission.keyword}.html`, submission.html_code);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${studentName}_portfolio.zip`);
  }

  return (
    <button className="rounded bg-emerald-600 px-4 py-2" onClick={downloadZip}>
      Download Portfolio ZIP
    </button>
  );
}
