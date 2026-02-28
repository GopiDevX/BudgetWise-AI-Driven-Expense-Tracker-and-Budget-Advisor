import re

filepath = r'c:\Projects\Infosys Springboard Intern\BudgetWise\frontend\src\pages\Register.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

good_css = r'''const Spinner = styled.div`
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  vertical-align: middle;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const GradientDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, 
      rgba(226, 232, 240, 0), 
      rgba(226, 232, 240, 1), 
      rgba(226, 232, 240, 0)
    );
  }
  
  &::before { margin-right: 1rem; }
  &::after { margin-left: 1rem; }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.875rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
  text-align: center;
`;

const ResendLink = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
  
  &:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
  
  &:disabled {
    color: #94a3b8;
    cursor: not-allowed;
    text-decoration: none;
  }
`;

const OtpContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const OtpBox = styled.input`
  width: 50px;
  height: 55px;
  padding: 0;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  background: #ffffff;
  color: #0f172a;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
    transform: scale(1.05);
  }

  &::placeholder {
    color: #cbd5e1;
    font-weight: 400;
    font-size: 1rem;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1.25rem;
  }
`;

const StrengthMeter = styled.div`
  display: flex;
  gap: 4px;
  height: 4px;
  margin-top: 0.5rem;
`;

const StrengthSegment = styled.div`
  flex: 1;
  background: ${props => props.$active ? props.$color : '#e2e8f0'};
  border-radius: 2px;
  transition: background 0.3s ease;
  
  &.active {
    background: ${props => {
      if (props.$score <= 1) return '#ef4444';
      if (props.$score === 2) return '#f59e0b';
      if (props.$score === 3) return '#84cc16';
      return '#10b981';
    }};
  }
`;
'''

new_content = re.sub(r'const Spinner = styled\.div`.*?const StrengthSegment = styled\.div`\n(?:.*?)\n`;', good_css, content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Rewrite complete. Double check the file.')
