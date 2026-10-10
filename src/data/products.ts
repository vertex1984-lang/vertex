export interface MakimooProduct {
  id: string;
  asin: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  images: { url: string; altText: string; width: number; height: number }[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { id: string; title: string; price: { amount: string; currencyCode: string }; availableForSale: boolean; selectedOptions: { name: string; value: string }[] }[];
  amazonUrl: string;
  // Shopify integration fields (populated at runtime)
  shopifyVariantId?: string;
  shopifyAvailable?: boolean;
  shopifyPrice?: string;
  shopifyCurrencyCode?: string;
  shopifyImages?: string[];
  hasShopifyData?: boolean;
  /** Shopify variant 重量（当前单位统一 KILOGRAMS；0/undefined = 未设置，前台不展示） */
  shopifyWeight?: number;
  shopifyWeightUnit?: string;
  // Featured image override (optional)
  featuredImage?: string;
  // 与素材图对齐的白底标记（true = 白底图，展示时加内边距缩小产品占比）
  imageWhiteBg?: boolean[];
  // 详情页附图（可选；来自素材条目 detailImages，有才渲染，无则不显示）
  detailImages?: string[];
  // 五点卖点缩写（素材库 short-bullets；详情页卖点列表优先使用，无则回退描述切分）
  featureBullets?: string[];
  // 真实评价数据（可选；用户整理数据时填入即自动显示，无则不渲染评分区）
  rating?: number;
  reviewCount?: number;
  // 真实原价（可选；填入且高于现价时才显示划线价和 Save 徽章）
  compareAtPrice?: string;
  // 二级分类 key（enrich 时按 subcategories.ts 规则写入；仅 Cushions/Pillows/Towels/Mats 有）
  subcategory?: string;
}

const BASE_PRODUCTS: MakimooProduct[] = [
  {
    "id": "makimoo-B098F1BKJQ",
    "asin": "B098F1BKJQ",
    "title": "Makimoo Bike Basket for Women's Beach Cruiser or Scooter The Original Wicker Bicycle Baskets with Built in Cup Holder for Front Handlebar-Classic Vintage Style Handmade Natural Rattan Wicker",
    "handle": "bike-basket-for-women-s-beach-cruiser-or-scooter-the-origina-b098f1bkjq",
    "description": "Replicas of the Lightship baskets first produced during the whaling era of the 1800s.. Our baskets are made from finely woven rattan cane: the outer skin of the natural rattan vine.. Attaches to handlebars with 2 adjustable leather straps, designed especially for children's bicycles.",
    "descriptionHtml": "<p>Replicas of the Lightship baskets first produced during the whaling era of the 1800s.</p><p>Our baskets are made from finely woven rattan cane: the outer skin of the natural rattan vine.</p><p>Attaches to handlebars with 2 adjustable leather straps, designed especially for children's bicycles.</p>",
    "productType": "Others",
    "tags": [
      "Others"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B098F1BKJQ/1.webp",
        "altText": "Bike Basket for Women's Beach Cruiser or Scooter The Original Wicker Bicycle Baskets with Built in Cup Holder for Front Handlebar-Classic Vintage Style Handmade Natural Rattan Wicker",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B098F1BKJQ/2.webp",
        "altText": "Bike Basket for Women's Beach Cruiser or Scooter The Original Wicker Bicycle Baskets with Built in Cup Holder for Front Handlebar-Classic Vintage Style Handmade Natural Rattan Wicker",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B098F1BKJQ/3.webp",
        "altText": "Bike Basket for Women's Beach Cruiser or Scooter The Original Wicker Bicycle Baskets with Built in Cup Holder for Front Handlebar-Classic Vintage Style Handmade Natural Rattan Wicker",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B098F1BKJQ/4.webp",
        "altText": "Bike Basket for Women's Beach Cruiser or Scooter The Original Wicker Bicycle Baskets with Built in Cup Holder for Front Handlebar-Classic Vintage Style Handmade Natural Rattan Wicker",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B098F1BKJQ/5.webp",
        "altText": "Bike Basket for Women's Beach Cruiser or Scooter The Original Wicker Bicycle Baskets with Built in Cup Holder for Front Handlebar-Classic Vintage Style Handmade Natural Rattan Wicker",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B098F1BKJQ",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B098F1BKJQ"
  },
  {
    "id": "makimoo-B0BCJQYYL1",
    "asin": "B0BCJQYYL1",
    "title": "Makimoo Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
    "handle": "set-of-2-outdoor-dining-chair-cushions-comfort-patio-seating-b0bcjqyyl1",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0BCJQYYL1/1.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/2.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/3.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/4.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/5.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/6.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/7.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/Gemini_Generated_Image_33x07833x07833x0.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/Gemini_Generated_Image_9fu9q69fu9q69fu9.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/nano-banana-pro-1776261559346.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/nano-banana-pro-1776261903394.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/nano-banana-pro-1776262660713.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/nano-banana-pro-1776263205260.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/nano-banana-pro-1776263350652.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0BCJQYYL1",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0BCJQYYL1"
  },
  {
    "id": "makimoo-B0BXCKKNN8",
    "asin": "B0BXCKKNN8",
    "title": "Makimoo Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Black)",
    "handle": "memory-foam-travel-pillow-neck-pillow-with-360-degree-head-s-b0bxckknn8",
    "description": "【Enhanced Sweat-Resistant Fabric】This U-shaped travel pillow boasts a super soft magnetic therapy cloth filled with premium microbeads and is covered with an upgraded sweat-resistant fabric. It's breathable, comfortable, non-pilling, and colorfast, providing a luxurious feel and gentle care for your skin during travels.. 【Superior Memory Foam Quality】With advanced 5-second rebound technology, the memory foam filler offers excellent neck support, cushions your body, and relieves pressure points for ultimate relaxation, ensuring maximum comfort on your trip.. 【Ergonomically Designed Support】The Umerci airplane pillow, designed for 360° head support, naturally fits your neck with perfect curves and prevents head side-slipping. The extra two support points enhance support and relieve neck fatigue. You can adjust the angle and size using the rope lock for added comfort.. 【Portable and Lightweight】Designed for comfort and portability. With a storage bag, the pillow can be compressed to half its size and easily attached to your carry-on luggage, saving space.. 【Ideal for Travel】Our memory foam travel pillow offers superb support, protecting your head and neck from pain on long road trips, train rides, or flights.",
    "descriptionHtml": "<p>【Enhanced Sweat-Resistant Fabric】This U-shaped travel pillow boasts a super soft magnetic therapy cloth filled with premium microbeads and is covered with an upgraded sweat-resistant fabric. It's breathable, comfortable, non-pilling, and colorfast, providing a luxurious feel and gentle care for your skin during travels.</p><p>【Superior Memory Foam Quality】With advanced 5-second rebound technology, the memory foam filler offers excellent neck support, cushions your body, and relieves pressure points for ultimate relaxation, ensuring maximum comfort on your trip.</p><p>【Ergonomically Designed Support】The Umerci airplane pillow, designed for 360° head support, naturally fits your neck with perfect curves and prevents head side-slipping. The extra two support points enhance support and relieve neck fatigue. You can adjust the angle and size using the rope lock for added comfort.</p><p>【Portable and Lightweight】Designed for comfort and portability. With a storage bag, the pillow can be compressed to half its size and easily attached to your carry-on luggage, saving space.</p><p>【Ideal for Travel】Our memory foam travel pillow offers superb support, protecting your head and neck from pain on long road trips, train rides, or flights.</p>",
    "productType": "Travel",
    "tags": [
      "Travel"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0BXCKKNN8/1.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BXCKKNN8/2.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BXCKKNN8/3.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BXCKKNN8/4.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BXCKKNN8/5.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BXCKKNN8/6.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Black)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0BXCKKNN8",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0BXCKKNN8"
  },
  {
    "id": "makimoo-B0CQC6H9MZ",
    "asin": "B0CQC6H9MZ",
    "title": "Makimoo Throw Pillow Inserts 45cm x 45cm (18\" x 18\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
    "handle": "throw-pillow-inserts-45cm-x-45cm-18-x-18-cushion-inserts-hol-b0cqc6h9mz",
    "description": "PACKAGE CONTENTS: You will recPIeive a package containing two 18x18 Inch Throw Pillow inserts .. GREAT QUALITY: Our Throw Pillow inserts are made of soft and comfortable fabric with hollowfibre filling.. VERSATILE USAGE：Our Throw Pillow inserts are suitable for a variety of settings, including sofas, beds, couches, cars, chairs, and bay windows.. EASY WASHING: Hand wash the cover or using a gentle cycle for machine washing, followed by low tumble dry. Please avoid ironing the cover.. CARE INSTRUCTIONS: Take out the Throw Pillow inserts gently from the package, do not pull forcefully. Pad the inserts repeatly until they bounce back to original form before use.",
    "descriptionHtml": "<p>PACKAGE CONTENTS: You will recPIeive a package containing two 18x18 Inch Throw Pillow inserts .</p><p>GREAT QUALITY: Our Throw Pillow inserts are made of soft and comfortable fabric with hollowfibre filling.</p><p>VERSATILE USAGE：Our Throw Pillow inserts are suitable for a variety of settings, including sofas, beds, couches, cars, chairs, and bay windows.</p><p>EASY WASHING: Hand wash the cover or using a gentle cycle for machine washing, followed by low tumble dry. Please avoid ironing the cover.</p><p>CARE INSTRUCTIONS: Take out the Throw Pillow inserts gently from the package, do not pull forcefully. Pad the inserts repeatly until they bounce back to original form before use.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CQC6H9MZ/studio-main.webp",
        "altText": "Throw Pillow Inserts 45cm x 45cm (18\" x 18\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/B0CQC6H9MZ/scene.webp",
        "altText": "Throw Pillow Inserts 45cm x 45cm (18\" x 18\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/B0CQC6H9MZ/studio-side.webp",
        "altText": "Throw Pillow Inserts 45cm x 45cm (18\" x 18\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/B0CQC6H9MZ/studio-filling.webp",
        "altText": "Throw Pillow Inserts 45cm x 45cm (18\" x 18\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CQC6H9MZ",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CQC6H9MZ"
  },
  {
    "id": "makimoo-B0BZCLN57S",
    "asin": "B0BZCLN57S",
    "title": "Makimoo Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
    "handle": "travel-neck-pillow-top-memory-foam-pillow-for-head-support-i-b0bzcln57s",
    "description": "【DUAL COMFORT IN ONE PILLOW WITH TWO MATERIALS】Experience the versatility of having two pillows in one with our Travel Plane Neck Pillow. It features super soft, cozy silver fox plush on one side and cooling, relaxing ice silk on the other. This adaptable pillow meets all your comfort needs during travel.. 【5 SNAP BUTTONS FOR CUSTOMIZABLE NECK, HEAD, AND CHIN SUPPORT】This pillow provides FULL SUPPORT for your neck, head, and chin. The 5 adjustable snap buttons allow for a customizable fit, making it suitable for people with neck sizes from 8 inches to 18 inches.. 【LIGHTWEIGHT AND COMPACT WITH A CONVENIENT SNAP-ON LOOP】The 100% Pure Memory Foam Neck Pillow can be easily compressed into a compact bag, saving space in your carry-on. The sturdy snap-on loop lets you attach the pillow to backpacks, luggage, or nearly any item you carry.. 【REMOVABLE AND MACHINE-WASHABLE PILLOW COVER】Hygiene and comfort go hand-in-hand. Our pillow comes with a detachable cover that can be easily removed and machine washed after every trip.. 【PURCHASE WITH CONFIDENCE, GUARANTEED】We stand by our products with a 100% satisfaction guarantee. If you're not pleased with our neck pillows or our service for any reason, please let us know. We'll either refund your money or send you a new plane neck pillow.",
    "descriptionHtml": "<p>【DUAL COMFORT IN ONE PILLOW WITH TWO MATERIALS】Experience the versatility of having two pillows in one with our Travel Plane Neck Pillow. It features super soft, cozy silver fox plush on one side and cooling, relaxing ice silk on the other. This adaptable pillow meets all your comfort needs during travel.</p><p>【5 SNAP BUTTONS FOR CUSTOMIZABLE NECK, HEAD, AND CHIN SUPPORT】This pillow provides FULL SUPPORT for your neck, head, and chin. The 5 adjustable snap buttons allow for a customizable fit, making it suitable for people with neck sizes from 8 inches to 18 inches.</p><p>【LIGHTWEIGHT AND COMPACT WITH A CONVENIENT SNAP-ON LOOP】The 100% Pure Memory Foam Neck Pillow can be easily compressed into a compact bag, saving space in your carry-on. The sturdy snap-on loop lets you attach the pillow to backpacks, luggage, or nearly any item you carry.</p><p>【REMOVABLE AND MACHINE-WASHABLE PILLOW COVER】Hygiene and comfort go hand-in-hand. Our pillow comes with a detachable cover that can be easily removed and machine washed after every trip.</p><p>【PURCHASE WITH CONFIDENCE, GUARANTEED】We stand by our products with a 100% satisfaction guarantee. If you're not pleased with our neck pillows or our service for any reason, please let us know. We'll either refund your money or send you a new plane neck pillow.</p>",
    "productType": "Travel",
    "tags": [
      "Travel"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0BZCLN57S/1.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCLN57S/2.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCLN57S/3.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCLN57S/4.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCLN57S/5.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCLN57S/6.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCLN57S/7.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0BZCLN57S",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0BZCLN57S"
  },
  {
    "id": "makimoo-B0BZCMDZNS",
    "asin": "B0BZCMDZNS",
    "title": "Makimoo Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Grey)",
    "handle": "travel-neck-pillow-top-memory-foam-pillow-for-head-support-i-b0bzcmdzns",
    "description": "【DUAL COMFORT IN ONE PILLOW WITH TWO MATERIALS】Experience the versatility of having two pillows in one with our Travel Plane Neck Pillow. It features super soft, cozy silver fox plush on one side and cooling, relaxing ice silk on the other. This adaptable pillow meets all your comfort needs during travel.. 【5 SNAP BUTTONS FOR CUSTOMIZABLE NECK, HEAD, AND CHIN SUPPORT】This pillow provides FULL SUPPORT for your neck, head, and chin. The 5 adjustable snap buttons allow for a customizable fit, making it suitable for people with neck sizes from 8 inches to 18 inches.. 【LIGHTWEIGHT AND COMPACT WITH A CONVENIENT SNAP-ON LOOP】The 100% Pure Memory Foam Neck Pillow can be easily compressed into a compact bag, saving space in your carry-on. The sturdy snap-on loop lets you attach the pillow to backpacks, luggage, or nearly any item you carry.. 【REMOVABLE AND MACHINE-WASHABLE PILLOW COVER】Hygiene and comfort go hand-in-hand. Our pillow comes with a detachable cover that can be easily removed and machine washed after every trip.. 【PURCHASE WITH CONFIDENCE, GUARANTEED】We stand by our products with a 100% satisfaction guarantee. If you're not pleased with our neck pillows or our service for any reason, please let us know. We'll either refund your money or send you a new plane neck pillow.",
    "descriptionHtml": "<p>【DUAL COMFORT IN ONE PILLOW WITH TWO MATERIALS】Experience the versatility of having two pillows in one with our Travel Plane Neck Pillow. It features super soft, cozy silver fox plush on one side and cooling, relaxing ice silk on the other. This adaptable pillow meets all your comfort needs during travel.</p><p>【5 SNAP BUTTONS FOR CUSTOMIZABLE NECK, HEAD, AND CHIN SUPPORT】This pillow provides FULL SUPPORT for your neck, head, and chin. The 5 adjustable snap buttons allow for a customizable fit, making it suitable for people with neck sizes from 8 inches to 18 inches.</p><p>【LIGHTWEIGHT AND COMPACT WITH A CONVENIENT SNAP-ON LOOP】The 100% Pure Memory Foam Neck Pillow can be easily compressed into a compact bag, saving space in your carry-on. The sturdy snap-on loop lets you attach the pillow to backpacks, luggage, or nearly any item you carry.</p><p>【REMOVABLE AND MACHINE-WASHABLE PILLOW COVER】Hygiene and comfort go hand-in-hand. Our pillow comes with a detachable cover that can be easily removed and machine washed after every trip.</p><p>【PURCHASE WITH CONFIDENCE, GUARANTEED】We stand by our products with a 100% satisfaction guarantee. If you're not pleased with our neck pillows or our service for any reason, please let us know. We'll either refund your money or send you a new plane neck pillow.</p>",
    "productType": "Travel",
    "tags": [
      "Travel"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0BZCMDZNS/1.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCMDZNS/2.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCMDZNS/3.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCMDZNS/4.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCMDZNS/5.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCMDZNS/6.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Grey)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0BZCMDZNS",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0BZCMDZNS"
  },
  {
    "id": "makimoo-B0C2Z9JRDM",
    "asin": "B0C2Z9JRDM",
    "title": "Makimoo Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
    "handle": "memory-foam-travel-pillow-neck-pillow-with-360-degree-head-s-b0c2z9jrdm",
    "description": "【Enhanced Sweat-Resistant Fabric】This U-shaped travel pillow boasts a super soft magnetic therapy cloth filled with premium microbeads and is covered with an upgraded sweat-resistant fabric. It's breathable, comfortable, non-pilling, and colorfast, providing a luxurious feel and gentle care for your skin during travels.. 【Superior Memory Foam Quality】With advanced 5-second rebound technology, the memory foam filler offers excellent neck support, cushions your body, and relieves pressure points for ultimate relaxation, ensuring maximum comfort on your trip.. 【Ergonomically Designed Support】The Umerci airplane pillow, designed for 360° head support, naturally fits your neck with perfect curves and prevents head side-slipping. The extra two support points enhance support and relieve neck fatigue. You can adjust the angle and size using the rope lock for added comfort.. 【Portable and Lightweight】Designed for comfort and portability. With a storage bag, the pillow can be compressed to half its size and easily attached to your carry-on luggage, saving space.. 【Ideal for Travel】Our memory foam travel pillow offers superb support, protecting your head and neck from pain on long road trips, train rides, or flights.",
    "descriptionHtml": "<p>【Enhanced Sweat-Resistant Fabric】This U-shaped travel pillow boasts a super soft magnetic therapy cloth filled with premium microbeads and is covered with an upgraded sweat-resistant fabric. It's breathable, comfortable, non-pilling, and colorfast, providing a luxurious feel and gentle care for your skin during travels.</p><p>【Superior Memory Foam Quality】With advanced 5-second rebound technology, the memory foam filler offers excellent neck support, cushions your body, and relieves pressure points for ultimate relaxation, ensuring maximum comfort on your trip.</p><p>【Ergonomically Designed Support】The Umerci airplane pillow, designed for 360° head support, naturally fits your neck with perfect curves and prevents head side-slipping. The extra two support points enhance support and relieve neck fatigue. You can adjust the angle and size using the rope lock for added comfort.</p><p>【Portable and Lightweight】Designed for comfort and portability. With a storage bag, the pillow can be compressed to half its size and easily attached to your carry-on luggage, saving space.</p><p>【Ideal for Travel】Our memory foam travel pillow offers superb support, protecting your head and neck from pain on long road trips, train rides, or flights.</p>",
    "productType": "Travel",
    "tags": [
      "Travel"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C2Z9JRDM/1.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9JRDM/2.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9JRDM/3.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9JRDM/4.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9JRDM/5.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9JRDM/6.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9JRDM/7.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C2Z9JRDM",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C2Z9JRDM"
  },
  {
    "id": "makimoo-B0C2Z9PFFK",
    "asin": "B0C2Z9PFFK",
    "title": "Makimoo Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Grey)",
    "handle": "memory-foam-travel-pillow-neck-pillow-with-360-degree-head-s-b0c2z9pffk",
    "description": "【Enhanced Sweat-Resistant Fabric】This U-shaped travel pillow boasts a super soft magnetic therapy cloth filled with premium microbeads and is covered with an upgraded sweat-resistant fabric. It's breathable, comfortable, non-pilling, and colorfast, providing a luxurious feel and gentle care for your skin during travels.. 【Superior Memory Foam Quality】With advanced 5-second rebound technology, the memory foam filler offers excellent neck support, cushions your body, and relieves pressure points for ultimate relaxation, ensuring maximum comfort on your trip.. 【Ergonomically Designed Support】The Umerci airplane pillow, designed for 360° head support, naturally fits your neck with perfect curves and prevents head side-slipping. The extra two support points enhance support and relieve neck fatigue. You can adjust the angle and size using the rope lock for added comfort.. 【Portable and Lightweight】Designed for comfort and portability. With a storage bag, the pillow can be compressed to half its size and easily attached to your carry-on luggage, saving space.. 【Ideal for Travel】Our memory foam travel pillow offers superb support, protecting your head and neck from pain on long road trips, train rides, or flights.",
    "descriptionHtml": "<p>【Enhanced Sweat-Resistant Fabric】This U-shaped travel pillow boasts a super soft magnetic therapy cloth filled with premium microbeads and is covered with an upgraded sweat-resistant fabric. It's breathable, comfortable, non-pilling, and colorfast, providing a luxurious feel and gentle care for your skin during travels.</p><p>【Superior Memory Foam Quality】With advanced 5-second rebound technology, the memory foam filler offers excellent neck support, cushions your body, and relieves pressure points for ultimate relaxation, ensuring maximum comfort on your trip.</p><p>【Ergonomically Designed Support】The Umerci airplane pillow, designed for 360° head support, naturally fits your neck with perfect curves and prevents head side-slipping. The extra two support points enhance support and relieve neck fatigue. You can adjust the angle and size using the rope lock for added comfort.</p><p>【Portable and Lightweight】Designed for comfort and portability. With a storage bag, the pillow can be compressed to half its size and easily attached to your carry-on luggage, saving space.</p><p>【Ideal for Travel】Our memory foam travel pillow offers superb support, protecting your head and neck from pain on long road trips, train rides, or flights.</p>",
    "productType": "Travel",
    "tags": [
      "Travel"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C2Z9PFFK/1.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9PFFK/2.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9PFFK/3.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9PFFK/4.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9PFFK/5.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Grey)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C2Z9PFFK",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C2Z9PFFK"
  },
  {
    "id": "makimoo-B0C2ZCXVX7",
    "asin": "B0C2ZCXVX7",
    "title": "Makimoo Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Blue)",
    "handle": "memory-foam-travel-pillow-neck-pillow-with-360-degree-head-s-b0c2zcxvx7",
    "description": "【Enhanced Sweat-Resistant Fabric】This U-shaped travel pillow boasts a super soft magnetic therapy cloth filled with premium microbeads and is covered with an upgraded sweat-resistant fabric. It's breathable, comfortable, non-pilling, and colorfast, providing a luxurious feel and gentle care for your skin during travels.. 【Superior Memory Foam Quality】With advanced 5-second rebound technology, the memory foam filler offers excellent neck support, cushions your body, and relieves pressure points for ultimate relaxation, ensuring maximum comfort on your trip.. 【Ergonomically Designed Support】The Umerci airplane pillow, designed for 360° head support, naturally fits your neck with perfect curves and prevents head side-slipping. The extra two support points enhance support and relieve neck fatigue. You can adjust the angle and size using the rope lock for added comfort.. 【Portable and Lightweight】Designed for comfort and portability. With a storage bag, the pillow can be compressed to half its size and easily attached to your carry-on luggage, saving space.. 【Ideal for Travel】Our memory foam travel pillow offers superb support, protecting your head and neck from pain on long road trips, train rides, or flights.",
    "descriptionHtml": "<p>【Enhanced Sweat-Resistant Fabric】This U-shaped travel pillow boasts a super soft magnetic therapy cloth filled with premium microbeads and is covered with an upgraded sweat-resistant fabric. It's breathable, comfortable, non-pilling, and colorfast, providing a luxurious feel and gentle care for your skin during travels.</p><p>【Superior Memory Foam Quality】With advanced 5-second rebound technology, the memory foam filler offers excellent neck support, cushions your body, and relieves pressure points for ultimate relaxation, ensuring maximum comfort on your trip.</p><p>【Ergonomically Designed Support】The Umerci airplane pillow, designed for 360° head support, naturally fits your neck with perfect curves and prevents head side-slipping. The extra two support points enhance support and relieve neck fatigue. You can adjust the angle and size using the rope lock for added comfort.</p><p>【Portable and Lightweight】Designed for comfort and portability. With a storage bag, the pillow can be compressed to half its size and easily attached to your carry-on luggage, saving space.</p><p>【Ideal for Travel】Our memory foam travel pillow offers superb support, protecting your head and neck from pain on long road trips, train rides, or flights.</p>",
    "productType": "Travel",
    "tags": [
      "Travel"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C2ZCXVX7/1.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2ZCXVX7/2.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2ZCXVX7/3.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2ZCXVX7/4.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2ZCXVX7/5.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2ZCXVX7/6.webp",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Blue)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C2ZCXVX7",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C2ZCXVX7"
  },
  {
    "id": "makimoo-B0C33LFHN1",
    "asin": "B0C33LFHN1",
    "title": "Makimoo Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
    "handle": "set-of-4-outdoor-dining-chair-cushions-comfort-patio-seating-b0c33lfhn1",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C33LFHN1/1.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LFHN1/2.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LFHN1/3.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LFHN1/4.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LFHN1/5.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LFHN1/6.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C33LFHN1",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C33LFHN1"
  },
  {
    "id": "makimoo-B0C33LPY5G",
    "asin": "B0C33LPY5G",
    "title": "Makimoo Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
    "handle": "set-of-4-outdoor-dining-chair-cushions-comfort-patio-seating-b0c33lpy5g",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching. Specially treated fabric: water repellent, oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching</p><p>Specially treated fabric: water repellent, oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C33LPY5G/1.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LPY5G/2.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LPY5G/3.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LPY5G/4.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LPY5G/5.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LPY5G/6.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LPY5G/7.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
{
        "url": "/images/products/B0C33LPY5G/Seeany.com_万能改图_520044.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C33LPY5G",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C33LPY5G"
  },
  {
    "id": "makimoo-B0C33LXRVK",
    "asin": "B0C33LXRVK",
    "title": "Makimoo Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
    "handle": "set-of-4-outdoor-dining-chair-cushions-comfort-patio-seating-b0c33lxrvk",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C33LXRVK/1.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LXRVK/2.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LXRVK/3.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LXRVK/4.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LXRVK/5.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LXRVK/6.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LXRVK/7.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C33LXRVK",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C33LXRVK"
  },
  {
    "id": "makimoo-B0C33LZ5PW",
    "asin": "B0C33LZ5PW",
    "title": "Makimoo Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
    "handle": "set-of-4-outdoor-dining-chair-cushions-comfort-patio-seating-b0c33lz5pw",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C33LZ5PW/1.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LZ5PW/2.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LZ5PW/3.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LZ5PW/4.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LZ5PW/5.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LZ5PW/6.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LZ5PW/7.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C33LZ5PW",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C33LZ5PW"
  },
  {
    "id": "makimoo-B0C33M24L3",
    "asin": "B0C33M24L3",
    "title": "Makimoo Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
    "handle": "set-of-4-outdoor-dining-chair-cushions-comfort-patio-seating-b0c33m24l3",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C33M24L3/1.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/2.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/3.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/4.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/5.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/6.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/7.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-02-2666-Photorealistic commercial product photog....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-02-4992-Photorealistic commercial product photog....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-02-8138-Photorealistic commercial product photog....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-02-8366-Photorealistic commercial product photog....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-04-1414-Hyper-realistic commercial lifestyle pho....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-04-7544-Warm lifestyle commercial photography, b....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-04-8131-Hyper-realistic commercial lifestyle pho....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C33M24L3",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C33M24L3"
  },
  {
    "id": "makimoo-B0C39ZMK7H",
    "asin": "B0C39ZMK7H",
    "title": "Makimoo Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
    "handle": "set-of-2-outdoor-dining-chair-cushions-comfort-patio-seating-b0c39zmk7h",
    "description": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
    "descriptionHtml": "<p>Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C39ZMK7H/1.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZMK7H/2.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZMK7H/3.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZMK7H/4.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZMK7H/5.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZMK7H/6.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZMK7H/7.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZMK7H/8.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C39ZMK7H",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C39ZMK7H"
  },
  {
    "id": "makimoo-B0C39ZSD3Q",
    "asin": "B0C39ZSD3Q",
    "title": "Makimoo Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
    "handle": "set-of-2-outdoor-dining-chair-cushions-comfort-patio-seating-b0c39zsd3q",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C39ZSD3Q/1.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZSD3Q/2.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZSD3Q/3.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZSD3Q/4.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZSD3Q/5.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZSD3Q/6.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZSD3Q/7.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C39ZSD3Q",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C39ZSD3Q"
  },
  {
    "id": "makimoo-B0C3B12DL7",
    "asin": "B0C3B12DL7",
    "title": "Makimoo Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
    "handle": "set-of-2-outdoor-dining-chair-cushions-comfort-patio-seating-b0c3b12dl7",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture.. Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors.. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric.. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern.. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand.",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture.</p><p>Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors.</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric.</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern.</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand.</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C3B12DL7/1.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/2.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/3.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/4.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/5.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/6.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/7.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514628.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514643.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514667.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514779.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514797.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514802.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514853.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514864.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C3B12DL7",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C3B12DL7"
  },
  {
    "id": "makimoo-B0C3B13N8Z",
    "asin": "B0C3B13N8Z",
    "title": "Makimoo Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
    "handle": "set-of-2-outdoor-dining-chair-cushions-comfort-patio-seating-b0c3b13n8z",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C3B13N8Z/1.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/2.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/3.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/4.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/5.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/6.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/7.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514887.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514899.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514911.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514923.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514928.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514942.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514957.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_515008.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C3B13N8Z",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C3B13N8Z"
  },
  {
    "id": "makimoo-B0C3B16L6R",
    "asin": "B0C3B16L6R",
    "title": "Makimoo Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
    "handle": "set-of-2-outdoor-dining-chair-cushions-comfort-patio-seating-b0c3b16l6r",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture.. Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors.. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric.. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern.. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand.",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture.</p><p>Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors.</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric.</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern.</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand.</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C3B16L6R/1.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/2.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/3.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/4.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/5.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/6.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/7.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/Seeany.com_万能改图_515950.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/Seeany.com_万能改图_515959.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/Seeany.com_万能改图_515962.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/Seeany.com_万能改图_515976.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/Seeany.com_万能改图_515993.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/Seeany.com_万能改图_519872.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C3B16L6R",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C3B16L6R"
  },
  {
    "id": "makimoo-B0C3B265XJ",
    "asin": "B0C3B265XJ",
    "title": "Makimoo Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
    "handle": "set-of-2-outdoor-dining-chair-cushions-comfort-patio-seating-b0c3b265xj",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C3B265XJ/1.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/2.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/3.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/4.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/5.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/6.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/7.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_519876.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_519882.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_519883.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_519885.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_519901.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_519986.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_520027.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C3B265XJ",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C3B265XJ"
  },
  {
    "id": "makimoo-B0C4B9T6JV",
    "asin": "B0C4B9T6JV",
    "title": "Makimoo 2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
    "handle": "2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4b9t6jv",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. High quality fabric: Soft, smooth and washable. Provide extra comfort and longevity; filling material uses 100% polyester. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>High quality fabric: Soft, smooth and washable</p><p>Provide extra comfort and longevity; filling material uses 100% polyester</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C4B9T6JV/1.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/2.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/3.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/4.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/5.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/6.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/7.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_AI图片编辑器_529817.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529860.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529863.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529872.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529880.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529884.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529930.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529935.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C4B9T6JV",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C4B9T6JV"
  },
  {
    "id": "makimoo-B0C4BBVS53",
    "asin": "B0C4BBVS53",
    "title": "Makimoo 2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
    "handle": "2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bbvs53",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. High quality fabric: Soft, smooth and washable. Provide extra comfort and longevity; filling material uses 100% polyester. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>High quality fabric: Soft, smooth and washable</p><p>Provide extra comfort and longevity; filling material uses 100% polyester</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C4BBVS53/1.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BBVS53/2.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BBVS53/3.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BBVS53/4.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BBVS53/5.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BBVS53/6.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BBVS53/7.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C4BBVS53",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C4BBVS53"
  },
  {
    "id": "makimoo-B0C4BC7Q4S",
    "asin": "B0C4BC7Q4S",
    "title": "Makimoo 2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
    "handle": "2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bc7q4s",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. High quality fabric: Soft, smooth and washable. Provide extra comfort and longevity; filling material uses 100% polyester. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>High quality fabric: Soft, smooth and washable</p><p>Provide extra comfort and longevity; filling material uses 100% polyester</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C4BC7Q4S/1.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/2.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/3.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/4.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/5.gif",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/Gemini_Generated_Image_g03oq9g03oq9g03o (1).webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/Gemini_Generated_Image_k2s1iok2s1iok2s1.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/Gemini_Generated_Image_wjvhhiwjvhhiwjvh (1).webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/nano-banana-pro-upscaled-2x-1775544337846.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/nano-banana-pro-upscaled-2x-1775545639578.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/nano-banana-pro-upscaled-2x-1775546296442.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C4BC7Q4S",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C4BC7Q4S"
  },
  {
    "id": "makimoo-B0C4BCD4DY",
    "asin": "B0C4BCD4DY",
    "title": "Makimoo 2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
    "handle": "2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bcd4dy",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. High quality fabric: Soft, smooth and washable. Provide extra comfort and longevity; filling material uses 100% polyester. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>High quality fabric: Soft, smooth and washable</p><p>Provide extra comfort and longevity; filling material uses 100% polyester</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C4BCD4DY/1.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/2.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/3.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/4.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/5.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/6.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/7.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_AI图片编辑器_529422.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_万能改图_529469.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_万能改图_529473.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_万能改图_529517.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_万能改图_529572.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_万能改图_529618.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_万能改图_529632.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C4BCD4DY",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C4BCD4DY"
  },
  {
    "id": "makimoo-B0C4BD7Q5X",
    "asin": "B0C4BD7Q5X",
    "title": "Makimoo 2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
    "handle": "2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bd7q5x",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. High quality fabric: Soft, smooth and washable. Provide extra comfort and longevity; filling material uses 100% polyester. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>High quality fabric: Soft, smooth and washable</p><p>Provide extra comfort and longevity; filling material uses 100% polyester</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C4BD7Q5X/1.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/2.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/3.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/4.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/5.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/6.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/7.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_AI图片编辑_529103.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_AI图片编辑_529161.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_AI图片编辑器_529334.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_AI图片编辑器_529342.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_万能改图_529499.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_智能创作_520063.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_智能创作_520066.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_智能创作_520067.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_电商套图_529253.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C4BD7Q5X",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C4BD7Q5X"
  },
  {
    "id": "makimoo-B0C4BDLLFK",
    "asin": "B0C4BDLLFK",
    "title": "Makimoo 2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
    "handle": "2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0c4bdllfk",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. High quality fabric: Soft, smooth and washable. Provide extra comfort and longevity; filling material uses 100% polyester. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>High quality fabric: Soft, smooth and washable</p><p>Provide extra comfort and longevity; filling material uses 100% polyester</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C4BDLLFK/1.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BDLLFK/2.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BDLLFK/3.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BDLLFK/4.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BDLLFK/5.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BDLLFK/6.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BDLLFK/7.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C4BDLLFK",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C4BDLLFK"
  },
  {
    "id": "makimoo-B0C69QNSB3",
    "asin": "B0C69QNSB3",
    "title": "Makimoo Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
    "handle": "inflatable-travel-pillow-neck-pillow-support-for-traveling-a-b0c69qnsb3",
    "description": "【Neck Tilt Prevention】The neck pillows adhere to human engineering mechanics principles, with top humps that support your head and prevent neck tilting. Enjoy several hours of sleep on a flight without falling or experiencing hand or neck pain, making your journey more comfortable.. 【100% Soft Velvet Cover】This travel neck pillow features a non-irritating, odor-free soft velvet fabric. Its comfortable, sweat-resistant cover keeps your face fresh, making it an excellent alternative to inflatable horseshoe-shaped or memory foam pillows. Use it as a floating pillow for the bathtub (with the soft cover removed) for exceptional comfort.. 【Adjustable Firmness】Inflatable neck pillow showcases inflation technology with easy-to-use valves (inflate with just 3 breaths/blows). Adjust neck support and comfort by adding or releasing air, a feature unavailable in solid pillows. It also serves as excellent lower back support for kids or adults reading in airline seats.. 【Compact Size】Tired of memory foam pillows being too bulky for backpacks? Our neck pillow compresses to a size slightly larger than a soda can, fitting in your briefcase or hanging from your bag. No need to carry cumbersome neck supports during your travels.. 【Pain Relief Neck Pillows】If you've dismissed neck pillows as a gimmick, think again. When sitting in front of a computer for 12+ hours or enduring a 9+ hour flight, this cooling travel pillow can alleviate neck stiffness and fatigue. Ideal for airplanes, cars, offices, or recliners, it provides superior support and comfort compared to conventional squishy pillows. Treat your entire family to this thoughtful gift!",
    "descriptionHtml": "<p>【Neck Tilt Prevention】The neck pillows adhere to human engineering mechanics principles, with top humps that support your head and prevent neck tilting. Enjoy several hours of sleep on a flight without falling or experiencing hand or neck pain, making your journey more comfortable.</p><p>【100% Soft Velvet Cover】This travel neck pillow features a non-irritating, odor-free soft velvet fabric. Its comfortable, sweat-resistant cover keeps your face fresh, making it an excellent alternative to inflatable horseshoe-shaped or memory foam pillows. Use it as a floating pillow for the bathtub (with the soft cover removed) for exceptional comfort.</p><p>【Adjustable Firmness】Inflatable neck pillow showcases inflation technology with easy-to-use valves (inflate with just 3 breaths/blows). Adjust neck support and comfort by adding or releasing air, a feature unavailable in solid pillows. It also serves as excellent lower back support for kids or adults reading in airline seats.</p><p>【Compact Size】Tired of memory foam pillows being too bulky for backpacks? Our neck pillow compresses to a size slightly larger than a soda can, fitting in your briefcase or hanging from your bag. No need to carry cumbersome neck supports during your travels.</p><p>【Pain Relief Neck Pillows】If you've dismissed neck pillows as a gimmick, think again. When sitting in front of a computer for 12+ hours or enduring a 9+ hour flight, this cooling travel pillow can alleviate neck stiffness and fatigue. Ideal for airplanes, cars, offices, or recliners, it provides superior support and comfort compared to conventional squishy pillows. Treat your entire family to this thoughtful gift!</p>",
    "productType": "Travel",
    "tags": [
      "Travel"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C69QNSB3/1.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69QNSB3/2.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69QNSB3/3.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69QNSB3/4.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69QNSB3/5.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69QNSB3/6.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69QNSB3/7.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C69QNSB3",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C69QNSB3"
  },
  {
    "id": "makimoo-B0C69RJVVT",
    "asin": "B0C69RJVVT",
    "title": "Makimoo Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
    "handle": "inflatable-travel-pillow-neck-pillow-support-for-traveling-a-b0c69rjvvt",
    "description": "【Neck Tilt Prevention】The neck pillows adhere to human engineering mechanics principles, with top humps that support your head and prevent neck tilting. Enjoy several hours of sleep on a flight without falling or experiencing hand or neck pain, making your journey more comfortable.. 【100% Soft Velvet Cover】This travel neck pillow features a non-irritating, odor-free soft velvet fabric. Its comfortable, sweat-resistant cover keeps your face fresh, making it an excellent alternative to inflatable horseshoe-shaped or memory foam pillows. Use it as a floating pillow for the bathtub (with the soft cover removed) for exceptional comfort.. 【Adjustable Firmness】Inflatable neck pillow showcases inflation technology with easy-to-use valves (inflate with just 3 breaths/blows). Adjust neck support and comfort by adding or releasing air, a feature unavailable in solid pillows. It also serves as excellent lower back support for kids or adults reading in airline seats.. 【Compact Size】Tired of memory foam pillows being too bulky for backpacks? Our neck pillow compresses to a size slightly larger than a soda can, fitting in your briefcase or hanging from your bag. No need to carry cumbersome neck supports during your travels.. 【Pain Relief Neck Pillows】If you've dismissed neck pillows as a gimmick, think again. When sitting in front of a computer for 12+ hours or enduring a 9+ hour flight, this cooling travel pillow can alleviate neck stiffness and fatigue. Ideal for airplanes, cars, offices, or recliners, it provides superior support and comfort compared to conventional squishy pillows. Treat your entire family to this thoughtful gift!",
    "descriptionHtml": "<p>【Neck Tilt Prevention】The neck pillows adhere to human engineering mechanics principles, with top humps that support your head and prevent neck tilting. Enjoy several hours of sleep on a flight without falling or experiencing hand or neck pain, making your journey more comfortable.</p><p>【100% Soft Velvet Cover】This travel neck pillow features a non-irritating, odor-free soft velvet fabric. Its comfortable, sweat-resistant cover keeps your face fresh, making it an excellent alternative to inflatable horseshoe-shaped or memory foam pillows. Use it as a floating pillow for the bathtub (with the soft cover removed) for exceptional comfort.</p><p>【Adjustable Firmness】Inflatable neck pillow showcases inflation technology with easy-to-use valves (inflate with just 3 breaths/blows). Adjust neck support and comfort by adding or releasing air, a feature unavailable in solid pillows. It also serves as excellent lower back support for kids or adults reading in airline seats.</p><p>【Compact Size】Tired of memory foam pillows being too bulky for backpacks? Our neck pillow compresses to a size slightly larger than a soda can, fitting in your briefcase or hanging from your bag. No need to carry cumbersome neck supports during your travels.</p><p>【Pain Relief Neck Pillows】If you've dismissed neck pillows as a gimmick, think again. When sitting in front of a computer for 12+ hours or enduring a 9+ hour flight, this cooling travel pillow can alleviate neck stiffness and fatigue. Ideal for airplanes, cars, offices, or recliners, it provides superior support and comfort compared to conventional squishy pillows. Treat your entire family to this thoughtful gift!</p>",
    "productType": "Travel",
    "tags": [
      "Travel"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C69RJVVT/1.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RJVVT/2.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RJVVT/3.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RJVVT/4.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RJVVT/5.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RJVVT/6.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RJVVT/7.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C69RJVVT",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C69RJVVT"
  },
  {
    "id": "makimoo-B0C69RR6GF",
    "asin": "B0C69RR6GF",
    "title": "Makimoo Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
    "handle": "inflatable-travel-pillow-neck-pillow-support-for-traveling-a-b0c69rr6gf",
    "description": "【Neck Tilt Prevention】The neck pillows adhere to human engineering mechanics principles, with top humps that support your head and prevent neck tilting. Enjoy several hours of sleep on a flight without falling or experiencing hand or neck pain, making your journey more comfortable.. 【100% Soft Velvet Cover】This travel neck pillow features a non-irritating, odor-free soft velvet fabric. Its comfortable, sweat-resistant cover keeps your face fresh, making it an excellent alternative to inflatable horseshoe-shaped or memory foam pillows. Use it as a floating pillow for the bathtub (with the soft cover removed) for exceptional comfort.. 【Adjustable Firmness】Inflatable neck pillow showcases inflation technology with easy-to-use valves (inflate with just 3 breaths/blows). Adjust neck support and comfort by adding or releasing air, a feature unavailable in solid pillows. It also serves as excellent lower back support for kids or adults reading in airline seats.. 【Compact Size】Tired of memory foam pillows being too bulky for backpacks? Our neck pillow compresses to a size slightly larger than a soda can, fitting in your briefcase or hanging from your bag. No need to carry cumbersome neck supports during your travels.. 【Pain Relief Neck Pillows】If you've dismissed neck pillows as a gimmick, think again. When sitting in front of a computer for 12+ hours or enduring a 9+ hour flight, this cooling travel pillow can alleviate neck stiffness and fatigue. Ideal for airplanes, cars, offices, or recliners, it provides superior support and comfort compared to conventional squishy pillows. Treat your entire family to this thoughtful gift!",
    "descriptionHtml": "<p>【Neck Tilt Prevention】The neck pillows adhere to human engineering mechanics principles, with top humps that support your head and prevent neck tilting. Enjoy several hours of sleep on a flight without falling or experiencing hand or neck pain, making your journey more comfortable.</p><p>【100% Soft Velvet Cover】This travel neck pillow features a non-irritating, odor-free soft velvet fabric. Its comfortable, sweat-resistant cover keeps your face fresh, making it an excellent alternative to inflatable horseshoe-shaped or memory foam pillows. Use it as a floating pillow for the bathtub (with the soft cover removed) for exceptional comfort.</p><p>【Adjustable Firmness】Inflatable neck pillow showcases inflation technology with easy-to-use valves (inflate with just 3 breaths/blows). Adjust neck support and comfort by adding or releasing air, a feature unavailable in solid pillows. It also serves as excellent lower back support for kids or adults reading in airline seats.</p><p>【Compact Size】Tired of memory foam pillows being too bulky for backpacks? Our neck pillow compresses to a size slightly larger than a soda can, fitting in your briefcase or hanging from your bag. No need to carry cumbersome neck supports during your travels.</p><p>【Pain Relief Neck Pillows】If you've dismissed neck pillows as a gimmick, think again. When sitting in front of a computer for 12+ hours or enduring a 9+ hour flight, this cooling travel pillow can alleviate neck stiffness and fatigue. Ideal for airplanes, cars, offices, or recliners, it provides superior support and comfort compared to conventional squishy pillows. Treat your entire family to this thoughtful gift!</p>",
    "productType": "Travel",
    "tags": [
      "Travel"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C69RR6GF/1.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RR6GF/2.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RR6GF/3.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RR6GF/4.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RR6GF/5.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RR6GF/6.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RR6GF/7.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C69RR6GF",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C69RR6GF"
  },
  {
    "id": "makimoo-B0C69RRYXM",
    "asin": "B0C69RRYXM",
    "title": "Makimoo Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
    "handle": "inflatable-travel-pillow-neck-pillow-support-for-traveling-a-b0c69rryxm",
    "description": "【Neck Tilt Prevention】The neck pillows adhere to human engineering mechanics principles, with top humps that support your head and prevent neck tilting. Enjoy several hours of sleep on a flight without falling or experiencing hand or neck pain, making your journey more comfortable.. 【100% Soft Velvet Cover】This travel neck pillow features a non-irritating, odor-free soft velvet fabric. Its comfortable, sweat-resistant cover keeps your face fresh, making it an excellent alternative to inflatable horseshoe-shaped or memory foam pillows. Use it as a floating pillow for the bathtub (with the soft cover removed) for exceptional comfort.. 【Adjustable Firmness】Inflatable neck pillow showcases inflation technology with easy-to-use valves (inflate with just 3 breaths/blows). Adjust neck support and comfort by adding or releasing air, a feature unavailable in solid pillows. It also serves as excellent lower back support for kids or adults reading in airline seats.. 【Compact Size】Tired of memory foam pillows being too bulky for backpacks? Our neck pillow compresses to a size slightly larger than a soda can, fitting in your briefcase or hanging from your bag. No need to carry cumbersome neck supports during your travels.. 【Pain Relief Neck Pillows】If you've dismissed neck pillows as a gimmick, think again. When sitting in front of a computer for 12+ hours or enduring a 9+ hour flight, this cooling travel pillow can alleviate neck stiffness and fatigue. Ideal for airplanes, cars, offices, or recliners, it provides superior support and comfort compared to conventional squishy pillows. Treat your entire family to this thoughtful gift!",
    "descriptionHtml": "<p>【Neck Tilt Prevention】The neck pillows adhere to human engineering mechanics principles, with top humps that support your head and prevent neck tilting. Enjoy several hours of sleep on a flight without falling or experiencing hand or neck pain, making your journey more comfortable.</p><p>【100% Soft Velvet Cover】This travel neck pillow features a non-irritating, odor-free soft velvet fabric. Its comfortable, sweat-resistant cover keeps your face fresh, making it an excellent alternative to inflatable horseshoe-shaped or memory foam pillows. Use it as a floating pillow for the bathtub (with the soft cover removed) for exceptional comfort.</p><p>【Adjustable Firmness】Inflatable neck pillow showcases inflation technology with easy-to-use valves (inflate with just 3 breaths/blows). Adjust neck support and comfort by adding or releasing air, a feature unavailable in solid pillows. It also serves as excellent lower back support for kids or adults reading in airline seats.</p><p>【Compact Size】Tired of memory foam pillows being too bulky for backpacks? Our neck pillow compresses to a size slightly larger than a soda can, fitting in your briefcase or hanging from your bag. No need to carry cumbersome neck supports during your travels.</p><p>【Pain Relief Neck Pillows】If you've dismissed neck pillows as a gimmick, think again. When sitting in front of a computer for 12+ hours or enduring a 9+ hour flight, this cooling travel pillow can alleviate neck stiffness and fatigue. Ideal for airplanes, cars, offices, or recliners, it provides superior support and comfort compared to conventional squishy pillows. Treat your entire family to this thoughtful gift!</p>",
    "productType": "Travel",
    "tags": [
      "Travel"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C69RRYXM/1.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RRYXM/2.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RRYXM/3.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RRYXM/4.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RRYXM/5.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RRYXM/6.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RRYXM/7.webp",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C69RRYXM",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C69RRYXM"
  },
  {
    "id": "makimoo-B0C6H5XZMZ",
    "asin": "B0C6H5XZMZ",
    "title": "Makimoo Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
    "handle": "set-of-4-outdoor-dining-chair-cushions-comfort-patio-seating-b0c6h5xzmz",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture.. Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors.. It is overstuffed for added comfort and long-lasting use, with filling made of 100% outdoor polyester fabric.. Suitable for both indoor and outdoor settings, it can be spot cleaned. Available in various color/pattern options.. Measures 44 x 21 x 4.50 inches (LxWxH). Allow up to 72 hours for the cushion to fully expand.",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture.</p><p>Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors.</p><p>It is overstuffed for added comfort and long-lasting use, with filling made of 100% outdoor polyester fabric.</p><p>Suitable for both indoor and outdoor settings, it can be spot cleaned. Available in various color/pattern options.</p><p>Measures 44 x 21 x 4.50 inches (LxWxH). Allow up to 72 hours for the cushion to fully expand.</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C6H5XZMZ/1.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C6H5XZMZ/2.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C6H5XZMZ/3.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C6H5XZMZ/4.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C6H5XZMZ/5.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C6H5XZMZ/6.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C6H5XZMZ",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C6H5XZMZ"
  },
  {
    "id": "makimoo-B0C8J237V3",
    "asin": "B0C8J237V3",
    "title": "Makimoo Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Blue)",
    "handle": "travel-neck-pillow-top-memory-foam-pillow-for-head-support-i-b0c8j237v3",
    "description": "【DUAL COMFORT IN ONE PILLOW WITH TWO MATERIALS】Experience the versatility of having two pillows in one with our Travel Plane Neck Pillow. It features super soft, cozy silver fox plush on one side and cooling, relaxing ice silk on the other. This adaptable pillow meets all your comfort needs during travel.. 【5 SNAP BUTTONS FOR CUSTOMIZABLE NECK, HEAD, AND CHIN SUPPORT】This pillow provides FULL SUPPORT for your neck, head, and chin. The 5 adjustable snap buttons allow for a customizable fit, making it suitable for people with neck sizes from 8 inches to 18 inches.. 【LIGHTWEIGHT AND COMPACT WITH A CONVENIENT SNAP-ON LOOP】The 100% Pure Memory Foam Neck Pillow can be easily compressed into a compact bag, saving space in your carry-on. The sturdy snap-on loop lets you attach the pillow to backpacks, luggage, or nearly any item you carry.. 【REMOVABLE AND MACHINE-WASHABLE PILLOW COVER】Hygiene and comfort go hand-in-hand. Our pillow comes with a detachable cover that can be easily removed and machine washed after every trip.. 【PURCHASE WITH CONFIDENCE, GUARANTEED】We stand by our products with a 100% satisfaction guarantee. If you're not pleased with our neck pillows or our service for any reason, please let us know. We'll either refund your money or send you a new plane neck pillow.",
    "descriptionHtml": "<p>【DUAL COMFORT IN ONE PILLOW WITH TWO MATERIALS】Experience the versatility of having two pillows in one with our Travel Plane Neck Pillow. It features super soft, cozy silver fox plush on one side and cooling, relaxing ice silk on the other. This adaptable pillow meets all your comfort needs during travel.</p><p>【5 SNAP BUTTONS FOR CUSTOMIZABLE NECK, HEAD, AND CHIN SUPPORT】This pillow provides FULL SUPPORT for your neck, head, and chin. The 5 adjustable snap buttons allow for a customizable fit, making it suitable for people with neck sizes from 8 inches to 18 inches.</p><p>【LIGHTWEIGHT AND COMPACT WITH A CONVENIENT SNAP-ON LOOP】The 100% Pure Memory Foam Neck Pillow can be easily compressed into a compact bag, saving space in your carry-on. The sturdy snap-on loop lets you attach the pillow to backpacks, luggage, or nearly any item you carry.</p><p>【REMOVABLE AND MACHINE-WASHABLE PILLOW COVER】Hygiene and comfort go hand-in-hand. Our pillow comes with a detachable cover that can be easily removed and machine washed after every trip.</p><p>【PURCHASE WITH CONFIDENCE, GUARANTEED】We stand by our products with a 100% satisfaction guarantee. If you're not pleased with our neck pillows or our service for any reason, please let us know. We'll either refund your money or send you a new plane neck pillow.</p>",
    "productType": "Travel",
    "tags": [
      "Travel"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C8J237V3/1.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J237V3/2.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J237V3/3.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J237V3/4.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J237V3/5.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J237V3/6.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Blue)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C8J237V3",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C8J237V3"
  },
  {
    "id": "makimoo-B0C8J292WF",
    "asin": "B0C8J292WF",
    "title": "Makimoo Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Pink)",
    "handle": "travel-neck-pillow-top-memory-foam-pillow-for-head-support-i-b0c8j292wf",
    "description": "【DUAL COMFORT IN ONE PILLOW WITH TWO MATERIALS】Experience the versatility of having two pillows in one with our Travel Plane Neck Pillow. It features super soft, cozy silver fox plush on one side and cooling, relaxing ice silk on the other. This adaptable pillow meets all your comfort needs during travel.. 【5 SNAP BUTTONS FOR CUSTOMIZABLE NECK, HEAD, AND CHIN SUPPORT】This pillow provides FULL SUPPORT for your neck, head, and chin. The 5 adjustable snap buttons allow for a customizable fit, making it suitable for people with neck sizes from 8 inches to 18 inches.. 【LIGHTWEIGHT AND COMPACT WITH A CONVENIENT SNAP-ON LOOP】The 100% Pure Memory Foam Neck Pillow can be easily compressed into a compact bag, saving space in your carry-on. The sturdy snap-on loop lets you attach the pillow to backpacks, luggage, or nearly any item you carry.. 【REMOVABLE AND MACHINE-WASHABLE PILLOW COVER】Hygiene and comfort go hand-in-hand. Our pillow comes with a detachable cover that can be easily removed and machine washed after every trip.. 【PURCHASE WITH CONFIDENCE, GUARANTEED】We stand by our products with a 100% satisfaction guarantee. If you're not pleased with our neck pillows or our service for any reason, please let us know. We'll either refund your money or send you a new plane neck pillow.",
    "descriptionHtml": "<p>【DUAL COMFORT IN ONE PILLOW WITH TWO MATERIALS】Experience the versatility of having two pillows in one with our Travel Plane Neck Pillow. It features super soft, cozy silver fox plush on one side and cooling, relaxing ice silk on the other. This adaptable pillow meets all your comfort needs during travel.</p><p>【5 SNAP BUTTONS FOR CUSTOMIZABLE NECK, HEAD, AND CHIN SUPPORT】This pillow provides FULL SUPPORT for your neck, head, and chin. The 5 adjustable snap buttons allow for a customizable fit, making it suitable for people with neck sizes from 8 inches to 18 inches.</p><p>【LIGHTWEIGHT AND COMPACT WITH A CONVENIENT SNAP-ON LOOP】The 100% Pure Memory Foam Neck Pillow can be easily compressed into a compact bag, saving space in your carry-on. The sturdy snap-on loop lets you attach the pillow to backpacks, luggage, or nearly any item you carry.</p><p>【REMOVABLE AND MACHINE-WASHABLE PILLOW COVER】Hygiene and comfort go hand-in-hand. Our pillow comes with a detachable cover that can be easily removed and machine washed after every trip.</p><p>【PURCHASE WITH CONFIDENCE, GUARANTEED】We stand by our products with a 100% satisfaction guarantee. If you're not pleased with our neck pillows or our service for any reason, please let us know. We'll either refund your money or send you a new plane neck pillow.</p>",
    "productType": "Travel",
    "tags": [
      "Travel"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0C8J292WF/1.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J292WF/2.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J292WF/3.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J292WF/4.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J292WF/5.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J292WF/6.webp",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Pink)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0C8J292WF",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0C8J292WF"
  },
  {
    "id": "makimoo-B0CBT7B1TY",
    "asin": "B0CBT7B1TY",
    "title": "Makimoo Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue)",
    "handle": "outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cbt7b1ty",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. Durable, easy to care: Strength and durability and built into every inch. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure：Back 20\"×17\", Seat 17\"×17\" ; Allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>Durable, easy to care: Strength and durability and built into every inch</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure：Back 20\"×17\", Seat 17\"×17\" ; Allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Cushions",
    "tags": [
      "Cushions"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CBT7B1TY/1.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7B1TY/3.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7B1TY/4.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7B1TY/5.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7B1TY/6.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CBT7B1TY",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CBT7B1TY"
  },
  {
    "id": "makimoo-B0CBT7R7NN",
    "asin": "B0CBT7R7NN",
    "title": "Makimoo Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Grey)",
    "handle": "outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cbt7r7nn",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. Durable, easy to care: Strength and durability and built into every inch. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure：Back 20\"×17\", Seat 17\"×17\" ; Allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>Durable, easy to care: Strength and durability and built into every inch</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure：Back 20\"×17\", Seat 17\"×17\" ; Allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Cushions",
    "tags": [
      "Cushions"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CBT7R7NN/1.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7R7NN/3.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7R7NN/4.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7R7NN/5.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7R7NN/6.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7R7NN/nano-banana-pro-1776232286608.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Grey)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CBT7R7NN",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CBT7R7NN"
  },
  {
    "id": "makimoo-B0CBT7RFK2",
    "asin": "B0CBT7RFK2",
    "title": "Makimoo Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Brown)",
    "handle": "outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cbt7rfk2",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. Durable, easy to care: Strength and durability and built into every inch. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure：Back 20\"×17\", Seat 17\"×17\" ; Allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>Durable, easy to care: Strength and durability and built into every inch</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure：Back 20\"×17\", Seat 17\"×17\" ; Allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Cushions",
    "tags": [
      "Cushions"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CBT7RFK2/1.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7RFK2/3.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7RFK2/4.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7RFK2/5.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7RFK2/6.webp",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Brown)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CBT7RFK2",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CBT7RFK2"
  },
  {
    "id": "makimoo-B0CC5RGRPS",
    "asin": "B0CC5RGRPS",
    "title": "Makimoo Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Blue Monet Garden)",
    "handle": "set-of-2-outdoor-dining-chair-cushions-patio-seating-cushion-b0cc5rgrps",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Specially treated fabric: water repellent, oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 38 x18x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Specially treated fabric: water repellent, oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 38 x18x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CC5RGRPS/1.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Blue Monet Garden)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5RGRPS/2.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Blue Monet Garden)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5RGRPS/3.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Blue Monet Garden)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5RGRPS/4.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Blue Monet Garden)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5RGRPS/5.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Blue Monet Garden)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5RGRPS/6.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Blue Monet Garden)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CC5RGRPS",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CC5RGRPS"
  },
  {
    "id": "makimoo-B0CC5TLWFS",
    "asin": "B0CC5TLWFS",
    "title": "Makimoo Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Red-Green Geometry)",
    "handle": "set-of-2-outdoor-dining-chair-cushions-patio-seating-cushion-b0cc5tlwfs",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Specially treated fabric: water repellent, oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 38 x18x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Specially treated fabric: water repellent, oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 38 x18x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CC5TLWFS/1.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Red-Green Geometry)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5TLWFS/2.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Red-Green Geometry)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5TLWFS/3.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Red-Green Geometry)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5TLWFS/4.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Red-Green Geometry)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5TLWFS/5.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Red-Green Geometry)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CC5TLWFS",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CC5TLWFS"
  },
  {
    "id": "makimoo-B0CC5VNQY3",
    "asin": "B0CC5VNQY3",
    "title": "Makimoo Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Tulip)",
    "handle": "set-of-2-outdoor-dining-chair-cushions-patio-seating-cushion-b0cc5vnqy3",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Specially treated fabric: water repellent, oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 38 x18x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Specially treated fabric: water repellent, oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 38 x18x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CC5VNQY3/1.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Tulip)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5VNQY3/2.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Tulip)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5VNQY3/3.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Tulip)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5VNQY3/4.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Tulip)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5VNQY3/5.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Tulip)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CC5VNQY3",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CC5VNQY3"
  },
  {
    "id": "makimoo-B0CC5WN6JJ",
    "asin": "B0CC5WN6JJ",
    "title": "Makimoo Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
    "handle": "set-of-2-outdoor-dining-chair-cushions-patio-seating-cushion-b0cc5wn6jj",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Specially treated fabric: water repellent, oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 38 x18x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Specially treated fabric: water repellent, oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 38 x18x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CC5WN6JJ/1.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/2.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/3.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/4.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/5.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-1885-Warm cozy indoor-outdoor lifestyle shot,....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-2189-Photorealistic lifestyle product shot, 2....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-2441-Commercial product photography, set of 2....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-3493-Commercial product photography, set of 2....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-3503-Lifestyle product photography, set of 2 ....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-4145-Photorealistic lifestyle product shot, 2....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-4164-High-end cinematic product photography, ....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-4400-Warm cozy indoor-outdoor lifestyle shot,....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-4890-Warm cozy indoor-outdoor lifestyle shot,....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-4937-Elegant French country garden lifestyle ....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-6232-Lifestyle product photography, set of 2 ....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-6375-Elegant French country garden lifestyle ....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-6523-Photorealistic lifestyle product shot, 2....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-6656-High-end cinematic product photography, ....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-7306-Commercial product photography, set of 2....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-7338-Elegant French country garden lifestyle ....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-7479-Warm cozy indoor-outdoor lifestyle shot,....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-7751-Lifestyle product photography, set of 2 ....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-8666-Elegant French country garden lifestyle ....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-8747-High-end cinematic product photography, ....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-8817-High-end cinematic product photography, ....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-9053-Lifestyle product photography, set of 2 ....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-9485-Commercial product photography, set of 2....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-9713-Photorealistic lifestyle product shot, 2....webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CC5WN6JJ",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CC5WN6JJ"
  },
  {
    "id": "makimoo-B0CC5Y77DC",
    "asin": "B0CC5Y77DC",
    "title": "Makimoo Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Butterfly)",
    "handle": "set-of-2-outdoor-dining-chair-cushions-patio-seating-cushion-b0cc5y77dc",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Specially treated fabric: water repellent, oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 38 x18x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Specially treated fabric: water repellent, oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 38 x18x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CC5Y77DC/1.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Butterfly)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5Y77DC/2.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Butterfly)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5Y77DC/3.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Butterfly)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5Y77DC/5.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Butterfly)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CC5Y77DC",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CC5Y77DC"
  },
  {
    "id": "makimoo-B0CJ8TJL56",
    "asin": "B0CJ8TJL56",
    "title": "Makimoo 2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Houndstooth)",
    "handle": "2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0cj8tjl56",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. High quality fabric: Soft, smooth and washable. Provide extra comfort and longevity; filling material uses 100% polyester. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>High quality fabric: Soft, smooth and washable</p><p>Provide extra comfort and longevity; filling material uses 100% polyester</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CJ8TJL56/1.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJ8TJL56/2.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJ8TJL56/3.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJ8TJL56/4.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Houndstooth)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CJ8TJL56",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CJ8TJL56"
  },
  {
    "id": "makimoo-B0CJHSLCZ5",
    "asin": "B0CJHSLCZ5",
    "title": "Makimoo 2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Red Houndstooth)",
    "handle": "2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0cjhslcz5",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. High quality fabric: Soft, smooth and washable. Provide extra comfort and longevity; filling material uses 100% polyester. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>High quality fabric: Soft, smooth and washable</p><p>Provide extra comfort and longevity; filling material uses 100% polyester</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CJHSLCZ5/1.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Red Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJHSLCZ5/2.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Red Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJHSLCZ5/3.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Red Houndstooth)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CJHSLCZ5",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CJHSLCZ5"
  },
  {
    "id": "makimoo-B0CJHX7XKL",
    "asin": "B0CJHX7XKL",
    "title": "Makimoo 2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Houndstooth)",
    "handle": "2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-with-tie-b0cjhx7xkl",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. High quality fabric: Soft, smooth and washable. Provide extra comfort and longevity; filling material uses 100% polyester. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>High quality fabric: Soft, smooth and washable</p><p>Provide extra comfort and longevity; filling material uses 100% polyester</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 17 x17 ( (LxW); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CJHX7XKL/1.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJHX7XKL/2.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJHX7XKL/3.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJHX7XKL/4.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Houndstooth)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CJHX7XKL",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CJHX7XKL"
  },
  {
    "id": "makimoo-B0CQBZM49V",
    "asin": "B0CQBZM49V",
    "title": "Makimoo Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
    "handle": "throw-pillow-inserts-30-x-50cm-12-x-20-cushion-inserts-hollo-b0cqbzm49v",
    "description": "PACKAGE CONTENTS: You will receive a package containing two 12x20-inch Throw Pillow inserts .. GREAT QUALITY: Our Throw Pillow inserts are made of soft and comfortable fabric with hollowfibre filling.. VERSATILE USAGE：Our Throw Pillow inserts are suitable for a variety of settings, including sofas, beds, couches, cars, chairs, and bay windows.. EASY WASHING: Hand wash the cover or using a gentle cycle for machine washing, followed by low tumble dry. Please avoid ironing the cover.. CARE INSTRUCTIONS: Take out the Throw Pillow inserts gently from the package, do not pull forcefully. Pad the inserts repeatly until they bounce back to original form before use.",
    "descriptionHtml": "<p>PACKAGE CONTENTS: You will receive a package containing two 12x20-inch Throw Pillow inserts .</p><p>GREAT QUALITY: Our Throw Pillow inserts are made of soft and comfortable fabric with hollowfibre filling.</p><p>VERSATILE USAGE：Our Throw Pillow inserts are suitable for a variety of settings, including sofas, beds, couches, cars, chairs, and bay windows.</p><p>EASY WASHING: Hand wash the cover or using a gentle cycle for machine washing, followed by low tumble dry. Please avoid ironing the cover.</p><p>CARE INSTRUCTIONS: Take out the Throw Pillow inserts gently from the package, do not pull forcefully. Pad the inserts repeatly until they bounce back to original form before use.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CQBZM49V/studio-main.webp",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/B0CQBZM49V/scene.webp",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/B0CQBZM49V/studio-side.webp",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/B0CQBZM49V/studio-filling.webp",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CQBZM49V",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CQBZM49V"
  },
  {
    "id": "makimoo-B0CQC5QJFJ",
    "asin": "B0CQC5QJFJ",
    "title": "Makimoo Throw Pillow Inserts 40cm x 40cm (16\" x 16\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
    "handle": "throw-pillow-inserts-40cm-x-40cm-16-x-16-cushion-inserts-hol-b0cqc5qjfj",
    "description": "PACKAGE CONTENTS: You will recPIeive a package containing two 16x16-inch Throw Pillow inserts .. GREAT QUALITY: Our Throw Pillow inserts are made of soft and comfortable fabric with hollowfibre filling.. VERSATILE USAGE：Our Throw Pillow inserts are suitable for a variety of settings, including sofas, beds, couches, cars, chairs, and bay windows.. EASY WASHING: Hand wash the cover or using a gentle cycle for machine washing, followed by low tumble dry. Please avoid ironing the cover.. CARE INSTRUCTIONS: Take out the Throw Pillow inserts gently from the package, do not pull forcefully. Pad the inserts repeatly until they bounce back to original form before use.",
    "descriptionHtml": "<p>PACKAGE CONTENTS: You will recPIeive a package containing two 16x16-inch Throw Pillow inserts .</p><p>GREAT QUALITY: Our Throw Pillow inserts are made of soft and comfortable fabric with hollowfibre filling.</p><p>VERSATILE USAGE：Our Throw Pillow inserts are suitable for a variety of settings, including sofas, beds, couches, cars, chairs, and bay windows.</p><p>EASY WASHING: Hand wash the cover or using a gentle cycle for machine washing, followed by low tumble dry. Please avoid ironing the cover.</p><p>CARE INSTRUCTIONS: Take out the Throw Pillow inserts gently from the package, do not pull forcefully. Pad the inserts repeatly until they bounce back to original form before use.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CQC5QJFJ/1.webp",
        "altText": "Throw Pillow Inserts 40cm x 40cm (16\" x 16\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC5QJFJ/2.webp",
        "altText": "Throw Pillow Inserts 40cm x 40cm (16\" x 16\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC5QJFJ/3.webp",
        "altText": "Throw Pillow Inserts 40cm x 40cm (16\" x 16\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC5QJFJ/4.webp",
        "altText": "Throw Pillow Inserts 40cm x 40cm (16\" x 16\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC5QJFJ/5.webp",
        "altText": "Throw Pillow Inserts 40cm x 40cm (16\" x 16\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC5QJFJ/6.webp",
        "altText": "Throw Pillow Inserts 40cm x 40cm (16\" x 16\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CQC5QJFJ",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CQC5QJFJ"
  },
  {
    "id": "makimoo-B0BY8LY757",
    "asin": "B0BY8LY757",
    "title": "Makimoo Hanging Pagan Cauldron Oil Burner, Black Wax Warmer Aroma Diffuser, with Handle, for Essential Fragrance Wax Melts, Enchanting Witches' Home Decor Element.",
    "handle": "hanging-pagan-cauldron-oil-burner-black-wax-warmer-aroma-dif-b0by8ly757",
    "description": "【Practical and Efficient Design】: The Halloween Cauldron Oil Diffuser is ideal for burning fragrance oil and aroma wax tarts, ensuring longer burn times and enhancing the ambience of your room.. 【High-quality Materials】: The Cauldron Wax Melt Burner, crafted from top-notch ceramic materials with a sleek matte finish, boasts a unique cauldron pot design and is straightforward to use.. 【Stylish Room Decor】: The Hanging Cauldron Wax Burner, with its ample capacity and well-designed opening, adds an elegant and appealing touch, perfect for enhancing your living space.. 【Excellent Gift Choice】: The Witch Cauldron Wax Warmer is a superb gift option for occasions like weddings, housewarmings, birthdays, Mother's Day, Halloween, and more.. 【Versatile Use】: The Witch Cauldron Oil Burner is designed to diffuse a refreshing aroma throughout your space. It's perfect for storing essential oils and can be heated using a standard tea light.",
    "descriptionHtml": "<p>【Practical and Efficient Design】: The Halloween Cauldron Oil Diffuser is ideal for burning fragrance oil and aroma wax tarts, ensuring longer burn times and enhancing the ambience of your room.</p><p>【High-quality Materials】: The Cauldron Wax Melt Burner, crafted from top-notch ceramic materials with a sleek matte finish, boasts a unique cauldron pot design and is straightforward to use.</p><p>【Stylish Room Decor】: The Hanging Cauldron Wax Burner, with its ample capacity and well-designed opening, adds an elegant and appealing touch, perfect for enhancing your living space.</p><p>【Excellent Gift Choice】: The Witch Cauldron Wax Warmer is a superb gift option for occasions like weddings, housewarmings, birthdays, Mother's Day, Halloween, and more.</p><p>【Versatile Use】: The Witch Cauldron Oil Burner is designed to diffuse a refreshing aroma throughout your space. It's perfect for storing essential oils and can be heated using a standard tea light.</p>",
    "productType": "Home Fragrance",
    "tags": [
      "Home Fragrance"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0BY8LY757/1.webp",
        "altText": "Hanging Pagan Cauldron Oil Burner, Black Wax Warmer Aroma Diffuser, with Handle, for Essential Fragrance Wax Melts, Enchanting Witches' Home Decor Element.",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BY8LY757/2.webp",
        "altText": "Hanging Pagan Cauldron Oil Burner, Black Wax Warmer Aroma Diffuser, with Handle, for Essential Fragrance Wax Melts, Enchanting Witches' Home Decor Element.",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BY8LY757/3.webp",
        "altText": "Hanging Pagan Cauldron Oil Burner, Black Wax Warmer Aroma Diffuser, with Handle, for Essential Fragrance Wax Melts, Enchanting Witches' Home Decor Element.",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BY8LY757/4.webp",
        "altText": "Hanging Pagan Cauldron Oil Burner, Black Wax Warmer Aroma Diffuser, with Handle, for Essential Fragrance Wax Melts, Enchanting Witches' Home Decor Element.",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BY8LY757/5.webp",
        "altText": "Hanging Pagan Cauldron Oil Burner, Black Wax Warmer Aroma Diffuser, with Handle, for Essential Fragrance Wax Melts, Enchanting Witches' Home Decor Element.",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0BY8LY757",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0BY8LY757"
  },
  {
    "id": "makimoo-B0CXDZF2WQ",
    "asin": "B0CXDZF2WQ",
    "title": "Makimoo Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
    "handle": "set-of-4-outdoor-dining-chair-cushions-comfort-patio-seating-b0cxdzf2wq",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching. Specially treated fabric: water repellent, oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching</p><p>Specially treated fabric: water repellent, oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CXDZF2WQ/1.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/2.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/3.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/4.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/5.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/6.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/7.webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-1464-Commercial lifestyle product photography....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-3315-Editorial lifestyle product image, set o....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-3427-Warm homely lifestyle photograph, 2 oran....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-3473-Editorial lifestyle product image, set o....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-3850-Commercial lifestyle product photography....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-4818-Editorial lifestyle product image, set o....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-5057-Warm homely lifestyle photograph, 2 oran....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-5645-Editorial lifestyle product image, set o....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-7671-Commercial lifestyle product photography....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-8340-Warm homely lifestyle photograph, 2 oran....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-8424-Warm homely lifestyle photograph, 2 oran....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-9090-Commercial lifestyle product photography....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-1025-Aesthetic lifestyle commercial photograp....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-4529-Lifestyle product photography, set of 4 ....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-5075-Commercial product photography, set of 4....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-5319-Commercial product photography, set of 4....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-5926-Aesthetic lifestyle commercial photograp....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-6913-Lifestyle product photography, set of 4 ....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-6914-Commercial product photography, set of 4....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-7817-Lifestyle product photography, set of 4 ....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-8460-Commercial product photography, set of 4....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-8564-Lifestyle product photography, set of 4 ....webp",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0CXDZF2WQ",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CXDZF2WQ"
  },
  {
    "id": "makimoo-B0D5DNWX8J",
    "asin": "B0D5DNWX8J",
    "title": "Makimoo Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
    "handle": "set-of-2-outdoor-dining-chair-cushions-comfort-patio-seating-b0d5dnwx8j",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x21x4.5 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x21x4.5 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0D5DNWX8J/1.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D5DNWX8J/2.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D5DNWX8J/3.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D5DNWX8J/4.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D5DNWX8J/5.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D5DNWX8J/6.webp",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0D5DNWX8J",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0D5DNWX8J"
  },
  {
    "id": "makimoo-B0D9LH1Y55",
    "asin": "B0D9LH1Y55",
    "title": "Makimoo Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
    "handle": "original-greek-pepper-mill-european-style-salt-and-pepper-gr-b0d9lh1y55",
    "description": "European Artisanal Design: Inspired by the coffee mills used by Greek soldiers in the early 20th century, this pepper mill boasts a stable flanged base and a robust all-metal body. It serves as both a functional and aesthetically pleasing addition to your collection of seasoning and spice tools.. Elevated Flavor and Aroma: The pepper mill grinder is designed to meticulously break down each peppercorn, unlocking their fullest flavor and aroma potential. You can customize your preferred texture, whether coarse or fine, thanks to the adjustable steel grinding mechanism.. Specifications: Crafted by hand, this salt grinder stands at a height of 9 inches, with a maximum base width of 2.25 inches.. Simple Assembly: Assembling your new peppercorn grinder is a straightforward process. Begin by unscrewing the nut located at the top of the mill to remove the lid. Next, extract the handle, reattach the lid, position the handle on top, and securely fasten the nut.. Hand Made: This high-quality piece is handmade and crafted with precision. It is an authentic embodiment of European style that will enhance the aesthetic of your kitchen.",
    "descriptionHtml": "<p>European Artisanal Design: Inspired by the coffee mills used by Greek soldiers in the early 20th century, this pepper mill boasts a stable flanged base and a robust all-metal body. It serves as both a functional and aesthetically pleasing addition to your collection of seasoning and spice tools.</p><p>Elevated Flavor and Aroma: The pepper mill grinder is designed to meticulously break down each peppercorn, unlocking their fullest flavor and aroma potential. You can customize your preferred texture, whether coarse or fine, thanks to the adjustable steel grinding mechanism.</p><p>Specifications: Crafted by hand, this salt grinder stands at a height of 9 inches, with a maximum base width of 2.25 inches.</p><p>Simple Assembly: Assembling your new peppercorn grinder is a straightforward process. Begin by unscrewing the nut located at the top of the mill to remove the lid. Next, extract the handle, reattach the lid, position the handle on top, and securely fasten the nut.</p><p>Hand Made: This high-quality piece is handmade and crafted with precision. It is an authentic embodiment of European style that will enhance the aesthetic of your kitchen.</p>",
    "productType": "Others",
    "tags": [
      "Others"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0D9LH1Y55/1.webp",
        "altText": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D9LH1Y55/2.webp",
        "altText": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D9LH1Y55/3.webp",
        "altText": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D9LH1Y55/4.webp",
        "altText": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D9LH1Y55/5.webp",
        "altText": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D9LH1Y55/6.webp",
        "altText": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D9LH1Y55/7.webp",
        "altText": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0D9LH1Y55",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0D9LH1Y55"
  },
  {
    "id": "makimoo-B0F1XFWZVY",
    "asin": "B0F1XFWZVY",
    "title": "Makimoo Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
    "handle": "set-of-2-high-back-tufted-outdoor-chair-cushion-44-x-21-inch-b0f1xfwzvy",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Specially treated fabric: Water repellent,oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x 21x4.5 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Specially treated fabric: Water repellent,oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x 21x4.5 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0F1XFWZVY/1.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/2.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/3.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/4.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/5.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/6.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/jimeng-2026-04-02-1642-Photorealistic commercial product photog....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/jimeng-2026-04-02-2138-Photorealistic lifestyle commercial phot....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/jimeng-2026-04-02-6642-Photorealistic lifestyle product photogr....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/jimeng-2026-04-02-6913-Photorealistic lifestyle commercial phot....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/jimeng-2026-04-02-9328-Photorealistic lifestyle commercial phot....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0F1XFWZVY",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0F1XFWZVY"
  },
  {
    "id": "makimoo-B0F1XMTYNC",
    "asin": "B0F1XMTYNC",
    "title": "Makimoo Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
    "handle": "set-of-2-high-back-tufted-outdoor-chair-cushion-44-x-21-inch-b0f1xmtync",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Specially treated fabric: Water repellent,oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x 21x4.5 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Specially treated fabric: Water repellent,oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x 21x4.5 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0F1XMTYNC/1.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/2.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/3.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/4.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/5.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/6.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-1883-Warm lifestyle commercial product shot, ....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-2400-Cinematic commercial product photography....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-2946-Cinematic commercial product photography....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-5495-Photorealistic commercial product photog....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-5684-Photorealistic commercial product photog....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-6399-Cinematic commercial product photography....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-7442-Photorealistic commercial product photog....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-7612-Photorealistic commercial product photog....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-8196-Cinematic commercial product photography....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-8227-Warm lifestyle commercial product shot, ....webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0F1XMTYNC",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0F1XMTYNC"
  },
  {
    "id": "makimoo-B0F1XS27XS",
    "asin": "B0F1XS27XS",
    "title": "Makimoo Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
    "handle": "set-of-2-high-back-tufted-outdoor-chair-cushion-44-x-21-inch-b0f1xs27xs",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Specially treated fabric: Water repellent,oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x 21x4.5 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Specially treated fabric: Water repellent,oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x 21x4.5 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0F1XS27XS/1.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/2.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/3.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/4.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/5.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/6.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/7.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/8.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/9.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0F1XS27XS",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0F1XS27XS"
  },
  {
    "id": "makimoo-B0F1XS7VKY",
    "asin": "B0F1XS7VKY",
    "title": "Makimoo Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Coffee Brown)",
    "handle": "set-of-2-high-back-tufted-outdoor-chair-cushion-44-x-21-inch-b0f1xs7vky",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Specially treated fabric: Water repellent,oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x 21x4.5 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Specially treated fabric: Water repellent,oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x 21x4.5 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0F1XS7VKY/1.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Coffee Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS7VKY/2.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Coffee Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS7VKY/3.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Coffee Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS7VKY/5.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Coffee Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS7VKY/6.webp",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Coffee Brown)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0F1XS7VKY",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0F1XS7VKY"
  },
  {
    "id": "makimoo-B0F1Y4J48T",
    "asin": "B0F1Y4J48T",
    "title": "Makimoo 2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Green & Brown)",
    "handle": "2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-water-re-b0f1y4j48t",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Specially treated fabric: Water repellent,oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 17 x17 Inch ( (LxW); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Specially treated fabric: Water repellent,oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 17 x17 Inch ( (LxW); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0F1Y4J48T/1.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Green & Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y4J48T/2.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Green & Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y4J48T/3.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Green & Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y4J48T/4.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Green & Brown)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0F1Y4J48T",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0F1Y4J48T"
  },
  {
    "id": "makimoo-B0F1Y91HPR",
    "asin": "B0F1Y91HPR",
    "title": "Makimoo 2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Dark Green)",
    "handle": "2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-water-re-b0f1y91hpr",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas for garden/patio furniture. Specially treated fabric: Water repellent,oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 18.5 Inch in diameters; allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas for garden/patio furniture</p><p>Specially treated fabric: Water repellent,oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 18.5 Inch in diameters; allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0F1Y91HPR/1.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y91HPR/2.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y91HPR/3.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y91HPR/4.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y91HPR/jimeng-2026-04-02-1125-Warm photorealistic lifestyle product ph....webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y91HPR/jimeng-2026-04-02-5812-Photorealistic commercial lifestyle prod....webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Dark Green)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0F1Y91HPR",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0F1Y91HPR"
  },
  {
    "id": "makimoo-B0F62XRB55",
    "asin": "B0F62XRB55",
    "title": "Makimoo Throw Pillow Inserts 35 x 35cm (14\" x 14\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
    "handle": "throw-pillow-inserts-35-x-35cm-14-x-14-cushion-inserts-hollo-b0f62xrb55",
    "description": "PACKAGE CONTENTS: You will recPIeive a package containing two 14x14 Inch Throw Pillow inserts .. GREAT QUALITY: Our Throw Pillow inserts are made of soft and comfortable fabric with hollowfibre filling.. VERSATILE USAGE：Our Throw Pillow inserts are suitable for a variety of settings, including sofas, beds, couches, cars, chairs, and bay windows.. EASY WASHING: Hand wash the cover or using a gentle cycle for machine washing, followed by low tumble dry. Please avoid ironing the cover.. CARE INSTRUCTIONS: Take out the Throw Pillow inserts gently from the package, do not pull forcefully. Pad the inserts repeatly until they bounce back to original form before use.",
    "descriptionHtml": "<p>PACKAGE CONTENTS: You will recPIeive a package containing two 14x14 Inch Throw Pillow inserts .</p><p>GREAT QUALITY: Our Throw Pillow inserts are made of soft and comfortable fabric with hollowfibre filling.</p><p>VERSATILE USAGE：Our Throw Pillow inserts are suitable for a variety of settings, including sofas, beds, couches, cars, chairs, and bay windows.</p><p>EASY WASHING: Hand wash the cover or using a gentle cycle for machine washing, followed by low tumble dry. Please avoid ironing the cover.</p><p>CARE INSTRUCTIONS: Take out the Throw Pillow inserts gently from the package, do not pull forcefully. Pad the inserts repeatly until they bounce back to original form before use.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0F62XRB55/studio-main.webp",
        "altText": "Throw Pillow Inserts 35 x 35cm (14\" x 14\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/B0F62XRB55/scene.webp",
        "altText": "Throw Pillow Inserts 35 x 35cm (14\" x 14\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/B0F62XRB55/studio-side.webp",
        "altText": "Throw Pillow Inserts 35 x 35cm (14\" x 14\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/B0F62XRB55/studio-filling.webp",
        "altText": "Throw Pillow Inserts 35 x 35cm (14\" x 14\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0F62XRB55",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0F62XRB55"
  },
  {
    "id": "makimoo-B0FNQRRV78",
    "asin": "B0FNQRRV78",
    "title": "Makimoo 2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
    "handle": "2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-water-re-b0fnqrrv78",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Specially treated fabric: Water repellent,oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 17 x17 Inch ( (LxW); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Specially treated fabric: Water repellent,oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 17 x17 Inch ( (LxW); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0FNQRRV78/1.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/2.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/3.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/4.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/5.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/6.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/7.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/8.webp",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0FNQRRV78",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0FNQRRV78"
  },
  {
    "id": "makimoo-B0G6M3F7CY",
    "asin": "B0G6M3F7CY",
    "title": "Makimoo Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (12x20 Inch)",
    "handle": "throw-pillow-inserts-pack-of-2-cushion-inserts-hollowfibre-f-b0g6m3f7cy",
    "description": "PACKAGE CONTENTS: You will receive a package containing two 12x20 Inch Throw Pillow inserts .. GREAT QUALITY: Our Throw Pillow inserts are made of soft and comfortable fabric with hollowfibre filling.. VERSATILE USAGE：Our Throw Pillow inserts are suitable for a variety of settings, including sofas, beds, couches, cars, chairs, and bay windows.. CARE INSTRUCTIONS: Take out the Throw Pillow inserts gently from the package, do not pull forcefully. Pad the inserts repeatly until they bounce back to original form before use. Report an issue with this product",
    "descriptionHtml": "<p>PACKAGE CONTENTS: You will receive a package containing two 12x20 Inch Throw Pillow inserts .</p><p>GREAT QUALITY: Our Throw Pillow inserts are made of soft and comfortable fabric with hollowfibre filling.</p><p>VERSATILE USAGE：Our Throw Pillow inserts are suitable for a variety of settings, including sofas, beds, couches, cars, chairs, and bay windows.</p><p>CARE INSTRUCTIONS: Take out the Throw Pillow inserts gently from the package, do not pull forcefully. Pad the inserts repeatly until they bounce back to original form before use. Report an issue with this product</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0G6M3F7CY/jimeng-2026-03-18-9847-【跨境爆款首选·热带风户外庭院场景】 Commercial e-commerce....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (12x20 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6M3F7CY/jimeng-2026-03-18-9988-【跨境爆款首选·热带风户外庭院场景】 Commercial e-commerce....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (12x20 Inch)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0G6M3F7CY",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0G6M3F7CY"
  },
  {
    "id": "makimoo-B0G6MPTVFD",
    "asin": "B0G6MPTVFD",
    "title": "Makimoo Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
    "handle": "throw-pillow-inserts-pack-of-2-cushion-inserts-hollowfibre-f-b0g6mptvfd",
    "description": "PACKAGE CONTENTS: You will receive a package containing two 18x18 Inch Throw Pillow inserts .. GREAT QUALITY: Our Throw Pillow inserts are made of soft and comfortable fabric with hollowfibre filling.. VERSATILE USAGE：Our Throw Pillow inserts are suitable for a variety of settings, including sofas, beds, couches, cars, chairs, and bay windows.. CARE INSTRUCTIONS: Take out the Throw Pillow inserts gently from the package, do not pull forcefully. Pad the inserts repeatly until they bounce back to original form before use. Report an issue with this product",
    "descriptionHtml": "<p>PACKAGE CONTENTS: You will receive a package containing two 18x18 Inch Throw Pillow inserts .</p><p>GREAT QUALITY: Our Throw Pillow inserts are made of soft and comfortable fabric with hollowfibre filling.</p><p>VERSATILE USAGE：Our Throw Pillow inserts are suitable for a variety of settings, including sofas, beds, couches, cars, chairs, and bay windows.</p><p>CARE INSTRUCTIONS: Take out the Throw Pillow inserts gently from the package, do not pull forcefully. Pad the inserts repeatly until they bounce back to original form before use. Report an issue with this product</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0G6MPTVFD/1.webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/2.webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/4.webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-2037-Warm home aesthetic photography, main su....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-3365-Warm home aesthetic photography, main su....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-3997-提示词 3：【高级感种草・侘寂风书房场景 _ 极简高级英文描述】 Premium....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-4435-Warm home aesthetic photography, main su....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-4528-Warm home aesthetic photography, main su....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-5831-Commercial e-commerce product photograph....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-7104-Warm home aesthetic photography, main su....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-7939-提示词 3：【高级感种草・侘寂风书房场景 _ 极简高级英文描述】 Premium....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-8695-提示词 3：【高级感种草・侘寂风书房场景 _ 极简高级英文描述】 Premium....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-18-3610-【跨境爆款首选·热带风户外庭院场景】 Commercial e-commerce....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-18-5290-【跨境爆款首选·热带风户外庭院场景】 Commercial e-commerce....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-18-7632-【氛围感种草·度假风卧室床头场景】 Premium warm lifestyle....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-1297-Commercial lifestyle photography, photor....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-2290-Commercial lifestyle photography, photor....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-2352-Lifestyle product photography, ultra-rea....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-2671-Commercial product photography, photorea....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-4302-Commercial product photography, photorea....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-4416-Lifestyle product photography, ultra-rea....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-4726-Commercial product photography, photorea....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-5158-Commercial product photography, photorea....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-5278-Commercial lifestyle photography, photor....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-5503-2 pieces of plump white rectangular diam....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-6098-Lifestyle product photography, ultra-rea....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-8741-Lifestyle product photography, ultra-rea....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-1726-Photorealistic commercial product photog....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-2240-Ultra-realistic commercial product photo....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-2489-Ultra-realistic commercial product photo....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-3081-Warm photorealistic lifestyle shot, 2 wh....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-4001-Photorealistic commercial product photog....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-4075-Photorealistic commercial product photog....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-4079-Warm photorealistic lifestyle shot, 2 wh....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-5714-Photorealistic commercial product photog....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-7029-Ultra-realistic commercial product photo....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-7148-Ultra-realistic commercial product photo....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-7785-Photorealistic commercial product photog....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-9232-Photorealistic commercial product photog....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-9330-Photorealistic commercial product photog....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-9924-Warm photorealistic lifestyle shot, 2 wh....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-1276-Hyper-realistic commercial product photo....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-4564-Photorealistic professional commercial p....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-5427-Hyper-realistic commercial product photo....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-6175-Photorealistic professional commercial p....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-6849-Hyper-realistic commercial product photo....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-9076-Photorealistic professional commercial p....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-9965-Hyper-realistic commercial product photo....webp",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "49.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-B0G6MPTVFD",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0G6MPTVFD"
  },
  {
    "id": "makimoo-MK-PC-CORD-CARAMEL",
    "asin": "MK-PC-CORD-CARAMEL",
    "title": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Caramel)",
    "handle": "corduroy-pillow-covers-caramel-40x40-mk-pc-cord-caramel",
    "description": "Set of 2 Corduroy Covers: You receive two matching 40 x 40 cm throw pillow covers in Caramel, ready to refresh your sofa, couch or bed. Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space. Muted Ins-Style Color: A low-saturation Caramel tone that layers beautifully with neutrals like cream, beige and warm brown. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Corduroy Covers: You receive two matching 40 x 40 cm throw pillow covers in Caramel, ready to refresh your sofa, couch or bed.</p><p>Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space.</p><p>Muted Ins-Style Color: A low-saturation Caramel tone that layers beautifully with neutrals like cream, beige and warm brown.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CORD-CARAMEL/1.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Caramel)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-CARAMEL/2.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Caramel)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-CARAMEL/3.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Caramel)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CORD-CARAMEL",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CORD-CARAMEL-45",
    "asin": "MK-PC-CORD-CARAMEL-45",
    "title": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Caramel)",
    "handle": "corduroy-pillow-covers-caramel-45x45-mk-pc-cord-caramel-45",
    "description": "Set of 2 Corduroy Covers: You receive two matching 45 x 45 cm throw pillow covers in Caramel, ready to refresh your sofa, couch or bed. Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space. Muted Ins-Style Color: A low-saturation Caramel tone that layers beautifully with neutrals like cream, beige and warm brown. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Corduroy Covers: You receive two matching 45 x 45 cm throw pillow covers in Caramel, ready to refresh your sofa, couch or bed.</p><p>Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space.</p><p>Muted Ins-Style Color: A low-saturation Caramel tone that layers beautifully with neutrals like cream, beige and warm brown.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CORD-CARAMEL-45/1.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Caramel)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-CARAMEL-45/2.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Caramel)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-CARAMEL-45/3.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Caramel)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CORD-CARAMEL-45",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CORD-DUSTYROSE",
    "asin": "MK-PC-CORD-DUSTYROSE",
    "title": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Dusty Rose)",
    "handle": "corduroy-pillow-covers-dustyrose-40x40-mk-pc-cord-dustyrose",
    "description": "Set of 2 Corduroy Covers: You receive two matching 40 x 40 cm throw pillow covers in Dusty Rose, ready to refresh your sofa, couch or bed. Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space. Muted Ins-Style Color: A low-saturation Dusty Rose tone that layers beautifully with neutrals like cream, beige and warm brown. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Corduroy Covers: You receive two matching 40 x 40 cm throw pillow covers in Dusty Rose, ready to refresh your sofa, couch or bed.</p><p>Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space.</p><p>Muted Ins-Style Color: A low-saturation Dusty Rose tone that layers beautifully with neutrals like cream, beige and warm brown.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CORD-DUSTYROSE/1.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Dusty Rose)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-DUSTYROSE/2.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Dusty Rose)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-DUSTYROSE/3.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Dusty Rose)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CORD-DUSTYROSE",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CORD-DUSTYROSE-45",
    "asin": "MK-PC-CORD-DUSTYROSE-45",
    "title": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Dusty Rose)",
    "handle": "corduroy-pillow-covers-dustyrose-45x45-mk-pc-cord-dustyrose-45",
    "description": "Set of 2 Corduroy Covers: You receive two matching 45 x 45 cm throw pillow covers in Dusty Rose, ready to refresh your sofa, couch or bed. Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space. Muted Ins-Style Color: A low-saturation Dusty Rose tone that layers beautifully with neutrals like cream, beige and warm brown. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Corduroy Covers: You receive two matching 45 x 45 cm throw pillow covers in Dusty Rose, ready to refresh your sofa, couch or bed.</p><p>Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space.</p><p>Muted Ins-Style Color: A low-saturation Dusty Rose tone that layers beautifully with neutrals like cream, beige and warm brown.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CORD-DUSTYROSE-45/1.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Dusty Rose)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-DUSTYROSE-45/2.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Dusty Rose)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-DUSTYROSE-45/3.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Dusty Rose)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CORD-DUSTYROSE-45",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CORD-OLIVE",
    "asin": "MK-PC-CORD-OLIVE",
    "title": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Olive)",
    "handle": "corduroy-pillow-covers-olive-40x40-mk-pc-cord-olive",
    "description": "Set of 2 Corduroy Covers: You receive two matching 40 x 40 cm throw pillow covers in Olive, ready to refresh your sofa, couch or bed. Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space. Muted Ins-Style Color: A low-saturation Olive tone that layers beautifully with neutrals like cream, beige and warm brown. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Corduroy Covers: You receive two matching 40 x 40 cm throw pillow covers in Olive, ready to refresh your sofa, couch or bed.</p><p>Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space.</p><p>Muted Ins-Style Color: A low-saturation Olive tone that layers beautifully with neutrals like cream, beige and warm brown.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CORD-OLIVE/1.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Olive)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-OLIVE/2.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Olive)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-OLIVE/3.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Olive)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CORD-OLIVE",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CORD-OLIVE-45",
    "asin": "MK-PC-CORD-OLIVE-45",
    "title": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Olive)",
    "handle": "corduroy-pillow-covers-olive-45x45-mk-pc-cord-olive-45",
    "description": "Set of 2 Corduroy Covers: You receive two matching 45 x 45 cm throw pillow covers in Olive, ready to refresh your sofa, couch or bed. Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space. Muted Ins-Style Color: A low-saturation Olive tone that layers beautifully with neutrals like cream, beige and warm brown. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Corduroy Covers: You receive two matching 45 x 45 cm throw pillow covers in Olive, ready to refresh your sofa, couch or bed.</p><p>Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space.</p><p>Muted Ins-Style Color: A low-saturation Olive tone that layers beautifully with neutrals like cream, beige and warm brown.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CORD-OLIVE-45/1.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Olive)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-OLIVE-45/2.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Olive)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-OLIVE-45/3.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Olive)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CORD-OLIVE-45",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CORD-DUSTYBLUE",
    "asin": "MK-PC-CORD-DUSTYBLUE",
    "title": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Dusty Blue)",
    "handle": "corduroy-pillow-covers-dustyblue-40x40-mk-pc-cord-dustyblue",
    "description": "Set of 2 Corduroy Covers: You receive two matching 40 x 40 cm throw pillow covers in Dusty Blue, ready to refresh your sofa, couch or bed. Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space. Muted Ins-Style Color: A low-saturation Dusty Blue tone that layers beautifully with neutrals like cream, beige and warm brown. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Corduroy Covers: You receive two matching 40 x 40 cm throw pillow covers in Dusty Blue, ready to refresh your sofa, couch or bed.</p><p>Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space.</p><p>Muted Ins-Style Color: A low-saturation Dusty Blue tone that layers beautifully with neutrals like cream, beige and warm brown.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CORD-DUSTYBLUE/1.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Dusty Blue)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-DUSTYBLUE/2.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Dusty Blue)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-DUSTYBLUE/3.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Dusty Blue)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CORD-DUSTYBLUE",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CORD-DUSTYBLUE-45",
    "asin": "MK-PC-CORD-DUSTYBLUE-45",
    "title": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Dusty Blue)",
    "handle": "corduroy-pillow-covers-dustyblue-45x45-mk-pc-cord-dustyblue-45",
    "description": "Set of 2 Corduroy Covers: You receive two matching 45 x 45 cm throw pillow covers in Dusty Blue, ready to refresh your sofa, couch or bed. Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space. Muted Ins-Style Color: A low-saturation Dusty Blue tone that layers beautifully with neutrals like cream, beige and warm brown. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Corduroy Covers: You receive two matching 45 x 45 cm throw pillow covers in Dusty Blue, ready to refresh your sofa, couch or bed.</p><p>Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space.</p><p>Muted Ins-Style Color: A low-saturation Dusty Blue tone that layers beautifully with neutrals like cream, beige and warm brown.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CORD-DUSTYBLUE-45/1.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Dusty Blue)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-DUSTYBLUE-45/2.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Dusty Blue)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-DUSTYBLUE-45/3.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Dusty Blue)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CORD-DUSTYBLUE-45",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CORD-CHARCOAL",
    "asin": "MK-PC-CORD-CHARCOAL",
    "title": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Charcoal)",
    "handle": "corduroy-pillow-covers-charcoal-40x40-mk-pc-cord-charcoal",
    "description": "Set of 2 Corduroy Covers: You receive two matching 40 x 40 cm throw pillow covers in Charcoal, ready to refresh your sofa, couch or bed. Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space. Muted Ins-Style Color: A low-saturation Charcoal tone that layers beautifully with neutrals like cream, beige and warm brown. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Corduroy Covers: You receive two matching 40 x 40 cm throw pillow covers in Charcoal, ready to refresh your sofa, couch or bed.</p><p>Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space.</p><p>Muted Ins-Style Color: A low-saturation Charcoal tone that layers beautifully with neutrals like cream, beige and warm brown.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CORD-CHARCOAL/1.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Charcoal)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-CHARCOAL/2.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Charcoal)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-CHARCOAL/3.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Charcoal)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CORD-CHARCOAL",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CORD-CHARCOAL-45",
    "asin": "MK-PC-CORD-CHARCOAL-45",
    "title": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Charcoal)",
    "handle": "corduroy-pillow-covers-charcoal-45x45-mk-pc-cord-charcoal-45",
    "description": "Set of 2 Corduroy Covers: You receive two matching 45 x 45 cm throw pillow covers in Charcoal, ready to refresh your sofa, couch or bed. Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space. Muted Ins-Style Color: A low-saturation Charcoal tone that layers beautifully with neutrals like cream, beige and warm brown. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Corduroy Covers: You receive two matching 45 x 45 cm throw pillow covers in Charcoal, ready to refresh your sofa, couch or bed.</p><p>Soft Ribbed Corduroy: The fine-wale corduroy fabric has a velvety matte texture with subtle vertical stripes, adding cozy depth to any space.</p><p>Muted Ins-Style Color: A low-saturation Charcoal tone that layers beautifully with neutrals like cream, beige and warm brown.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the durable fabric keeps its texture and color wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CORD-CHARCOAL-45/1.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Charcoal)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-CHARCOAL-45/2.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Charcoal)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CORD-CHARCOAL-45/3.webp",
        "altText": "Makimoo Corduroy Throw Pillow Covers Set of 2, Soft Ribbed Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Charcoal)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CORD-CHARCOAL-45",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CTN-SAGE",
    "asin": "MK-PC-CTN-SAGE",
    "title": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Sage)",
    "handle": "cotton-like-pillow-covers-sage-40x40-mk-pc-ctn-sage",
    "description": "Set of 2 Cotton-Like Covers: You receive two matching 40 x 40 cm throw pillow covers in Sage, ready to refresh your sofa, couch or bed. Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin. Muted Ins-Style Color: A low-saturation Sage tone that layers beautifully with neutrals like sage, cream and soft grey. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Cotton-Like Covers: You receive two matching 40 x 40 cm throw pillow covers in Sage, ready to refresh your sofa, couch or bed.</p><p>Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin.</p><p>Muted Ins-Style Color: A low-saturation Sage tone that layers beautifully with neutrals like sage, cream and soft grey.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CTN-SAGE/1.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Sage)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-SAGE/2.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Sage)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-SAGE/3.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Sage)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CTN-SAGE",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CTN-SAGE-45",
    "asin": "MK-PC-CTN-SAGE-45",
    "title": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Sage)",
    "handle": "cotton-like-pillow-covers-sage-45x45-mk-pc-ctn-sage-45",
    "description": "Set of 2 Cotton-Like Covers: You receive two matching 45 x 45 cm throw pillow covers in Sage, ready to refresh your sofa, couch or bed. Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin. Muted Ins-Style Color: A low-saturation Sage tone that layers beautifully with neutrals like sage, cream and soft grey. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Cotton-Like Covers: You receive two matching 45 x 45 cm throw pillow covers in Sage, ready to refresh your sofa, couch or bed.</p><p>Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin.</p><p>Muted Ins-Style Color: A low-saturation Sage tone that layers beautifully with neutrals like sage, cream and soft grey.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CTN-SAGE-45/1.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Sage)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-SAGE-45/2.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Sage)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-SAGE-45/3.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Sage)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CTN-SAGE-45",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CTN-CREAM",
    "asin": "MK-PC-CTN-CREAM",
    "title": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Cream)",
    "handle": "cotton-like-pillow-covers-cream-40x40-mk-pc-ctn-cream",
    "description": "Set of 2 Cotton-Like Covers: You receive two matching 40 x 40 cm throw pillow covers in Cream, ready to refresh your sofa, couch or bed. Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin. Muted Ins-Style Color: A low-saturation Cream tone that layers beautifully with neutrals like sage, cream and soft grey. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Cotton-Like Covers: You receive two matching 40 x 40 cm throw pillow covers in Cream, ready to refresh your sofa, couch or bed.</p><p>Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin.</p><p>Muted Ins-Style Color: A low-saturation Cream tone that layers beautifully with neutrals like sage, cream and soft grey.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CTN-CREAM/1.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Cream)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-CREAM/2.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Cream)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-CREAM/3.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Cream)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CTN-CREAM",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CTN-CREAM-45",
    "asin": "MK-PC-CTN-CREAM-45",
    "title": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Cream)",
    "handle": "cotton-like-pillow-covers-cream-45x45-mk-pc-ctn-cream-45",
    "description": "Set of 2 Cotton-Like Covers: You receive two matching 45 x 45 cm throw pillow covers in Cream, ready to refresh your sofa, couch or bed. Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin. Muted Ins-Style Color: A low-saturation Cream tone that layers beautifully with neutrals like sage, cream and soft grey. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Cotton-Like Covers: You receive two matching 45 x 45 cm throw pillow covers in Cream, ready to refresh your sofa, couch or bed.</p><p>Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin.</p><p>Muted Ins-Style Color: A low-saturation Cream tone that layers beautifully with neutrals like sage, cream and soft grey.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CTN-CREAM-45/1.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Cream)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-CREAM-45/2.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Cream)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-CREAM-45/3.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Cream)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CTN-CREAM-45",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CTN-BLUSH",
    "asin": "MK-PC-CTN-BLUSH",
    "title": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Blush)",
    "handle": "cotton-like-pillow-covers-blush-40x40-mk-pc-ctn-blush",
    "description": "Set of 2 Cotton-Like Covers: You receive two matching 40 x 40 cm throw pillow covers in Blush, ready to refresh your sofa, couch or bed. Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin. Muted Ins-Style Color: A low-saturation Blush tone that layers beautifully with neutrals like sage, cream and soft grey. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Cotton-Like Covers: You receive two matching 40 x 40 cm throw pillow covers in Blush, ready to refresh your sofa, couch or bed.</p><p>Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin.</p><p>Muted Ins-Style Color: A low-saturation Blush tone that layers beautifully with neutrals like sage, cream and soft grey.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CTN-BLUSH/1.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Blush)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-BLUSH/2.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Blush)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-BLUSH/3.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Blush)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CTN-BLUSH",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CTN-BLUSH-45",
    "asin": "MK-PC-CTN-BLUSH-45",
    "title": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Blush)",
    "handle": "cotton-like-pillow-covers-blush-45x45-mk-pc-ctn-blush-45",
    "description": "Set of 2 Cotton-Like Covers: You receive two matching 45 x 45 cm throw pillow covers in Blush, ready to refresh your sofa, couch or bed. Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin. Muted Ins-Style Color: A low-saturation Blush tone that layers beautifully with neutrals like sage, cream and soft grey. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Cotton-Like Covers: You receive two matching 45 x 45 cm throw pillow covers in Blush, ready to refresh your sofa, couch or bed.</p><p>Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin.</p><p>Muted Ins-Style Color: A low-saturation Blush tone that layers beautifully with neutrals like sage, cream and soft grey.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CTN-BLUSH-45/1.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Blush)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-BLUSH-45/2.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Blush)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-BLUSH-45/3.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Blush)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CTN-BLUSH-45",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CTN-DUSTYBLUE",
    "asin": "MK-PC-CTN-DUSTYBLUE",
    "title": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Dusty Blue)",
    "handle": "cotton-like-pillow-covers-dustyblue-40x40-mk-pc-ctn-dustyblue",
    "description": "Set of 2 Cotton-Like Covers: You receive two matching 40 x 40 cm throw pillow covers in Dusty Blue, ready to refresh your sofa, couch or bed. Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin. Muted Ins-Style Color: A low-saturation Dusty Blue tone that layers beautifully with neutrals like sage, cream and soft grey. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Cotton-Like Covers: You receive two matching 40 x 40 cm throw pillow covers in Dusty Blue, ready to refresh your sofa, couch or bed.</p><p>Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin.</p><p>Muted Ins-Style Color: A low-saturation Dusty Blue tone that layers beautifully with neutrals like sage, cream and soft grey.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CTN-DUSTYBLUE/1.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Dusty Blue)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-DUSTYBLUE/2.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Dusty Blue)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-DUSTYBLUE/3.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Dusty Blue)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CTN-DUSTYBLUE",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CTN-DUSTYBLUE-45",
    "asin": "MK-PC-CTN-DUSTYBLUE-45",
    "title": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Dusty Blue)",
    "handle": "cotton-like-pillow-covers-dustyblue-45x45-mk-pc-ctn-dustyblue-45",
    "description": "Set of 2 Cotton-Like Covers: You receive two matching 45 x 45 cm throw pillow covers in Dusty Blue, ready to refresh your sofa, couch or bed. Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin. Muted Ins-Style Color: A low-saturation Dusty Blue tone that layers beautifully with neutrals like sage, cream and soft grey. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Cotton-Like Covers: You receive two matching 45 x 45 cm throw pillow covers in Dusty Blue, ready to refresh your sofa, couch or bed.</p><p>Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin.</p><p>Muted Ins-Style Color: A low-saturation Dusty Blue tone that layers beautifully with neutrals like sage, cream and soft grey.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CTN-DUSTYBLUE-45/1.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Dusty Blue)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-DUSTYBLUE-45/2.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Dusty Blue)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-DUSTYBLUE-45/3.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Dusty Blue)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CTN-DUSTYBLUE-45",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CTN-LIGHTGREY",
    "asin": "MK-PC-CTN-LIGHTGREY",
    "title": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Light Grey)",
    "handle": "cotton-like-pillow-covers-lightgrey-40x40-mk-pc-ctn-lightgrey",
    "description": "Set of 2 Cotton-Like Covers: You receive two matching 40 x 40 cm throw pillow covers in Light Grey, ready to refresh your sofa, couch or bed. Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin. Muted Ins-Style Color: A low-saturation Light Grey tone that layers beautifully with neutrals like sage, cream and soft grey. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Cotton-Like Covers: You receive two matching 40 x 40 cm throw pillow covers in Light Grey, ready to refresh your sofa, couch or bed.</p><p>Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin.</p><p>Muted Ins-Style Color: A low-saturation Light Grey tone that layers beautifully with neutrals like sage, cream and soft grey.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CTN-LIGHTGREY/1.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Light Grey)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-LIGHTGREY/2.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Light Grey)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-LIGHTGREY/3.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 40 x 40 cm (Light Grey)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CTN-LIGHTGREY",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-PC-CTN-LIGHTGREY-45",
    "asin": "MK-PC-CTN-LIGHTGREY-45",
    "title": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Light Grey)",
    "handle": "cotton-like-pillow-covers-lightgrey-45x45-mk-pc-ctn-lightgrey-45",
    "description": "Set of 2 Cotton-Like Covers: You receive two matching 45 x 45 cm throw pillow covers in Light Grey, ready to refresh your sofa, couch or bed. Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin. Muted Ins-Style Color: A low-saturation Light Grey tone that layers beautifully with neutrals like sage, cream and soft grey. Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing. Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.",
    "descriptionHtml": "<p>Set of 2 Cotton-Like Covers: You receive two matching 45 x 45 cm throw pillow covers in Light Grey, ready to refresh your sofa, couch or bed.</p><p>Soft Washed Cotton-Like Fabric: A finely woven matte cotton-feel fabric with a relaxed, slightly textured finish that is gentle on skin.</p><p>Muted Ins-Style Color: A low-saturation Light Grey tone that layers beautifully with neutrals like sage, cream and soft grey.</p><p>Hidden Zipper Closure: A smooth concealed zipper keeps the look clean and makes the covers easy to remove for washing.</p><p>Easy Care: Machine washable on a gentle cycle; the breathable fabric stays soft wash after wash. Inserts not included.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-PC-CTN-LIGHTGREY-45/1.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Light Grey)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-LIGHTGREY-45/2.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Light Grey)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-PC-CTN-LIGHTGREY-45/3.webp",
        "altText": "Makimoo Cotton-Like Throw Pillow Covers Set of 2, Soft Textured Square Cushion Cases for Sofa Couch Bed, 45 x 45 cm (Light Grey)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "19.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-PC-CTN-LIGHTGREY-45",
        "title": "Default Title",
        "price": {
          "amount": "19.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-BP-INSERT-1PC",
    "asin": "MK-BP-INSERT-1PC",
    "title": "Makimoo Long Body Pillow Insert, Soft Breathable Polyester Fiber Fill Rectangular Cushion for Bed Sofa Couch, 137 x 51 cm (White)",
    "handle": "long-body-pillow-insert-54x20-mk-bp-insert-1pc",
    "description": "Full-Body Support: The extra-long 137 x 51 cm (54 x 20 in) pillow cradles your body for side sleeping, lounging, reading or pregnancy support. Soft Breathable Fill: Generously filled with plush polyester fiber that balances softness and support and fluffs back easily. Smooth Brushed Shell: A soft brushed microfiber shell in clean white that fits any body pillow cover. Versatile Comfort: Ideal for beds, daybeds and sofas — use it as a hug pillow, backrest or leg support. Easy Care: Machine washable on a gentle cycle; tumble dry low to restore loft.",
    "descriptionHtml": "<p>Full-Body Support: The extra-long 137 x 51 cm (54 x 20 in) pillow cradles your body for side sleeping, lounging, reading or pregnancy support.</p><p>Soft Breathable Fill: Generously filled with plush polyester fiber that balances softness and support and fluffs back easily.</p><p>Smooth Brushed Shell: A soft brushed microfiber shell in clean white that fits any body pillow cover.</p><p>Versatile Comfort: Ideal for beds, daybeds and sofas — use it as a hug pillow, backrest or leg support.</p><p>Easy Care: Machine washable on a gentle cycle; tumble dry low to restore loft.</p>",
    "productType": "Pillows",
    "tags": [
      "Pillows"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-BP-INSERT-1PC/1.webp",
        "altText": "Makimoo Long Body Pillow Insert, Soft Breathable Polyester Fiber Fill Rectangular Cushion for Bed Sofa Couch, 137 x 51 cm (White)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-BP-INSERT-1PC/2.webp",
        "altText": "Makimoo Long Body Pillow Insert, Soft Breathable Polyester Fiber Fill Rectangular Cushion for Bed Sofa Couch, 137 x 51 cm (White)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-BP-INSERT-1PC/3.webp",
        "altText": "Makimoo Long Body Pillow Insert, Soft Breathable Polyester Fiber Fill Rectangular Cushion for Bed Sofa Couch, 137 x 51 cm (White)",
        "width": 1200,
        "height": 1200
      },
      {
        "url": "/images/products/MK-BP-INSERT-1PC/4.webp",
        "altText": "Makimoo Long Body Pillow Insert, Soft Breathable Polyester Fiber Fill Rectangular Cushion for Bed Sofa Couch, 137 x 51 cm (White)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "35.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-BP-INSERT-1PC",
        "title": "Default Title",
        "price": {
          "amount": "35.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-CUSHION-CORD-CREAM",
    "asin": "MK-CUSHION-CORD-CREAM",
    "title": "Makimoo 2 Pack Chair Cushions With Backrest And Seat, Soft Tufted Corduroy High Back Dining Chair Pads With Ties For Indoor Outdoor Patio Garden Use, 95 x 45 cm (Cream)",
    "handle": "corduroy-chair-cushions-cream-95x45-mk-cushion-cord-cream",
    "description": "Set of 2 High-Back Corduroy Cushions: Two matching chair pads combine a tall backrest with a generously padded seat, offering consistent comfort for dining chairs, patio seating, or garden loungers. Thick, Tufted Corduroy Cover: The ribbed corduroy fabric adds subtle texture and a soft hand-feel, while the deep button tufting helps the fill stay evenly distributed across the back and seat over time. Secure Ties for a Neat Fit: Four attached fabric ties let you fasten the cushion to the chair frame at the top and sides, helping keep the pad in place. Plush Support for Back and Seat: Filled with resilient polyester padding, the cushion cradles your lower back, spine, and hips to reduce pressure during long meals or relaxing afternoons. Versatile 95 x 45cm Size: Works well with rattan, wood, and metal high-back chairs; allow up to 72 hours for the cushion to fully expand.",
    "descriptionHtml": "<p>Set of 2 High-Back Corduroy Cushions: Two matching chair pads combine a tall backrest with a generously padded seat, offering consistent comfort for dining chairs, patio seating, or garden loungers.</p><p>Thick, Tufted Corduroy Cover: The ribbed corduroy fabric adds subtle texture and a soft hand-feel, while the deep button tufting helps the fill stay evenly distributed across the back and seat over time.</p><p>Secure Ties for a Neat Fit: Four attached fabric ties let you fasten the cushion to the chair frame at the top and sides, helping keep the pad in place.</p><p>Plush Support for Back and Seat: Filled with resilient polyester padding, the cushion cradles your lower back, spine, and hips to reduce pressure during long meals or relaxing afternoons.</p><p>Versatile 95 x 45cm Size: Works well with rattan, wood, and metal high-back chairs; allow up to 72 hours for the cushion to fully expand.</p>",
    "productType": "Cushions",
    "tags": [
      "Cushions"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-CUSHION-CORD-CREAM/1.webp",
        "altText": "Makimoo 2 Pack Chair Cushions With Backrest And Seat, Soft Tufted Corduroy High Back Dining Chair Pads With Ties For Indoor Outdoor Patio Garden Use, 95 x 45 cm (Cream)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "39.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-CUSHION-CORD-CREAM",
        "title": "Default Title",
        "price": {
          "amount": "39.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-CUSHION-CORD-DUSTYROSE",
    "asin": "MK-CUSHION-CORD-DUSTYROSE",
    "title": "Makimoo 2 Pack Chair Cushions With Backrest And Seat, Soft Tufted Corduroy High Back Dining Chair Pads With Ties For Indoor Outdoor Patio Garden Use, 95 x 45 cm (Dusty Rose)",
    "handle": "corduroy-chair-cushions-dusty-rose-95x45-mk-cushion-cord-dustyrose",
    "description": "Set of 2 High-Back Corduroy Cushions: Two matching chair pads combine a tall backrest with a generously padded seat, offering consistent comfort for dining chairs, patio seating, or garden loungers. Thick, Tufted Corduroy Cover: The ribbed corduroy fabric adds subtle texture and a soft hand-feel, while the deep button tufting helps the fill stay evenly distributed across the back and seat over time. Secure Ties for a Neat Fit: Four attached fabric ties let you fasten the cushion to the chair frame at the top and sides, helping keep the pad in place. Plush Support for Back and Seat: Filled with resilient polyester padding, the cushion cradles your lower back, spine, and hips to reduce pressure during long meals or relaxing afternoons. Versatile 95 x 45cm Size: Works well with rattan, wood, and metal high-back chairs; allow up to 72 hours for the cushion to fully expand.",
    "descriptionHtml": "<p>Set of 2 High-Back Corduroy Cushions: Two matching chair pads combine a tall backrest with a generously padded seat, offering consistent comfort for dining chairs, patio seating, or garden loungers.</p><p>Thick, Tufted Corduroy Cover: The ribbed corduroy fabric adds subtle texture and a soft hand-feel, while the deep button tufting helps the fill stay evenly distributed across the back and seat over time.</p><p>Secure Ties for a Neat Fit: Four attached fabric ties let you fasten the cushion to the chair frame at the top and sides, helping keep the pad in place.</p><p>Plush Support for Back and Seat: Filled with resilient polyester padding, the cushion cradles your lower back, spine, and hips to reduce pressure during long meals or relaxing afternoons.</p><p>Versatile 95 x 45cm Size: Works well with rattan, wood, and metal high-back chairs; allow up to 72 hours for the cushion to fully expand.</p>",
    "productType": "Cushions",
    "tags": [
      "Cushions"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-CUSHION-CORD-DUSTYROSE/1.webp",
        "altText": "Makimoo 2 Pack Chair Cushions With Backrest And Seat, Soft Tufted Corduroy High Back Dining Chair Pads With Ties For Indoor Outdoor Patio Garden Use, 95 x 45 cm (Dusty Rose)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "39.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-CUSHION-CORD-DUSTYROSE",
        "title": "Default Title",
        "price": {
          "amount": "39.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-CUSHION-CORD-OLIVE",
    "asin": "MK-CUSHION-CORD-OLIVE",
    "title": "Makimoo 2 Pack Chair Cushions With Backrest And Seat, Soft Tufted Corduroy High Back Dining Chair Pads With Ties For Indoor Outdoor Patio Garden Use, 95 x 45 cm (Olive)",
    "handle": "corduroy-chair-cushions-olive-95x45-mk-cushion-cord-olive",
    "description": "Set of 2 High-Back Corduroy Cushions: Two matching chair pads combine a tall backrest with a generously padded seat, offering consistent comfort for dining chairs, patio seating, or garden loungers. Thick, Tufted Corduroy Cover: The ribbed corduroy fabric adds subtle texture and a soft hand-feel, while the deep button tufting helps the fill stay evenly distributed across the back and seat over time. Secure Ties for a Neat Fit: Four attached fabric ties let you fasten the cushion to the chair frame at the top and sides, helping keep the pad in place. Plush Support for Back and Seat: Filled with resilient polyester padding, the cushion cradles your lower back, spine, and hips to reduce pressure during long meals or relaxing afternoons. Versatile 95 x 45cm Size: Works well with rattan, wood, and metal high-back chairs; allow up to 72 hours for the cushion to fully expand.",
    "descriptionHtml": "<p>Set of 2 High-Back Corduroy Cushions: Two matching chair pads combine a tall backrest with a generously padded seat, offering consistent comfort for dining chairs, patio seating, or garden loungers.</p><p>Thick, Tufted Corduroy Cover: The ribbed corduroy fabric adds subtle texture and a soft hand-feel, while the deep button tufting helps the fill stay evenly distributed across the back and seat over time.</p><p>Secure Ties for a Neat Fit: Four attached fabric ties let you fasten the cushion to the chair frame at the top and sides, helping keep the pad in place.</p><p>Plush Support for Back and Seat: Filled with resilient polyester padding, the cushion cradles your lower back, spine, and hips to reduce pressure during long meals or relaxing afternoons.</p><p>Versatile 95 x 45cm Size: Works well with rattan, wood, and metal high-back chairs; allow up to 72 hours for the cushion to fully expand.</p>",
    "productType": "Cushions",
    "tags": [
      "Cushions"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-CUSHION-CORD-OLIVE/1.webp",
        "altText": "Makimoo 2 Pack Chair Cushions With Backrest And Seat, Soft Tufted Corduroy High Back Dining Chair Pads With Ties For Indoor Outdoor Patio Garden Use, 95 x 45 cm (Olive)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "39.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-CUSHION-CORD-OLIVE",
        "title": "Default Title",
        "price": {
          "amount": "39.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  },
  {
    "id": "makimoo-MK-CUSHION-CORD-DUSTYBLUE",
    "asin": "MK-CUSHION-CORD-DUSTYBLUE",
    "title": "Makimoo 2 Pack Chair Cushions With Backrest And Seat, Soft Tufted Corduroy High Back Dining Chair Pads With Ties For Indoor Outdoor Patio Garden Use, 95 x 45 cm (Dusty Blue)",
    "handle": "corduroy-chair-cushions-dusty-blue-95x45-mk-cushion-cord-dustyblue",
    "description": "Set of 2 High-Back Corduroy Cushions: Two matching chair pads combine a tall backrest with a generously padded seat, offering consistent comfort for dining chairs, patio seating, or garden loungers. Thick, Tufted Corduroy Cover: The ribbed corduroy fabric adds subtle texture and a soft hand-feel, while the deep button tufting helps the fill stay evenly distributed across the back and seat over time. Secure Ties for a Neat Fit: Four attached fabric ties let you fasten the cushion to the chair frame at the top and sides, helping keep the pad in place. Plush Support for Back and Seat: Filled with resilient polyester padding, the cushion cradles your lower back, spine, and hips to reduce pressure during long meals or relaxing afternoons. Versatile 95 x 45cm Size: Works well with rattan, wood, and metal high-back chairs; allow up to 72 hours for the cushion to fully expand.",
    "descriptionHtml": "<p>Set of 2 High-Back Corduroy Cushions: Two matching chair pads combine a tall backrest with a generously padded seat, offering consistent comfort for dining chairs, patio seating, or garden loungers.</p><p>Thick, Tufted Corduroy Cover: The ribbed corduroy fabric adds subtle texture and a soft hand-feel, while the deep button tufting helps the fill stay evenly distributed across the back and seat over time.</p><p>Secure Ties for a Neat Fit: Four attached fabric ties let you fasten the cushion to the chair frame at the top and sides, helping keep the pad in place.</p><p>Plush Support for Back and Seat: Filled with resilient polyester padding, the cushion cradles your lower back, spine, and hips to reduce pressure during long meals or relaxing afternoons.</p><p>Versatile 95 x 45cm Size: Works well with rattan, wood, and metal high-back chairs; allow up to 72 hours for the cushion to fully expand.</p>",
    "productType": "Cushions",
    "tags": [
      "Cushions"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/MK-CUSHION-CORD-DUSTYBLUE/1.webp",
        "altText": "Makimoo 2 Pack Chair Cushions With Backrest And Seat, Soft Tufted Corduroy High Back Dining Chair Pads With Ties For Indoor Outdoor Patio Garden Use, 95 x 45 cm (Dusty Blue)",
        "width": 1200,
        "height": 1200
      }
    ],
    "priceRange": {
      "minVariantPrice": {
        "amount": "39.99",
        "currencyCode": "USD"
      }
    },
    "variants": [
      {
        "id": "variant-MK-CUSHION-CORD-DUSTYBLUE",
        "title": "Default Title",
        "price": {
          "amount": "39.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ]
      }
    ],
    "amazonUrl": ""
  }
];

import { SHOPIFY_MAP } from './shopify-map';
import { MATERIALS_MAP, SITE_ONLY_WHITEBG } from './materials-map';
import { MATERIALS_SHORT_BULLETS } from './materials-short-bullets';
import { MATERIALS_PRODUCTS } from './products-materials';
import { SHORT_TITLES } from './short-titles';
import { DETAIL_IMAGES_OVERRIDES } from './detail-images-overrides';
import { GALLERY_IMAGES_OVERRIDES } from './gallery-images-overrides';
import { classifyProduct } from './subcategories';

/** 站点基础产品 + 素材库新增产品 */
export const PRODUCTS_DATA: MakimooProduct[] = [...BASE_PRODUCTS, ...MATERIALS_PRODUCTS];

/** 应用素材库覆盖（标题/五点描述/图片），返回原产品表示该 ASIN 无素材数据 */
function applyMaterialsData(product: MakimooProduct): MakimooProduct {
  const entry = MATERIALS_MAP[product.asin.toLowerCase()];
  if (!entry) {
    // 素材库之外的老产品：仅应用白底图标记
    const whiteBg = SITE_ONLY_WHITEBG[product.asin.toLowerCase()];
    return whiteBg ? { ...product, imageWhiteBg: whiteBg } : product;
  }
  const bullets = entry.bullets.trim();
  return {
    ...product,
    title: entry.title || product.title,
    description: bullets ? bullets.replace(/\n\n+/g, ' ').replace(/\n/g, ' ') : product.description,
    descriptionHtml: bullets
      ? bullets.split(/\n\n+/).map((p) => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, ' ')}</p>`).join('')
      : product.descriptionHtml,
    images: entry.images.map((url) => ({ url, altText: entry.title || product.title, width: 800, height: 800 })),
    imageWhiteBg: entry.whiteBg,
    // 五点卖点缩写（详情页卖点列表优先使用）
    featureBullets: MATERIALS_SHORT_BULLETS[product.asin.toLowerCase()],
    // 详情附图（可选；覆盖表优先——独立文件不受 materials-map 再生成影响）
    ...(DETAIL_IMAGES_OVERRIDES[product.asin.toLowerCase()] || entry.detailImages
      ? { detailImages: DETAIL_IMAGES_OVERRIDES[product.asin.toLowerCase()] || entry.detailImages }
      : {}),
  };
}

/** 无手工精简标题时的自动精简：去品牌词、≤100 字符（在逗号/空格处截断） */
function autoShortenTitle(t: string): string {
  const s = t.replace(/\bmakimoo\b[,\s-]*/i, '').trim();
  if (s.length <= 100) return s;
  const cut = s.slice(0, 100);
  const lastComma = cut.lastIndexOf(',');
  if (lastComma >= 40) return cut.slice(0, lastComma).trim();
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace >= 40 ? cut.slice(0, lastSpace) : cut).trim();
}

/** 分类归并：Home Fragrance / Travel → Others，Bath 按标题拆为 Towels / Mats；
 * Dining 按标题拆分（2026-09 起 Dining 为正式类目）：托盘/餐具类 → Dining，餐椅垫类 → Cushions */
const CATEGORY_MERGE: Record<string, string> = {
  'home fragrance': 'Others',
  travel: 'Others',
};
const DINING_TRAY_RE = /tray|serving basket|fruit (plate|basket|bowl)|snack (plate|bowl|tray)|platter|bread basket|placemat|coaster/i;
const MATS_RE = /bath ?mats?|bath rug|kitchen (mat|rug)|door mat|entryway|floor mat|area rug|diatom/i;
const TOWELS_RE = /towel/i;
function normalizeCategory(t: string, title = ''): string {
  if (t.toLowerCase() === 'bath') {
    if (MATS_RE.test(title)) return 'Mats';
    if (TOWELS_RE.test(title)) return 'Towels';
    return 'Mats';
  }
  // Dining：托盘/餐具类归 Dining，餐椅垫等其余归 Cushions
  if (t.toLowerCase() === 'dining') return DINING_TRAY_RE.test(title) ? 'Dining' : 'Cushions';
  // 个别椅垫在源数据中被错标为 Pillows，按标题归正（如 B0DSGCLBVW / B0DSGCKWXW）
  if (t.toLowerCase() === 'pillows' && /chair cushion/i.test(title)) return 'Cushions';
  // 枕套/枕芯类按全站规则（classify: pillowcase/insert → Pillows）从 Others 归正（如 B0F62QGV32 / B0GJLVMHT7）
  if (t.toLowerCase() === 'others' && /pillow ?case|(pillow|cushion) insert|pillow stuffer/i.test(title)) return 'Pillows';
  // 颈枕归正到 Pillows（2026-10-08 用户定：Pillows 新增 Neck Pillows 子类目，颈枕从 Others/Travel 移入）
  if ((t.toLowerCase() === 'travel' || t.toLowerCase() === 'others') && /neck pillow/i.test(title)) return 'Pillows';
  return CATEGORY_MERGE[t.toLowerCase()] || t;
}

/** 全站隐藏的产品（2026-09-30 用户定）：
 *  - 4 款天鹅绒充气颈枕不再展示、不放入任何类目（前缀匹配）
 *  - 8 款枕套全站隐藏（Pillow Cases 子类目整体移除；注意同变体族的 3 款 cushion covers
 *    b0gjlsdz52/b0gjldmt57/b0gjlmjws1 三款抱枕套 2026-10-08 起也已隐藏；duvset 标题含 pillowcases
 *    但是床品套装，不在隐藏之列） */
const HIDDEN_HANDLE_PREFIXES = ['inflatable-travel-pillow-'];
const HIDDEN_HANDLES = new Set([
  // 2026-10-08 用户定：B0H4V662HL（45×45 枕芯）与 B0CQC6H9MZ 重复，全站移除
  'premium-pillow-inserts-45-x-45-cm-set-of-2-decorative-b0h4v662hl',
  // 2026-10-08 用户定：3 款压花枕套全站移除（Pillow Cases 类目将改为 Decorative Pillow Cases 装饰枕套）
  'makimoo-embossed-cushion-covers-set-of-2-soft-microfibre-b0gjlsdz52',
  'makimoo-embossed-cushion-covers-set-of-2-soft-breathable-b0gjldmt57',
  'set-of-2-embossed-geometric-microfiber-cushion-covers-50-x-b0gjlmjws1',
  'textured-geometric-embossed-pillowcases-set-of-2-soft-b0gjlvmht7',
  'makimoo-embossed-microfiber-pillow-covers-50-x-70-cm-set-of-b0gjlp59k1',
  'makimoo-embossed-pillowcases-set-of-2-ultra-soft-breathable-b0gjlnmx2g',
  'makimoo-embossed-microfiber-pillowcases-set-of-2-soft-b0gjlp4pr2',
  'makimoo-embossed-pillowcases-2-pack-soft-textured-pillow-b0gjlmc6z4',
  'makimoo-embossed-microfibre-pillowcases-40-x-80-cm-set-of-2-b0gjlgxtl4',
  'set-of-2-pillowcases-40-x-80-cm-soft-durable-skin-friendly-b0gjlgm6xg',
  'makimoo-embossed-pillow-cases-set-of-2-luxury-soft-brushed-b0gjldwt6x',
]);

export function isHiddenProduct(p: { handle: string }): boolean {
  return HIDDEN_HANDLE_PREFIXES.some(pre => p.handle.startsWith(pre)) || HIDDEN_HANDLES.has(p.handle);
}

/** Merge local product data with Shopify data (prices, availability, variant IDs) and materials overrides (title, bullets, images) */
export function enrichProductsWithShopifyData(products: MakimooProduct[]): MakimooProduct[] {
  return products.filter(p => !isHiddenProduct(p)).map(rawProduct => {
    const product = applyMaterialsData(rawProduct);
    const asinLower = product.asin.toLowerCase();
    // 精简标题（≤100 字符、去品牌词），素材库标题之后的最终覆盖；无手工条目时自动精简
    const shortTitle = SHORT_TITLES[asinLower] || autoShortenTitle(product.title);
    const titled = shortTitle !== product.title ? { ...product, title: shortTitle } : product;
    // 分类归一化（productType + tags）
    const categorized = {
      ...titled,
      productType: normalizeCategory(titled.productType, titled.title),
      tags: titled.tags.map(t => normalizeCategory(t, titled.title)),
      // 二级分类：用完整标题（精简前）判定，避免关键词被截断
      subcategory: classifyProduct(
        normalizeCategory(titled.productType, titled.title),
        product.title,
        asinLower
      ),
    };
    // 图片顺序完全以素材库为准（--keep-order 同步），不做类目级重排
    const finalProduct = categorized;
    const shopifyEntry = SHOPIFY_MAP[asinLower];
    const materialsImages = MATERIALS_MAP[asinLower]?.images;
    // 老产品（无素材库条目）的本地重拍/AI 主图覆盖，优先于 Shopify CDN 图
    const galleryOverride = GALLERY_IMAGES_OVERRIDES[asinLower];
    const galleryImages = materialsImages || galleryOverride;
    if (!shopifyEntry) {
      return galleryImages
        ? { ...finalProduct, hasShopifyData: false, shopifyImages: galleryImages }
        : { ...finalProduct, hasShopifyData: false };
    }
    return {
      ...finalProduct,
      hasShopifyData: true,
      shopifyVariantId: shopifyEntry.variantId,
      shopifyAvailable: shopifyEntry.availableForSale,
      // Use Shopify price unless it's $0.0 (needs fix), then fallback to local price
      shopifyPrice: shopifyEntry.priceNeedsFix ? finalProduct.priceRange.minVariantPrice.amount : shopifyEntry.price,
      shopifyCurrencyCode: shopifyEntry.currencyCode,
      // 素材库图片优先于 Shopify CDN 图（shopifyImages 是全站图片显示的第一通道）
      shopifyImages: galleryImages || shopifyEntry.images,
      shopifyWeight: shopifyEntry.weight,
      shopifyWeightUnit: shopifyEntry.weightUnit,
    };
  });
}

export function getProductByHandle(handle: string): MakimooProduct | undefined {
  const product = PRODUCTS_DATA.find(p => p.handle === handle);
  if (!product) return undefined;
  return enrichProductsWithShopifyData([product])[0];
}

export function getProductsByCategory(category: string): MakimooProduct[] {
  // 先 enrich（含分类归一化），再按归一化后的分类过滤
  const enriched = enrichProductsWithShopifyData(PRODUCTS_DATA);
  if (!category) return enriched;
  return enriched.filter(p =>
    p.productType.toLowerCase() === category.toLowerCase() ||
    p.tags.some(t => t.toLowerCase().includes(category.toLowerCase()))
  );
}

export function searchProducts(query: string): MakimooProduct[] {
  const q = query.toLowerCase();
  const filtered = PRODUCTS_DATA.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
  return enrichProductsWithShopifyData(filtered);
}
