import os
from html2image import Html2Image

output_dir = os.path.abspath("docs/diagrams")
html_file = os.path.join(output_dir, "architecture.html")

hti = Html2Image(
    browser_executable=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    output_path=output_dir,
    size=(1480, 1800),
    custom_flags=['--force-device-scale-factor=2', '--hide-scrollbars', '--disable-gpu']
)

with open(html_file, 'r', encoding='utf-8') as f:
    html_content = f.read()

hti.screenshot(html_str=html_content, save_as="architecture.png")
print("Successfully generated docs/diagrams/architecture.png")
