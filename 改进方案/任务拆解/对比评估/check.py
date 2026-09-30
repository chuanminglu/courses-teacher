#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
任务实现说明产出 · 自动检查脚本
用法:  python3 check.py runs/A-sonnet5.md [runs/B-deepseek-flash.md ...]

检查项（对应 output-template.md 规则编号）：
  自动项  S1 章节齐备 / S2 章节非空 / T3 开放表述 / D1 DoD标签 /
          X1 排除项条数与点名 / Q2 清单疑问句 / Q3 阻塞类型 / Q4 出处 / Q5 后果
  人工项  G2(T6 语法断言) / G4(Q1 清单一致性) / G5(C4 自相矛盾) / P1-P6 计分项
          —— 脚本只提示，不判定
"""
import re
import sys
import os
from collections import Counter

# ── 配置 ──────────────────────────────────────────────────────────
REQUIRED_SECTIONS = [
    "你要做的事", "对应验收标准", "本任务信息自包含",
    "执行前必须确认清单", "背景", "预计涉及文件", "技术选型",
    "从验收标准推导出的隐含规则", "明确不要做的事",
    "完成定义", "CI/CD", "假设与待确认项", "交付要求",
]
OPEN_EXPRESSIONS = [
    "由实现方选型", "具体方案不限", "由实现方自行", "由实现方决定",
    "可选A或B", "可选 A 或 B", "二选一", "由开发者选择", "由执行者选择",
]
VALID_BLOCK_TYPES = re.compile(r"(阻塞|默认生效-可反馈)")
EVIDENCE = re.compile(r"\[(FACT|INFER|ASSUME|UNKNOWN)\]")
TASK_HEAD = re.compile(r"^##+\s*(T\d{5})", re.M)
CHECKLIST_ITEM = re.compile(r"^\s*-\s*\[[ x]\]\s*\*{0,2}(Q\d+)\*{0,2}")


def split_tasks(text):
    """按 '## T00101：...' 切分，返回 [(tid, body), ...]"""
    parts = TASK_HEAD.split(text)
    # parts = [前言, tid1, body1, tid2, body2, ...]
    out = []
    for i in range(1, len(parts), 2):
        out.append((parts[i], parts[i + 1]))
    return out


def extract_section(body, name):
    """抽取 ### {name} 到下一个 ### 之间的内容"""
    m = re.search(r"^#{2,4}\s*" + re.escape(name) + r"[^\n]*\n(.*?)(?=^#{2,4}\s|\Z)",
                  body, re.S | re.M)
    return m.group(1) if m else None


