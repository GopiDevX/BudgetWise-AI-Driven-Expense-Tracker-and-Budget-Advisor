import re

filepath = r'c:\Projects\Infosys Springboard Intern\BudgetWise\frontend\src\pages\Register.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix spacing in CSS properties like 'font - size' -> 'font-size'
properties_to_fix = [
    'font - size', 'margin - top', 'text - align', 'font - weight', 
    'align - items', 'justify - content', 'border - radius', 'border - color',
    'margin - bottom', 'margin - left', 'box - shadow', 'flex - direction',
    'text - decoration', 'cursor: not - allowed'
]

for prop in properties_to_fix:
    content = content.replace(prop, prop.replace(' - ', '-'))

# Update RegisterCard padding
content = content.replace('padding: 2rem 2.5rem;', 'padding: 1.5rem 2.5rem; /* Reduced to save vertical space */')

# Update Form layout to allow scrolling internally
old_form = '''const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;'''

new_form = '''const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.5rem;
  
  /* Custom Scrollbar for the form */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;'''

content = content.replace(old_form, new_form)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed CSS properties and added Form scrolling.")
