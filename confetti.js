// Confetti animation when completing a focus session
function showConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    // Create confetti pieces
    const colors = ['#6c63ff', '#ff6b6b', '#feca57', '#1dd1a1', '#5f27cd'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confetti.style.opacity = Math.random() + 0.5;
        confetti.style.transform = 'scale(' + (Math.random() * 0.4 + 0.6) + ')';
        confettiContainer.appendChild(confetti);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
        if (confettiContainer && confettiContainer.parentNode === document.body) {
            document.body.removeChild(confettiContainer);
        }
    }, 5000);
}
