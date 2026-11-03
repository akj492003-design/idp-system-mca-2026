import { FileText } from "lucide-react";
import ProcessingStatus from "./ProcessingStatus.jsx";
import DocumentPreview from "./DocumentPreview.jsx";
import ExtractedInformation from "./ExtractedInformation.jsx";
import OcrExtractedText from "./OcrExtractedText.jsx";
import PredictionResults from "./PredictionResults.jsx";
import ClassProbability from "./ClassProbability.jsx";
import Icon from "../Common/Icon.jsx";

export default function DocumentProcessingResult({ documentData = null, onViewAnalytics }) {
  return (
    <section id="result" className="scroll-mt-20 rounded-lg border border-(color:--c-line) bg-(color:--c-panel) p-3 sm:p-4" aria-labelledby="resultTitle">
      <div className="mb-3 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-(color:--c-primary) text-white"><FileText className="h-5 w-5" /></span>
        <div><h2 id="resultTitle" className="text-lg font-semibold leading-tight">Document Processing Result</h2><p className="text-sm text-(color:--c-muted)">Details of the recently processed document.</p></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ProcessingStatus
          status={documentData?.status ?? "idle"}
          currentStage={documentData?.current_stage}
          progress={documentData?.progress ?? 0}
        />
        <DocumentPreview
          fileUrl={documentData?.preview_url}
          fileName={documentData?.file_name}
          processing={["queued", "processing"].includes(documentData?.status)}
        />
        <ExtractedInformation data={documentData?.extracted_information} />
        <OcrExtractedText text={documentData?.ocr_text ?? ""} pages={documentData?.page_texts ?? []} />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <PredictionResults prediction={documentData?.prediction} />
        <ClassProbability data={documentData?.class_probabilities} />
        <article className="flex flex-col items-center justify-center gap-4 rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-5 text-center">
          <button type="button" onClick={onViewAnalytics} className="group flex h-12 w-full max-w-[330px] cursor-pointer items-center justify-center gap-2 rounded-md border border-(color:--c-accent) bg-linear-to-b from-[#1a7bff] to-(color:--c-primary) text-[15px] font-semibold text-white shadow-lg shadow-blue-600/30 transition duration-300 hover:scale-[1.03] hover:shadow-blue-500/50 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(color:--c-accent)">
            <Icon name="bars" className="h-5 w-5" />View Analytics<Icon name="arrow" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <p className="max-w-xs text-xs leading-relaxed text-(color:--c-muted)">Click to view detailed model performance, comparison, and analytics after processing documents.</p>
        </article>
      </div>
    </section>
  );
}
