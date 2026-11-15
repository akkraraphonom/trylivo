import Image from "next/image";
import Link from "next/link";
import { createElement, Fragment } from "react";
import type { RichNode } from "@/lib/types";

const ALLOWED = new Set([
  "p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "strong", "em", "b", "i", "u",
  "br", "a", "blockquote", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td", "code", "pre", "hr",
]);

function renderNode(node: RichNode, key: number): React.ReactNode {
  if (typeof node === "string") return node;
  const { t, a = {}, c } = node;
  const children = c.map(renderNode);

  if (t === "img") {
    const src = String(a.src ?? "");
    if (!src) return null;
    return (
      <Image
        key={key}
        src={src}
        alt={String(a.alt ?? "")}
        width={Number(a.width ?? 1200)}
        height={Number(a.height ?? 800)}
        className="h-auto w-full rounded-2xl"
      />
    );
  }
  if (t === "a") {
    const href = String(a.href ?? "#");
    return href.startsWith("/") ? (
      <Link key={key} href={href}>
        {children}
      </Link>
    ) : (
      <a key={key} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  if (t === "br") return <br key={key} />;
  if (!ALLOWED.has(t)) return <Fragment key={key}>{children}</Fragment>;
  return createElement(t, { key }, ...children);
}

/** Renders the CMS rich-text tree (journal posts, legal pages, size guide). */
export function RichText({ nodes, className }: { nodes: RichNode[]; className?: string }) {
  return <div className={className ?? "prose-ecom"}>{nodes.map(renderNode)}</div>;
}
