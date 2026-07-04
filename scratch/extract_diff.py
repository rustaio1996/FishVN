import json

path = r"C:\Users\ADMIN\.gemini\antigravity-ide\brain\d1bc72a4-7c5f-46b4-b221-91777834572c\.system_generated\logs\transcript_full.jsonl"
with open(path, "r", encoding="utf-8") as f:
    for line in f:
        obj = json.loads(line)
        if obj.get("step_index") == 61:
            print(json.dumps(obj, indent=2))
            with open("d:\\FishVN\\scratch\\step_61.json", "w", encoding="utf-8") as out:
                json.dump(obj, out, indent=2)
            print("Successfully wrote step_61.json!")
            break
