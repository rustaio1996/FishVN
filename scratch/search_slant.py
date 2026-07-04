import os

search_terms = ["skew", "rotate", "transform"]
exclude_dirs = [".git", "node_modules", ".agents"]

for root, dirs, files in os.walk("."):
    # Filter directories
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        filepath = os.path.join(root, file)
        try:
            # Try UTF-8 first
            with open(filepath, 'r', encoding='utf-8') as f:
                lines = f.readlines()
        except UnicodeDecodeError:
            try:
                # Try UTF-16 if UTF-8 fails
                with open(filepath, 'r', encoding='utf-16') as f:
                    lines = f.readlines()
            except Exception:
                continue
        except Exception:
            continue

        for i, line in enumerate(lines):
            for term in search_terms:
                if term in line.lower():
                    # print matching file and line (excluding text-transform unless it also has rotate/skew)
                    if "text-transform" in line.lower() and not any(t in line.lower() for t in ["skew", "rotate"]):
                        continue
                    print(f"{filepath}:{i+1}: {line.strip()}")
