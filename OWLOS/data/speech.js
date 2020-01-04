function speak(text) {
    if (webProp.speak) {
        var msg = new SpeechSynthesisUtterance(text);
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[webProp.voice];
        window.speechSynthesis.speak(msg);        
    }
}