import fitz # PyMuPDF
import io
from PIL import Image
import os

pdf_file = "../500 FMO General package .pdf"
output_dir = "./public/assets"

os.makedirs(output_dir, exist_ok=True)

pdf_document = fitz.open(pdf_file)
image_count = 0

for page_index in range(len(pdf_document)):
    page = pdf_document[page_index]
    image_list = page.get_images(full=True)
    
    if image_list:
        print(f"[+] Found a total of {len(image_list)} images in page {page_index}")
    else:
        print(f"[!] No images found on page {page_index}")
        
    for image_index, img in enumerate(image_list, start=1):
        xref = img[0]
        base_image = pdf_document.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        # Load it to PIL to check if it's a valid image and maybe convert to PNG/JPG
        try:
            image = Image.open(io.BytesIO(image_bytes))
            # Save it
            image_name = f"page_{page_index}_img_{image_index}.{image_ext}"
            image_path = os.path.join(output_dir, image_name)
            image.save(image_path)
            print(f"[+] Image saved as {image_path}")
            image_count += 1
        except Exception as e:
            print(f"[-] Error saving image {image_index} on page {page_index}: {e}")

print(f"Total {image_count} images extracted.")