def check_task(tid, body):
    """返回 (fails, warns)  —— fails 为阻断级失败，warns 为提示"""
    fails, warns = [], []

    # ── S1 章节齐备 ──
    missing = [s for s in REQUIRED_SECTIONS if s not in body]
    if missing:
        fails.append(f"S1 缺章节: {missing}")

    # ── S2 章节非空 ──
    for s in ["从验收标准推导出的隐含规则", "技术选型", "明确不要做的事",
              "完成定义", "假设与待确认项"]:
        sec = extract_section(body, s)
        if sec is None:
            continue
        if len(sec.strip()) < 5:
            fails.append(f"S2 「{s}」章节为空")

    # ── T3 开放表述 ──
    hit = [e for e in OPEN_EXPRESSIONS if e in body]
    if hit:
        fails.append(f"T3 出现开放表述: {hit}  ← G1 阻断")

    # ── Q2–Q5 清单格式 ──
    cl = extract_section(body, "执行前必须确认清单")
    if cl is not None:
        items = [l for l in cl.splitlines() if CHECKLIST_ITEM.match(l)]
        if not items:
            if "无需确认项" not in cl:
                fails.append("Q 清单非空但未解析到条目（格式不符 `- [ ] **Qn**（类型）…`）")
        else:
            nonq = [l for l in items if "？" not in l and "?" not in l]
            if nonq:
                warns.append(f"Q2 {len(nonq)} 条非疑问句（需人工确认是否可回答）")
            noblk = [l for l in items if not VALID_BLOCK_TYPES.search(l)]
            if noblk:
                fails.append(f"Q3 {len(noblk)} 条缺阻塞类型/类型自造")
            noref = [l for l in items if "对应正文" not in l and "对应「" not in l]
            if noref:
                warns.append(f"Q4 {len(noref)} 条未写出处")
            nocons = [l for l in items if "若不" not in l]
            if nocons:
                warns.append(f"Q5 {len(nocons)} 条未写'若不…'后果")

    # ── D1 DoD 证据标签 ──
    dod = extract_section(body, "完成定义")
    if dod:
        items = [l for l in dod.splitlines()
                 if re.match(r"^\s*[-*]\s+\S", l)]
        unlabeled = [l for l in items if not EVIDENCE.search(l)]
        if unlabeled:
            warns.append(f"D1 {len(unlabeled)} 条 DoD 未标证据等级")
        # 完成定义内实测项也应挂 AC 编号（软性）
        noac = [l for l in items if not re.search(r"AC-?\d|F\d|D\d|E\d|P\d", l)]
        if noac:
            warns.append(f"D1/P5 {len(noac)} 条 DoD 未挂验收标准编号")

    # ── X1 排除项 ──
    exc = extract_section(body, "明确不要做的事")
    if exc:
        items = [l for l in exc.splitlines() if re.match(r"^\s*-\s+\S", l)]
        if len(items) < 3:
            fails.append(f"X1 排除项仅 {len(items)} 条（要求 ≥3）")
        if not re.search(r"T\d{5}", exc):
            fails.append("X1 排除项未点名相邻任务 ID")

    # ── T6 提示（不可自动判定）──
    for m in re.finditer(r"[^\n]*", body):
        line = m.group(0)
        if re.search(r"ADD COLUMN|IF NOT EXISTS|支持该语法|版本支持", line) and "[FACT]" in line:
            warns.append("T6 ⚠️ 疑似语法断言标 [FACT] —— **必须人工判定**（grep 误报率约 50%）")
            break

    return fails, warns


def check_file(path):
    text = open(path, encoding="utf-8").read()
    tasks = split_tasks(text)
    name = os.path.basename(path)

    print("=" * 74)
    print(f"  {name}")
    print(f"  字节数 {len(text.encode('utf-8')):,}   任务数 {len(tasks)}")
    print("=" * 74)

    if not tasks:
        print("  ❌ 未解析到任何 '## T00xxx' 任务标题 —— 文件结构不符，无法检查")
        return

    expected = [f"T0010{i}" for i in range(1, 8)]
    got = [t for t, _ in tasks]
    miss = [t for t in expected if t not in got]
    extra = [t for t in got if t not in expected]
    if miss:
        print(f"  ❌ 缺失任务: {miss}")
    if extra:
        print(f"  ⚠️ 多余任务: {extra}")

    pass_n = 0
    for tid, body in tasks:
        fails, warns = check_task(tid, body)
        if fails:
            print(f"\n  {tid}  ❌ 不合格")
            for f in fails:
                print(f"      ✗ {f}")
        else:
            pass_n += 1
            print(f"\n  {tid}  ✅ 自动项通过")
        for w in warns:
            print(f"      ⚠️ {w}")

    print(f"\n  ── 自动项汇总: {pass_n}/{len(tasks)} 个任务通过 ──")
    print("  ── 以下必须人工判定，本脚本不覆盖 ──")
    print("      G2  T6 语法/API 断言是否误标 [FACT]（逐条看标签附着在哪句话上）")
    print("      G4  Q1 清单条数 == 正文非 [FACT] 决策点数（列三列表比对，机械计数不可靠）")
    print("      G5  C4/X4 隐含规则与排除项是否自相矛盾")
    print("      P1–P6 计分项（技术选型穷举度/论证质量/隐含规则/颗粒度/DoD可判定性/排除项精度）")
    print()


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "runs")
        args = [os.path.join(base, f) for f in
                ("A-sonnet5.md", "B-deepseek-flash.md")
                if os.path.exists(os.path.join(base, f))]
        if not args:
            print(__doc__)
            print("未找到 runs/A-sonnet5.md 或 runs/B-deepseek-flash.md，请显式传入文件路径。")
            sys.exit(1)
        print(f"（未指定文件，自动检查 runs/ 下已存在的 {len(args)} 个产出）\n")
    for p in args:
        if not os.path.exists(p):
            print(f"❌ 文件不存在: {p}\n")
            continue
        check_file(p)
