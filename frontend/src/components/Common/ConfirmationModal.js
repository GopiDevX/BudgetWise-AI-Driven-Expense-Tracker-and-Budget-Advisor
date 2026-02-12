import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

// --- Styled Components ---

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1050; // Higher than standard modals if needed
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalCard = styled.div`
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 1.25rem;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: ${slideUp} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const ModalContent = styled.div`
  padding: 2rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: ${props => props.type === 'danger' ? '#fee2e2' : '#dbeafe'};
  color: ${props => props.type === 'danger' ? '#dc2626' : '#2563eb'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  padding: 0 1.5rem 1.5rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f1f5f9;
  color: #475569;
  
  &:hover:not(:disabled) {
    background-color: #e2e8f0;
    color: #1e293b;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: ${props => props.type === 'danger' ? '#ef4444' : '#3b82f6'};
  color: white;
  box-shadow: 0 4px 6px -1px ${props => props.type === 'danger' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.type === 'danger' ? '#dc2626' : '#2563eb'};
    transform: translateY(-1px);
    box-shadow: 0 6px 8px -1px ${props => props.type === 'danger' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger', // 'danger' or 'info'
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <Overlay onClick={isLoading ? null : onClose}>
            <ModalCard onClick={e => e.stopPropagation()}>
                <ModalContent>
                    <IconWrapper type={type}>
                        <FiAlertTriangle />
                    </IconWrapper>
                    <Title>{title}</Title>
                    <Message>{message}</Message>
                </ModalContent>

                <ButtonGroup>
                    <CancelButton onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </CancelButton>
                    <ConfirmButton
                        onClick={onConfirm}
                        type={type}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </ConfirmButton>
                </ButtonGroup>
            </ModalCard>
        </Overlay>
    );
};

export default ConfirmationModal;
