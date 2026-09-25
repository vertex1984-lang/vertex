# Makimoo Headless Store — 项目规则

Next.js 14 静态导出站点（`output: export` → `out/`）。数据源三方：站内数据（`src/data/`）、素材库（http://106.55.160.52:8080）、Shopify（mkhome-3.myshopify.com，Storefront API）。

## 产品标识与 SKU 规则（长期遵守）

- **站内内部 key 统一用素材库的 `asin` 字段**：亚马逊 ASIN（`B0xxxxxxxx`）或 1688 供应商标识（`1688-xxx` / `1688-xxx-Cx`）。产品数据、图片目录 `public/images/products/{标识}/`、各映射文件的 key 都是小写标识。SKU 不在页面展示，不做内部 key。
- **新格式 SKU**（如 `US-F61ZXX`、`DE-0P0QIZ`）的权威来源是**素材库**（items 的 `sku` 字段）。
- **Shopify 匹配优先级：tags > SKU 兜底**。tags 里恰好打一个产品标识（ASIN 或 1688-xxx）为最优先；无 tag 时按 SKU 反查素材库 `sku` 字段兜底接入（`build-shopify-map.js`，控制台打 `SKU fallback:` 日志）；带 tag 的记录永远优先于兜底记录。老的 SKU=ASIN 格式关联仍只作兜底。
- **重复标识处理**：同一标识出现多个 Shopify 产品时，使用 tags 里带标识的新上传产品。
- **校验闭环**：Shopify 产品的 SKU 必须等于素材库中该标识的 `sku`，不一致要报警（防止 tag 打错/建错产品）。
- **剔除名单**：`B0F1YCXTRX`（早期错误数据，宠物窝误打坐垫 ASIN）已从全站剔除，记录在 `scripts/build-shopify-map.js` 的 `EXCLUDED_ASINS`，重新跑同步脚本时不得重新接入。

## 产品核实 + 更新流程（每次素材库/Shopify 有更新时直接执行）

1. `node scripts/sync-materials.js <素材库密码>`（或 `MATERIALS_JWT=xxx` 写进 `.env.local`，**推荐**：平台公开素材接口已按密码归属用户隔离，单密码只能取到该用户自己的素材，全组同步必须走管理端 JWT 通道）— 拉素材库（makimoohome 分组 groupId=18），下载转 WebP（q82，≤1600px）到 `public/images/products/{标识}/`，生成 `materials-map.ts`（全部素材产品覆盖表）和 `products-materials.ts`（站点没有的新产品条目，自动分类、白底检测）。幂等：`scripts/materials-manifest.json` 记录每个产品的图片 URL 顺序，数量/顺序/内容有变才重下（打印 `[图片更新]`）；`--force` 强制全部重下；**图片展示顺序默认保持素材库原始顺序（keep-order 为默认行为，2026-09-14 起）**，旧的优先级重排需显式加 `--reorder`。注意：更新重下时只清数字编号定图（`^\d+\.webp$`），`detail-*.webp` 等附属图保留（防 overrides 死链，2026-09-24）。
2. `node scripts/build-shopify-map.js` — 拉 Shopify 全部产品，按 tags 标识匹配，校验 SKU 一致性，生成 `shopify-map.ts`（variantId/价格/在售状态/重量 weight+weightUnit/创建时间 createdAt）。
3. `node scripts/build-weights.js` — 产品权重体系（已入 build 链）：表现分（销量 60 / 新鲜度 15 / 评价 15 / 内容 10）+ 人工赋权表 `src/data/weights-overrides.ts`（单品：boost ±30 封顶 / pin 置顶 ≤3 个 / bury 沉底 / exclude 排除 / until 限时 / note 必填；分组规则 GROUP_BOOSTS：按 productType/subcategory/materialIncludes/asinIncludes 组合命中，与单品 boost 叠加合计 ±30 封顶——2026-09 首批规则已于 2026-09-14 应用户要求全部清零，当前人工权重只保留管理工具的单品打分 weight-boosts.json），生成 `src/data/product-weights.ts`（含类目 type 字段）；排序统一走 `src/lib/weights.ts` 的 `sortByWeight()`（缺货沉底 > pin 固定位 > 总分降序 > **同分按类目平均分降序** > buried > 缺货；类目平均分 = 该类目全部在售产品总分均值，不做类目配额平衡），已接入类目页 featured 排序与 Best Sellers 选品。销量信号读 `scripts/sales-data.json`（asin → 近 90 天销量），暂无该文件时按 0 计（待 Shopify Admin API token 开通后生成）。
4. `node scripts/extract-specs.js` — 从标题/描述/handle 提取尺寸（归一化 cm）和材质（关键词词典），生成 `product-specs.ts` 并打印覆盖率报告。提取不准/缺失的手工补在 `specs-overrides.ts`（前台优先）。
5. `npm run build` 重建后核验，用户确认后推送。**注意：`next build` 导出时不会覆盖 `out/` 里已存在的同名图片**——纯图片更新（public/images 变了但页面代码没变）时，重建后必须手动同步：`cp -r public/images/products/. out/images/products/`（或先删 `out/images/products` 再构建），否则站点仍展示旧图。

### 图片展示顺序（首图=第 1 张）

图片池 = 素材库**初审定版图**（`images` 数组，顺序即展示顺序，与素材库详情页所见一致；`imageTypes` 的标注图、`whiteBgImages` 均不入站）。同步默认保持该顺序（keep-order），不做优先级重排。

文件编号按下载顺序固定，展示顺序由 `materials-map.ts` 的 images 数组定义。旧的类型优先级重排规则（场景图 > 白底图 > …）已废止，仅在不加 `--keep-order` 时作为遗留逻辑保留在脚本中。

例外：**Blankets 全部 23 个产品首图置顶**——用户指定首图统一为"铺床场景图"样式（参照 `1688-969627065032-C40/4.webp`），由脚本里的 `PIN_FIRST_URLS`（5 个 URL，覆盖深灰/蓝/银灰/奶黄/浅紫 5 个图片族）实现：命中产品把该图排到 images 数组第一，其余图顺位后移，文件编号不变。

### 分类规则

