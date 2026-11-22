"use client";

import { EyeOff, LayoutGrid, Palette, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Style1Nocturne } from "./style-1-nocturne";
import { Style2Swiss } from "./style-2-swiss";
import { Style3Gallery } from "./style-3-gallery";
import { Style4Foundry } from "./style-4-foundry";
import { Style5Maison } from "./style-5-maison";
import styles from "./style-switcher-shell.module.css";

export const STYLE_OPTIONS = [
  {
    id: 1,
    shortLabel: "01 暗夜建筑",
    name: "Nocturne Monolith",
    cnName: "暗夜金属建筑美学",
    dot: "#caa976",
    palette: ["#0a0b0d", "#14161a", "#caa976", "#f3efe7"],
    summary: "深黑曜石与香槟黄铜，全屏电影级夜景立面轮播与交互式四大工艺矩阵，极具高级建筑质感。",
  },
  {
    id: 2,
    shortLabel: "02 瑞士网格",
    name: "Swiss Atelier Index",
    cnName: "瑞士极简建筑目录",
    dot: "#111211",
    palette: ["#f8f7f4", "#ffffff", "#111211", "#8c5a32"],
    summary: "外露 1px 瑞士网格线、高辨识度无衬线排版、可按品类筛选的作品索引与四步制程协议。",
  },
  {
    id: 3,
    shortLabel: "03 美术馆画册",
    name: "Alabaster Gallery",
    cnName: "温润美术馆画册风",
    dot: "#9f7e4c",
    palette: ["#f3efe7", "#e7e0d3", "#1f1e1a", "#9f7e4c"],
    summary: "温润雪花石膏与洞石肌理、优雅斜体衬线、同现场双图叙事章节与可切换表面材质工坊。",
  },
  {
    id: 4,
    shortLabel: "04 精密工坊",
    name: "Foundry Blueprint",
    cnName: "精密工业工程风",
    dot: "#c85a28",
    palette: ["#15191f", "#e9ecf0", "#c85a28", "#f5f7f9"],
    summary: "面向建筑师与总包方的工业精密风，首屏独创「竣工实景 ↔ 车间1:1预装」切换器与区域交付表。",
  },
  {
    id: 5,
    shortLabel: "05 巴黎高定",
    name: "Maison Lumière",
    cnName: "巴黎高定旗舰奢华",
    dot: "#b08e52",
    palette: ["#faf8f4", "#121722", "#b08e52", "#efeae1"],
    summary: "芳登广场对称式高定美学，丝绒午夜蓝与烫金双细线画框，按年代浏览全球高奢旗舰履历。",
  },
] as const;

type StyleId = 1 | 2 | 3 | 4 | 5;

export function StyleSwitcherShell({
  initialStyle = 1,
  initialClean = false,
}: {
  initialStyle?: StyleId;
  initialClean?: boolean;
}) {
  const [styleId, setStyleId] = useState<StyleId>(initialStyle);
  const [collapsed, setCollapsed] = useState(initialClean);
  const [compareOpen, setCompareOpen] = useState(false);

  const selectStyle = (next: StyleId) => {
    setStyleId(next);
    setCompareOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set("style", String(next));
    window.history.replaceState({}, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key >= "1" && event.key <= "5") {
        event.preventDefault();
        selectStyle(Number(event.key) as StyleId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {styleId === 1 && <Style1Nocturne />}
      {styleId === 2 && <Style2Swiss />}
      {styleId === 3 && <Style3Gallery />}
      {styleId === 4 && <Style4Foundry />}
      {styleId === 5 && <Style5Maison />}

      {!initialClean && (
        <>
          {compareOpen && (
            <div className={styles.drawer} role="dialog" aria-label="Compare 5 homepage styles">
              <div className={styles.drawerHead}>
                <div>
                  <h3>国耀金属首页 · 5种全新UI风格对比</h3>
                  <p>点击任意卡片立即切换预览（也可使用快捷键 Alt + 1~5），确认方案后即可清理其余风格并合并至 main。</p>
                </div>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setCompareOpen(false)}
                  aria-label="Close comparison"
                >
                  <X size={14} /> 关闭
                </button>
              </div>

              <div className={styles.drawerGrid}>
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`${styles.styleCard} ${styleId === opt.id ? styles.styleCardActive : ""}`}
                    onClick={() => selectStyle(opt.id as StyleId)}
                  >
                    <div className={styles.paletteStrip}>
                      {opt.palette.map((hex) => (
                        <span key={hex} style={{ background: hex }} />
                      ))}
                    </div>
                    <div>
                      <small>STYLE 0{opt.id} · {opt.name}</small>
                      <strong>{opt.cnName}</strong>
                    </div>
                    <p>{opt.summary}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {collapsed ? (
            <button
              type="button"
              className={styles.collapsedBtn}
              onClick={() => setCollapsed(false)}
              aria-label="Open 5-style switcher"
            >
              <Palette size={15} /> 切换风格 (0{styleId}/05)
            </button>
          ) : (
            <aside className={styles.dock} aria-label="Homepage style selector">
              <div className={styles.bar}>
                <span className={styles.label}>风格预览</span>
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`${styles.tabBtn} ${styleId === opt.id ? styles.tabBtnActive : ""}`}
                    onClick={() => selectStyle(opt.id as StyleId)}
                    aria-pressed={styleId === opt.id}
                  >
                    <span className={styles.swatch} style={{ background: opt.dot }} />
                    {opt.shortLabel}
                  </button>
                ))}
                <span className={styles.divider} aria-hidden="true" />
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setCompareOpen((v) => !v)}
                >
                  <LayoutGrid size={14} /> 对比
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => {
                    setCompareOpen(false);
                    setCollapsed(true);
                  }}
                  title="收起风格切换栏以纯净预览"
                >
                  <EyeOff size={14} /> 收起
                </button>
              </div>
            </aside>
          )}
        </>
      )}
    </>
  );
}
