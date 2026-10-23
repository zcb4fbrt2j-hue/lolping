# 15 页研究生课程汇报 PPT 交付

《一条船缝里的材料智慧——从传统福船艌缝到现代船舶防护材料，看海洋强国建设之路》

本目录直接复制已经完成的文件，**未重新生成或修改 PPT 内容与设计**。PPTX、PDF 和预览与原件 SHA-256 一致。

## 从 GitHub 下载

- [下载可编辑 PPTX](https://github.com/zcb4fbrt2j-hue/lolping/raw/refs/heads/deliver/ppt-15-slides-20261023/deliverables/academic-presentation.pptx)
- [下载 PDF](https://github.com/zcb4fbrt2j-hue/lolping/raw/refs/heads/deliver/ppt-15-slides-20261023/deliverables/academic-presentation.pdf)
- [下载完整 ZIP：PPTX、PDF、全部预览、源码、讲稿与资料清单](https://github.com/zcb4fbrt2j-hue/lolping/raw/refs/heads/deliver/ppt-15-slides-20261023/deliverables/academic-presentation-bundle.zip)
- [查看预览总览](previews/contact-sheet.jpg)

如果直接下载被浏览器拦截，请打开对应文件的 GitHub 页面，点击右上角 **Download raw file / 下载原始文件**。
请保留 `.pptx` 扩展名；不要把 GitHub 文件页面的 HTML 保存成 PPTX。私有仓库需要先登录有访问权限的 GitHub 账号。

[文件页面：PPTX](https://github.com/zcb4fbrt2j-hue/lolping/blob/deliver/ppt-15-slides-20261023/deliverables/academic-presentation.pptx)

也可克隆对应分支：

```bash
git clone --branch deliver/ppt-15-slides-20261023 --single-branch https://github.com/zcb4fbrt2j-hue/lolping.git
```

文件在克隆目录的 `deliverables/` 中。分支内是真实二进制文件，不是 Git LFS 指针。

## 文件与完整性

| 文件 | 大小（字节） | 已做检查 |
| --- | ---: | --- |
| `academic-presentation.pptx` | 323,128 | ZIP CRC、全部 XML 解析、python-pptx 重新打开；15 页、231 个非空可编辑文本形状 |
| `academic-presentation.pdf` | 1,489,421 | PDF 重新打开；15 页，每页均可提取文字 |
| `previews/slide-01.png`—`slide-15.png` | 合计 2,393,886 | 15 张均通过图像完整性校验；每张 1600 × 900 |
| `previews/contact-sheet.jpg` | 491,529 | 图像完整性校验；1440 × 1510 |

全部逐项大小及原件校验值见 [integrity-report.json](integrity-report.json)。
[SHA256SUMS.json](SHA256SUMS.json) 包含交付文件哈希；ZIP 内各文件另有 `BUNDLE-SHA256SUMS.json`。

原 PPTX SHA-256：

```text
85a7672cdbfe5c3358122ddf01e3f4b0c286f9aeebf364176c49d893efc49d7c
```

以上文件远低于 GitHub 100 MiB 单文件限制，采用普通 Git 提交，无需 Git LFS。

## 源码与使用

`source/` 保留生成器、渲染检查脚本、依赖版本、所需图片、逐页规划、讲稿、原检查报告与参考资料清单。
源码与之前生成时保持一致，本次没有执行生成器或渲染器来替换已完成文件。

如以后需要重新生成，先安装 `source/requirements.txt` 中的 Python 依赖，以及 LibreOffice 和 Noto Sans CJK SC 字体，然后运行：

```bash
python deliverables/source/build_deck.py
python deliverables/source/render_and_check.py
```

脚本以自身目录为工作目录，在 `source/` 内生成中文文件名的 PPTX/PDF 和预览，**不会覆盖本目录顶层的英文文件名交付件**。
PPTX 使用 Noto Sans CJK SC，未嵌入字体；接收电脑缺少字体时应安装后检查版式。

参考资料与图片署名、使用边界见 [来源清单](source/sources/参考资料与核验记录.md)。照片保留原机构署名，没有宣称获得开放或商业再分发许可。

## 合并到 main

[创建 Pull Request：main ← deliver/ppt-15-slides-20261023](https://github.com/zcb4fbrt2j-hue/lolping/compare/main...deliver/ppt-15-slides-20261023?expand=1)

分支推送后即可下载，无需等待 PR 合并。