`classify()` 自动分类：标题含 duvet/bedding/bed linen/quilt cover/comforter/fitted sheet 等 → **Bedding**；含 blanket → **Blankets**（两条先于 Pillows 判定，床品标题常带 pillowcases）；含 bath mat/towel/rug/kitchen mat/door mat 等 → **Bath**；travel/neck pillow → Travel；pillowcase/insert 等 → Pillows；wall art/canvas/framed art/decorative painting 等 → **Decor**（2026-09 新增）；tray/serving basket/fruit plate/platter 等 → **Dining**（2026-09 新增，两条先于 Cushions 的 dining 兜底，托盘标题常带 "dining table" 场景词）；dining → Dining；chair/seat cushion → Cushions；其余 → Others。全站一级类目 10 个：Cushions / Pillows / Towels / Mats / Bedding / Blankets / Decor / Dining / Holiday（暂无产品）/ Others；V2 导航曾用的 Bath 标签已统一改名为 **Towels**。顶部导航顺序：**Featured → Bedding → Pillows → Cushions → Towels → Mats → Blankets → Decor → Dining**（Others 不在导航，仅页脚；原 Shop All 首项 2026-09 改为 Featured，仅作弹窗入口、href 为空，菜单标题/移动端主项为纯文字不跳转；弹窗三子项 + 3 张图卡原分别指向三个独立精选页 `/featured-products`、`/best-sellers`、`/new-arrivals`（2026-09 起 `/featured-products` 已隐藏：弹窗内 Featured Products 子项及其图卡已移除，只保留 Best Sellers / New Arrivals 两项；站外老链接由页面本身兼容转跳 `/best-sellers`）——三模块数据源统一在 `src/data/featured-sections.ts`，与首页共用，图上大产品卡共用 `src/components/v2/V2OverlayCard.tsx`；原 `/featured` 汇总页保留但全站无入口。首页 Featured/Best Sellers/New Arrivals 模块的 View All / View More 均已改指 `/best-sellers`、`/new-arrivals`（Featured 区的也指 /best-sellers）。`/best-sellers` 保持大占屏比编辑画报风格（关联促销模块：Top 10 榜单 / Pairs Well With 搭配购 / 类目入口卡 / Newsletter）；`/new-arrivals` 2026-09 已改为 /products 类目页同款样式（浅色面包屑页头 + 白底 ProductCard 平铺网格），展示按 Shopify `createdAt` 倒序的最新 20 款，不区分类目——`createdAt` 字段由 `build-shopify-map.js` 写入 `shopify-map.ts`））。Blankets 无二级类目，mega menu 只展示右侧图卡；Bedding 2026-09 起有二级类目（见下）。

### 产品标签体系（色系 + 场景，2026-09）

- `/featured-products` 页（原 Complete the Look）**已隐藏，全站不留入口**（2026-09 用户要求）：页面本身改为兼容跳转——老参数 `?scene=` / `?color=` 仍落对应静态分类页，其余一律 client 端 `router.replace` 到 `/best-sellers/`；原所有入口（导航弹窗子项/图卡、首页 Featured 区 View All/View More、new-arrivals teaser、color/scene 子页面包屑）全部改指 `/best-sellers/`。原 Complete the Look 内容随之下线，`filter-bar.tsx` / `look-card.tsx` 保留备查。**color/scene 聚合子页（`/featured-products/color/<key>/`、`/scene/<key>/`）保留**，无筛选栏，页头/产品卡已对齐 /products 类目页（浅色面包屑页头 + 白底 ProductCard），入口是首页 Shop by Color / Shop by Scene 的 SHOP 按钮。
- **标签持久化在 `src/data/product-tags.json`**（key = 小写 asin，字段 `color` / `scene` / `pieces`），由 `node scripts/generate-tags.js` 生成（复用 `check-tags.js` 的产品枚举管线，遍历全部在售产品）；**新品上架或规则变更后需重跑该脚本**。页面读取时 **JSON 优先、现算兜底**：asin 不在 JSON 里时回退到 `getColorTag`/`getSceneTag` 现算，保证新品未跑脚本页面不炸。
- 标签规则在 `src/data/product-tags.ts`：**色系**14 个内置（`BASE_COLOR_RULES`），主色原则——纯色/花色一视同仁，取标题中位置最靠前的颜色词；标题完全无颜色词的走 `COLOR_OVERRIDES` 人工指定表（key = 小写 asin，含 `1688-xxx` 标识，用户看图确认后填入）。**场景**9 个内置（`BASE_SCENE_RULES`）：Living Room / Bedroom / Kitchen / Bathroom / Dining Room / Garden & Lawn / Entryway / Beach & Pool / Travel，按 `SCENE_PRIORITY`（具体 → 宽泛）取第一个命中，标题无场景词按 productType 兜底（`TYPE_FALLBACK`）。每个产品恰好一个 color 和一个 scene。匹配用词边界正则（允许复数 s）。**规则覆盖（2026-09 新增）**：`src/data/tag-rules-overrides.json` 可禁用内置项（disabledColors/disabledScenes）或追加自定义项（customColors/customScenes，key 规则 `^[a-z0-9-]+$`，hex 为 #RRGGBB），导出的 `COLOR_RULES`/`SCENE_RULES` 是「内置未禁用 + 自定义在后」的生效合集，自定义场景插到 `SCENE_PRIORITY` 最前；由本地管理工具 admin-server.js 维护，勿手改 TS 加规则。注意该文件用 namespace import 引入 JSON（本地脚本 TS shim 不开 esModuleInterop，default import 取不到值）。
- **手工 color/scene 保护**：product-tags.json 中带 `"manual": true` 的条目（管理工具人工指定）不会被 `generate-tags.js` 的自动打标覆盖，只刷新 pieces；两项都选回「未设置」时管理工具会写 null 并去掉 manual 标记（回到自动打标）。**手工 Pack 件数保护**：带 `"manualPieces": true` 的条目（管理工具人工指定的 pieces）不会被 generate-tags.js 的标题提取覆盖；清空时 pieces 置 null 并去掉 manualPieces。
- **Others / Decor / Dining 类目的产品不做 color/scene 分类**（2026-09 用户定）：`generate-tags.js`/`check-tags.js` 跳过（不写进 product-tags.json），`featured-products/tagged.ts` 的 ALL 及首页 Shop by Color / Shop by Scene 同步排除，Featured 配额与 Best Sellers 选品也不含这三类；排除清单统一在 `product-tags.ts` 的 `NO_TAG_TYPES`；推荐区（V2Recommended）里这些类目只按类目参与打分。
- **打标必须用完整标题**（`MATERIALS_MAP[asin]?.title || p.title`，即素材库覆盖后、精简前），enrich 后的短标题会丢颜色词。
- 每个在 product-tags.json 中出现的 color/scene 分类，构建时自动拥有独立静态页 `/featured-products/color/<key>/` 和 `/featured-products/scene/<key>/`（generateStaticParams 驱动，空分类不生成；页面代码在 `featured-products/color/[color]/` 和 `featured-products/scene/[scene]/`，共享打标逻辑/产品卡/筛选栏在 `featured-products/tagged.ts`、`look-card.tsx`、`filter-bar.tsx`）；新增色系/场景在管理工具（或 tag-rules-overrides.json）里加 + 重跑 generate-tags.js + 构建。主页及分类页的筛选 chip 是分类导航（点击跳对应 URL），老参数 `?scene=`/`?color=` 由主页 client 端 router.replace 兼容跳转。

