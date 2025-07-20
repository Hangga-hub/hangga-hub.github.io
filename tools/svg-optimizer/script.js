document.addEventListener("DOMContentLoaded", () => {
    const svgInput = document.getElementById('svgInput');
    const svgCode = document.getElementById('svgCode');
    const optimizeBtn = document.getElementById('optimizeBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultSection = document.getElementById('resultSection');
    const optimizedSvg = document.getElementById('optimizedSvg');
    const svgPreview = document.getElementById('svgPreview');
    const originalSize = document.getElementById('originalSize');
    const optimizedSize = document.getElementById('optimizedSize');
    const reduction = document.getElementById('reduction');
    const elementCount = document.getElementById('elementCount');

    // File input handler
    svgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            svgCode.value = event.target.result;
        };
        reader.readAsText(file);
    });

    // Optimize button handler
    optimizeBtn.addEventListener('click', () => {
        if (!svgCode.value.trim()) {
            alert('Please paste SVG code or upload an SVG file');
            return;
        }

        try {
            // Get optimization options
            const options = {
                removeComments: document.getElementById('removeComments').checked,
                removeMetadata: document.getElementById('removeMetadata').checked,
                removeEmptyAttrs: document.getElementById('removeEmptyAttrs').checked,
                collapseGroups: document.getElementById('collapseGroups').checked,
                removeUnusedNS: document.getElementById('removeUnusedNS').checked
            };

            // Simple SVG optimization (in a real app you'd use a library like SVGO)
            let optimized = optimizeSvg(svgCode.value, options);
            
            // Update UI with results
            optimizedSvg.value = optimized;
            svgPreview.innerHTML = optimized;
            resultSection.classList.remove('hidden');
            
            // Calculate stats
            const original = svgCode.value.length;
            const optimizedLength = optimized.length;
            const sizeReduction = ((original - optimizedLength) / original * 100).toFixed(2);
            
            // Count elements (simple approximation)
            const elements = (optimized.match(/<[a-z][\s\S]*?>/gi) || []).length;
            
            // Update stats
            originalSize.textContent = formatSize(original);
            optimizedSize.textContent = formatSize(optimizedLength);
            reduction.textContent = `${sizeReduction}%`;
            elementCount.textContent = elements;
            
            // Enable download and copy buttons
            downloadBtn.disabled = false;
            copyBtn.disabled = false;
            
            // Add animation to stats
            animateValue(originalSize);
            animateValue(optimizedSize);
            animateValue(reduction);
            animateValue(elementCount);
            
        } catch (error) {
            console.error('Error optimizing SVG:', error);
            alert('Error optimizing SVG. Please check your input and try again.');
        }
    });

    // Download button handler
    downloadBtn.addEventListener('click', () => {
        const blob = new Blob([optimizedSvg.value], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'optimized.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Copy button handler
    copyBtn.addEventListener('click', () => {
        optimizedSvg.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });

    // Clear button handler
    clearBtn.addEventListener('click', () => {
        svgCode.value = '';
        svgInput.value = '';
        optimizedSvg.value = '';
        svgPreview.innerHTML = '';
        resultSection.classList.add('hidden');
        downloadBtn.disabled = true;
        copyBtn.disabled = true;
    });

    // Simple SVG optimization function
    function optimizeSvg(svg, options) {
        let result = svg;
        
        // Remove comments
        if (options.removeComments) {
            result = result.replace(/<!--[\s\S]*?-->/g, '');
        }
        
        // Remove metadata
        if (options.removeMetadata) {
            result = result.replace(/<metadata>[\s\S]*?<\/metadata>/g, '');
        }
        
        // Remove empty attributes
        if (options.removeEmptyAttrs) {
            result = result.replace(/\s[a-z-]+="\s*"/g, '');
        }
        
        // Collapse groups (simple version)
        if (options.collapseGroups) {
            result = result.replace(/<g>\s*<\/g>/g, '');
        }
        
        // Remove unused namespaces (simple version)
        if (options.removeUnusedNS) {
            result = result.replace(/xmlns:[a-z]+="[^"]*"/g, (match) => {
                const prefix = match.match(/xmlns:([a-z]+)/)[1];
                return result.includes(`${prefix}:`) ? match : '';
            }).replace(/\s+/g, ' ');
        }
        
        // Remove extra whitespace
        result = result.replace(/>\s+</g, '><').trim();
        
        return result;
    }
    
    // Format file size
    function formatSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    
    // Animate value change
    function animateValue(element) {
        element.classList.add('animate-pulse-effect');
        setTimeout(() => {
            element.classList.remove('animate-pulse-effect');
        }, 400);
    }
});