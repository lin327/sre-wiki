import { visit } from "unist-util-visit";

/**
 * Remark plugin that converts wikilink syntax to standard markdown links.
 *
 * Supported syntax:
 *   [[slug]]        -> <a href="/slug">slug</a>
 *   [[slug|text]]   -> <a href="/slug">text</a>
 */
export default function remarkWikilinks() {
  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || index === null) return;

      const regex = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;
      const value = node.value;

      // Fast bail — no wikilink markers at all
      if (!value.includes("[[")) return;

      const children = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(value)) !== null) {
        // Text before the wikilink
        if (match.index > lastIndex) {
          children.push({
            type: "text",
            value: value.slice(lastIndex, match.index),
          });
        }

        const slug = match[1].trim();
        const text = match[2] ? match[2].trim() : slug;

        children.push({
          type: "link",
          url: `/${slug}`,
          children: [{ type: "text", value: text }],
        });

        lastIndex = regex.lastIndex;
      }

      // No wikilinks found
      if (lastIndex === 0) return;

      // Trailing text after the last wikilink
      if (lastIndex < value.length) {
        children.push({ type: "text", value: value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...children);
      return index + children.length;
    });
  };
}