### 隐藏名单

### 自定义分类层（taxonomy，仅本地）

- `scripts/admin-server.js`：本地分类管理工具（`node scripts/admin-server.js` → http://localhost:8090），**仅供店主本地使用，不上线**。零新依赖，复用 check-tags.js 的 TS 加载管线实时 enrich 产品数据。
- 数据存 `src/data/taxonomy.json`：`categories`（用户自定义类目）/ `tags`（自定义标签）/ `assignments`（key = 小写 asin → `{ category, tags[] }`）。规则：**一个产品最多一个自定义类目，可有多个自定义 tag**；POST 时服务端校验 key 唯一性（`^[a-z0-9-]+$`）与引用完整性，原子写入。
- 管理页还可配置 color/scene：产品表格里下拉手工指定（写 product-tags.json 并标 `manual: true`，generate-tags.js 不冲掉，见上节）；左栏可新增/删除色系与场景规则本身（写 tag-rules-overrides.json，内置项删除=加入 disabled，自定义项=彻底移除；被禁用/删除 key 的存量引用会被清空并去掉 manual）。「材质 / Pack」列同样可编辑：材质为 checklist 多选（选项 = 规格数据全部原子材质 ∪ 用户词表，按使用次数降序），列内可「+ 新增材质」（写入 material-overrides.json 的 materials），勾选结果写 assignments（完全替换规格材质，可「↺ 恢复自动规格」删除覆盖）；Pack 为 1-20 整数输入，写 product-tags.json 并标 `manualPieces: true`。统一走 `POST /api/save`（taxonomy + tagRules + tagAssignments + materials + materialAssignments + piecesAssignments 一次提交，后三者可缺省；全量校验通过后才落盘，四个 JSON 均原子写入）。
- 与现有一级/二级类目体系**并存且互不干扰**；当前前端不读 taxonomy.json，供后续按需接入（如专题页、权重分组）。
- 管理页改动保存后需重新构建网站才会反映到任何已接入的页面。

`scripts/sync-materials.js` 的 `HIDDEN_ASINS`：素材库保留但不生成站点条目。当前仅 `1688-916370884976-C9`（与 C6 完全重复的被子变体，2026-09-14 用户确认隐藏）。原隐藏的 `1688-1051650740507` / `1688-1051650740507-C2`（蕾丝边被套）已于 2026-09-24 应户要求解除隐藏并全量上站（花边-禾时三码组）。

### 二级分类（subcategory）

- 注册表与判定逻辑：`src/data/subcategories.ts`（`classifyProduct(productType, title, asin)`，enrich 时写入 `product.subcategory`，URL 参数 `?sub=`）。
- **判定用完整标题**（素材库覆盖后、精简前），避免关键词被短标题截断。
- Cushions 按形态/尺寸分组：`rocking`（摇椅垫 = 50×43 上下两件套或标题含 rocking；另含手工指定的三个连体靠背垫 B0CW1TBZV3/B0CW17PZYT/B0CW1LDN6L，见 `subcategories.ts` 的 `SUB_OVERRIDES`）、`hb-medium`（95×45 连体高背，含 90×45）、`hb-large`（110×55 高背）、`seat-pad`（43×43 方形坐垫 + 47×8 圆形坐垫）。无独立兜底组，判不了的按标题 high-back 词进 hb-medium、否则 seat-pad。
- 产品卡眉头标签显示二级分类短名（`productCategoryTag()`），无二级分类的显示顶级分类名。
- 类目页筛选面板：`Collections`（二级分类单选）+ `Material`（多选）；Price/Size/Availability 筛选已移除（用户要求）。二级分类不再以 pills 形式出现在类目页顶部，入口在 /categories 汇总页和 Collections 筛选行。
- Pillows：quilted→`quilted`；embossed/pillowcase/covers→`embossed`；其余→`basic`。
- Towels：beach→`beach`；hand/face towel 或 40×80 四件装→`hand-face`；其余→`bath-towels`。
- Mats：按关键词在标题中**最早出现位置**定主用途（kitchen/door/area-rugs/bath-mats，兜底 other-mats）——标题尾部常堆场景词，不能用包含匹配定优先级。
- Bedding 按材质分组（`classifyBedding`，2026-09 新增）：取规格表主材质（material 逗号前第一个），Microfiber→`microfiber`、Linen→`linen`、Cotton→`cotton`；Bamboo 等暂不分组（无 subcategory）。材质数据见 product-specs.ts / specs-overrides.ts。
- Others：`travel`（neck pillow/travel）、`kitchen-tools`（pepper mill/grinder/kitchen 等）、`extras`（兜底：自行车篮、香薰炉等）。
- Decor（2026-09 新增，首批 10 个挂画）：固定 `wall-art`。
- Dining（2026-09 新增，首批 22 个藤编托盘）：标题含 placemat/coaster/table pad|mat → `placemats`（暂空备用），其余 → `trays`。旧数据里 productType 为 Dining 的 38 个餐椅垫按标题拆分：托盘/餐具类归 Dining，其余仍归 Cushions（`products.ts` 的 `normalizeCategory` + `DINING_TRAY_RE`）。
- 四个错标产品已按标题归正：95×45 椅垫 B0DSGCLBVW/B0DSGCKWXW（Pillows→Cushions，含 "chair cushion"）；枕芯 B0F62QGV32、枕套 B0GJLVMHT7（Others→Pillows，pillowcase/insert 规则）。顶级计数：Cushions 64 / Mats 36 / Pillows 29 / Blanket 23 / Bedding 23 / Others 17 / Towels 14。
- 裸 `/products` 已取消（前端重定向到 `/categories` 汇总页）；`/products?cat=x` 类目页含二级分类 pills（吸顶）+ 常态展开筛选；`/categories` 为二级分类汇总静态页。
- `/categories` 二级分类卡片的缩略图目前是**临时的**：自动取该组第一个在售产品的首图（`repImage()`，场景图优先于白底图）。**后续要为每个二级分类生成专属缩略图替换**（用户已确认此计划）。

### 标题规则

