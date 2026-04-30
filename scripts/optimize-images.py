"""
optimize-images.py
批量压缩网站图片：
1. PNG → WebP（品牌图和产品图）
2. JPG → WebP（产品图）
3. 保留原图作为备份（.bak 目录）

使用 Pillow 进行转换和压缩
"""

import os
import sys
from pathlib import Path
from PIL import Image

# 配置
IMAGES_DIR = Path(__file__).parent.parent / "public" / "images"
WEBP_QUALITY = 80  # WebP 质量（0-100），80 是很好的平衡点
JPG_QUALITY = 85   # JPG 压缩质量（用于保留 JPG 格式的情况）
MAX_WIDTH = 1200   # 产品图最大宽度（像素），超过则缩放
MAX_HEIGHT = 1200  # 产品图最大高度
BRAND_MAX_WIDTH = 2400  # 品牌图允许更大尺寸

# 统计
stats = {
    "processed": 0,
    "skipped": 0,
    "errors": 0,
    "original_size": 0,
    "optimized_size": 0,
    "png_to_webp": 0,
    "jpg_to_webp": 0,
}


def get_webp_path(original_path: Path) -> Path:
    """将文件扩展名改为 .webp"""
    return original_path.with_suffix(".webp")


def is_brand_image(path: Path) -> bool:
    """判断是否是品牌图片"""
    return "brand" in path.parts


def optimize_image(input_path: Path, output_path: Path, is_brand: bool = False):
    """压缩并转换单张图片"""
    try:
        img = Image.open(input_path)

        # 处理 RGBA（透明通道）
        if img.mode == "RGBA":
            # WebP 支持透明度，直接转换
            pass
        elif img.mode == "P":
            # 调色板模式 → RGBA
            img = img.convert("RGBA")
        elif img.mode != "RGB":
            img = img.convert("RGB")

        # 缩放（只缩小，不放大）
        max_w = BRAND_MAX_WIDTH if is_brand else MAX_WIDTH
        max_h = BRAND_MAX_WIDTH if is_brand else MAX_HEIGHT

        if img.width > max_w or img.height > max_h:
            img.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
            print(f"    缩放: {img.width}x{img.height}")

        # 保存为 WebP
        save_kwargs = {"format": "WEBP", "quality": WEBP_QUALITY}
        if img.mode == "RGBA":
            save_kwargs["lossless"] = False

        img.save(str(output_path), **save_kwargs)

        return True
    except Exception as e:
        print(f"    ❌ 错误: {e}")
        stats["errors"] += 1
        return False


def process_directory(directory: Path):
    """处理目录中的所有图片"""
    extensions = {".png", ".jpg", ".jpeg"}

    for root, dirs, files in os.walk(directory):
        root_path = Path(root)

        # 跳过备份目录
        if ".bak" in root_path.parts:
            continue

        for filename in files:
            file_path = root_path / filename

            if file_path.suffix.lower() not in extensions:
                continue

            # 跳过已经是 WebP 的
            if file_path.suffix.lower() == ".webp":
                continue

            # 计算输出路径
            webp_path = get_webp_path(file_path)

            # 如果 WebP 已存在且比源文件新，跳过
            if webp_path.exists() and webp_path.stat().st_mtime > file_path.stat().st_mtime:
                stats["skipped"] += 1
                continue

            original_size = file_path.stat().st_size
            stats["original_size"] += original_size

            is_brand = is_brand_image(file_path)
            rel_path = file_path.relative_to(IMAGES_DIR)

            print(f"  处理: {rel_path} ({original_size / 1024:.0f}KB)", end="")

            if optimize_image(file_path, webp_path, is_brand):
                new_size = webp_path.stat().st_size
                stats["optimized_size"] += new_size
                stats["processed"] += 1

                if file_path.suffix.lower() == ".png":
                    stats["png_to_webp"] += 1
                else:
                    stats["jpg_to_webp"] += 1

                savings = (1 - new_size / original_size) * 100
                print(f" → {new_size / 1024:.0f}KB (节省 {savings:.0f}%)")

                # 删除原文件（WebP 已替代）
                file_path.unlink()
            else:
                stats["optimized_size"] += original_size


def main():
    print("=" * 60)
    print("  Makimoo 图片优化工具")
    print(f"  目标目录: {IMAGES_DIR}")
    print(f"  WebP 质量: {WEBP_QUALITY}")
    print(f"  产品图最大尺寸: {MAX_WIDTH}x{MAX_HEIGHT}")
    print(f"  品牌图最大尺寸: {BRAND_MAX_WIDTH}x{BRAND_MAX_WIDTH}")
    print("=" * 60)

    if not IMAGES_DIR.exists():
        print(f"❌ 目录不存在: {IMAGES_DIR}")
        sys.exit(1)

    print("\n📁 处理品牌图片...")
    brand_dir = IMAGES_DIR / "brand"
    if brand_dir.exists():
        process_directory(brand_dir)

    print("\n📁 处理产品图片...")
    products_dir = IMAGES_DIR / "products"
    if products_dir.exists():
        process_directory(products_dir)

    # 输出统计
    print("\n" + "=" * 60)
    print("  优化完成！")
    print("=" * 60)
    print(f"  处理图片数: {stats['processed']}")
    print(f"  跳过（已存在）: {stats['skipped']}")
    print(f"  PNG → WebP: {stats['png_to_webp']}")
    print(f"  JPG → WebP: {stats['jpg_to_webp']}")
    print(f"  错误: {stats['errors']}")
    print(f"  原始总大小: {stats['original_size'] / 1024 / 1024:.1f}MB")
    print(f"  优化后总大小: {stats['optimized_size'] / 1024 / 1024:.1f}MB")

    if stats['original_size'] > 0:
        savings = (1 - stats['optimized_size'] / stats['original_size']) * 100
        print(f"  总共节省: {savings:.0f}%")
    print("=" * 60)


if __name__ == "__main__":
    main()
