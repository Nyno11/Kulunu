(function () {
  const BASE_URL = 'https://api.kulunu.app';

  // Sync header with localStorage session
  const session = JSON.parse(localStorage.getItem('user_session') || 'null');
  const nameEl = document.getElementById('headerUserName');
  const emailEl = document.getElementById('headerUserEmail');
  if (session) {
    const displayName = session.full_name || session.name || 'User';
    const displayEmail = session.email || '';
    if (nameEl) nameEl.textContent = displayName;
    if (emailEl) emailEl.textContent = displayEmail;
  }

  const form = document.getElementById('createEventForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.primary-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';

    const titleVal = document.getElementById('title').value.trim();
    const dateVal = document.getElementById('date').value;
    const venueVal = document.getElementById('venue').value.trim();
    const typeVal = document.getElementById('type').value;
    const bannerFile = document.getElementById('banner').files[0];

    // Authenticated: call the API
    if (session && session.token) {
      // Read banner as base64 data URL if present
      let banner_url = null;
      if (bannerFile) {
        banner_url = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(bannerFile);
        });
      }

      try {
        const res = await fetch(`${BASE_URL}/create-event`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: titleVal, date: dateVal, venue: venueVal, type: typeVal, banner_url }),
        });

        const data = await res.json();

        if (!data.success) {
          alert(data.message || 'Failed to create event.');
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          return;
        }

        localStorage.setItem('activeEvent', JSON.stringify(data.data || data.event || {}));
        window.location.href = 'Event.html';
      } catch (err) {
        console.error(err);
        alert('Server error. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }

    } else {
      // Not logged in — save locally and continue
      const previewImg = document.getElementById('previewImg');
      const eventData = {
        id: 'EVT-' + Date.now(),
        title: titleVal,
        date: dateVal,
        venue: venueVal,
        type: typeVal,
        banner: previewImg ? previewImg.src : '',
        status: 'draft',
        tickets: [],
        attendees: []
      };
      localStorage.setItem('activeEvent', JSON.stringify(eventData));
      window.location.href = 'Event.html';
    }
  });
})();
