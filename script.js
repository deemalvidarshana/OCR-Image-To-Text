document.addEventListener('DOMContentLoaded', function() {
    const fileSelector = document.getElementById('fileInput');
    const startButton = document.getElementById('startButton');
    const img = document.getElementById('imagePreview');
    const progress = document.querySelector('.progress');
    const textarea = document.getElementById('textOutput');
    const downloadButton = document.getElementById('downloadButton');
    const copyButton = document.getElementById('copyButton');

    // Function to download text
    function downloadText(text, filename) {
        const blob = new Blob([text], { type: 'text/plain' });
        const a = document.createElement('a');
        a.download = filename;
        a.href = URL.createObjectURL(blob);
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Function to copy text to clipboard
    function copyTextToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            console.log('Text copied to clipboard');
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    }

    // Function to adjust textarea height based on content
    function adjustTextareaHeight() {
        // Set the height of the textarea based on its scrollHeight
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    // Show image on upload
    fileSelector.onchange = () => {
        const file = fileSelector.files[0];
        const imgUrl = URL.createObjectURL(file);
        img.src = imgUrl;
    };

    // Start text recognition
    startButton.onclick = () => {
        textarea.value = '';
        progress.innerHTML = 'Processing...';
        const rec = new Tesseract.TesseractWorker();
        rec.recognize(fileSelector.files[0])
            .progress(function (response) {
                progress.innerHTML = `${(response.progress * 100).toFixed(2)}%`;
            })
            .then(function (result) {
                textarea.value = result.text;
                progress.innerHTML = 'Done';
                rec.terminate();
                // After setting the value, adjust the height of the textarea
                adjustTextareaHeight();
            });
    };

    // Download text
    downloadButton.onclick = () => {
        const text = textarea.value;
        if (text) {
            downloadText(text, 'extracted_text.txt');
        }
    };

    // Copy text to clipboard
    copyButton.onclick = () => {
        const text = textarea.value;
        if (text) {
            copyTextToClipboard(text);
        }
    };

    // Call the adjustTextareaHeight function initially to set the initial height
    adjustTextareaHeight();

    // Add an event listener for input in the textarea to dynamically adjust its height
    textarea.addEventListener('input', function() {
        adjustTextareaHeight();
    });
});