- 手工精简表 `src/data/short-titles.ts`（≤100 字符、去 "Makimoo"、保留件数/关键属性/尺寸/颜色）优先。
- 无手工条目的新产品由 `products.ts` 的 `autoShortenTitle()` 自动精简（去品牌词，>100 字符在逗号/空格处截断）。
- **按二级类目标题化**（用户确认的新方向，逐个类目推进）：标题只写属性，不写产品类名，标点一律英文。已完成：**Rocking Chair** = `材质/图案, Tufted, with Ties - 95x45cm, 颜色`（统一标注 95x45cm，不写 Set/Pack 件数）；**High-Back Medium** = `Outdoor Cushions, 尺寸 - 颜色/图案`（95 款写 95 x 45cm，90 款写 90 x 45cm，颜色/图案按素材库实际描述区分，如 Blue Monet Garden / Red Green Geometric / Khaki）；**High-Back Large** = 同格式（110 x 55cm，圆背款实际标注 110 x 53cm；同一颜色图案同时有 2 件装和 4 件装的，末尾加 `, Set of 2/4` 区分）；**Seat Pads** = `Seat Cushions, Tufted, 尺寸 - 颜色/图案`（43 款写 43 x 43cm，圆形写 47cm Round，18.5 英寸款写 47 x 47cm；4 个藤椅垫非 Tufted 工艺，标题不带 Tufted）；**Pillows/Basic** = `Pillow Inserts, 尺寸, Soft & Durable White`（全部白色枕芯；两个 45 x 45cm 同款用 Throw Pillow Inserts / Pillow Inserts 区分）；**Pillows/Quilted** = `Pillow Inserts, 尺寸, Premium Quality White`；**Pillows/Embossed** = `Pillowcases, 尺寸, Premium Quality, 颜色`（11 个枕套/枕罩按此格式；3 个 b0gd* 是填充睡枕而非枕套，写 `Bed Pillows, 尺寸, Premium Quality, White`）；**Towels/Bath Towels**（仅白底+条纹款）= `Luxury Cotton Bath Towels, Premium Quality, 颜色`（bath-towels 共 8 个，只有 1688-1044064113195 系列 3 个是白底条纹款；两个 Grey 条纹款尺寸不同，末尾加 `, 80 x 160cm` / `, 70 x 140cm` 区分；其余 5 个纯色款未标题化，等用户给格式）；**Towels/Beach** = `Thick Cotton Beach Towels, 颜色`（4 个全是双色条纹款，颜色统一写 X and White：Red / Grey / Yellow / Blue and White）；**Towels/Hand & Face** = `Cotton Hand Towels Hotel Spa Style, 颜色`（2 个：White / Grey，其中 White 款原标题是 Face Towels，按用户格式统一写 Hand Towels）；**Mats 全部四个子类目**（kitchen 5 / bath-mats 6 / door 1 / area-rugs 2，共 14 个）= `材质+样式+功能`，每条 ≤10 个单词，逐个按素材库标题+首图拟写；同款区分：两个 Beige 厨房垫用 Vintage Tile / Solid Cuttable 区分，三个白色棉浴室垫用 Embossed Footprint / Jacquard Stone Pattern / Plain Extra Thick 区分，成对的椭圆垫和圆地毯末尾加颜色（Off White / Brown、Camel / White）；**Others**（15 个）= 逐条 ≤10 单词：12 个旅行颈枕分三组写 `Memory Foam Travel Neck Pillow with Storage Bag, 颜色` / `Adjustable Memory Foam Travel Neck Pillow, 颜色` / `Inflatable Velvet Travel Neck Pillow with Carry Bag, 颜色`（各 Black/Grey/Blue/Pink），另 3 个单品：Wicker Bicycle Basket / Hanging Cauldron Oil Burner / Greek Pepper Mill；**9.8 后新品 125 个（2026-09-14 用户确认方案，≤10 词、必含材质）**：**Bedding/Linen**（LINEN3 20 个）= `100% Linen Duvet Cover Set, 3 Piece, 颜色, 尺寸`；**Bedding/Microfiber**（BEDSET4 52 个）= `Microfiber 4-Piece Bedding Set, 颜色/图案, 尺寸`（13 个外观词：Beige/Grey/Pink/White/Lilac Floral/Slate Bamboo/Tan Floral/Sage Floral/Mauve Lace Floral/Moss Lace Floral/Coffee Patchwork/Blue Patchwork/Grey Plaid）；**DUVSET**（16 个）= `Microfiber Duvet Cover Set, 3 Piece, 颜色, 尺寸`；**被子三件套**（1688-916370884976 剩 4 个，宣称 Washed Cotton 实为 Microfiber）= `Microfiber Comforter Set, Light Blue, 尺寸cm`（按被面尺寸区分）；**仿兔毛毯**（1688-969627065032 共 22 个）= `Faux Rabbit Fur Throw Blanket, 颜色, 尺寸cm`（Blue/Cream Yellow/Dark Grey/Silver Grey/Purple × 5 档尺寸）；**地毯**（11 个）= `材质+款式+Area Rug, 颜色`（Faux Cashmere Persian / Faux Rabbit Fur Shaggy / Faux Fur Oval / Low-Pile Vintage Persian——745181807454 系列无材质数据暂用 Low-Pile）。方案全文留档 `E:\Makimoo Website\title-plan-2026-09-14.md`。

注意：产品原始数据有两处来源——`products.ts` 的 BASE_PRODUCTS 和 `products-materials.ts` 的 MATERIALS_PRODUCTS，枚举类目成员时两个文件都要解析（travel/home fragrance→Others 的归并只影响 BASE_PRODUCTS）。

## 展示规则

