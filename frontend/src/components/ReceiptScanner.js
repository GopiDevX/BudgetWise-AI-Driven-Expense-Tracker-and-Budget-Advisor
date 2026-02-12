import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import Tesseract from 'tesseract.js';
import { FiCamera, FiUpload, FiX, FiLoader, FiCheck, FiAlertCircle } from 'react-icons/fi';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.$isDragging ? '#6366f1' : '#e2e8f0'};
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$isDragging ? '#eef2ff' : '#f8fafc'};

  &:hover {
    border-color: #6366f1;
    background: #eef2ff;
  }
`;

const UploadIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UploadText = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  object-fit: contain;
`;

const ProgressContainer = styled.div`
  margin: 1.5rem 0;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
`;

const ProgressText = styled.p`
  color: #64748b;
  font-size: 0.85rem;
  text-align: center;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ResultSection = styled.div`
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-top: 1rem;
`;

const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

const ResultLabel = styled.span`
  color: #64748b;
  font-size: 0.9rem;
`;

const ResultValue = styled.span`
  color: #0f172a;
  font-weight: 600;
  font-size: 0.95rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: white;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;

  &:hover {
    background: #f8fafc;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

/**
 * ReceiptScanner Component
 * Handles receipt image upload, OCR processing, and data extraction
 */
const ReceiptScanner = ({ isOpen, onClose, onScanComplete }) => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState('');
    const [extractedData, setExtractedData] = useState(null);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Parse OCR text to extract transaction data
    const parseReceiptText = (text) => {
        const lines = text.split('\n').filter(line => line.trim());

        // Extract amount - look for patterns like ₹123, Rs. 456, Total: 789, Grand Total, etc.
        let amount = null;
        // Create a cleaner version of text for parsing
        const cleanText = text.toLowerCase().replace(/[^\w\s.,₹]/g, ' ');
        console.log("Raw OCR Text:", text);
        console.log("Cleaned Text:", cleanText);

        // Strategy 1: Specific keyword matching
        const amountPatterns = [
            /(?:total|grand\s*total|amount|amt|net\s*amount|payable|bill\s*amount|amount\s*incl.*taxes)[:\s]*[₹rs.]*\s*([\d,]+\.?\d*)/gi,
            /(?:sub\s*total)[:\s]*[₹rs.]*\s*([\d,]+\.?\d*)/gi, // Fallback to subtotal
            /[₹rs.]\s*([\d,]+\.?\d*)/gi,
        ];

        for (const pattern of amountPatterns) {
            const matches = [...text.matchAll(pattern)];
            if (matches.length > 0) {
                // Get the last match (usually the bottom-most total)
                const lastMatch = matches[matches.length - 1];
                const parsed = parseFloat(lastMatch[1].replace(/,/g, ''));
                if (!isNaN(parsed) && parsed > 0) {
                    amount = parsed;
                    console.log("Found matches with strategy 1:", parsed);
                    break;
                }
            }
        }

        // Strategy 2: Fallback - Find the largest number that looks like a price
        if (!amount) {
            console.log("Strategy 1 failed. Trying Strategy 2 (Max Number)...");
            // Match any number:
            // 1. Starts with digits
            // 2. Can have commas
            // 3. Can have a decimal part
            const numberPattern = /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b/g;
            const numbers = [];
            let match;
            while ((match = numberPattern.exec(text)) !== null) {
                // Remove commas before parsing
                const numStr = match[0].replace(/,/g, '');
                const num = parseFloat(numStr);

                // Filter out unlikely numbers (like years, phone numbers if they get parsed as one block, etc.)
                // We assume a transaction amount is likely between 0 and 1,000,000.
                // We also avoid numbers that look like years (e.g., 2024, 2025) unless they have decimals.
                const isYearLike = num >= 1900 && num <= 2100 && !match[0].includes('.');

                if (!isNaN(num) && num > 0 && num < 1000000 && !isYearLike) {
                    numbers.push(num);
                }
            }

            console.log("Found potential numbers:", numbers);

            if (numbers.length > 0) {
                // Heuristic: Total is usually the maximum value found
                amount = Math.max(...numbers);
            }
        }

        // Extract date - look for DD/MM/YYYY or DD-MM-YYYY patterns
        let date = null;
        const datePatterns = [
            /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/g,
            /(\d{2,4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/g,
        ];

        for (const pattern of datePatterns) {
            const match = pattern.exec(text);
            if (match) {
                let day, month, year;
                if (match[1].length === 4) {
                    // YYYY-MM-DD format
                    year = match[1];
                    month = match[2];
                    day = match[3];
                } else if (match[3].length === 4) {
                    // DD-MM-YYYY format
                    day = match[1];
                    month = match[2];
                    year = match[3];
                } else {
                    // DD-MM-YY format
                    day = match[1];
                    month = match[2];
                    year = match[3].length === 2 ? '20' + match[3] : match[3];
                }

                const parsedDate = new Date(year, month - 1, day);
                if (!isNaN(parsedDate.getTime())) {
                    date = parsedDate.toISOString().split('T')[0];
                    break;
                }
            }
        }

        // Extract merchant/description - usually the first meaningful line
        let merchant = null;
        for (const line of lines.slice(0, 5)) {
            const cleaned = line.trim();
            // Skip lines that are mostly numbers or very short
            if (cleaned.length > 3 && !/^\d+$/.test(cleaned) && !/^[₹rs.\d\s,]+$/i.test(cleaned)) {
                merchant = cleaned.substring(0, 50); // Limit length
                break;
            }
        }

        return {
            amount: amount || 0,
            date: date || new Date().toISOString().split('T')[0],
            description: merchant || 'Receipt scan',
            rawText: text
        };
    };

    // Handle file selection
    const handleFileSelect = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        setError('');
        setImage(file);
        setExtractedData(null);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    // Process image with OCR
    const processImage = async () => {
        if (!image) return;

        setIsProcessing(true);
        setProgress(0);
        setError('');

        try {
            console.log("Starting Tesseract OCR with improved config...");
            const result = await Tesseract.recognize(image, 'eng', {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100));
                        setProgressText('Recognizing text...');
                    } else if (m.status === 'loading language traineddata') {
                        setProgressText('Loading OCR engine...');
                    } else {
                        setProgressText(m.status);
                    }
                },
                // Improved Tesseract configuration for receipts
                tessedit_pageseg_mode: '6', // Assume a single uniform block of text
                tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz₹$.,/- :()&',
            });

            console.log("OCR Complete. Confidence:", result.data.confidence);
            console.log("Full OCR Text Length:", result.data.text.length);
            console.log("Full OCR Text:", result.data.text);

            // Validate OCR output
            if (!result.data.text || result.data.text.trim().length < 5) {
                console.error("OCR returned insufficient text!");
                setError('Could not extract text from image. Please try a clearer, well-lit photo with the receipt flat and in focus.');
                setIsProcessing(false);
                return;
            }

            const extracted = parseReceiptText(result.data.text);
            setExtractedData(extracted);
        } catch (err) {
            console.error('OCR Error:', err);
            setError('Failed to process image. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle drag events
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    // Use extracted data
    const handleUseData = () => {
        if (extractedData && onScanComplete) {
            onScanComplete({
                amount: extractedData.amount,
                date: extractedData.date,
                description: extractedData.description,
                type: 'expense',
                category: 'Other Expense'
            });
        }
        handleClose();
    };

    // Reset and close
    const handleClose = () => {
        setImage(null);
        setImagePreview(null);
        setExtractedData(null);
        setProgress(0);
        setError('');
        setIsProcessing(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={handleClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>📸 Scan Receipt</ModalTitle>
                    <CloseButton onClick={handleClose}>
                        <FiX />
                    </CloseButton>
                </ModalHeader>

                {!imagePreview ? (
                    <UploadArea
                        $isDragging={isDragging}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadIcon>
                            <FiCamera size={28} />
                        </UploadIcon>
                        <UploadText>
                            <strong>Click to upload</strong> or drag and drop<br />
                            <span style={{ fontSize: '0.85rem' }}>PNG, JPG up to 5MB</span>
                        </UploadText>
                        <HiddenInput
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                        />
                    </UploadArea>
                ) : (
                    <>
                        <PreviewImage src={imagePreview} alt="Receipt preview" />

                        {isProcessing && (
                            <ProgressContainer>
                                <ProgressBar>
                                    <ProgressFill $progress={progress} />
                                </ProgressBar>
                                <ProgressText>
                                    <FiLoader className="spinning" /> {progressText} {progress}%
                                </ProgressText>
                            </ProgressContainer>
                        )}

                        {extractedData && (
                            <ResultSection>
                                <ResultItem>
                                    <ResultLabel>Amount</ResultLabel>
                                    <ResultValue>₹{extractedData.amount.toFixed(2)}</ResultValue>
                                </ResultItem>
                                <ResultItem>
                                    <ResultLabel>Date</ResultLabel>
                                    <ResultValue>{extractedData.date}</ResultValue>
                                </ResultItem>
                                <ResultItem>
                                    <ResultLabel>Description</ResultLabel>
                                    <ResultValue>{extractedData.description}</ResultValue>
                                </ResultItem>
                            </ResultSection>
                        )}

                        {error && (
                            <ErrorMessage>
                                <FiAlertCircle /> {error}
                            </ErrorMessage>
                        )}

                        <ButtonGroup>
                            <SecondaryButton onClick={() => {
                                setImagePreview(null);
                                setImage(null);
                                setExtractedData(null);
                            }}>
                                <FiUpload size={16} /> New Image
                            </SecondaryButton>

                            {!extractedData ? (
                                <PrimaryButton onClick={processImage} disabled={isProcessing}>
                                    {isProcessing ? (
                                        <>
                                            <FiLoader className="spinning" /> Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FiCamera size={16} /> Scan Receipt
                                        </>
                                    )}
                                </PrimaryButton>
                            ) : (
                                <PrimaryButton onClick={handleUseData}>
                                    <FiCheck size={16} /> Use This Data
                                </PrimaryButton>
                            )}
                        </ButtonGroup>
                    </>
                )}
            </ModalContent>
        </ModalOverlay>
    );
};

export default ReceiptScanner;
