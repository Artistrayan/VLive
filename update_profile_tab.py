import re

with open('src/components/Tabs/ProfileTab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add formatNum helper inside ProfileTab
format_num_code = """  const formatNum = (num) => {
    const n = Number(num) || 0;
    const lang = safeStorage.getItem('vlive_app_lang') || 'en';
    if (lang === 'fa') return n.toLocaleString('fa-IR');
    if (lang === 'ar') return n.toLocaleString('ar-EG');
    return n.toLocaleString('en-US');
  };
"""

if "const formatNum =" not in content:
    # Insert right after const { isSuperAdmin ... }
    content = content.replace("const { isSuperAdmin, isEditMode, setIsEditMode } = useVisualUiEditor();", "const { isSuperAdmin, isEditMode, setIsEditMode } = useVisualUiEditor();\n" + format_num_code)

print("formatNum helper inserted successfully!")
