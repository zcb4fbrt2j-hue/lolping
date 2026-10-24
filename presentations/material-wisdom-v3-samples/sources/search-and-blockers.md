# 检索、排除与访问受阻记录

核验日期：2026-10-24（北京时间）。工作阶段：素材库；未进入V3排版。

| 站点/来源 | 实际结果 | 本轮处理 |
|---|---|---|
| 中国非物质文化遗产网，`https://www.ihchina.cn/directory_details/11847` | 既有项目原文可读，原页7张照片约500像素宽；本轮站内 `/search_result/keyword/福船` 与JSON检索多次503/超时 | 用作历史工艺事实来源，不把低分辨率原图继续放大 |
| UNESCO，`https://ich.unesco.org/en/USL/watertight-bulkhead-technology-of-chinese-junks-00321` | 项目正文及原页照片链接可读；07615、07617、07620、07622、07625、07627、07630等HUG图接口503；图片弹窗/影片返回Request Rejected或验证码 | 不能完成高清图片取回，未把HTML验证码当图片，也未尝试解验证码 |
| 中国航海博物馆官网，`https://www.shmmc.com.cn/` | 两次首页访问503 | 未取得馆方高清福船图 |
| Wikimedia Commons，`https://commons.wikimedia.org/`、`https://upload.wikimedia.org/` | 搜索、元数据API与原始文件可访问；检索福船、Fuchuan、Fuzhou/Foochow junk、航海博物馆、Princess Taiping、船舶和洋山港 | 已取得现代船舶与洋山港原图；低分辨率、错船型、图画/模型以及无关图均排除；未把检索关键词当作内容证明 |
| 原摄影页Flickr，`https://www.flickr.com/photos/27142920@N04/2979719045/` | 403，Tunnel connection failed | Commons已有2009年上传记录、Flickr许可审核标记及EXIF；仍未补齐“福船”船型的一手核验 |
| 香港海事博物馆，`https://www.hkmaritimemuseum.org/` | 403，Tunnel connection failed | 无法读取馆方有关复原船访问的资料 |
| NPS公开检索，`https://www.nps.gov/search/?query=Princess%20Taiping` | 403，Tunnel connection failed | 未用搜索页或外部简介冒充原始船型资料 |
| 原照片说明所链 Maritime Compass，`https://maritimecompass.blogspot.com/2008/10/princess-taiping.html` | 403，Tunnel connection failed | 未引用不可读正文 |
| 中国政府网检索子域、新华搜索子域 | `sousuo.www.gov.cn`、`so.news.cn` 返回403；新华社主站可读，但所试检索入口404 | 主站可读不等于检索与图片来源全部可用 |
| 上海市政府全站检索，`https://search.sh.gov.cn/searchResult` | 可检索福船及博物馆报道；对太平公主号、COSCO船名的结果不够精确 | 不把词项部分命中作为具体船型或科研应用证据 |
| Bing网页/RSS检索 | 多次返回与福船/艌缝完全无关的结果 | 丢弃，无任何结论建立在这些结果上 |

网络配置已通过受支持的环境配置工具保存草稿，保留旧域名并增加实际需要的一手核验域名。返回 `status=saved`、`requires_publish=true`。这些值证明草稿已保存，不证明网络策略已应用；本轮没有更改代理设置或绕过访问控制。

仍缺：高清福船封面照；第2页高清且工艺内容可核实的传统造船/艌缝相关照片。未找到前不得宣布V3三页已制作或图片替换已完成。
