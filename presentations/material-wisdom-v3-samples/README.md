# V3返工：图片素材核验结果（尚未制作PPT）

**本目录不是V3三页PPT交付。当前仅完成原文件检查与素材库核验；PPTX、PDF和三页PNG尚未生成。**

按本轮要求，先建立图片库、核实拍摄内容，再进入排版。现代船舶和洋山港原图已核对；传统部分仍缺少“高清且船型确认的福船照片”及“高清且工艺内容确认的传统建造/艌缝照片”。不能将未核实的复原船称为福船，也不能把静态涂装船体称为艌缝现场，因此暂未进入制作与渲染阶段。

原版15页、V2三页以及两个Skill的231个既有文件哈希均未变化，见 [保护记录](original-preservation.json)。本轮没有制作后续12页、没有重新安装依赖、没有修改Skill渲染器。

## 已核对、可用于后续制作的高清原图

| 拟用位置 | 原图与主题关系 | 尺寸 | 作者与许可 |
|---|---|---|---|
| 封面现代部分 | COSCO Shipping Universe，IMO 9795610；鹿特丹港拍摄的中国远洋船舶场景。仅说明现代船舶，不指认任何涂层科研成果 | 4306×2422 | Alf van Beem；Public domain |
| 第3页场景 | 洋山深水港岸桥与船舶装卸实景。2013年历史照片，不能作为2026年自动化水平或当前统计证据 | 4592×3056 | Bruno Corpet (Quoique)；CC BY-SA 3.0 |

- [现代船舶原图](assets/verified/cosco-universe-original.JPG)：4,044,494字节。[来源页](https://commons.wikimedia.org/wiki/File:Cosco_Shipping_Universe_(ship,_2018)_IMO_9795610,_Port_of_Rotterdam_pic7.JPG)。
- [洋山港原图](assets/verified/yangshan-2013-original.JPG)：2,286,189字节。[来源页](https://commons.wikimedia.org/wiki/File:Shanghai-Yangshan-Port-Containers2013-03.JPG)。

二者来自摄影者自行上传的原始图；文件尺寸、相机EXIF、拍摄时间和原页描述已交叉检查。没有AI生成、插值放大、调色或补画。平台元数据和相机信息是来源证据，不代表进行过独立现场鉴定。

## 未获选用的高清候选

| 候选 | 尺寸 | 可确认内容 | 未选原因 |
|---|---|---|---|
| “太平公主号”复原船整体 | 4256×2832 | Paul A. Hernandez，2008-10-18 15:08:37，Nikon D700，Hyde Street Pier；CC BY 2.0 | 原页可确认中国木帆船复原船，但具体“福船”船型尚缺可访问的一手资料核验 |
| 同船船艏/船体另一机位 | 4256×2832 | 同摄影者，2008-10-18 15:10:42，Nikon D700；独立原片，不是上一张裁剪 | 画面是静态涂装后船体，不能称为艌缝施工；不能替代工艺实景 |

[整体候选原页](https://commons.wikimedia.org/wiki/File:Princess_Taiping_2.jpg) · [船体候选原页](https://commons.wikimedia.org/wiki/File:Princess_Taiping.jpg)。两张仅保存在 `assets/pending/`，均 `selected_for_ppt=false`，不算完成图片替换。

既有500像素宽的非遗原图、580像素宽的博物馆福船照未被选为大幅照片。检出的4288像素“航海博物馆内”照片实际呈现现代船舶，尽管清晰，也因主题不符排除。普通中国帆船、其他国家船舶和船型未明的模型同样未被当作福船。

## 缺失素材与访问困难

详见 [检索与受阻记录](sources/search-and-blockers.md)。

1. 封面仍缺一张可确认具体船型的高清福船实船/复原船照片。
2. 第2页仍缺一张高清且内容可核验的福船、传统木船建造或相关工艺照片，不能靠图片外观推断“艌缝”。
3. 中国非遗网搜索、UNESCO高清图接口和航海博物馆官网多次返回503或验证页；香港海事博物馆、原Flickr摄影页等返回403。没有绕过验证码、代理或网络限制。
4. 已保存增加相关核验域名的环境配置草稿。工具返回 `requires_publish=true`；保存草稿不会应用或发布配置，需要在环境设置中审核、保存并发布。未把配置草稿称为已生效。

## 后续约束

- 素材补齐前，不生成带有未核实照片的V3定稿，不将本素材预览当作PPT页。
- 封面照片永久专用：包括同图裁剪、调色、缩放版本；不得在样张正文或后续12页复用。已将现代船舶原图临时登记为封面保留，见 [封面保留清单](cover-reservations.json)。
- 不把照片和某个科研项目的工程应用强行对应；不利用2013年港口照证明当前性能。
- 确认素材后再制作三种不同版式的3页，使用原生可编辑文字和图形，LibreOffice渲染并逐页检查。科技强国为理论主线，海洋强国为应用场景，五章结构继续保留。

## 文件与验证

- [素材核验预览](previews/asset-review-contact.png)：这是四张候选图片的联系表，**不是3页PPT预览**。
- [完整素材包ZIP](v3-asset-review-bundle.zip)：包含原始图、候选图、来源、许可、核验结果和校验脚本，**不包含尚未生成的PPTX/PDF**。
- [机器可读素材库](asset-library.json)、[原页元数据](sources/selected-image-metadata.json)、[原图许可与署名](IMAGE-LICENSES.md)。

```bash
python presentations/material-wisdom-v3-samples/verify_assets.py
# 如用于开工门禁，下面命令会因尚缺传统素材而返回2：
python presentations/material-wisdom-v3-samples/verify_assets.py --require-ready
```

原图全部保留原始像素与字节；每个文件有SHA256。仅联系表缩小照片用于审核，不作为高清原片。联系表按CC BY-SA 3.0提供，包含原照片作者署名；各原图按各自原许可提供。下载源图后如修改CC BY-SA照片，请保留署名、来源、许可并依其条款提供修改后的图片；不将整份PPT内容一概宣称为图片平台许可。