- 白底图（四边像素 R/G/B≥245 比例≥70% 判定）：产品卡加 `p-2 sm:p-7`（2026-09 移动端从 p-5 收紧到 p-2，提高小屏图片占屏比）、详情主图 `p-6 sm:p-8` 缩小显示；场景图打满。图区容器统一白底。缺货产品灰化 40% 并沉底。
- 产品卡（含 Featured）：标题含 "Set of X" / "X Pack" / "X-Pack" / "Pack of X" 自动打 `{X} Pack` 标签。
- 首页 Featured 区块用 `variant="featured"`（固定高度+渐变底），与其它卡片样式独立。
- 全站退货政策统一为 **30 天**。
- **Frequently Bought Together（详情页搭配购）暂时下线**：产品数量太少，搭配推荐意义不大。组件保留在 `src/components/BoughtTogether.tsx`，由 `ProductDetailClient.tsx` 顶部的 `SHOW_BOUGHT_TOGETHER = false` 开关控制。**后续产品够多了（用户确认后）改回 `true` 并重新构建即可启用**，启用前注意复核横版布局在桌面端不换行。
- **规格表（详情页 Specifications）**：Weight 来自 Shopify（`formatWeightDual`，≥1kg 用 kg/lb、<1kg 用 g/oz，两位小数去尾零；Shopify 重量为 0 不显示该行）；Dimensions/Material 来自 `product-specs.ts`（`formatDimensionsDual`，cm 和 in 各自四舍五入到最近的 0.5）。格式化函数在 `src/lib/specs.ts`。**材质产品级覆盖（2026-09 新增）**：`src/data/material-overrides.json`（`materials` 用户新增材质词表 + `assignments` key = 小写 asin → 原子材质数组，有序即显示顺序），由管理工具 admin-server.js 维护；`getProductSpecs` 合并优先级 = 自动提取 product-specs.ts → specs-overrides.ts → material-overrides.assignments（asin 有条目则 `material = 数组 join(', ')` 完全替换前两者），前台 Material 筛选/规格表随之生效。注意该文件同 tag-rules-overrides.json 用 namespace import 引入（本地脚本 TS shim 不开 esModuleInterop）。
- **用户会在 Shopify 后台用 metafields 维护尺寸和重量**：当用户要求"抓取 Shopify metafields 覆盖规格"时，扩展同步脚本读取产品 metafields（尺寸/重量），生成或覆盖 `product-specs.ts` 中对应字段（metafields 优先于文本提取，低于 specs-overrides.ts 手工表）。届时需先向用户确认 metafield 的 namespace/key 命名。
- 下单走 `variantId`（`gid://shopify/ProductVariant/...`），随 `shopify-map.ts` 更新，Shopify 后台删老产品不会造成站内断链。
- 1688 供应商标识的产品无亚马逊链接，`amazonUrl` 为空（在售时前台显示 Add to Cart，不显示 Amazon 按钮）。

## 本地预览

- `npm run build` 前必须停掉占用 8080 的静态服务器（否则 EBUSY 锁 `out/`）。
- 预览：本地静态服务器 serve `out/` @ 8080，访问 http://localhost:8080。**必须全响应 `Cache-Control: no-store`**（2026-09 起用 node 服务器替代 `python -m http.server`：python 无缓存头，浏览器启发式缓存会拿旧 HTML + 已删除的旧 JS chunk，水合失败 → 首页导航滚动不切实底等"JS 死了"症状）。**`/index.html`（含子路径）一律 301 到干净 URL**：Next 客户端路由表没有 index.html 路由，直接访问会水合失败——页面能显示但 JS 全死（2026-09 实测：用户从浏览器自动补全进 `/index.html`，首页导航透明卡死；`/` 正常）。V2Header 的 transparentStart 判断也做了 `/index(.html)` 尾段归一化兜底。

## Git

- remote：`git@github.com:vertex1984-lang/vertex.git`，推送后 Vercel 自动部署。commit/push 必须用户明确要求后才执行。

## 协作开发

- 仓库为 **Public**，协作者：**OnishiAguri**（Write 权限，2026-09 加入）。
- **`main` 已启用服务端分支保护**（ruleset `protect-main`，2026-09 配置）：禁止 force push、禁止删除分支；**仓库所有者（vertex1984-lang）可直推 main**（2026-09 v2 上线实测直推成功，ruleset 对所有者不拦截）。协作者（OnishiAguri）如被拦截，走分支 → PR → 所有者 approve → Squash merge 流程。
- 推送/合并进 `main` 即触发 Vercel 自动上线，注意改动影响。
- 动工前先 `git pull` 并基于最新 `main` 开分支，避免冲突。
- `.env.local` 不进仓库：协作者需自行创建（Shopify 三个环境变量 + `SEEANY_API_KEY`，由用户线下私下传递）。

## SeeAny AI 生图 API

用于生成/编辑网站配图（电商场景优化）。文档：https://www.seeany.com/developer

- **认证**：`Authorization: Bearer $SEEANY_API_KEY`（key 存于 `.env.local` 的 `SEEANY_API_KEY`，账户名 makimoohome；`.env*.local` 已被 gitignore，不要把 key 写进代码或提交）
- **创建任务**：`POST https://api.seeany.com/api/ai/smarttask`，头加 `User-Agent: seeany-api`、`Content-Type: application/json`
- **请求体**：
  ```json
  {
    "aiTypeId": 113,
    "aiType": "smartImg",
    "prompt": "中文描述即可",
    "inputImgs": ["可选，参考图 URL"],
    "imgNum": 1,
    "imgRatio": "1:1 / 4:3 / 16:9 / 21:9 等",
    "mode": "gpt-image-2.5-sunburst",
    "size": "1K"
  }
  ```
- **mode（模型）**：默认用 `gpt-image-2.5-sunburst`（GPT image-2.5 高质，1K/2K/4K = ¥0.30/¥0.40/¥0.50；2026-09 用户定，替代原 nano-banana-pro）。其他可选：`gpt-image-2.5`（=快速 flare，¥0.20/¥0.30/¥0.40）、`gpt-image-2`、`nano-banana-pro`、`nano-banana-2`、`seeany4`（中文增强，仅 2K/4K）、`nano-banana`（不支持 size）。完整文档第 9 节（模型/比例/分辨率）
- **响应**：`{"code":0,"data":{"task_uuid":"wtask_...","wait_time":40}}` —— 全异步架构，拿 task_uuid 后轮询取结果（支持 Webhook）
- **轮询**：查询任务状态/结果的具体端点以文档为准（生成后从任务接口取图 URL，下载转 WebP 进 `public/images/`）
- **能力**：文生图、参考图生图、白底图（一键抠图换底）、AI 图片编辑（抠图/扩图/消除/变清晰）、AI 视频
- 风格约定：全站米色 #F8F5F0 + 暖棕 #8B5A2B 家居调性，prompt 里注明色调；品牌 Logo/吉祥物不要让 AI 画（易变形）

## V2（已上线为正式版，2026-09 切换）

### 版本结构

- **`src/app/(v2)/` = 线上正式版**：v2 页面已切换到根路径（`/`、`/products/` 等），组件在 `src/components/v2/`（V2Header fixed 透明→实底 / V2Footer / V2PageHeader 深色页头等）。**V2Header 实底切换双通道（2026-09）**：scroll 事件（滞回 60/30px + 挂载时立即同步一次）+ IntersectionObserver 观测文档顶下 60px 处的 1px 哨兵（`sentinelRef`）——两机制独立，防个别环境 scroll 事件不生效导致卡在透明态；仅首页 `/` 与 `/about/` 起始透明，其余页始终实底。V2Footer 配色 2026-09-23 由 bg-brand 焦糖棕底改为浅米底深炭字（`bg-off-white text-charcoal`，链接 hover 下划线/分组小横线用 brand 棕，订阅按钮 bg-brand），与全站浅底风格统一。
- **旧版（classic）保留在 `legacy/classic/`**：源码完整保留但**不在路由内、全站无入口**，仅供查阅；不要改动，也不要把链接指回去。回滚 = `git revert` 切换 commit（或参考该目录恢复）。
- 根 `src/app/layout.tsx` 是极简壳（fonts/Toast/Analytics/全站 metadata），`(v2)/layout.tsx` 是 V2 的 Header/Footer 壳。

