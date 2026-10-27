# PPT Master 项目级安装记录

已使用官方跨Agent安装命令安装 **PPT Master v6.7.3**，仅选择Codex、项目级、复制模式。源仓库：https://github.com/hugohe3/ppt-master ，已核验提交：`78759bf62e9a1ef43e926ff9e50afa4cfe9a63cb`。

## 目录与分支

- 项目内路径：`.agents/skills/ppt-master/`。
- 本次独立工作区：`/workspace/lolping-ppt-master`，属于同一个lolping仓库的Git worktree。
- 安装分支：`install/ppt-master-20261027`，基于检查时最新的 `origin/main`（`8d8b957`）。
- 原工作区 `/workspace/lolping` 继续保留此前PPT工作分支及所有文件。本次没有切换或修改它。
- Python虚拟环境：`/workspace/venvs/ppt-master-20261027`，位于仓库之外，不提交Git。

正式安装命令（Node.js v24.19.0、npm 11.9.0、skills CLI 1.7.4）：

```bash
npm_config_cache=/tmp/ppt-master-npm-cache DISABLE_TELEMETRY=1 \
  npx --yes skills add hugohe3/ppt-master \
  --agent codex --skill ppt-master --copy --yes --json
```

第一次尝试CLI帮助时，默认npm缓存目录不可写；将缓存指定到 `/tmp` 后成功。未采用手工删减版安装。`skills-lock.json` 保留官方CLI生成的来源及内容哈希。

## 官方文档与许可证

已阅读上游README、SKILL.md、MIT许可证及requirements说明。安装包含13,030个官方文件（39,244,270字节），逐文件Git blob哈希与上述提交一致，缺失、额外及改写文件均为0。保留全部 scripts、templates、references、workflows、LICENSE、署名文件和 `.env.example`。

- PPT Master主体：MIT，版权归Hugo He。
- 图标另有许可：CHUNK为CC BY 4.0，Tabler与Phosphor为MIT，Simple Icons为CC0且品牌标志可能有单独权利限制。完整说明保留于 `templates/icons/THIRD_PARTY_NOTICES.md`。
- PDF转换依赖PyMuPDF为AGPL-3.0／商业双许可，不由PPT Master的MIT许可证覆盖。依赖安装在虚拟环境，未将依赖二进制再分发进仓库。
- `upstream-README.md` 与 `upstream-README_CN.md` 是审阅快照，内部相对链接依原仓库目录；使用时优先打开官方在线README或项目内实际Skill路径。

## 依赖与冲突验证

Python 3.12.14满足官方Python 3.10+要求。使用全新虚拟环境安装官方requirements全部依赖，未继承系统site-packages。19项直接依赖模块导入成功，`pip check` 返回 `No broken requirements found.`。本次没有修改全局Python的131项已安装发行包。

现有coursework-ppt与presentation-skill保持不变。三个Skill名称及目录互不覆盖；功能范围有交集，因此后续应显式指定使用哪个Skill，避免混用不同工作流。已核验原工作区3,669个文件的SHA-256不变，覆盖现有Skills、PPT及素材。

依赖版本记录：`requirements-tested.txt`。新云环境中可执行：

```bash
bash tools/ppt-master/setup.sh
bash tools/ppt-master/run.sh attribution_guard.py
```

可用 `PPT_MASTER_VENV` 指定其他独立虚拟环境。需要按Skill原命令运行 `python3` 时，先激活该虚拟环境；也可以通过 `tools/ppt-master/run.sh <script.py> [参数]` 调用。

本次没有创建真实 `.env`、配置API密钥或调用付费API。`.gitignore` 已覆盖真实环境配置、虚拟环境和常见缓存，并保留官方 `.env.example`。AI图片等外部服务功能按需配置；本次不声称已验证外部API服务。

## 验证结果与边界

- 官方 `attribution_guard.py` 返回0。
- 315个Python脚本通过语法解析；SKILL.md中的相对文件链接齐全。
- SVG/PPTX导入导出、源资料转换、SVG质量检查、项目管理与模板注册共6个CLI的 `--help` 均正常加载。
- `npx skills list --agent codex --json` 同时列出coursework-ppt、presentation-skill、ppt-master；ppt-master显示 `scope: project`、`agents: [Codex]`。
- 上述证明安装器能够发现Codex项目级Skill；**不等于当前网页版Codex会话已自动热加载它**。本次会话可显式读取其SKILL.md。合并后，在包含该目录的分支开启新任务再检查自动发现。
- 遵照本次任务范围，没有生成测试PPT，没有读取、编辑或删除现有PPT内容，也未进行PPT生成端到端测试。文件保全检查仅计算原始文件哈希。

复核命令：

```bash
PYTHONDONTWRITEBYTECODE=1 /workspace/venvs/ppt-master-20261027/bin/python \
  tools/ppt-master/verify_installation.py
```

验证详情见 `validation.json`、`codex-skill-discovery.json`、`upstream-file-audit.json`、`preservation.json`。

## 后续调用

在此安装分支／合并后的main中使用：

> 请使用 `$ppt-master` 完成这项PPT任务。如果没有自动识别，请先读取 `.agents/skills/ppt-master/SKILL.md`，使用PPT Master独立虚拟环境执行脚本，并按照该Skill的路由处理。

在当前仍保留旧PPT分支的原工作区中，也可明确指定绝对路径：

> 请读取 `/workspace/lolping-ppt-master/.agents/skills/ppt-master/SKILL.md` 并使用PPT Master；Python环境为 `/workspace/venvs/ppt-master-20261027`。

Skill正式使用时要求先通过归属完整性检查，再读取路由；本次仅安装验证，不启动演示文稿制作工作流。

## GitHub交付状态

安装分支已推送。实际执行 `gh pr create --base main --head install/ppt-master-20261027` 时，当前云环境返回 `Post "https://api.github.com/graphql": Forbidden`，因此没有创建成功的PR编号，也不将创建页面链接称为已创建PR。

[打开预填PR创建页面（目标main）](https://github.com/zcb4fbrt2j-hue/lolping/compare/main...install/ppt-master-20261027?expand=1&title=Install%20PPT%20Master%20for%20Codex%20with%20isolated%20dependencies)

PR说明见 [PULL_REQUEST.md](PULL_REQUEST.md)。检查后可在GitHub创建并合并；本次未自动合并main。
