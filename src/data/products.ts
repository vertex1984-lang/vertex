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
}

export const PRODUCTS_DATA: MakimooProduct[] = [
  {
    "id": "makimoo-B098F1BKJQ",
    "asin": "B098F1BKJQ",
    "title": "Bike Basket for Women's Beach Cruiser or Scooter The Original Wicker Bicycle Baskets with Built in Cup Holder for Front Handlebar-Classic Vintage Style Handmade Natural Rattan Wicker",
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
        "url": "/images/products/B098F1BKJQ/1.jpg",
        "altText": "Bike Basket for Women's Beach Cruiser or Scooter The Original Wicker Bicycle Baskets with Built in Cup Holder for Front Handlebar-Classic Vintage Style Handmade Natural Rattan Wicker",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B098F1BKJQ/2.jpg",
        "altText": "Bike Basket for Women's Beach Cruiser or Scooter The Original Wicker Bicycle Baskets with Built in Cup Holder for Front Handlebar-Classic Vintage Style Handmade Natural Rattan Wicker",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B098F1BKJQ/3.jpg",
        "altText": "Bike Basket for Women's Beach Cruiser or Scooter The Original Wicker Bicycle Baskets with Built in Cup Holder for Front Handlebar-Classic Vintage Style Handmade Natural Rattan Wicker",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B098F1BKJQ/4.jpg",
        "altText": "Bike Basket for Women's Beach Cruiser or Scooter The Original Wicker Bicycle Baskets with Built in Cup Holder for Front Handlebar-Classic Vintage Style Handmade Natural Rattan Wicker",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B098F1BKJQ/5.jpg",
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
    "id": "makimoo-B0BBZSGDBQ",
    "asin": "B0BBZSGDBQ",
    "title": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
    "handle": "set-of-4-outdoor-dining-chair-cushions-comfort-patio-seating-b0bbzsgdbq",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture. Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching to garden/patio furniture</p><p>Effortlessly enhancing the looks of your home/garden, our cushions for outdoor furniture come in a range of simple yet vibrant colors</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0BBZSGDBQ/1.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/2.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/3.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/4.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/5.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/6.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/7.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/Gemini_Generated_Image_6hxq0i6hxq0i6hxq_no_watermark.png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/Gemini_Generated_Image_7hl1fk7hl1fk7hl1 (1)_no_watermark.png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/Gemini_Generated_Image_8wha3f8wha3f8wha_no_watermark.png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/Gemini_Generated_Image_dx4yrtdx4yrtdx4y_no_watermark.png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/Gemini_Generated_Image_h0y52fh0y52fh0y5.png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/Gemini_Generated_Image_sqk513sqk513sqk5_no_watermark.png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/Gemini_Generated_Image_yhsvzxyhsvzxyhsv_no_watermark.png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/nano-banana-pro-1776244917658.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZSGDBQ/nano-banana-pro-1776265366343.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blooming Fiesta",
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
        "id": "variant-B0BBZSGDBQ",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0BBZSGDBQ"
  },
  {
    "id": "makimoo-B0BBZW4LZR",
    "asin": "B0BBZW4LZR",
    "title": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
    "handle": "set-of-2-outdoor-dining-chair-cushions-comfort-patio-seating-b0bbzw4lzr",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching. Specially treated fabric: water repellent, oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas with ties for attaching</p><p>Specially treated fabric: water repellent, oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 44 x21x4.50 inch ( (LxWxH); allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0BBZW4LZR/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZW4LZR/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZW4LZR/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZW4LZR/4.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZW4LZR/Gemini_Generated_Image_6hxq0i6hxq0i6hxq_no_watermark.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZW4LZR/Gemini_Generated_Image_7hl1fk7hl1fk7hl1 (1)_no_watermark.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZW4LZR/Gemini_Generated_Image_8wha3f8wha3f8wha_no_watermark.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZW4LZR/Gemini_Generated_Image_dx4yrtdx4yrtdx4y_no_watermark.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZW4LZR/Gemini_Generated_Image_n8ubjfn8ubjfn8ub_no_watermark.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZW4LZR/Gemini_Generated_Image_sqk513sqk513sqk5_no_watermark.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZW4LZR/Gemini_Generated_Image_yhsvzxyhsvzxyhsv_no_watermark.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZW4LZR/nano-banana-pro-1776244917658.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BBZW4LZR/nano-banana-pro-1776246681536.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Red",
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
        "id": "variant-B0BBZW4LZR",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0BBZW4LZR"
  },
  {
    "id": "makimoo-B0BCJQYYL1",
    "asin": "B0BCJQYYL1",
    "title": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
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
        "url": "/images/products/B0BCJQYYL1/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/4.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/5.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/6.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/7.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/Gemini_Generated_Image_33x07833x07833x0.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/Gemini_Generated_Image_9fu9q69fu9q69fu9.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/nano-banana-pro-1776261559346.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/nano-banana-pro-1776261903394.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/nano-banana-pro-1776262660713.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/nano-banana-pro-1776263205260.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral Essence",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BCJQYYL1/nano-banana-pro-1776263350652.jpg",
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
    "title": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Black)",
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
        "url": "/images/products/B0BXCKKNN8/1.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BXCKKNN8/2.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BXCKKNN8/3.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BXCKKNN8/4.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BXCKKNN8/5.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BXCKKNN8/6.jpg",
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
    "id": "makimoo-B0BY8LY757",
    "asin": "B0BY8LY757",
    "title": "Hanging Pagan Cauldron Oil Burner, Black Wax Warmer Aroma Diffuser, with Handle, for Essential Fragrance Wax Melts, Enchanting Witches' Home Decor Element.",
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
        "url": "/images/products/B0BY8LY757/1.jpg",
        "altText": "Hanging Pagan Cauldron Oil Burner, Black Wax Warmer Aroma Diffuser, with Handle, for Essential Fragrance Wax Melts, Enchanting Witches' Home Decor Element.",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BY8LY757/2.jpg",
        "altText": "Hanging Pagan Cauldron Oil Burner, Black Wax Warmer Aroma Diffuser, with Handle, for Essential Fragrance Wax Melts, Enchanting Witches' Home Decor Element.",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BY8LY757/3.jpg",
        "altText": "Hanging Pagan Cauldron Oil Burner, Black Wax Warmer Aroma Diffuser, with Handle, for Essential Fragrance Wax Melts, Enchanting Witches' Home Decor Element.",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BY8LY757/4.jpg",
        "altText": "Hanging Pagan Cauldron Oil Burner, Black Wax Warmer Aroma Diffuser, with Handle, for Essential Fragrance Wax Melts, Enchanting Witches' Home Decor Element.",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BY8LY757/5.jpg",
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
    "id": "makimoo-B0BZCLN57S",
    "asin": "B0BZCLN57S",
    "title": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
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
        "url": "/images/products/B0BZCLN57S/1.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCLN57S/2.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCLN57S/3.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCLN57S/4.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCLN57S/5.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCLN57S/6.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCLN57S/7.jpg",
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
    "title": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Grey)",
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
        "url": "/images/products/B0BZCMDZNS/1.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCMDZNS/2.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCMDZNS/3.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCMDZNS/4.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCMDZNS/5.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0BZCMDZNS/6.jpg",
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
    "title": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
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
        "url": "/images/products/B0C2Z9JRDM/1.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9JRDM/2.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9JRDM/3.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9JRDM/4.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9JRDM/5.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9JRDM/6.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9JRDM/7.jpg",
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
    "title": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Grey)",
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
        "url": "/images/products/B0C2Z9PFFK/1.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9PFFK/2.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9PFFK/3.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9PFFK/4.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2Z9PFFK/5.jpg",
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
    "title": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Blue)",
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
        "url": "/images/products/B0C2ZCXVX7/1.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2ZCXVX7/2.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2ZCXVX7/3.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2ZCXVX7/4.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2ZCXVX7/5.jpg",
        "altText": "Memory Foam Travel Pillow, Neck Pillow with 360-Degree Head Support, Comfortable and Lightweight, Ideal for Sleeping on Airplane, Car, Train, Bus and Home Use, Comes with Storage Bag (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C2ZCXVX7/6.jpg",
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
    "title": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
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
        "url": "/images/products/B0C33LFHN1/1.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LFHN1/2.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LFHN1/3.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LFHN1/4.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LFHN1/5.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LFHN1/6.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LFHN1/7.jpg",
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
    "title": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
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
        "url": "/images/products/B0C33LPY5G/1.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LPY5G/2.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LPY5G/3.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LPY5G/4.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LPY5G/5.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LPY5G/6.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LPY5G/7.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LPY5G/Seeany.com_万能改图_520044.png",
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
    "title": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
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
        "url": "/images/products/B0C33LXRVK/1.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LXRVK/2.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LXRVK/3.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LXRVK/4.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LXRVK/5.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LXRVK/6.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LXRVK/7.jpg",
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
    "title": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
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
        "url": "/images/products/B0C33LZ5PW/1.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LZ5PW/2.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LZ5PW/3.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LZ5PW/4.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LZ5PW/5.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LZ5PW/6.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (Orange and Red Stripes, 4)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33LZ5PW/7.jpg",
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
    "title": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
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
        "url": "/images/products/B0C33M24L3/1.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/2.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/3.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/4.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/5.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/6.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/7.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-02-2666-Photorealistic commercial product photog....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-02-4992-Photorealistic commercial product photog....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-02-8138-Photorealistic commercial product photog....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-02-8366-Photorealistic commercial product photog....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-04-1414-Hyper-realistic commercial lifestyle pho....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-04-7544-Warm lifestyle commercial photography, b....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C33M24L3/jimeng-2026-04-04-8131-Hyper-realistic commercial lifestyle pho....png",
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
    "title": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
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
        "url": "/images/products/B0C39ZMK7H/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZMK7H/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZMK7H/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZMK7H/4.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZMK7H/5.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZMK7H/6.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue and Red Leaves",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZMK7H/7.jpg",
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
    "title": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
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
        "url": "/images/products/B0C39ZSD3Q/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZSD3Q/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZSD3Q/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZSD3Q/4.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZSD3Q/5.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZSD3Q/6.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Khaki Floral",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C39ZSD3Q/7.jpg",
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
    "title": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
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
        "url": "/images/products/B0C3B12DL7/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/4.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/5.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/6.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/7.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514628.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514643.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514667.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514779.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514797.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514802.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514853.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Orange and Red Stripes",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B12DL7/Seeany.com_万能改图_514864.png",
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
    "title": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
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
        "url": "/images/products/B0C3B13N8Z/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/4.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/5.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/6.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/7.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514887.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514899.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514911.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514923.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514928.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514942.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_514957.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Blue Trumpet Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B13N8Z/Seeany.com_万能改图_515008.png",
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
    "title": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
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
        "url": "/images/products/B0C3B16L6R/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/4.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/5.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/6.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/7.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/Seeany.com_万能改图_515950.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/Seeany.com_万能改图_515959.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/Seeany.com_万能改图_515962.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/Seeany.com_万能改图_515976.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/Seeany.com_万能改图_515993.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Green Plaid",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B16L6R/Seeany.com_万能改图_519872.png",
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
    "title": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
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
        "url": "/images/products/B0C3B265XJ/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/4.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/5.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/6.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/7.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_519876.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_519882.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_519883.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_519885.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_519901.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_519986.png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, Watercolor Flowers",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C3B265XJ/Seeany.com_万能改图_520027.png",
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
    "title": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
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
        "url": "/images/products/B0C4B9T6JV/1.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/2.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/3.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/4.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/5.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/6.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/7.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_AI图片编辑器_529817.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529860.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529863.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529872.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529880.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529884.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529930.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Plaid)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4B9T6JV/Seeany.com_万能改图_529935.png",
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
    "title": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
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
        "url": "/images/products/B0C4BBVS53/1.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BBVS53/2.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BBVS53/3.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BBVS53/4.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BBVS53/5.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BBVS53/6.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Trumpet Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BBVS53/7.jpg",
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
    "title": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
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
        "url": "/images/products/B0C4BC7Q4S/1.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/2.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/3.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/4.jpg",
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
        "url": "/images/products/B0C4BC7Q4S/Gemini_Generated_Image_g03oq9g03oq9g03o (1).png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/Gemini_Generated_Image_k2s1iok2s1iok2s1.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/Gemini_Generated_Image_wjvhhiwjvhhiwjvh (1).png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/nano-banana-pro-upscaled-2x-1775544337846.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/nano-banana-pro-upscaled-2x-1775545639578.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Khaki Floral)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BC7Q4S/nano-banana-pro-upscaled-2x-1775546296442.png",
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
    "title": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
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
        "url": "/images/products/B0C4BCD4DY/1.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/2.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/3.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/4.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/5.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/6.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/7.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_AI图片编辑器_529422.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_万能改图_529469.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_万能改图_529473.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_万能改图_529517.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_万能改图_529572.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_万能改图_529618.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Watercolor Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BCD4DY/Seeany.com_万能改图_529632.png",
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
    "title": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
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
        "url": "/images/products/B0C4BD7Q5X/1.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/2.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/3.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/4.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/5.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/6.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/7.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_AI图片编辑_529103.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_AI图片编辑_529161.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_AI图片编辑器_529334.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_AI图片编辑器_529342.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_万能改图_529499.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_智能创作_520063.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_智能创作_520066.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_智能创作_520067.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BD7Q5X/Seeany.com_电商套图_529253.png",
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
    "title": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
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
        "url": "/images/products/B0C4BDLLFK/1.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BDLLFK/2.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BDLLFK/3.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BDLLFK/4.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BDLLFK/5.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BDLLFK/6.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Orange and Red Stripes)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C4BDLLFK/7.jpg",
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
    "title": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
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
        "url": "/images/products/B0C69QNSB3/1.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69QNSB3/2.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69QNSB3/3.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69QNSB3/4.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69QNSB3/5.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69QNSB3/6.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69QNSB3/7.jpg",
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
    "title": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
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
        "url": "/images/products/B0C69RJVVT/1.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RJVVT/2.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RJVVT/3.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RJVVT/4.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RJVVT/5.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RJVVT/6.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Black)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RJVVT/7.jpg",
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
    "title": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
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
        "url": "/images/products/B0C69RR6GF/1.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RR6GF/2.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RR6GF/3.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RR6GF/4.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RR6GF/5.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RR6GF/6.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RR6GF/7.jpg",
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
    "title": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
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
        "url": "/images/products/B0C69RRYXM/1.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RRYXM/2.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RRYXM/3.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RRYXM/4.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RRYXM/5.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RRYXM/6.jpg",
        "altText": "Inflatable Travel Pillow, Neck Pillow Support for Traveling, Airplanes, Cars, and Offices with Compact Carrying Bag, Soft Velvet Washable Cover, Ideal for Adult Sleepers (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C69RRYXM/7.jpg",
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
    "title": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
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
        "url": "/images/products/B0C6H5XZMZ/1.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C6H5XZMZ/2.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C6H5XZMZ/3.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C6H5XZMZ/4.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C6H5XZMZ/5.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C6H5XZMZ/6.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper,",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C6H5XZMZ/7.jpg",
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
    "title": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Blue)",
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
        "url": "/images/products/B0C8J237V3/1.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J237V3/2.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J237V3/3.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J237V3/4.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J237V3/5.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J237V3/6.jpg",
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
    "title": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Pink)",
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
        "url": "/images/products/B0C8J292WF/1.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J292WF/2.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J292WF/3.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J292WF/4.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J292WF/5.jpg",
        "altText": "Travel Neck Pillow, Top Memory Foam Pillow for Head Support, Ideal for Airplanes, Cars, and Home Recliners, Adjustable and Soft (Pink)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0C8J292WF/6.jpg",
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
    "title": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue)",
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
        "url": "/images/products/B0CBT7B1TY/1.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7B1TY/3.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7B1TY/4.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7B1TY/5.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7B1TY/6.jpg",
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
    "title": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Grey)",
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
        "url": "/images/products/B0CBT7R7NN/1.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7R7NN/3.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7R7NN/4.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7R7NN/5.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7R7NN/6.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Grey)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7R7NN/nano-banana-pro-1776232286608.jpg",
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
    "title": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Brown)",
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
        "url": "/images/products/B0CBT7RFK2/1.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7RFK2/3.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7RFK2/4.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7RFK2/5.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CBT7RFK2/6.jpg",
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
    "title": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Blue Monet Garden)",
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
        "url": "/images/products/B0CC5RGRPS/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Blue Monet Garden)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5RGRPS/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Blue Monet Garden)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5RGRPS/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Blue Monet Garden)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5RGRPS/4.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Blue Monet Garden)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5RGRPS/5.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Blue Monet Garden)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5RGRPS/6.jpg",
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
    "title": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Red-Green Geometry)",
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
        "url": "/images/products/B0CC5TLWFS/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Red-Green Geometry)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5TLWFS/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Red-Green Geometry)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5TLWFS/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Red-Green Geometry)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5TLWFS/4.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Red-Green Geometry)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5TLWFS/5.jpg",
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
    "title": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Tulip)",
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
        "url": "/images/products/B0CC5VNQY3/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Tulip)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5VNQY3/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Tulip)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5VNQY3/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Tulip)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5VNQY3/4.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Tulip)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5VNQY3/5.jpg",
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
    "title": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
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
        "url": "/images/products/B0CC5WN6JJ/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/4.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/5.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-1885-Warm cozy indoor-outdoor lifestyle shot,....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-2189-Photorealistic lifestyle product shot, 2....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-2441-Commercial product photography, set of 2....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-3493-Commercial product photography, set of 2....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-3503-Lifestyle product photography, set of 2 ....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-4145-Photorealistic lifestyle product shot, 2....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-4164-High-end cinematic product photography, ....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-4400-Warm cozy indoor-outdoor lifestyle shot,....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-4890-Warm cozy indoor-outdoor lifestyle shot,....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-4937-Elegant French country garden lifestyle ....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-6232-Lifestyle product photography, set of 2 ....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-6375-Elegant French country garden lifestyle ....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-6523-Photorealistic lifestyle product shot, 2....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-6656-High-end cinematic product photography, ....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-7306-Commercial product photography, set of 2....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-7338-Elegant French country garden lifestyle ....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-7479-Warm cozy indoor-outdoor lifestyle shot,....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-7751-Lifestyle product photography, set of 2 ....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-8666-Elegant French country garden lifestyle ....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-8747-High-end cinematic product photography, ....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-8817-High-end cinematic product photography, ....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-9053-Lifestyle product photography, set of 2 ....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-9485-Commercial product photography, set of 2....png",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Jungle Leopard)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5WN6JJ/jimeng-2026-04-04-9713-Photorealistic lifestyle product shot, 2....png",
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
    "title": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Butterfly)",
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
        "url": "/images/products/B0CC5Y77DC/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Butterfly)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5Y77DC/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Butterfly)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5Y77DC/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Patio Seating Cushions, 38x18x4.5 inch, for Garden Patio Furniture (Butterfly)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CC5Y77DC/5.jpg",
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
    "title": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Houndstooth)",
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
        "url": "/images/products/B0CJ8TJL56/1.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJ8TJL56/2.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJ8TJL56/3.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Green Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJ8TJL56/4.jpg",
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
    "title": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Red Houndstooth)",
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
        "url": "/images/products/B0CJHSLCZ5/1.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Red Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJHSLCZ5/2.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Red Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJHSLCZ5/3.jpg",
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
    "title": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Houndstooth)",
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
        "url": "/images/products/B0CJHX7XKL/1.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJHX7XKL/2.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJHX7XKL/3.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad with Ties - Dining Chair Cushion, 17\" x 17\" (Blue Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CJHX7XKL/4.jpg",
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
    "title": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
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
        "url": "/images/products/B0CQBZM49V/1.jpg",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/2.jpg",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/3.jpg",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/4.jpg",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/5.jpg",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/6.jpg",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/Gemini_Generated_Image_g03oq9g03oq9g03o (1).png",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/Gemini_Generated_Image_s8z5dts8z5dts8z5 (1).png",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/Gemini_Generated_Image_w6eqdiw6eqdiw6eq.png",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/jimeng-2026-04-08-1780-Hyperrealistic warm minimalist product p....png",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/jimeng-2026-04-08-2079-Hyperrealistic warm minimalist product p....png",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/jimeng-2026-04-08-3805-Photorealistic 8K lifestyle product shot....png",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/jimeng-2026-04-08-4110-Hyperrealistic warm minimalist product p....png",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/jimeng-2026-04-08-5430-Photorealistic warm minimalist living ro....png",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/jimeng-2026-04-08-7313-Photorealistic 8K lifestyle product shot....png",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/jimeng-2026-04-08-7573-Hyperrealistic warm minimalist product p....png",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/jimeng-2026-04-08-8337-Photorealistic 8K lifestyle product shot....png",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/jimeng-2026-04-08-9243-Photorealistic 8K lifestyle product shot....png",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/jimeng-2026-04-09-7321-Hyper-realistic commercial lifestyle pho....png",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/nano-banana-pro-1775546845583.jpg",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQBZM49V/nano-banana-pro-1775558573205.jpg",
        "altText": "Throw Pillow Inserts 30 x 50cm (12\" x 20\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
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
    "title": "Throw Pillow Inserts 40cm x 40cm (16\" x 16\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
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
        "url": "/images/products/B0CQC5QJFJ/1.jpg",
        "altText": "Throw Pillow Inserts 40cm x 40cm (16\" x 16\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC5QJFJ/2.jpg",
        "altText": "Throw Pillow Inserts 40cm x 40cm (16\" x 16\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC5QJFJ/3.jpg",
        "altText": "Throw Pillow Inserts 40cm x 40cm (16\" x 16\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC5QJFJ/4.jpg",
        "altText": "Throw Pillow Inserts 40cm x 40cm (16\" x 16\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC5QJFJ/5.jpg",
        "altText": "Throw Pillow Inserts 40cm x 40cm (16\" x 16\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC5QJFJ/6.jpg",
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
    "id": "makimoo-B0CQC6H9MZ",
    "asin": "B0CQC6H9MZ",
    "title": "Throw Pillow Inserts 45cm x 45cm (18\" x 18\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
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
        "url": "/images/products/B0CQC6H9MZ/1.jpg",
        "altText": "Throw Pillow Inserts 45cm x 45cm (18\" x 18\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC6H9MZ/2.jpg",
        "altText": "Throw Pillow Inserts 45cm x 45cm (18\" x 18\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC6H9MZ/3.jpg",
        "altText": "Throw Pillow Inserts 45cm x 45cm (18\" x 18\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC6H9MZ/4.jpg",
        "altText": "Throw Pillow Inserts 45cm x 45cm (18\" x 18\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC6H9MZ/5.jpg",
        "altText": "Throw Pillow Inserts 45cm x 45cm (18\" x 18\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CQC6H9MZ/6.jpg",
        "altText": "Throw Pillow Inserts 45cm x 45cm (18\" x 18\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
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
    "id": "makimoo-B0CW182MCY",
    "asin": "B0CW182MCY",
    "title": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Red Houndstooth)",
    "handle": "outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cw182mcy",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. Durable, easy to care: Strength and durability and built into every inch. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure：Back 20\"×17\", Seat 17\"×17\" ; Allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>Durable, easy to care: Strength and durability and built into every inch</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure：Back 20\"×17\", Seat 17\"×17\" ; Allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Cushions",
    "tags": [
      "Cushions"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CW182MCY/1.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Red Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW182MCY/2.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Red Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW182MCY/3.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Red Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW182MCY/4.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Red Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW182MCY/5.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Red Houndstooth)",
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
        "id": "variant-B0CW182MCY",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CW182MCY"
  },
  {
    "id": "makimoo-B0CW193N7M",
    "asin": "B0CW193N7M",
    "title": "Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 19\"×16.5\", Seat 16.5\"×16.5\" (Black Purple Flowers)",
    "handle": "patio-cushion-rocking-chair-cushion-tufted-pads-set-of-upper-b0cw193n7m",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. Durable, easy to care: Strength and durability and built into every inch. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure：Back 19\"×16.5\", Seat 16.5\"×16.5; Allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>Durable, easy to care: Strength and durability and built into every inch</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure：Back 19\"×16.5\", Seat 16.5\"×16.5; Allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Cushions",
    "tags": [
      "Cushions"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CW193N7M/1.jpg",
        "altText": "Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 19\"×16.5\", Seat 16.5\"×16.5\" (Black Purple Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW193N7M/2.jpg",
        "altText": "Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 19\"×16.5\", Seat 16.5\"×16.5\" (Black Purple Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW193N7M/6.jpg",
        "altText": "Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 19\"×16.5\", Seat 16.5\"×16.5\" (Black Purple Flowers)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW193N7M/7.jpg",
        "altText": "Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 19\"×16.5\", Seat 16.5\"×16.5\" (Black Purple Flowers)",
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
        "id": "variant-B0CW193N7M",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CW193N7M"
  },
  {
    "id": "makimoo-B0CW19GMPQ",
    "asin": "B0CW19GMPQ",
    "title": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue Houndstooth)",
    "handle": "outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cw19gmpq",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. Durable, easy to care: Strength and durability and built into every inch. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure：Back 20\"×17\", Seat 17\"×17\" ; Allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>Durable, easy to care: Strength and durability and built into every inch</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure：Back 20\"×17\", Seat 17\"×17\" ; Allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Cushions",
    "tags": [
      "Cushions"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CW19GMPQ/1.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW19GMPQ/2.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW19GMPQ/3.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW19GMPQ/4.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW19GMPQ/5.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Blue Houndstooth)",
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
        "id": "variant-B0CW19GMPQ",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CW19GMPQ"
  },
  {
    "id": "makimoo-B0CW1H96Y5",
    "asin": "B0CW1H96Y5",
    "title": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Green Houndstooth)",
    "handle": "outdoor-patio-cushion-rocking-chair-cushion-tufted-pads-set--b0cw1h96y5",
    "description": "Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture. Durable, easy to care: Strength and durability and built into every inch. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure：Back 20\"×17\", Seat 17\"×17\" ; Allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester with ties for attaching to garden/patio furniture</p><p>Durable, easy to care: Strength and durability and built into every inch</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure：Back 20\"×17\", Seat 17\"×17\" ; Allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Cushions",
    "tags": [
      "Cushions"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0CW1H96Y5/1.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Green Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW1H96Y5/2.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Green Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW1H96Y5/3.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Green Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW1H96Y5/4.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Green Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW1H96Y5/5.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Green Houndstooth)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CW1H96Y5/6.jpg",
        "altText": "Outdoor Patio Cushion, Rocking Chair Cushion, Tufted Pads, Set of Upper and Lower with Ties Pack of 2 (2 Sets) - Back 20\"×17\", Seat 17\"×17\" (Green Houndstooth)",
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
        "id": "variant-B0CW1H96Y5",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0CW1H96Y5"
  },
  {
    "id": "makimoo-B0CXDZF2WQ",
    "asin": "B0CXDZF2WQ",
    "title": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
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
        "url": "/images/products/B0CXDZF2WQ/1.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/2.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/3.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/4.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/5.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/6.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/7.jpg",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-1464-Commercial lifestyle product photography....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-3315-Editorial lifestyle product image, set o....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-3427-Warm homely lifestyle photograph, 2 oran....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-3473-Editorial lifestyle product image, set o....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-3850-Commercial lifestyle product photography....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-4818-Editorial lifestyle product image, set o....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-5057-Warm homely lifestyle photograph, 2 oran....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-5645-Editorial lifestyle product image, set o....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-7671-Commercial lifestyle product photography....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-8340-Warm homely lifestyle photograph, 2 oran....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-8424-Warm homely lifestyle photograph, 2 oran....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-04-9090-Commercial lifestyle product photography....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-1025-Aesthetic lifestyle commercial photograp....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-4529-Lifestyle product photography, set of 4 ....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-5075-Commercial product photography, set of 4....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-5319-Commercial product photography, set of 4....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-5926-Aesthetic lifestyle commercial photograp....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-6913-Lifestyle product photography, set of 4 ....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-6914-Commercial product photography, set of 4....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-7817-Lifestyle product photography, set of 4 ....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-8460-Commercial product photography, set of 4....png",
        "altText": "Set of 4 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper, (4, Orange)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0CXDZF2WQ/jimeng-2026-04-06-8564-Lifestyle product photography, set of 4 ....png",
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
    "title": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
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
        "url": "/images/products/B0D5DNWX8J/1.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D5DNWX8J/2.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D5DNWX8J/3.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D5DNWX8J/4.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D5DNWX8J/5.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D5DNWX8J/6.jpg",
        "altText": "Set of 2 Outdoor Dining Chair Cushions, Comfort Patio Seating Cushions, 44 x21x4.5 inch, Single Welt and Zipper (Blue and Red Leaves)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D5DNWX8J/7.jpg",
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
    "title": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
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
        "url": "/images/products/B0D9LH1Y55/1.jpg",
        "altText": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D9LH1Y55/2.jpg",
        "altText": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D9LH1Y55/3.jpg",
        "altText": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D9LH1Y55/4.jpg",
        "altText": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D9LH1Y55/5.jpg",
        "altText": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D9LH1Y55/6.jpg",
        "altText": "Original Greek Pepper Mill, European Style Salt and Pepper Grinder, 9-Inch (Brass)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0D9LH1Y55/7.jpg",
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
    "title": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
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
        "url": "/images/products/B0F1XFWZVY/1.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/2.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/3.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/4.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/5.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/6.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/jimeng-2026-04-02-1642-Photorealistic commercial product photog....png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/jimeng-2026-04-02-2138-Photorealistic lifestyle commercial phot....png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/jimeng-2026-04-02-6642-Photorealistic lifestyle product photogr....png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/jimeng-2026-04-02-6913-Photorealistic lifestyle commercial phot....png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Navy Blue)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XFWZVY/jimeng-2026-04-02-9328-Photorealistic lifestyle commercial phot....png",
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
    "title": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
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
        "url": "/images/products/B0F1XMTYNC/1.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/2.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/3.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/4.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/5.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/6.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-1883-Warm lifestyle commercial product shot, ....png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-2400-Cinematic commercial product photography....png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-2946-Cinematic commercial product photography....png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-5495-Photorealistic commercial product photog....png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-5684-Photorealistic commercial product photog....png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-6399-Cinematic commercial product photography....png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-7442-Photorealistic commercial product photog....png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-7612-Photorealistic commercial product photog....png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-8196-Cinematic commercial product photography....png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XMTYNC/jimeng-2026-04-02-8227-Warm lifestyle commercial product shot, ....png",
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
    "title": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
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
        "url": "/images/products/B0F1XS27XS/1.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/2.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/3.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/4.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/5.png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/6.png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/7.png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/8.png",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Angola Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS27XS/9.png",
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
    "title": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Coffee Brown)",
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
        "url": "/images/products/B0F1XS7VKY/1.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Coffee Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS7VKY/2.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Coffee Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS7VKY/3.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Coffee Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS7VKY/5.jpg",
        "altText": "Set of 2 High Back Tufted Outdoor Chair Cushion, 44 x 21 Inch, Water Repellent, Outdoor Dining Chair Cushions with Ties, Patio Seating Cushions for Garden Patio Furniture (Coffee Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1XS7VKY/6.jpg",
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
    "title": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Green & Brown)",
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
        "url": "/images/products/B0F1Y4J48T/1.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Green & Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y4J48T/2.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Green & Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y4J48T/3.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Green & Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y4J48T/4.jpg",
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
    "title": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Dark Green)",
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
        "url": "/images/products/B0F1Y91HPR/1.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y91HPR/2.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y91HPR/3.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y91HPR/4.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y91HPR/jimeng-2026-04-02-1125-Warm photorealistic lifestyle product ph....png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Dark Green)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1Y91HPR/jimeng-2026-04-02-5812-Photorealistic commercial lifestyle prod....png",
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
    "id": "makimoo-B0F1YCXTRX",
    "asin": "B0F1YCXTRX",
    "title": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Coffee Brown)",
    "handle": "2-pack-outdoor-indoor-wicker-patio-seat-cushion-pad-water-re-b0f1ycxtrx",
    "description": "Outdoor/patio cushion made of durable 100% polyester canvas for garden/patio furniture. Specially treated fabric: Water repellent,oil repellent, UV resistant. Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric. Suitable for indoor or outdoor use; spot clean only; choice of color/pattern. Measure 18.5 Inch in diameters; allow up to 72 hours for cushion to fully expand",
    "descriptionHtml": "<p>Outdoor/patio cushion made of durable 100% polyester canvas for garden/patio furniture</p><p>Specially treated fabric: Water repellent,oil repellent, UV resistant</p><p>Overstuffed for extra comfort and longevity; filling material uses 100% outdoor polyester fabric</p><p>Suitable for indoor or outdoor use; spot clean only; choice of color/pattern</p><p>Measure 18.5 Inch in diameters; allow up to 72 hours for cushion to fully expand</p>",
    "productType": "Dining",
    "tags": [
      "Dining"
    ],
    "availableForSale": true,
    "images": [
      {
        "url": "/images/products/B0F1YCXTRX/1.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Coffee Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1YCXTRX/2.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Coffee Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1YCXTRX/3.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Coffee Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1YCXTRX/4.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Coffee Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1YCXTRX/jimeng-2026-04-02-3037-Photorealistic commercial lifestyle phot....png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Coffee Brown)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F1YCXTRX/jimeng-2026-04-02-5250-Photorealistic commercial lifestyle phot....png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, 18.5-Inch, Dining Chair Cushion, Set of 2 (Coffee Brown)",
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
        "id": "variant-B0F1YCXTRX",
        "title": "Default Title",
        "price": {
          "amount": "49.99",
          "currencyCode": "USD"
        },
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "amazonUrl": "https://www.amazon.com/dp/B0F1YCXTRX"
  },
  {
    "id": "makimoo-B0F62XRB55",
    "asin": "B0F62XRB55",
    "title": "Throw Pillow Inserts 35 x 35cm (14\" x 14\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
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
        "url": "/images/products/B0F62XRB55/1.jpg",
        "altText": "Throw Pillow Inserts 35 x 35cm (14\" x 14\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F62XRB55/2.jpg",
        "altText": "Throw Pillow Inserts 35 x 35cm (14\" x 14\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F62XRB55/4.jpg",
        "altText": "Throw Pillow Inserts 35 x 35cm (14\" x 14\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F62XRB55/5.jpg",
        "altText": "Throw Pillow Inserts 35 x 35cm (14\" x 14\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0F62XRB55/6.jpg",
        "altText": "Throw Pillow Inserts 35 x 35cm (14\" x 14\"), Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (Pack of 2)",
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
    "title": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
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
        "url": "/images/products/B0FNQRRV78/1.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/2.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/3.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/4.jpg",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/5.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/6.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/7.png",
        "altText": "2-Pack Outdoor/Indoor Wicker Patio Seat Cushion Pad, Water Repellent, Dining Chair Cushion, with Ties 17 x 17, Set of 2 (Blue & Red)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0FNQRRV78/8.png",
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
    "title": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (12x20 Inch)",
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
        "url": "/images/products/B0G6M3F7CY/jimeng-2026-03-18-9847-【跨境爆款首选·热带风户外庭院场景】 Commercial e-commerce....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (12x20 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6M3F7CY/jimeng-2026-03-18-9988-【跨境爆款首选·热带风户外庭院场景】 Commercial e-commerce....png",
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
    "title": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
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
        "url": "/images/products/B0G6MPTVFD/1.jpg",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/2.jpg",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/4.jpg",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-2037-Warm home aesthetic photography, main su....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-3365-Warm home aesthetic photography, main su....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-3997-提示词 3：【高级感种草・侘寂风书房场景 _ 极简高级英文描述】 Premium....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-4435-Warm home aesthetic photography, main su....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-4528-Warm home aesthetic photography, main su....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-5831-Commercial e-commerce product photograph....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-7104-Warm home aesthetic photography, main su....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-7939-提示词 3：【高级感种草・侘寂风书房场景 _ 极简高级英文描述】 Premium....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-17-8695-提示词 3：【高级感种草・侘寂风书房场景 _ 极简高级英文描述】 Premium....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-18-3610-【跨境爆款首选·热带风户外庭院场景】 Commercial e-commerce....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-18-5290-【跨境爆款首选·热带风户外庭院场景】 Commercial e-commerce....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-18-7632-【氛围感种草·度假风卧室床头场景】 Premium warm lifestyle....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-1297-Commercial lifestyle photography, photor....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-2290-Commercial lifestyle photography, photor....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-2352-Lifestyle product photography, ultra-rea....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-2671-Commercial product photography, photorea....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-4302-Commercial product photography, photorea....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-4416-Lifestyle product photography, ultra-rea....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-4726-Commercial product photography, photorea....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-5158-Commercial product photography, photorea....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-5278-Commercial lifestyle photography, photor....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-5503-2 pieces of plump white rectangular diam....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-6098-Lifestyle product photography, ultra-rea....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-21-8741-Lifestyle product photography, ultra-rea....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-1726-Photorealistic commercial product photog....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-2240-Ultra-realistic commercial product photo....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-2489-Ultra-realistic commercial product photo....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-3081-Warm photorealistic lifestyle shot, 2 wh....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-4001-Photorealistic commercial product photog....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-4075-Photorealistic commercial product photog....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-4079-Warm photorealistic lifestyle shot, 2 wh....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-5714-Photorealistic commercial product photog....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-7029-Ultra-realistic commercial product photo....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-7148-Ultra-realistic commercial product photo....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-7785-Photorealistic commercial product photog....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-9232-Photorealistic commercial product photog....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-9330-Photorealistic commercial product photog....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-22-9924-Warm photorealistic lifestyle shot, 2 wh....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-1276-Hyper-realistic commercial product photo....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-4564-Photorealistic professional commercial p....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-5427-Hyper-realistic commercial product photo....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-6175-Photorealistic professional commercial p....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-6849-Hyper-realistic commercial product photo....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-9076-Photorealistic professional commercial p....png",
        "altText": "Throw Pillow Inserts Pack of 2, Cushion Inserts, Hollowfibre Filling for Sofa, Bedding Cushion Pads (18x18 Inch)",
        "width": 800,
        "height": 800
      },
      {
        "url": "/images/products/B0G6MPTVFD/jimeng-2026-03-26-9965-Hyper-realistic commercial product photo....png",
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
  }
];

