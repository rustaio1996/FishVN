import os
from PIL import Image

def main():
    src_path = r"C:\Users\ADMIN\.gemini\antigravity-ide\brain\2d546553-de6f-4145-9ea3-67a8ba59f7fb\media__1782992251408.jpg"
    dest_dir = r"d:\FishVN\build"
    
    if not os.path.exists(src_path):
        print(f"Source image not found at {src_path}")
        return
        
    print(f"Opening source image: {src_path}")
    img = Image.open(src_path)
    
    # Crop to square if not already square
    width, height = img.size
    print(f"Original size: {width}x{height}")
    if width != height:
        min_dim = min(width, height)
        left = (width - min_dim) // 2
        top = (height - min_dim) // 2
        right = left + min_dim
        bottom = top + min_dim
        print(f"Cropping image to square: ({left}, {top}, {right}, {bottom})")
        img = img.crop((left, top, right, bottom))
        width = height = min_dim
        
    # Sizes to generate
    sizes = [16, 32, 48, 64, 128, 256]
    
    # Save individual PNG files
    for size in sizes:
        resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
        out_png = os.path.join(dest_dir, f"icon-{size}.png")
        resized_img.save(out_png, format="PNG")
        print(f"Saved: {out_png}")
        
        # Also copy 256x256 to icon.png
        if size == 256:
            out_icon_png = os.path.join(dest_dir, "icon.png")
            resized_img.save(out_icon_png, format="PNG")
            print(f"Saved: {out_icon_png}")
            
    # Save multi-size ICO file
    out_ico = os.path.join(dest_dir, "icon.ico")
    ico_img = img.resize((256, 256), Image.Resampling.LANCZOS)
    ico_img.save(
        out_ico,
        format="ICO",
        sizes=[(s, s) for s in sizes]
    )
    print(f"Saved multi-size ICO: {out_ico}")
    print("Icon processing completed successfully.")

if __name__ == "__main__":
    main()
