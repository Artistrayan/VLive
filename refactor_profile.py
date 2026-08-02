import re

with open('/app/applet/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make Trending Live horizontal slider
old_grid = '                {/* Stream Cards Grid */}\n                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">'
new_slider = '                {/* Stream Cards Horizontal Slider */}\n                <div className="flex items-center gap-4 overflow-x-auto pb-2.5 no-scrollbar">'

content = content.replace(old_grid, new_slider)

# Update stream card container inside streams map to be w-72 shrink-0
old_card = 'className="card-3d rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/90 group hover:border-pink-500/50 transition duration-300 flex flex-col"'
new_card = 'className="w-72 sm:w-80 shrink-0 card-3d rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/90 group hover:border-pink-500/50 transition duration-300 flex flex-col shadow-xl"'

content = content.replace(old_card, new_card)

with open('/app/applet/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Home live streams converted to horizontal slider.")
