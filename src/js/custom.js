// FAQ Toggle Functionality
document.querySelectorAll('.faq-question').forEach((question) => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;

        // Alternar la clase activa
        faqItem.classList.toggle('active');

        // Cerrar otras respuestas abiertas
        document.querySelectorAll('.faq-item').forEach((item) => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });
    });
});
