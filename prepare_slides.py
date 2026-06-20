import os
import shutil

src_dir = "../JPEG FMO General package"
dest_dir = "public/slides"

os.makedirs(dest_dir, exist_ok=True)

# Define the sequence of files we want
slide_mapping = [
    ("1.png", "slide-01.png"),
    ("2.png", "slide-02.png"),
    ("3.png", "slide-03.png"),
    ("4.png", "slide-04.png"),
    ("5.png", "slide-05.png"),
    ("6.png", "slide-06.png"),
    ("7.png", "slide-07.png"),
    ("8.png", "slide-08.png"),
    ("9.png", "slide-09.png"),
    ("10.png", "slide-10.png"),
    ("11.png", "slide-11.png"),
    ("12.png", "slide-12.png"),
    ("13.png", "slide-13.png"),
    ("14.png", "slide-14.png"),
    ("15C 500 pax.png", "slide-15.png"),
    ("16C 500 pax.png", "slide-16.png"),
    ("17.png", "slide-17.png"),
    ("18.png", "slide-18.png"),
    ("19.png", "slide-19.png"),
    ("20.png", "slide-20.png"),
    ("21.png", "slide-21.png"),
    ("22.png", "slide-22.png"),
    ("23.png", "slide-23.png"),
    ("24.png", "slide-24.png"),
    ("25.png", "slide-25.png")
]

for src, dest in slide_mapping:
    src_path = os.path.join(src_dir, src)
    dest_path = os.path.join(dest_dir, dest)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dest_path)
        print(f"Copied {src} -> {dest}")
    else:
        print(f"Warning: Not found {src_path}")