### V2 开发约定

- **站内链接一律走 `v2url()`**（`src/lib/v2paths.ts`）：v2 切换后已直通 `resolveUrl()`（保留 file:// 兼容），不再加前缀；图片等静态资源用 `resolveUrl()`。
- **颜色只用 Tailwind token**（`brand` / `cream` / `off-white` / `charcoal` / `warm-gray`），不写死 hex。例外：从 classic 复用/沿用的组件与内容（如政策页复用 `src/components/Policy.tsx`，正文沿用旧版样式）保持原样。
- 新组件放 `src/components/v2/`，页面放 `src/app/(v2)/`；fixed 透明 Header 要求每个页面第一屏能衬住（首页/ about 大图页头，内页 `V2PageHeader` 的 bg-brand + pt-32）。
- V2Header 顶部促销条（Announcement Bar）向下滚动超过阈值后自动收起（桌面/移动一致），回到顶部附近再展开，由 `scrolled` 滞回阈值（60/30px）控制。透明起始页判定：首页（`/`）和 `/about/`。
- 首页 Shop by Style 区（2026-09 新增，`V2ShopByStyleBento.tsx`，替换原 V2TrustStats 数据区，后者组件保留未删）：画报错落网格——产品数最多的风格占 2×2 主卡，其余小卡补齐（小卡偶数时末行 2 张拉宽），桌面 4 列静态网格（不用横滑，与 Color/Scene 模块节奏错开）、移动 2 列主卡通栏；底部右对齐 "Discover More →" 文字链接（非按钮）进 Styles 汇总页。卡片文字 = 偏小字号风格名 + 件数，无 CTA 箭头。风格共 7 个（用户定，日式并入 Rattan & Woven）：African & Tribal / Rattan & Woven / Bohemian / Persian & Vintage / Farmhouse / Hotel / Modern（兜底）。风格标签与 color/scene 的关键差异：**全类目参与**（含 NO_TAG_TYPES 的 Decor/Dining/Others）。规则在 `product-tags.ts`（STYLE_RULES 数组顺序 = 打标优先级，具体→宽泛勿动；展示顺序在 style-tagged.ts 的 STYLE_DISPLAY_ORDER 显式定义（Modern/Farmhouse 排前，Hotel 与 Rattan & Woven 互换过，未列入的新风格自动排最后）），数据层 `src/data/style-tagged.ts`（ALL_STYLED 按权重降序 + styleCards 选图：优先权重最高产品的 featuredImage），风格入口卡组件 `V2StyleCard.tsx`（首页 Bento 与汇总页共用），聚合页 `/featured-products/style/[style]/`（仅 ≥1 款在售的风格生成静态页），汇总页 `/featured-products/style/`（全部有产品的风格卡网格，新增风格自动出现）。调研脚本：`scripts/style-survey.js`（关键词分布）、`scripts/style-distribution.js`（打标结果分布）。
- 产品列表页（`(v2)/products/page.tsx`）展示样式：classic `ProductCard` 白卡 + Collections/Material 左侧筛选栏 + 二级分类分区视图 + Load More；版心是 V2 全宽容器（无 1400px 边框盒；2026-09 起移动端收窄为 px-3 / gap-2 提高产品卡占屏比，桌面端仍 px-10 / gap-6），列数不变，产品卡随页面宽度等比增大。分区视图移动端也是 2 列网格平铺（2026-09 由横滑条统一改为网格，与 decor 页一致），二级类目分区标题保留。产品卡与 QuickViewModal 通过可选 `href`/`detailHref` prop 覆盖详情链接。同款产品网格页（new-arrivals / featured-products 的 color/scene 子页 / favorites / best-sellers / 详情页相关产品 / V2RecentlyViewed）同步应用该移动端收窄规则；首页 V2ShopByScene 移动端平铺区亦已对齐（px-3 / gap-2）。
- 移动端导航抽屉（V2Header）：不铺满全屏——z-40 低于页头（z-50），页头保持露出，汉堡按钮为开关（打开时变 ×）；抽屉从页头下缘开始（打开瞬间量 `headerRef.offsetHeight`），限高内部滚动，其余区域盖 `bg-charcoal/40` 半透明遮罩，点抽屉外任意处关闭。抽屉内不再有独立 × 按钮。遮罩关闭在 `onTouchEnd` 里 `preventDefault()`：阻止浏览器在抽屉消失后向同一触点补发 click（幽灵点击会落到下层原始网页链接上触发转跳）。抽屉内一级类目默认折叠，整行点击展开/收起二级类目（grid-rows 0fr/1fr 过渡动画，`expandedCat` 状态，关抽屉复位），展开后首项 "Shop All {类目} →" 链到类目汇总页（Featured 无汇总页，直接列 Best Sellers / New Arrivals）。
- 移动端详情页主区 grid 必须显式 `grid-cols-1` 且两个子项加 `min-w-0`（`V2ProductDetailClient.tsx`）：隐式 auto 列会被图库内容（缩略图横排、带 width/height 属性的主图）撑到内容宽度，造成整页横向溢出、标题与主图右缘被裁。
- client 页面的 metadata 由同目录 route `layout.tsx` 提供（见 `(v2)/cart/layout.tsx`、`(v2)/products/layout.tsx`、`(v2)/favorites/layout.tsx`）。
- 心愿单页 `(v2)/favorites/`：读 localStorage（`makimoo-favorites`，存 product.id）渲染 classic `ProductCard` 网格，最近收藏在前；导航心形图标入口在 V2Header（角标监听 `makimoo:favorites-updated`）。
- 首页 Featured Products 区：桌面端 bento 网格（容器 max-w-[1800px]、左右 5:12——宽度按「右侧 3 列小卡保持原 2×2 时代卡宽」推算，左侧两张 1:1 焦点大卡上下排列 = 位次 1/2 + 右侧 3×2 小卡 = 位次 3–8，上排 3/4/5、下排 6/7/8）；移动端为横向滚动条（8 张统一大小 V2ProductCard），两套布局 `lg:hidden` / `hidden lg:block` 互斥。**选品为类目配额制**（2026-09 用户定，`featured-sections.ts` 的 `getFeaturedProducts()`，共 8 个卡位）：类目权重 = 该类目在售产品数占总在售产品数（不含 Others/Decor/Dining，见 `NO_TAG_TYPES`）的比例，配额 = 比例 × 8 四舍五入再按误差修正到恰好 8；类目内部按 `sortByWeight()` 总分降序；卡片顺序按类目份额降序整组排列（份额高的类目靠前）。原 FEATURED_ASINS 人工清单已废止；首页 Best Sellers 区块排除 Featured 已展示产品避免重复。

