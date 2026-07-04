import re

# Read the log file
with open("C:\\Users\\ADMIN\\.gemini\\antigravity-ide\\brain\\343e3402-94b6-4651-8cbf-a8dc68cda82c\\.system_generated\\tasks\\task-315.log", "r", encoding="utf-8") as f:
    lines = f.readlines()

css_matches = []
for line in lines:
    m = re.match(r'^\.\\css\\(style|base)\.css:(\d+):(.*)$', line.strip())
    if m:
        filename = m.group(1) + ".css"
        line_num = m.group(2)
        content = m.group(3)
        css_matches.append(f"{filename}:{line_num}: {content.strip()}")

# Write to text file using utf-8
with open("scratch/matches_utf8.txt", "w", encoding="utf-8") as out:
    out.write(f"Total CSS matches: {len(css_matches)}\n")
    for match in css_matches:
        out.write(match + "\n")