import { SHOPIFY_MAP } from './shopify-map';

/** Merge local product data with Shopify data (prices, availability, variant IDs) */
export function enrichProductsWithShopifyData(products: MakimooProduct[]): MakimooProduct[] {
  return products.map(product => {
    const asinLower = product.asin.toLowerCase();
    const shopifyEntry = SHOPIFY_MAP[asinLower];
    if (!shopifyEntry) {
      return { ...product, hasShopifyData: false };
    }
    return {
      ...product,
      hasShopifyData: true,
      shopifyVariantId: shopifyEntry.variantId,
      shopifyAvailable: shopifyEntry.availableForSale,
      // Use Shopify price unless it's $0.0 (needs fix), then fallback to local price
      shopifyPrice: shopifyEntry.priceNeedsFix ? product.priceRange.minVariantPrice.amount : shopifyEntry.price,
      shopifyCurrencyCode: shopifyEntry.currencyCode,
      shopifyImages: shopifyEntry.images,
    };
  });
}

export function getProductByHandle(handle: string): MakimooProduct | undefined {
  const product = PRODUCTS_DATA.find(p => p.handle === handle);
  if (!product) return undefined;
  return enrichProductsWithShopifyData([product])[0];
}

export function getProductsByCategory(category: string): MakimooProduct[] {
  let filtered: MakimooProduct[];
  if (!category) {
    filtered = PRODUCTS_DATA;
  } else {
    filtered = PRODUCTS_DATA.filter(p =>
      p.productType.toLowerCase() === category.toLowerCase() ||
      p.tags.some(t => t.toLowerCase().includes(category.toLowerCase()))
    );
  }
  return enrichProductsWithShopifyData(filtered);
}

export function searchProducts(query: string): MakimooProduct[] {
  const q = query.toLowerCase();
  const filtered = PRODUCTS_DATA.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
  return enrichProductsWithShopifyData(filtered);
}
