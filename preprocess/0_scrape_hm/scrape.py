import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options


def scrape_hm_hover_images():
    options = Options()
    # options.add_argument("--headless")  # Optional: remove this to see the browser
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(options=options)
    driver.get("https://www2.hm.com/sv_se/herr/produkter/se-alla.html")

    # Scroll to load more products
    for _ in range(10):  # You can increase the range to load more products
        driver.execute_script("window.scrollBy(0, 3000);")
        time.sleep(1.5)

    product_elements = driver.find_elements(By.CSS_SELECTOR, ".product-item")
    products = []

    for el in product_elements:
        try:
            img_tag = el.find_element(By.TAG_NAME, "img")
            link_tag = el.find_element(By.TAG_NAME, "a")

            main_img = img_tag.get_attribute("src")
            hover_img = img_tag.get_attribute("data-altimage")
            href = link_tag.get_attribute("href")

            products.append(
                {
                    "product_url": href,
                    "main_img": main_img,
                    "hover_img": (
                        f"https://www2.hm.com{hover_img}" if hover_img else None
                    ),
                }
            )
        except Exception as e:
            print("Skipped a product due to error:", e)

    driver.quit()

    return products


if __name__ == "__main__":
    results = scrape_hm_hover_images()
    for product in results:
        print("Product:", product["product_url"])
        print("Main Image:", product["main_img"])
        print("Hover Image:", product["hover_img"])
        print("-" * 60)
