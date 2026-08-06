import os
from html2image import Html2Image

output_dir = os.path.abspath("docs/diagrams")

hti = Html2Image(
    browser_executable=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    output_path=output_dir,
    size=(1480, 1850),
    custom_flags=['--force-device-scale-factor=2', '--hide-scrollbars', '--disable-gpu']
)

html_files = [
    ("architecture.html", "architecture.png"),
    ("database_schema.html", "database_schema.png"),
    ("class_diagram.html", "class_diagram.png"),
    ("directory_structure.html", "directory_structure.png")
]

for html_fname, png_fname in html_files:
    html_path = os.path.join(output_dir, html_fname)
    if os.path.exists(html_path):
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        hti.screenshot(html_str=html_content, save_as=png_fname)
        print(f"Successfully generated docs/diagrams/{png_fname}")
