// script.js for Text to Speech Tool

document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const voiceSelect = document.getElementById('voiceSelect');
    const rateRange = document.getElementById('rateRange');
    const rateValueSpan = document.getElementById('rateValue');
    const pitchRange = document.getElementById('pitchRange');
    const pitchValueSpan = document.getElementById('pitchValue');
    const volumeRange = document.getElementById('volumeRange');
    const volumeValueSpan = document.getElementById('volumeValue');
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    const stopButton = document.getElementById('stopButton');
    const clearButton = document.getElementById('clearButton');
    const ttsMessage = document.getElementById('ttsMessage');

    let synth = window.speechSynthesis;
    let voices = [];
    let utterance = null; // To hold the current SpeechSynthesisUtterance

    // Function to populate voices dropdown
    function populateVoiceList() {
        voices = synth.getVoices().sort((a, b) => a.name.localeCompare(b.name));
        voiceSelect.innerHTML = ''; // Clear existing options

        if (voices.length === 0) {
            ttsMessage.textContent = "No speech synthesis voices available in your browser.";
            playButton.disabled = true;
            return;
        }

        voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-lang', voice.lang);
            option.setAttribute('data-name', voice.name);
            voiceSelect.appendChild(option);
        });

        // Set a default voice if available (e.g., a common English voice)
        const defaultVoice = voices.find(voice => voice.lang === 'en-US' || voice.lang === 'en-GB');
        if (defaultVoice) {
            voiceSelect.value = `${defaultVoice.name} (${defaultVoice.lang})`;
        } else if (voices.length > 0) {
            voiceSelect.selectedIndex = 0; // Fallback to the first available voice
        }
    }

    // Load voices on voiceschanged event (important for Chrome)
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoiceList;
    } else {
        // Fallback for browsers that don't fire voiceschanged immediately
        populateVoiceList();
    }

    // Function to speak the text
    function speakText() {
        if (synth.speaking) {
            ttsMessage.textContent = 'Already speaking... Stopping current speech.';
            synth.cancel(); // Stop current speech before starting new one
        }

        const text = textInput.value.trim();
        if (text === '') {
            ttsMessage.textContent = 'Please enter some text to convert.';
            return;
        }

        utterance = new SpeechSynthesisUtterance(text);

        // Set voice
        const selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute('data-name');
        utterance.voice = voices.find(voice => voice.name === selectedVoiceName);

        // Set parameters
        utterance.rate = parseFloat(rateRange.value);
        utterance.pitch = parseFloat(pitchRange.value);
        utterance.volume = parseFloat(volumeRange.value);

        // Event listeners for utterance
        utterance.onstart = () => {
            ttsMessage.textContent = 'Speaking...';
            playButton.disabled = true;
            pauseButton.disabled = false;
            stopButton.disabled = false;
        };

        utterance.onend = () => {
            ttsMessage.textContent = 'Speech finished.';
            playButton.disabled = false;
            pauseButton.disabled = true;
            stopButton.disabled = true;
        };

        utterance.onerror = (event) => {
            ttsMessage.textContent = `Speech error: ${event.error}`;
            console.error('SpeechSynthesisUtterance.onerror', event);
            playButton.disabled = false;
            pauseButton.disabled = true;
            stopButton.disabled = true;
        };

        synth.speak(utterance);
    }

    // Event listeners for controls and buttons
    playButton.addEventListener('click', () => {
        if (synth.paused && utterance) {
            synth.resume();
            ttsMessage.textContent = 'Resuming speech...';
        } else {
            speakText();
        }
    });

    pauseButton.addEventListener('click', () => {
        if (synth.speaking && !synth.paused) {
            synth.pause();
            ttsMessage.textContent = 'Speech paused.';
        }
    });

    stopButton.addEventListener('click', () => {
        if (synth.speaking || synth.paused) {
            synth.cancel();
            ttsMessage.textContent = 'Speech stopped.';
        }
    });

    clearButton.addEventListener('click', () => {
        textInput.value = '';
        if (synth.speaking || synth.paused) {
            synth.cancel();
        }
        ttsMessage.textContent = '';
        playButton.disabled = false;
        pauseButton.disabled = true;
        stopButton.disabled = true;
    });

    // Update range value displays
    rateRange.addEventListener('input', () => {
        rateValueSpan.textContent = rateRange.value;
    });

    pitchRange.addEventListener('input', () => {
        pitchValueSpan.textContent = pitchRange.value;
    });

    volumeRange.addEventListener('input', () => {
        volumeValueSpan.textContent = volumeRange.value;
    });

    // Initial state for buttons
    pauseButton.disabled = true;
    stopButton.disabled = true;
});
