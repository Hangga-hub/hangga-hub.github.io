// script.js for tools/pdf-merger-splitter/

document.addEventListener('DOMContentLoaded', () => {
    // PDF Merger Elements
    const mergePdfUpload = document.getElementById('mergePdfUpload');
    const uploadMergeBtn = document.getElementById('uploadMergeBtn');
    const mergeFileNameDisplay = document.getElementById('mergeFileNameDisplay');
    const mergeFileList = document.getElementById('mergeFileList');
    const mergePdfBtn = document.getElementById('mergePdfBtn');

    // PDF Splitter Elements
    const splitPdfUpload = document.getElementById('splitPdfUpload');
    const uploadSplitBtn = document.getElementById('uploadSplitBtn');
    const splitFileNameDisplay = document.getElementById('splitFileNameDisplay');
    const pageRangesInput = document.getElementById('pageRanges');
    const splitPdfBtn = document.getElementById('splitPdfBtn');
    const splitResultsDiv = document.getElementById('splitResults');

    // General Elements
    const clearAllBtn = document.getElementById('clearAllBtn');
    const messageBox = document.getElementById('messageBox');
    const loadingOverlay = document.getElementById('loadingOverlay');

    let mergeFiles = []; // Stores { file: File, arrayBuffer: ArrayBuffer } for merging
    let splitFile = null; // Stores { file: File, arrayBuffer: ArrayBuffer } for splitting

    // Function to display messages
    function showMessage(message, type = 'info') {
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.className = `message-box ${type}`;
            messageBox.style.display = 'block';
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 3000);
        } else {
            console.warn("Message box element not found.");
        }
    }

    // Show/hide loading overlay
    function toggleLoading(show) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    // --- PDF Merger Logic ---
    uploadMergeBtn.addEventListener('click', () => mergePdfUpload.click());

    mergePdfUpload.addEventListener('change', async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) {
            showMessage('No PDF files selected for merging.', 'info');
            return;
        }

        toggleLoading(true);
        let newFilesCount = 0;
        for (const file of files) {
            if (file.type !== 'application/pdf') {
                showMessage(`Skipping non-PDF file: ${file.name}`, 'warning');
                continue;
            }
            try {
                const arrayBuffer = await file.arrayBuffer();
                mergeFiles.push({ file, arrayBuffer });
                newFilesCount++;
            } catch (error) {
                console.error(`Error reading ${file.name}:`, error);
                showMessage(`Failed to read file: ${file.name}.`, 'error');
            }
        }
        toggleLoading(false);
        renderMergeFileList();
        showMessage(`${newFilesCount} PDF(s) added for merging. Total: ${mergeFiles.length}`, 'success');
    });

    function renderMergeFileList() {
        mergeFileList.innerHTML = '';
        if (mergeFiles.length > 0) {
            mergeFileList.style.display = 'block';
            mergeFiles.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'file-list-item';
                div.innerHTML = `
                    <span class="file-name">${item.file.name}</span>
                    <button class="remove-btn" data-index="${index}" title="Remove file"><i class="ri-close-line"></i></button>
                `;
                mergeFileList.appendChild(div);
            });
            mergeFileNameDisplay.textContent = `${mergeFiles.length} PDF(s) selected.`;
            mergePdfBtn.style.display = 'inline-block';
        } else {
            mergeFileList.style.display = 'none';
            mergeFileNameDisplay.textContent = '';
            mergePdfBtn.style.display = 'none';
        }
    }

    mergeFileList.addEventListener('click', (event) => {
        if (event.target.closest('.remove-btn')) {
            const index = parseInt(event.target.closest('.remove-btn').dataset.index);
            if (!isNaN(index)) {
                mergeFiles.splice(index, 1);
                renderMergeFileList();
                showMessage('PDF removed from merge list.', 'info');
            }
        }
    });

    mergePdfBtn.addEventListener('click', async () => {
        if (mergeFiles.length < 2) {
            showMessage('Please select at least two PDF files to merge.', 'error');
            return;
        }

        toggleLoading(true);
        try {
            const mergedPdf = await PDFLib.PDFDocument.create();
            for (const item of mergeFiles) {
                const pdfDoc = await PDFLib.PDFDocument.load(item.arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            saveAs(blob, 'merged_document.pdf');
            showMessage('PDFs merged successfully!', 'success');
        } catch (error) {
            console.error('Error merging PDFs:', error);
            showMessage('Failed to merge PDFs. Please ensure they are valid PDF files.', 'error');
        } finally {
            toggleLoading(false);
        }
    });

    // --- PDF Splitter Logic ---
    uploadSplitBtn.addEventListener('click', () => splitPdfUpload.click());

    splitPdfUpload.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) {
            showMessage('No PDF file selected for splitting.', 'info');
            splitFile = null;
            splitFileNameDisplay.textContent = '';
            splitPdfBtn.style.display = 'none';
            return;
        }

        if (file.type !== 'application/pdf') {
            showMessage('Please select a valid PDF file.', 'error');
            splitFile = null;
            splitFileNameDisplay.textContent = '';
            splitPdfBtn.style.display = 'none';
            return;
        }

        toggleLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            splitFile = { file, arrayBuffer };
            splitFileNameDisplay.textContent = `Selected: ${file.name}`;
            splitPdfBtn.style.display = 'inline-block';
            showMessage(`PDF "${file.name}" loaded for splitting.`, 'success');
        } catch (error) {
            console.error(`Error reading ${file.name}:`, error);
            showMessage(`Failed to read file: ${file.name}.`, 'error');
            splitFile = null;
        } finally {
            toggleLoading(false);
        }
    });

    splitPdfBtn.addEventListener('click', async () => {
        if (!splitFile) {
            showMessage('Please upload a PDF file to split.', 'error');
            return;
        }

        const pageRangesStr = pageRangesInput.value.trim();
        if (!pageRangesStr) {
            showMessage('Please enter page ranges (e.g., 1-5, 8, 10-12).', 'error');
            return;
        }

        toggleLoading(true);
        splitResultsDiv.innerHTML = ''; // Clear previous results
        splitResultsDiv.style.display = 'none';

        try {
            const originalPdfDoc = await PDFLib.PDFDocument.load(splitFile.arrayBuffer);
            const totalPages = originalPdfDoc.getPageCount();
            const partsToSplit = parsePageRanges(pageRangesStr, totalPages);

            if (partsToSplit.length === 0) {
                showMessage('No valid page ranges found. Please check your input.', 'error');
                toggleLoading(false);
                return;
            }

            const splitPdfs = [];
            for (let i = 0; i < partsToSplit.length; i++) {
                const range = partsToSplit[i];
                const newPdfDoc = await PDFLib.PDFDocument.create();
                const copiedPages = await newPdfDoc.copyPages(originalPdfDoc, range.pages.map(p => p - 1)); // pdf-lib is 0-indexed

                copiedPages.forEach((page) => newPdfDoc.addPage(page));
                const pdfBytes = await newPdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                splitPdfs.push({
                    name: `${splitFile.file.name.replace(/\.pdf$/i, '')}_part_${range.label}.pdf`,
                    blob: blob
                });
            }

            if (splitPdfs.length > 0) {
                splitResultsDiv.style.display = 'grid';
                if (splitPdfs.length === 1) {
                    // If only one part, offer direct download
                    const item = splitPdfs[0];
                    const div = document.createElement('div');
                    div.className = 'split-result-item';
                    div.innerHTML = `
                        <span class="file-name">${item.name}</span>
                        <a href="${URL.createObjectURL(item.blob)}" download="${item.name}" class="button button-primary">Download</a>
                    `;
                    splitResultsDiv.appendChild(div);
                    showMessage('PDF split successfully!', 'success');
                } else {
                    // If multiple parts, offer individual downloads and a ZIP
                    const zip = new JSZip();
                    splitPdfs.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'split-result-item';
                        div.innerHTML = `
                            <span class="file-name">${item.name}</span>
                            <a href="${URL.createObjectURL(item.blob)}" download="${item.name}" class="button button-secondary">Download</a>
                        `;
                        splitResultsDiv.appendChild(div);
                        zip.file(item.name, item.blob);
                    });

                    const zipDownloadBtn = document.createElement('button');
                    zipDownloadBtn.className = 'button button-primary';
                    zipDownloadBtn.textContent = 'Download All as ZIP';
                    zipDownloadBtn.style.gridColumn = '1 / -1'; // Span across all columns
                    zipDownloadBtn.style.marginTop = '15px';
                    zipDownloadBtn.addEventListener('click', async () => {
                        toggleLoading(true);
                        try {
                            const zipBlob = await zip.generateAsync({ type: "blob" });
                            saveAs(zipBlob, `${splitFile.file.name.replace(/\.pdf$/i, '')}_split_parts.zip`);
                            showMessage('All split PDFs downloaded as ZIP!', 'success');
                        } catch (zipError) {
                            console.error('Error generating ZIP:', zipError);
                            showMessage('Failed to create ZIP file.', 'error');
                        } finally {
                            toggleLoading(false);
                        }
                    });
                    splitResultsDiv.appendChild(zipDownloadBtn);
                    showMessage('PDF split into multiple parts! Download individually or as ZIP.', 'success');
                }
            } else {
                showMessage('No pages were selected for splitting based on your input.', 'warning');
            }

        } catch (error) {
            console.error('Error splitting PDF:', error);
            showMessage('Failed to split PDF. Please check page ranges and file validity.', 'error');
        } finally {
            toggleLoading(false);
        }
    });

    // Helper function to parse page ranges (e.g., "1-5, 8, 10-12")
    function parsePageRanges(rangeStr, totalPages) {
        const ranges = rangeStr.split(',').map(s => s.trim()).filter(s => s !== '');
        const parsedRanges = [];

        ranges.forEach(range => {
            if (range.includes('-')) {
                const [start, end] = range.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= totalPages && start <= end) {
                    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
                    parsedRanges.push({ label: `${start}-${end}`, pages });
                } else {
                    showMessage(`Invalid range: ${range}. Pages must be within 1-${totalPages} and start <= end.`, 'warning');
                }
            } else {
                const pageNum = Number(range);
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                    parsedRanges.push({ label: `${pageNum}`, pages: [pageNum] });
                } else {
                    showMessage(`Invalid page number: ${range}. Must be within 1-${totalPages}.`, 'warning');
                }
            }
        });
        return parsedRanges;
    }

    // --- Clear All ---
    clearAllBtn.addEventListener('click', () => {
        // Clear Merger section
        mergeFiles = [];
        mergePdfUpload.value = '';
        renderMergeFileList();
        mergeFileNameDisplay.textContent = '';
        mergePdfBtn.style.display = 'none';

        // Clear Splitter section
        splitFile = null;
        splitPdfUpload.value = '';
        splitFileNameDisplay.textContent = '';
        pageRangesInput.value = '';
        splitPdfBtn.style.display = 'none';
        splitResultsDiv.innerHTML = '';
        splitResultsDiv.style.display = 'none';

        showMessage('Cleared all fields and results.', 'info');
    });
});
