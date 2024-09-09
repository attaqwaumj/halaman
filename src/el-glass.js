document.addEventListener("DOMContentLoaded", function() {
    const glassElements = document.querySelectorAll('[class*="glass"]');

    glassElements.forEach(el => {
        const classList = el.className.split(' ');

        classList.forEach(className => {
            // Match class patterns like glass:0.5-10px, glass-dark:0.8-5px, etc.
            const patternMatch = className.match(/(glass(?:-dark|-panel)?):([0-9]\.[0-9])-(\d+px)/);

            if (patternMatch) {
                const theme = patternMatch[1]; // Get the theme part (glass, glass-dark, glass-panel)
                const opacityValue = patternMatch[2]; // Get opacity value (e.g., 0.5)
                const blurValue = patternMatch[3]; // Get blur value (e.g., 10px)

                // Set the base class for the element (glass, glass-dark, or glass-panel)
                el.classList.add(theme);

                // Apply the correct styles based on the theme, opacity, and blur
                if (theme === 'glass-dark') {
                    el.style.setProperty('--glass-bg-color', `rgba(0, 0, 0, ${opacityValue})`);
                    el.style.setProperty('--glass-border-color', `rgba(255, 255, 255, ${0.1 * opacityValue})`);
                } else if (theme === 'glass-panel') {
                    el.style.setProperty('--glass-bg-color', `linear-gradient(135deg, rgba(255, 0, 150, ${opacityValue}), rgba(0, 206, 255, ${opacityValue}))`);
                    el.style.setProperty('--glass-border-color', `rgba(255, 255, 255, ${0.3 * opacityValue})`);
                } else {
                    el.style.setProperty('--glass-bg-color', `rgba(255, 255, 255, ${opacityValue})`);
                    el.style.setProperty('--glass-border-color', `rgba(255, 255, 255, ${0.2 * opacityValue})`);
                }

                // Apply the custom blur value
                el.style.setProperty('--glass-blur', blurValue);
            }
        });
    });
});