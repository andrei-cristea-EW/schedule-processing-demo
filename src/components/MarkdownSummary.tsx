import MarkdownRenderer from './MarkdownRenderer';

interface MarkdownSummaryProps {
  content: string;
}

export default function MarkdownSummary({ content }: MarkdownSummaryProps) {
  return (
    <div className="markdown-summary">
      <MarkdownRenderer content={content} className="summary-content" />
    </div>
  );
}