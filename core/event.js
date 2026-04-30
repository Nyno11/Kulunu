(function () {
  // const BASE_URL = 'https://api.kulunu.app';
  const BASE_URL = 'http://192.168.153.21:8080';

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

// ─── ORGANISER VERIFICATION (kycModal in Ticket.html) ────────────────────────

(function () {
  // const BASE_URL = 'https://api.kulunu.app';
  const BASE_URL = 'http://192.168.153.21:8080';

  // Only activate on pages that have the KYC modal
  if (!document.getElementById('kycForm')) return;

  const session = JSON.parse(localStorage.getItem('user_session') || 'null');

  function showState(id) {
    ['kycLoading', 'kycFormState', 'kycPendingState', 'kycApprovedState'].forEach(function (sid) {
      var el = document.getElementById(sid);
      if (el) el.style.display = 'none';
    });
    var target = document.getElementById(id);
    if (target) target.style.display = id === 'kycLoading' ? 'block' : 'block';
  }

  // ── Status check (called by openKYC in Ticket.html) ──────────────────────
  async function checkStatus() {
    showState('kycLoading');

    if (!session || !session.token) {
      showState('kycFormState');
      return;
    }

    try {
      const res = await fetch(BASE_URL + '/organiser/status', {
        headers: { 'Authorization': 'Bearer ' + session.token }
      });
      const data = await res.json();

      if (!data.success || !data.data) { showState('kycFormState'); return; }

      const s = data.data;

      if (s.status === 'approved') {
        var nameEl = document.getElementById('kycApprovedName');
        if (nameEl) nameEl.textContent = s.org_name || '';
        showState('kycApprovedState');

      } else if (s.status === 'pending') {
        var dateEl = document.getElementById('kycPendingDate');
        if (dateEl && s.submitted_at) {
          dateEl.textContent = 'Submitted on ' + new Date(s.submitted_at).toLocaleDateString('en-NG', { dateStyle: 'long' });
        }
        showState('kycPendingState');

      } else if (s.status === 'rejected') {
        var box = document.getElementById('kycRejectionBox');
        if (box) {
          box.textContent = 'Previous application rejected: ' + (s.rejection_reason || 'No reason given.') + ' Please correct and resubmit.';
          box.style.display = 'block';
        }
        showState('kycFormState');

      } else {
        showState('kycFormState');
      }

    } catch (err) {
      console.error(err);
      showState('kycFormState');
    }
  }

  // Expose to Ticket.html's openKYC()
  window._kycCheckStatus = checkStatus;

  // ── ID document upload label ──────────────────────────────────────────────
  var docInput = document.getElementById('kyc_id_document');
  if (docInput) {
    docInput.addEventListener('change', function () {
      var file = docInput.files[0];
      if (!file) return;
      var label = document.getElementById('kycDocLabel');
      var area = document.getElementById('kycDocArea');
      if (label) label.textContent = file.name;
      if (area) area.style.borderColor = '#0CA6EF';
    });
  }

  // ── Form submission ───────────────────────────────────────────────────────
  var form = document.getElementById('kycForm');
  var submitBtn = document.getElementById('kycSubmitBtn');
  var errorBox = document.getElementById('kycFormError');

  function showError(msg) {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
  }

  function hideError() {
    if (errorBox) errorBox.style.display = 'none';
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideError();

    if (!session || !session.token) {
      showError('You must be logged in to submit a verification application.');
      return;
    }

    if (!document.getElementById('kyc_terms').checked) {
      showError('Please agree to the Terms & Conditions before submitting.');
      return;
    }

    var payload = {
      org_name: document.getElementById('kyc_org_name').value.trim(),
      org_type: document.getElementById('kyc_org_type').value,
      phone: document.getElementById('kyc_phone').value.trim(),
      address: document.getElementById('kyc_address').value.trim(),
      city: document.getElementById('kyc_city').value.trim(),
      state: document.getElementById('kyc_state').value.trim(),
      website: document.getElementById('kyc_instagram') ? document.getElementById('kyc_instagram').value.trim() || null : null,
      social_instagram: document.getElementById('kyc_instagram') ? document.getElementById('kyc_instagram').value.trim() || null : null,
      social_twitter: document.getElementById('kyc_twitter') ? document.getElementById('kyc_twitter').value.trim() || null : null,
      id_type: document.getElementById('kyc_id_type').value,
      id_number: document.getElementById('kyc_id_number').value.trim(),
      id_document_url: null,
    };

    var required = {
      'Organisation Name': payload.org_name,
      'Organiser Type': payload.org_type,
      'Phone Number': payload.phone,
      'Address': payload.address,
      'City': payload.city,
      'State': payload.state,
      'ID Type': payload.id_type,
      'ID Number': payload.id_number
    };
    for (var label in required) {
      if (!required[label]) { showError(label + ' is required.'); return; }
    }

    // Read ID document as base64 if provided
    var docFile = docInput ? docInput.files[0] : null;
    if (docFile) {
      payload.id_document_url = await new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onload = function () { resolve(reader.result); };
        reader.readAsDataURL(docFile);
      });
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const res = await fetch(BASE_URL + '/organiser/apply', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + session.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        showError(data.message || 'Submission failed. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
        return;
      }

      var dateEl = document.getElementById('kycPendingDate');
      if (dateEl) dateEl.textContent = 'Submitted on ' + new Date().toLocaleDateString('en-NG', { dateStyle: 'long' });
      showState('kycPendingState');

    } catch (err) {
      console.error(err);
      showError('Server error. Please check your connection and try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
    }
  });

})();
