# 《一条船缝里的材料智慧》第二版 · 三页视觉样张

本轮仅制作3页供确认：封面、第一章代表页、第四章代表页。没有制作其余12页，没有覆盖原版15页。

## 文件下载

- [可编辑PPTX](build/material-wisdom-v2-samples.pptx)（GitHub文件页点击下载按钮或 Raw）。
- [PDF预览](build/material-wisdom-v2-samples.pdf)。
- [PNG预览目录](build/previews/)。
- [完整包ZIP](build/material-wisdom-v2-samples-bundle.zip)。
- [图片与资料来源](图片与资料来源.md)。
- [三页规划](三页样张规划.md)、[研究证据](evidence_plan.json)、[视觉设计](design_brief.json)。

通过独立分支 `redesign/material-wisdom-v2-samples-20261024` 交付。若GitHub网页不能预览PPTX，下载后用PowerPoint或LibreOffice打开；无需依赖Codex内部附件。私人仓库下载需登录有权限的GitHub账号。

## 生成与检查

已读取 `.agents/skills/coursework-ppt/SKILL.md` 做内容与来源核查；读取 `.agents/skills/presentation-skill/SKILL.md` 做编辑式摄影布局、原生PPT制作和QA。没有声称网页版自动识别了本地Skill。

内容和样式源为 `outline.json` 与配套规划文件。生成使用 presentation-skill 的仓库构建器，并扩展 `photo-editorial` 可复用模板；扩展位于 `.agents/skills/presentation-skill/templates/pptxgenjs/photo_editorial.js`，调度改动仅5行，未改动旧PPT和coursework-ppt。29个原生非空文本对象，4个独立图片对象；图文均可编辑，未将整页栅格化。备注中有事实/本组分析区分与讲述提示。

在已配置项目环境中执行：

```bash
bash presentations/material-wisdom-v2-samples/rebuild.sh
```

依赖使用已安装的Node/PptxGenJS、image-size、Python python-pptx/Pillow/lxml/PyMuPDF、LibreOffice及pdftoppm；未重新安装依赖。完整重建需本分支的Skill脚本；ZIP也包含本次修改的渲染文件和许可证备份。

验证记录：`build/integrity.json`、`build/qa/qa_report.json`、`build/qa/manual-review.md`。LibreOffice逐页渲染，PPTX ZIP/XML有效，PDF3页，PNG3张，照片裁剪比例已计算核对，文本无溢出或重叠，未发现占位文字。自动QA保留2项摄影面积密度提示，人工已复查，不是几何错误。

限制：福船原图约500像素宽，略软，未用AI扩图；图片原页未见开放许可，不声称可自由再分发，课堂引用保留来源。2035科技强国目标已核实；“十六个强国”完整官方表述尚未核实，未冒充政策原话；邮轮照片不作为科研项目涂层应用证明。

原文件保护记录见 `build/original-preservation.json`。本轮未修改任何旧PPT、讲稿、素材或coursework-ppt文件。
