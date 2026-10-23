# coursework-ppt 安装与调用

上游：https://github.com/Tang1206cc/codex-academic-presentation-skill

安装来源提交：`6aed88f1461ed9eec1ceb5f5f0f935b68efabd56`。
将上游 `skill包/coursework-ppt/` 完整复制到 `.agents/skills/coursework-ppt/`，两个文件保持原样。
上游该版本没有模板、生成脚本、参考文件或依赖清单；原 README 保存在本目录的 `UPSTREAM_README.md`。
上游该版本未提供 LICENSE 文件，使用或再分发时应留意其授权状态。

## 调用

支持项目 Skill 发现的客户端可在新会话尝试 `$coursework-ppt`，但安装文件并不证明网页版已自动识别。
如果未识别，请明确输入：

```text
请先阅读并遵循 .agents/skills/coursework-ppt/SKILL.md，使用其中流程制作中文研究生学术 PPT。
作业要求：materials/作业要求.pdf
主题说明：materials/主题说明.txt
参考资料：materials/
输出：outputs/研究主题汇报.pptx
允许检索权威来源，不编造数据；完成后检查引用、字号和版式。
```

需提供实际存在的材料路径。此 Skill 是制作流程说明，不能独立执行，也不自带 PPTX 引擎。
当前会话已通过直接阅读入口并按其流程制作测试页验证人工调用路径。

## 环境与复现

本次环境：Python 3.12.14、Node.js v24.19.0、npm 11.9.0；Python PPTX 依赖版本见 `requirements.txt`。
选择 `python-pptx` 生成可编辑 PPTX，因此本流程不需要 Node 包。
中文字体 `Noto Sans CJK SC` 可用。接收方机器仍需安装兼容字体。

从项目根目录运行：

```bash
python -m venv .venv
.venv/bin/python -m pip install -r docs/coursework-ppt/requirements.txt
.venv/bin/python scripts/coursework_ppt_smoke.py
```

若当前 Python 已有上述依赖，直接运行 `python scripts/coursework_ppt_smoke.py`。
脚本会覆盖固定测试输出 `examples/coursework-ppt/中文学术汇报_测试页.pptx`。
单页规划：以“从研究问题到可追溯的证据”为主张，以 Skill 中的问题、证据、分析流程为依据，
用三列可编辑文本呈现；不添加虚构实证结果。

验证包括：ZIP CRC、全部 XML/关系文件解析、python-pptx 重新读取、页数、中文内容及元素页面边界。
当前无 LibreOffice，未执行 Office 渲染、像素级溢出检查或 PowerPoint GUI 打开验证。

## 提交与 main 合并

安装及测试文件保存在当前工作分支，并创建本地 Git 提交；不直接推送或改写 main。
在 Codex 界面提供的创建 PR 入口提交工作分支，将目标设为 `main` 后审阅合并。
若界面无 PR 入口，可在有远程写权限的终端执行：

```bash
git switch -c install/coursework-ppt
git push -u origin install/coursework-ppt
```

然后在 GitHub 从该分支向 `main` 创建 PR。需要先确保分支名尚未被使用。
