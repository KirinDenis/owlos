function speak(text) {
    if (configProperties.speak === 'true') {
        try {
            var msg = new SpeechSynthesisUtterance(text);
            var voices = window.speechSynthesis.getVoices();
            msg.voice = voices[configProperties.voice];
            window.speechSynthesis.speak(msg);
        }
        catch (exception) {
            console.error(exception);
        }
    }
}