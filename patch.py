import os
import glob

files = glob.glob('src/components/*.jsx')
for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Simple replace to add 'slide' class to main section
    content = content.replace('className="hero"', 'className="hero slide"')
    content = content.replace('className="prologue section"', 'className="prologue section slide"')
    content = content.replace('className="workflow section bg-primary"', 'className="workflow section bg-primary slide"')
    content = content.replace('className="specialists section bg-light"', 'className="specialists section bg-light slide"')
    content = content.replace('className="packages section"', 'className="packages section slide"')
    content = content.replace('className="addons section bg-primary"', 'className="addons section bg-primary slide"')
    content = content.replace('className="contact section bg-light text-center"', 'className="contact section bg-light text-center slide"')
    
    with open(f, 'w') as file:
        file.write(content)
print("Patched all components with slide class.")