- 2026-09-23 优化批次（对标《页面优化计划》手册 + Parachute）：
  - **Mega menu 多列升级**（`V2Header.tsx` 的 `menuColumns()`）：首列 = 类目子项（bedding 为 "Shop by Fabric" 面料列，描述取自 `src/data/bedding-fabrics.ts` 注册表，**链接直达面料二级 PLP `/bedding/[fabric]/`**（2026-09 起，不再指 /products 带子参数的大杂烩页），列标题不可点，列末追加 Fabric Guide），次列 = Featured 固定入口（Best Sellers / New Arrivals）；**bedding 例外（2026-09 用户定）：次列改为 "Bedding" 产品类型列**——列标题链 `/bedding/`，链接 = 产品类型逐项（**Bed Sets 合并项 → `/bedding/bed-sets/`**（2026-09 用户定：4-Piece/3-Piece 合并为一个入口，页内按 4 件/3 件两分区展示）、Comforter → `/bedding/comforter-sets/`；单类型页 `/bedding/4-piece-sets/`、`/bedding/3-piece-sets/` 保留兜底、全站无入口、不入 sitemap；Sheets/Duvet Covers 无产品 → `/bedding/#on-the-loom`，Blankets → `/products?cat=blankets`；The Texture Edit 不再入 menu，入口保留在首页 Brand Banner）。右侧 `MEGA_CARDS` 图卡不变（bedding 两张图卡同样改指面料 PLP）。**移动端抽屉 bedding 二级与桌面 mega menu 同构**（2026-09 用户定）：按 SHOP BY FABRIC / BEDDING 两组渲染（复用 `menuColumns()` 输出，组标题小号大写灰字同桌面列标题）；**"Shop All Bedding" 首项已移除**（2026-09 用户定），`/bedding/` 入口由 BEDDING 组标题链接承担（col.href 存在时组标题渲染为链接，同桌面列标题可点）；其他类目抽屉保持扁平风格列表（保留 "Shop All {类目}" 首项）。触发方式仍为点击导航项切换（非 hover）。
  - **真实评价**：数据 `src/data/product-reviews.ts`（`PRODUCT_REVIEWS`，key=asin 小写；Amazon 真实评价脱敏精选，填写规范红线见该文件头注释——不得改写原意/不得提升评分/作者脱敏/前端统一标注 Verified Amazon Purchase），渲染组件 `V2ProductReviews.tsx` 在 `[handle]/page.tsx` 页级挂载（新旧两种 PDP 变体共用），无数据整体不渲染；汇总字段仍是 products.ts 的 `rating`/`reviewCount`（控头部星级行与 JSON-LD），旧 PDP 头部星级行在有评价正文时可点击锚到 `#reviews`。新版 PDP（`ProductDetailUpgrade`）暂无头部星级行。
  - **页脚订阅已接通**（2026-09）：`NewsletterForm.tsx`（Shopify `customerCreate`）替换 V2Footer 原占位表单，宽度样式已适配页脚窄列。
  - **PDP 底部推荐区已移除**（2026-09 用户定）：新品 PDP 的 "Complete the Look / You May Also Like" 快速加购 6 卡区与老品 PDP 的 "More Comfort / You May Also Like" 4 卡区均已从 `[handle]/page.tsx` 移除（含 COMPLEMENT 互补类目表与选取逻辑）；`QuickAddCard.tsx` 组件文件保留磁盘备用。PDP 页尾模块顺序 = 评价区 → Related Guides → Recently Viewed。
  - **Related Guides 共用模块**（`V2RelatedGuides.tsx`）：按类目挑指南卡（`SLUGS_BY_CAT` 配置，静态卡 = Fabric Guide / The Texture Edit，其余从 blog-posts 解析；未配置类目回退最新 3 篇 blog；**bedding 2026-09 用户定只留 Fabric Guide 一张**——The Texture Edit / Pillow Filling 内容还不完整）。PDP 挂在评价区后（heading "Related Guides"），PLP 挂在网格下方（eyebrow/heading "Need help deciding?"，搜索视图不显示）。
  - **/better-texture/ 编辑页**（2026-09 新增）：6 个暖中性色系产品的材质质感策展页，入口 = 首页 Brand Banner "Discover More"（文案 "Better Texture, / Better Feeling."）；已加入 build-sitemap.js。
  - **/bedding/ 新 Bedding 落地页**（2026-09 新增，第三版）：按产品类型组织（Bed Sets / Duvet Covers / Sheets / Blankets，对标 Parachute 类目页）。目前仅 Bed Sets 有产品（92 SKU 全是套装，无单品床单/被罩）——家族分组 = ASIN 前缀（`bedset4-` = 4 件套、`duvset-`/`linen3-` = 3 件套、`1688-916370884976` = Comforter 3 件套），家族卡取 Queen 为代表 SKU、显最低 From 价；Sheets / Duvet Covers 渲染 Coming Soon（"On the Loom" 区块 + 类型索引灰显）；Blankets 类型卡链到既有 `/products?cat=blankets`。每分区只展示前 8 张卡，"View All" 进 `/products?cat=bedding` 选购视图。**回滚 = 删除 `src/app/(v2)/bedding/` 目录**，旧路由（legacy/classic V1）未改动；导航入口暂未切换（顶部 Bedding 仍指向 `/products?cat=bedding`）。Hero 底图由 `scripts/seeany-bedding-hero.js` 生成（`public/images/bedding/hero-{desktop,mobile}.webp`，GPT image-2.5 高质 2K，主题=舒适&睡眠质量，左侧/上部留白供 HTML 文案叠加）；已加入 build-sitemap.js。**2026-09 二次改版（用户定）：桌面端内容区 = 屏幕 80% 居中**（`lg:w-[80%] lg:mx-auto`，无死版心；产品卡网格 2/3/4 列 + lg:gap-8，分区标题 lg:text-3xl；**家族卡白色信息区 2026-09 用户定压缩：标题/From 价 text-sm/lg:text-base、内边距 p-3/lg:p-4，尺寸行保持 text-[11px]/lg:text-xs 单行**（BeddingSetCard 共享，面料页/类型页/大杂烩页同口径））；hero 桌面端 47:10 超宽幅（用户截图定比例），eyebrow "MAKIMOO BEDDING"（品牌连写），无 CTA 按钮；分区带锚点 `KIND_ANCHOR`（#sets-4/#sets-3/#sets-comforter）+ Coming Soon 区 #on-the-loom，`scroll-mt-32/36` 避让 fixed 页头，供 mega menu BEDDING 列深链。
  - **bedding 二级类目 PLP**（2026-09 新增，仿 Parachute fabric-led 模型，`/bedding/[slug]/` 一路由三页型）：**面料页**（linen / washed-cotton / linen-like，注册表 `src/data/bedding-fabrics.ts`：slug/material/desc 一句话质感/story 面料故事/heroImage，新面料在此注册 + build-sitemap.js 手动同步）版面 = 面料 hero（面料特写图 + 名字 + 质感短句 + 故事，移动端 16/10 矮幅——原 3/4 首屏见不到商品）→ 按类型分区网格（分区标题只写 "3-Piece Sets" 等，不重复面料名）；**类型页**（4-piece-sets / 3-piece-sets / comforter-sets，slug 映射在 bedding-families.ts 的 `SET_KIND_SLUGS`，标题文案 `SET_KIND_PAGE_COPY` 与落地页分区共用）**无 banner**（2026-09 用户定）= H1 + 一句话说明 → 单一网格平铺（V2FabricShop 的 flat 模式，卡片标题保留"材质 — 颜色"）；**Bed Sets 合并页**（`/bedding/bed-sets/`，2026-09 用户定：导航 4P/3P 合并入口，常量在 bedding-families.ts 的 `BED_SETS_SLUG/BED_SETS_KINDS/BED_SETS_PAGE_COPY`）= 无 banner H1 + 说明 → 按 4-Piece/3-Piece **两分区**展示（V2FabricShop 分区模式 + `colorOnly={false}`，卡片标题"材质 — 颜色"，不含 Comforter）。三者共用：组件 `V2FabricShop.tsx`（**无任何筛选条/标签**；**"数量+价格区间+排序下拉"一行 2026-09 用户定已移除**，固定 Featured 权重序，组件随之改为服务端组件；**分区模式且分区数 > 1 时页头下渲染分区锚点 chips**（2026-09 用户定：一页多分区让用户开屏即知有几个分类，带数量、点击平滑滚动，section 带 `scroll-mt` 避让 fixed 页头，移动端横滑））、面料互导模块（共享组件 `V2FabricCrossSell.tsx`，"Only the Highest-Quality Materials, Period."，**文字全压图上、不显示数量、当前面料页排除自身卡**，落地页全量展示，2026-09 用户定）、Related Guides。面料页卡片 `colorOnly`（BeddingSetCard prop：标题只留颜色）、无徽章。只给有产品的面料/类型生成静态页（generateStaticParams + dynamicParams=false；Sheets / Duvet Covers 无产品不生成，导航指 `/bedding/#on-the-loom`）。**导航直达二级分类**：顶部 Bedding → `/bedding/`，mega menu 面料列/类型列/图卡、移动端抽屉全部改指二级 PLP；`/products?cat=bedding` 大杂烩页**全站无入口**（/bedding/ 落地页原 View All 与底部 CTA 已移除——分区改为展示全部家族卡、底部改面料互导），页面本身保留兜底（老链接/广告深链），下一步再决定是否 301。
  - **bedding 类目页重做为付费搜索落地页**（2026-09，`/products?cat=bedding`，组件 `V2BeddingShop.tsx`）：完全替代 V2BeddingLanding 聚合页（组件文件保留磁盘备用，全站无入口）。设计目标 = 最大化向下推进（进 PDP / 继续下滑）：无 hero 首屏即产品网格；意图回显行（"23 styles from $19.99 to $59.99" 数量+价格区间，**数量统计与排序下拉右对齐同一行**，2026-09 用户定；运费/退货承诺顶部公告条已有，不重复）；粘性筛选条（`sticky top-20 lg:top-[88px]`，**类型 chips All/4-Piece/3-Piece/Comforter + 材质下拉**（2026-09 用户定：5 types + 6 fabrics 用 chips 移动端横滑太多、桌面也放不下；下拉选中后 pill 高亮），吸顶贴合页头下缘，**背景必须不透明 `bg-off-white`**——/95 + backdrop-blur 会让下方滚动文字透上来；**z-30，必须低于移动端导航抽屉遮罩 z-40**，否则抽屉打开时筛选条浮在抽屉之上）。两组筛选为**交集**关系：`Type:` / `Fabric:` 维度前缀，选中后筛选条内出"已选摘要行"（`4-Piece Sets × 100% Linen · N styles · Clear all`）。**零结果兜底（2026-09 用户定）**：友好提示 + Closest matches 推荐网格（先"只满足类型"的家族，不够再补"只满足材质"的，≤8 卡，复用 BeddingSetCard）+ Clear Filters 按钮，不留死路。家族卡标题 = `材质 — 颜色`（2026-09 用户定，如 "100% Linen — Sage"；无颜色只显材质；**Comforter 家族 ASIN 无颜色段，颜色从 MATERIALS_MAP 原始标题尾括号解析**（enrich 后的短标题已裁掉括号色名），如 "Light Blue & Cheese"），图上只叠 "4-Piece Set" 类型标（材质标已从图上移除）。URL 参数自管理：`type=four|three|comforter`（新增）、`sub`=材质（沿用）、`sort`（沿用），replaceState 不污染历史。家族分组/卡片共享模块：`src/data/bedding-families.ts`（`buildSetFamilies()`/`classifySet()`，含 materials 字段供材质筛选）+ `src/components/v2/BeddingSetCard.tsx`（badges prop），`/bedding/` 落地页同用。不符合 ASIN 前缀规律的 bedding 产品兜底进 "More Bedding" 区（ProductCard 逐 SKU）。注意：筛选条吸顶依赖祖先无 overflow 限制，(v2)/layout.tsx 的 `overflow-x-clip` 实测不影响 sticky（Chrome 下 clip 不创建滚动容器）。

### 构建副作用提醒
`npm run build` 会更新 `src/data/shopify-map.ts` 和 `public/sitemap.xml` 的时间戳。提交前如非有意更新数据，先还原：`git checkout -- src/data/shopify-map.ts public/sitemap.xml`。
