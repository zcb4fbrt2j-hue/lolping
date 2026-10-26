# 一条船缝里的材料智慧｜第五章修改版

第五章改为“以小见大：从材料智慧看时代发展”。基于 `material-wisdom-final-local.pptx` 局部修改第13—15页及其讲稿。15页正式内容＋1页参考附页，全篇约17分钟，第五章约2分30秒。所有旧版本保留。

## 文件

- [可编辑PPTX](build/material-wisdom-chapter-five.pptx)：23,284,946字节。
- [PDF](build/material-wisdom-chapter-five.pdf)：3,125,623字节。
- [16页PNG预览ZIP](material-wisdom-chapter-five-previews.zip)。
- [完整交付ZIP](material-wisdom-chapter-five-delivery.zip)：PPTX、PDF、PNG、讲稿、源文件、资料与验证报告。
- [第五章三页预览](build/previews/chapter-five-preview.png)。
- [第五章修改前后对照](build/previews/chapter-five-before-after.png)。
- [第13—15页替换讲稿](chapter-five-speaker-notes.md)；[完整逐页讲稿](逐页讲稿.md)。
- [图片占位清单与替换说明](图片占位清单与替换说明.md)。
- [资料与图片来源](参考资料与图片来源.md)。

GitHub文件页使用“Download raw file”下载原文件；不要将HTML网页另存为PPTX。

## 实际修改

|页码|内容与版式|
|---|---|
|13|古今左右对照：天然材料与现代材料科学、填塞密封与防腐防污、经验传承与科学验证。保留3:2原生照片占位框；涂层功能示意为可编辑图形。明确比较不表示直接技术传承关系。|
|14|大型16:9博物馆照片占位＋看见什么、理解什么、思考什么；由参观方法转向传统技术的现实启示。展品和真实观察待参观后补充。|
|15|延续简洁深海蓝结束页，保留“材料迭代，匠心接续”，以科技创新回应现实需求、以材料智慧支撑向海图强。|

第13—15页演讲者备注已重写，没有青年使命旧讲稿、JSON或开发记录。用时分别为65、55、30秒。讲稿约614个汉字，实际讲述时间仍需排练确认。沿用现有资料编号[1][2][3][7]，无新增科研数据、应用事实或照片，第16页无需改动。

## 验证

- 第1—12页与第16页的幻灯片XML、关系与备注逐字节一致；第1—12页PNG逐像素一致。
- 第16页PNG有317个局部字形边缘像素差异，源文本、布局和备注均逐字节相同；该渲染差异已单独记录，不声称全部16页像素完全相同。
- 16页均经LibreOffice渲染；PDF为16页，PNG均为1920×1080。
- 第13—15页独立视觉复核；自动检查无文字溢出、重叠、几何错误、视觉或设计警告。保留5项非阻断的面积密度提示，详见QA报告。
- 219个原生可编辑文字对象，6张原始高清照片及其授权信息保留；封面照片未重复。
- 5处原生图片占位框已通过插入、保存、重新打开及裁剪比例测试（测试只在临时副本进行，交付文件仍留空）。未进行桌面版PowerPoint人工UI测试。
- 772份此前文件的SHA-256保持一致，所有旧PPT和coursework-ppt均未修改。

## 源文件与复现

`outline.json` 是内容、讲稿和布局的正式源文件；`timing-and-chapters.json` 保存章节与时间。`source/chapter_five.js` 为本轮局部布局模板，`source/course_refined.js` 和 `source/photo_light.js` 保留依赖快照。源码遵循随附Apache-2.0许可证；照片许可单列于来源文档。

在此GitHub分支的仓库中执行：

```bash
bash presentations/material-wisdom-chapter-five-20261026/rebuild.sh
python presentations/material-wisdom-chapter-five-20261026/package_delivery.py
```

需要已安装的Node.js/PptxGenJS、Python依赖、Noto Sans CJK SC、LibreOffice和Poppler。不会在生成过程中重新安装依赖。单独下载交付ZIP时，`restore_photo_assets.py` 可按SHA-256从PPTX还原原始JPEG；完整重建仍需仓库内presentation-skill和对应模板。

后续博物馆照片应提供展品名称与性质、拍摄地点、日期、摄影者及使用许可。第1、2、13、14页使用独立原片；模型观察不能替代真实防水性能试验。插入照片后删除同名 `_LABEL` 提示文字，再按实际展品填写说明并复核裁剪。
