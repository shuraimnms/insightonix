// Minimal markdown-ish renderer for admin-editable pages.
// Supports ## / ### headings, unordered lists, **bold**, paragraphs.
// Kept intentionally small — DB pages are trusted (staff-only writes).

export function Markdown({ source }: { source: string }) {
  const lines = source.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];
  let list: string[] | null = null;

  const flushList = () => {
    if (list) {
      nodes.push(
        <ul key={nodes.length}>
          {list.map((li, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inline(li) }} />
          ))}
        </ul>,
      );
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("### ")) {
      flushList();
      nodes.push(<h3 key={nodes.length}>{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      flushList();
      nodes.push(<h2 key={nodes.length}>{line.slice(3)}</h2>);
    } else if (line.startsWith("- ")) {
      list ??= [];
      list.push(line.slice(2));
    } else if (!line.trim()) {
      flushList();
    } else {
      flushList();
      nodes.push(<p key={nodes.length} dangerouslySetInnerHTML={{ __html: inline(line) }} />);
    }
  }
  flushList();
  return <div className="prose-journal">{nodes}</div>;
}

function inline(s: string) {
  return escape(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
function escape(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
}
