import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export service for generating CSV and PDF files from transactions
 */
const exportService = {
    /**
     * Export transactions to CSV file
     * @param {Array} transactions - Array of transaction objects
     * @param {string} filename - Name of the downloaded file (without extension)
     */
    exportToCSV(transactions, filename = 'transactions') {
        if (!transactions || transactions.length === 0) {
            alert('No transactions to export');
            return;
        }

        // CSV headers
        const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];

        // Convert transactions to CSV rows
        const rows = transactions.map(tx => [
            new Date(tx.date).toLocaleDateString('en-IN'),
            `"${(tx.description || '').replace(/"/g, '""')}"`, // Escape quotes
            tx.category || 'Uncategorized',
            tx.type === 'income' ? 'Income' : 'Expense',
            tx.type === 'income' ? tx.amount : -Math.abs(tx.amount)
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Export transactions to PDF report
     * @param {Array} transactions - Array of transaction objects
     * @param {string} filename - Name of the downloaded file (without extension)
     */
    exportToPDF(transactions, filename = 'transactions_report') {
        if (!transactions || transactions.length === 0) {
            alert('No transactions to export');
            return;
        }

        // Create PDF document
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Title
        doc.setFontSize(20);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text('BudgetWise Transaction Report', pageWidth / 2, 20, { align: 'center' });

        // Date range
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139); // slate-500
        const today = new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.text(`Generated on: ${today}`, pageWidth / 2, 28, { align: 'center' });

        // Calculate summary
        const totalIncome = transactions
            .filter(tx => tx.type === 'income')
            .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        const totalExpenses = transactions
            .filter(tx => tx.type === 'expense')
            .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);

        const balance = totalIncome - totalExpenses;

        // Summary section
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text('Summary', 14, 42);

        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Total Income: Rs. ${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 14, 50);
        doc.text(`Total Expenses: Rs. ${totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 14, 56);
        doc.setTextColor(balance >= 0 ? 34 : 220, balance >= 0 ? 197 : 38, balance >= 0 ? 94 : 38);
        doc.text(`Net Balance: Rs. ${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 14, 62);

        // Transaction table
        const tableData = transactions.map(tx => [
            new Date(tx.date).toLocaleDateString('en-IN'),
            tx.description || '-',
            tx.category || 'Uncategorized',
            tx.type === 'income' ? 'Income' : 'Expense',
            `Rs. ${Math.abs(parseFloat(tx.amount)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
        ]);

        autoTable(doc, {
            startY: 70,
            head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [99, 102, 241], // indigo-500
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252] // slate-50
            },
            styles: {
                fontSize: 9,
                cellPadding: 4
            },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 50 },
                2: { cellWidth: 35 },
                3: { cellWidth: 25 },
                4: { cellWidth: 30, halign: 'right' }
            }
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${pageCount} - BudgetWise`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Save PDF
        doc.save(`${filename}.pdf`);
    },

    /**
     * Get formatted filename with date
     */
    getFilename(prefix = 'transactions') {
        const date = new Date().toISOString().split('T')[0];
        return `${prefix}_${date}`;
    }
};

export default exportService;
