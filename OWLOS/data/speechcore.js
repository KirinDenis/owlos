function speak(text) {
    if (configProperties.speak) {
        var msg = new SpeechSynthesisUtterance(text);
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[configProperties.voice];
        window.speechSynthesis.speak(msg);        
    }
}