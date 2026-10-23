# presentation-skill 安装与使用

安装位置：`.agents/skills/presentation-skill/`。

来源：[JohnTan38/presentation-skill-codex](https://github.com/JohnTan38/presentation-skill-codex)，提交 `4b337b8f72a05369583fc98c0b877ceaaf7786d0`。
上游 package 版本为 `0.1.5`。完整复制其 74 个原始文件，保留许可证、作者信息、脚本、模板、参考文件、示例及 agent 元数据；排除 `.git`。

## 许可证

已阅读上游 `LICENSE`、`README.md`、`SKILL.md` 与依赖说明。该版本使用 Apache-2.0，允许复制、修改及分发，需保留许可证和相关声明。
上游版权声明为 `Copyright 2026 Siril Sengolraj`，已原样保留；该 checkout 没有单独的 NOTICE 文件。
npm/Python 依赖和外部素材遵循各自许可，不随源码提交虚拟环境或 node_modules。

本安装没有修改上游原始文件；新增 `package-lock.json` 与 `requirements.lock.txt` 固定依赖。
逐文件核对记录见 `upstream-files.sha256.json`。

## 环境与安装

本次已在当前 Codex 云环境实际安装并测试：Python 3.12.14、Node.js v24.19.0、npm 11.9.0。
Python 使用 Skill 目录下的独立 `.venv`；Node 包使用 Skill 自己的 `node_modules`。
已有 LibreOffice、Poppler、中文字体；安装过程保留 TLS 和包完整性校验。

从项目根目录执行可复现安装：

```bash
bash scripts/setup_presentation_skill.sh
```

该脚本安装锁定的 Python 依赖、执行 `pip check`，并使用 `npm ci --ignore-scripts` 安装 npm 锁定依赖；已验证 sharp 与图标相关依赖可正常加载。
缓存放在 `.venv` 内，适应云环境中 HOME 只读的情况。脚本已重复执行成功。
制作 PPT 时直接使用现成环境，不在每次生成任务中重复安装。

运行 Python 脚本时使用：

```bash
.agents/skills/presentation-skill/.venv/bin/python .agents/skills/presentation-skill/scripts/edit_deck.py --help
```

核心本地工作流无需 API 密钥。联网素材、生成图片、Mermaid 特定外部后端均为可选，本次未启用或测试；没有配置任何密钥。

## 与 coursework-ppt 配合

- `coursework-ppt`：主题、论证、学术资料核查与引用。
- `presentation-skill`：结构化生成、已有 PPT 的安全修改、视觉排版与质量检查。

新建 PPT 先写结构化 outline 或 workspace，再使用 Skill 自带渲染器；已有 PPT 的单点文字修改使用 `edit_deck.py`，无需重建整份文稿。
网页版的自动 Skill 发现没有得到独立验证。如果 `$presentation-skill` 未识别，明确要求先读取：

```text
请阅读并遵循 .agents/skills/coursework-ppt/SKILL.md 进行内容策划和资料核验，
再阅读 .agents/skills/presentation-skill/SKILL.md 完成 PPT 生成、修改与质检。
现有正式 PPT 作为只读输入，修改另存副本。
```

## 验证结果

详细结果见 `validation/acceptance.json`。

1. 入口元数据有效，上游文件与来源提交内容逐字节一致。
2. Python 依赖检查通过，五个 Node 核心模块可加载，安装脚本可重复执行。
3. `preflight.py` 检查 3 页安装 outline 通过；Node 生成器产出可编辑 PPTX，包含中文、图标、卡片与表格。
4. `qa_gate.py` 严格几何、设计与视觉检查通过，无溢出、重叠、占位文字或设计告警；3/3 页实际渲染。
5. 独立视觉检查发现首轮副标题对比度偏低；从测试源样式改为 lab-report，重新生成并完成复验。过程见 `validation/manual-review.md`。
6. markitdown 可读取中文，无占位文字残留。
7. 上游 Node 回归套件 7/7 通过；该套件本次运行不含逐例渲染，不能替代上述实际渲染验证。
8. 自带 `edit_deck.py` 读取正式 PPT，在独立副本替换一处文字，副本仍为 15 页，生成 15 张可读预览；同路径覆盖操作被拒绝。
9. 操作前后核对 coursework-ppt、原交付目录及原制作目录共 88 个文件，哈希全部一致。

15 页修改副本与预览仅保存在被忽略的 `.local/presentation-skill-tests/`，没有替换正式交付件。
提交的 `validation/installation-smoke.pptx` 是独立的 3 页安装测试，不是课程 PPT 的更新版本。

## 常用命令

读取现有文稿：

```bash
.agents/skills/presentation-skill/.venv/bin/python .agents/skills/presentation-skill/scripts/edit_deck.py list-slides --input input.pptx
```

单点修改并另存：

```bash
.agents/skills/presentation-skill/.venv/bin/python .agents/skills/presentation-skill/scripts/edit_deck.py replace-text --input input.pptx --output revised.pptx --find '原文字' --replace '新文字' --require-match
```

生成预览：

```bash
.agents/skills/presentation-skill/.venv/bin/python .agents/skills/presentation-skill/scripts/render_slides.py --input revised.pptx --outdir revised-renders
```

交付前还须按 Skill 的 QA 与视觉复验流程检查。字体替代、图表/SmartArt/母版文本等超出简单 run 替换的情况，应采用相应结构化或 XML 工作流。

## GitHub 合并

安装分支：`install/presentation-skill-20261023`，以本次最新 `origin/main`（`e05c30a335afe82c7a7b4797867ea888374906d5`）为基础创建。

[创建 PR，目标 main](https://github.com/zcb4fbrt2j-hue/lolping/compare/main...install/presentation-skill-20261023?expand=1)。
PR 仅包括新 Skill、依赖锁、安装脚本、说明和测试证据；不包含旧课程 PPT 的改动。
