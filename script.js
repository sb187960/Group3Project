/**
 * LawnQuote - Instant Field Quoting Tool for Lawn Care & Landscaping Crews
 * GitHub Pages Compatible · Zero Dependencies · LocalStorage Persistence
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Default Settings & Realistic Baseline Rates
  // ---------------------------------------------------------------------------
  const DEFAULT_SETTINGS = {
    businessName: 'GreenThumb Lawn & Landscape',
    phone: '(555) 234-5678',
    email: 'quotes@greenthumb-example.com',
    minJobCharge: 50.0,
    quoteTerms: 'Estimates valid for 14 days. Payment due upon completion of services.',
    rates: {
      mowing: 12.0,      // per 1,000 sq ft
      edging: 4.0,       // per 1,000 sq ft
      leaf: 8.0,         // per 1,000 sq ft
      mulch: 85.0,       // per cubic yard
      hedge: 55.0        // per crew hour
    }
  };

  const STORAGE_KEY = 'lawnquote_crew_settings_v1';

  // State
  let currentSettings = null;
  let attachedPhotos = []; // Array of base64 data URLs
  let currentQuoteData = null;

  // DOM Elements - Navigation & Screens
  const navTabs = document.querySelectorAll('.tab-btn');
  const screens = {
    'screen-pricesheet': document.getElementById('screen-pricesheet'),
    'screen-newquote': document.getElementById('screen-newquote'),
    'screen-preview': document.getElementById('screen-preview')
  };

  // DOM Elements - Screen 1: Price Sheet
  const priceSheetForm = document.getElementById('price-sheet-form');
  const inputBizName = document.getElementById('setting-business-name');
  const inputBizPhone = document.getElementById('setting-phone');
  const inputBizEmail = document.getElementById('setting-email');
  const inputMinCharge = document.getElementById('setting-min-charge');
  const inputTerms = document.getElementById('setting-terms');
  const inputRateMowing = document.getElementById('setting-rate-mowing');
  const inputRateEdging = document.getElementById('setting-rate-edging');
  const inputRateLeaf = document.getElementById('setting-rate-leaf');
  const inputRateMulch = document.getElementById('setting-rate-mulch');
  const inputRateHedge = document.getElementById('setting-rate-hedge');
  const btnResetSettings = document.getElementById('btn-reset-settings');
  const settingsToast = document.getElementById('settings-toast');

  // DOM Elements - Screen 2: New Quote Form
  const newQuoteForm = document.getElementById('new-quote-form');
  const btnFillFake = document.getElementById('btn-fill-fake');
  const inputCustName = document.getElementById('quote-cust-name');
  const inputCustAddress = document.getElementById('quote-cust-address');
  const inputCustPhone = document.getElementById('quote-cust-phone');
  const inputCustEmail = document.getElementById('quote-cust-email');
  const phoneFeedback = document.getElementById('phone-feedback');
  const emailFeedback = document.getElementById('email-feedback');
  const inputYardSize = document.getElementById('quote-yard-size');
  
  const svcMowing = document.getElementById('svc-mowing');
  const svcEdging = document.getElementById('svc-edging');
  const svcLeaf = document.getElementById('svc-leaf');
  const svcMulch = document.getElementById('svc-mulch');
  const svcHedge = document.getElementById('svc-hedge');

  const mulchQtyContainer = document.getElementById('mulch-qty-container');
  const hedgeQtyContainer = document.getElementById('hedge-qty-container');
  const inputQtyMulch = document.getElementById('qty-mulch');
  const inputQtyHedge = document.getElementById('qty-hedge');
  const svcError = document.getElementById('svc-error');

  const photoInput = document.getElementById('photo-input');
  const photoThumbnails = document.getElementById('photo-thumbnails');

  // Service Rate Badges in Screen 2
  const badgeMowing = document.getElementById('badge-rate-mowing');
  const badgeEdging = document.getElementById('badge-rate-edging');
  const badgeLeaf = document.getElementById('badge-rate-leaf');
  const badgeMulch = document.getElementById('badge-rate-mulch');
  const badgeHedge = document.getElementById('badge-rate-hedge');

  // DOM Elements - Screen 3: Quote Preview
  const btnPrint = document.getElementById('btn-print');
  const btnEditQuote = document.getElementById('btn-edit-quote');
  const btnNewQuote = document.getElementById('btn-new-quote');

  const viewBizName = document.getElementById('view-biz-name');
  const viewBizPhone = document.getElementById('view-biz-phone');
  const viewBizEmail = document.getElementById('view-biz-email');
  const viewQuoteDate = document.getElementById('view-quote-date');
  const viewQuoteId = document.getElementById('view-quote-id');
  const viewCustName = document.getElementById('view-cust-name');
  const viewCustAddress = document.getElementById('view-cust-address');
  const viewCustContact = document.getElementById('view-cust-contact');
  const viewYardSize = document.getElementById('view-yard-size');
  const quoteLineItems = document.getElementById('quote-line-items');
  const viewQuoteTerms = document.getElementById('view-quote-terms');
  const viewSubtotal = document.getElementById('view-subtotal');
  const rowMinCharge = document.getElementById('row-min-charge');
  const viewMinChargeFloor = document.getElementById('view-min-charge-floor');
  const viewMinChargeAdj = document.getElementById('view-min-charge-adj');
  const viewRoundingAdj = document.getElementById('view-rounding-adj');
  const viewFinalTotal = document.getElementById('view-final-total');
  const quotePreviewPhotos = document.getElementById('quote-preview-photos');
  const quotePhotosGallery = document.getElementById('quote-photos-gallery');

  // DOM Elements - Screen 3: Send to Customer
  const btnSendSms = document.getElementById('btn-send-sms');
  const btnSendEmail = document.getElementById('btn-send-email');
  const btnCopyQuote = document.getElementById('btn-copy-quote');
  const labelSmsTarget = document.getElementById('label-sms-target');
  const labelEmailTarget = document.getElementById('label-email-target');
  const copyConfirmToast = document.getElementById('copy-confirmation-toast');
  const copyErrorToast = document.getElementById('copy-error-toast');
  const sendStatusBadge = document.getElementById('send-status-badge');
  const btnToggleMsgPreview = document.getElementById('btn-toggle-msg-preview');
  const msgPreviewContainer = document.getElementById('msg-preview-container');
  const tabBtnSms = document.getElementById('tab-btn-sms');
  const tabBtnEmail = document.getElementById('tab-btn-email');
  const previewPanelSms = document.getElementById('preview-panel-sms');
  const previewPanelEmail = document.getElementById('preview-panel-email');
  const previewSmsRecipient = document.getElementById('preview-sms-recipient');
  const previewSmsContent = document.getElementById('preview-sms-content');
  const previewEmailRecipient = document.getElementById('preview-email-recipient');
  const previewEmailSubject = document.getElementById('preview-email-subject');
  const previewEmailContent = document.getElementById('preview-email-content');

  // ---------------------------------------------------------------------------
  // Navigation & Screen Switching
  // ---------------------------------------------------------------------------
  function showScreen(screenId) {
    Object.keys(screens).forEach(id => {
      if (screens[id]) {
        screens[id].style.display = (id === screenId) ? 'block' : 'none';
      }
    });

    navTabs.forEach(btn => {
      const isTarget = btn.getAttribute('data-target') === screenId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // Scroll smoothly to top on tab switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      showScreen(target);
    });
  });

  // ---------------------------------------------------------------------------
  // Settings Management (Screen 1 & LocalStorage)
  // ---------------------------------------------------------------------------
  function loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        currentSettings = JSON.parse(stored);
      } else {
        currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        saveSettingsToStorage();
      }
    } catch (err) {
      console.warn('Could not read settings from localStorage, loading defaults:', err);
      currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }

    populateSettingsForm();
    updateScreen2RateBadges();
  }

  function saveSettingsToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
    } catch (err) {
      console.error('Failed to write to localStorage:', err);
    }
  }

  function populateSettingsForm() {
    inputBizName.value = currentSettings.businessName || '';
    inputBizPhone.value = currentSettings.phone || '';
    inputBizEmail.value = currentSettings.email || '';
    inputMinCharge.value = currentSettings.minJobCharge;
    inputTerms.value = currentSettings.quoteTerms || '';

    inputRateMowing.value = currentSettings.rates.mowing;
    inputRateEdging.value = currentSettings.rates.edging;
    inputRateLeaf.value = currentSettings.rates.leaf;
    inputRateMulch.value = currentSettings.rates.mulch;
    inputRateHedge.value = currentSettings.rates.hedge;
  }

  function updateScreen2RateBadges() {
    badgeMowing.textContent = `$${Number(currentSettings.rates.mowing).toFixed(2)} / 1k sq ft`;
    badgeEdging.textContent = `$${Number(currentSettings.rates.edging).toFixed(2)} / 1k sq ft`;
    badgeLeaf.textContent = `$${Number(currentSettings.rates.leaf).toFixed(2)} / 1k sq ft`;
    badgeMulch.textContent = `$${Number(currentSettings.rates.mulch).toFixed(2)} / cu yd`;
    badgeHedge.textContent = `$${Number(currentSettings.rates.hedge).toFixed(2)} / hr`;
  }

  priceSheetForm.addEventListener('submit', (e) => {
    e.preventDefault();

    currentSettings = {
      businessName: inputBizName.value.trim() || 'My Lawn Care Crew',
      phone: inputBizPhone.value.trim(),
      email: inputBizEmail.value.trim(),
      minJobCharge: Math.max(0, parseFloat(inputMinCharge.value) || 0),
      quoteTerms: inputTerms.value.trim(),
      rates: {
        mowing: Math.max(0, parseFloat(inputRateMowing.value) || 0),
        edging: Math.max(0, parseFloat(inputRateEdging.value) || 0),
        leaf: Math.max(0, parseFloat(inputRateLeaf.value) || 0),
        mulch: Math.max(0, parseFloat(inputRateMulch.value) || 0),
        hedge: Math.max(0, parseFloat(inputRateHedge.value) || 0)
      }
    };

    saveSettingsToStorage();
    updateScreen2RateBadges();

    // Show toast
    settingsToast.style.display = 'block';
    setTimeout(() => {
      settingsToast.style.display = 'none';
    }, 2500);
  });

  btnResetSettings.addEventListener('click', () => {
    if (confirm('Reset all prices and settings to realistic default sample rates?')) {
      currentSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      saveSettingsToStorage();
      populateSettingsForm();
      updateScreen2RateBadges();

      settingsToast.textContent = 'Settings reset to realistic defaults!';
      settingsToast.style.display = 'block';
      setTimeout(() => {
        settingsToast.style.display = 'none';
        settingsToast.textContent = 'Settings saved successfully!';
      }, 2500);
    }
  });

  // ---------------------------------------------------------------------------
  // Screen 2: Dynamic Service Toggles
  // ---------------------------------------------------------------------------
  function toggleServiceQty(checkbox, container, input) {
    if (checkbox.checked) {
      container.style.display = 'block';
      if (input && (!input.value || parseFloat(input.value) <= 0)) {
        input.value = input.getAttribute('value') || '1';
      }
    } else {
      container.style.display = 'none';
    }
  }

  svcMulch.addEventListener('change', () => toggleServiceQty(svcMulch, mulchQtyContainer, inputQtyMulch));
  svcHedge.addEventListener('change', () => toggleServiceQty(svcHedge, hedgeQtyContainer, inputQtyHedge));

  // ---------------------------------------------------------------------------
  // Screen 2: Photo Upload & Thumbnails
  // ---------------------------------------------------------------------------
  photoInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        attachedPhotos.push(event.target.result);
        renderThumbnails();
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-selected if removed
    photoInput.value = '';
  });

  function renderThumbnails() {
    photoThumbnails.innerHTML = '';
    attachedPhotos.forEach((dataUrl, idx) => {
      const wrap = document.createElement('div');
      wrap.className = 'thumb-item';

      const img = document.createElement('img');
      img.src = dataUrl;
      img.alt = `Site photo thumbnail ${idx + 1}`;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'thumb-remove-btn';
      removeBtn.innerHTML = '&times;';
      removeBtn.title = 'Remove photo';
      removeBtn.addEventListener('click', () => {
        attachedPhotos.splice(idx, 1);
        renderThumbnails();
      });

      wrap.appendChild(img);
      wrap.appendChild(removeBtn);
      photoThumbnails.appendChild(wrap);
    });
  }

  // ---------------------------------------------------------------------------
  // Customer Contact Validation (Gentle on-page messages, non-blocking)
  // ---------------------------------------------------------------------------
  function validateCustomerPhone() {
    const val = inputCustPhone.value.trim();
    if (!val) {
      phoneFeedback.style.display = 'none';
      phoneFeedback.textContent = '';
      return;
    }
    const digits = val.replace(/\D/g, '');
    const isValid = digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
    if (!isValid) {
      phoneFeedback.textContent = "Note: Phone number doesn't appear to be 10 digits. You can still proceed.";
      phoneFeedback.style.display = 'block';
    } else {
      phoneFeedback.style.display = 'none';
      phoneFeedback.textContent = '';
    }
  }

  function validateCustomerEmail() {
    const val = inputCustEmail.value.trim();
    if (!val) {
      emailFeedback.style.display = 'none';
      emailFeedback.textContent = '';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      emailFeedback.textContent = "Note: Email address format looks incomplete. You can still proceed.";
      emailFeedback.style.display = 'block';
    } else {
      emailFeedback.style.display = 'none';
      emailFeedback.textContent = '';
    }
  }

  inputCustPhone.addEventListener('input', validateCustomerPhone);
  inputCustPhone.addEventListener('blur', validateCustomerPhone);
  inputCustEmail.addEventListener('input', validateCustomerEmail);
  inputCustEmail.addEventListener('blur', validateCustomerEmail);

  // ---------------------------------------------------------------------------
  // Quick-Fill Fake Sample Data (Instant testing under 1 minute)
  // ---------------------------------------------------------------------------
  btnFillFake.addEventListener('click', () => {
    inputCustName.value = 'Jane Doe (Fake Sample Customer)';
    inputCustAddress.value = '742 Evergreen Terrace, Springfield, TX 75001';
    inputCustPhone.value = '(817) 555-0100';
    inputCustEmail.value = 'sample@example.com';
    inputYardSize.value = 5000;

    validateCustomerPhone();
    validateCustomerEmail();

    svcMowing.checked = true;
    svcEdging.checked = true;
    svcLeaf.checked = false;

    svcMulch.checked = true;
    toggleServiceQty(svcMulch, mulchQtyContainer, inputQtyMulch);
    inputQtyMulch.value = 2;

    svcHedge.checked = true;
    toggleServiceQty(svcHedge, hedgeQtyContainer, inputQtyHedge);
    inputQtyHedge.value = 1.5;

    svcError.style.display = 'none';
  });

  // ---------------------------------------------------------------------------
  // Screen 2: Calculation Engine & Quote Generation
  // ---------------------------------------------------------------------------
  newQuoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validations
    const custName = inputCustName.value.trim();
    const custAddress = inputCustAddress.value.trim();
    const custPhone = inputCustPhone.value.trim();
    const custEmail = inputCustEmail.value.trim();
    const yardSize = parseFloat(inputYardSize.value);

    if (!custName) {
      alert('Please enter a customer name.');
      inputCustName.focus();
      return;
    }

    if (!custAddress) {
      alert('Please enter the service property address.');
      inputCustAddress.focus();
      return;
    }

    if (!yardSize || yardSize <= 0) {
      alert('Please enter a valid yard size in square feet.');
      inputYardSize.focus();
      return;
    }

    const hasService = svcMowing.checked || svcEdging.checked || svcLeaf.checked || svcMulch.checked || svcHedge.checked;
    if (!hasService) {
      svcError.style.display = 'block';
      return;
    }
    svcError.style.display = 'none';

    // Pricing Calculation according to quote-rules skill:
    const areaUnits = yardSize / 1000.0;
    const lineItems = [];

    // 1. Mowing (per 1,000 sq ft)
    if (svcMowing.checked) {
      const rate = currentSettings.rates.mowing;
      const amount = areaUnits * rate;
      lineItems.push({
        name: 'Lawn Mowing',
        description: 'Mowing maintained turf areas with clippings blown clean',
        qty: `${yardSize.toLocaleString()} sq ft (${areaUnits.toFixed(2)}k units)`,
        rate: `$${rate.toFixed(2)} / 1k sq ft`,
        amount: amount
      });
    }

    // 2. Edging (per 1,000 sq ft)
    if (svcEdging.checked) {
      const rate = currentSettings.rates.edging;
      const amount = areaUnits * rate;
      lineItems.push({
        name: 'Perimeter & Bed Edging',
        description: 'Clean mechanical vertical edge along walks, driveways, and beds',
        qty: `${yardSize.toLocaleString()} sq ft (${areaUnits.toFixed(2)}k units)`,
        rate: `$${rate.toFixed(2)} / 1k sq ft`,
        amount: amount
      });
    }

    // 3. Leaf Cleanup (per 1,000 sq ft)
    if (svcLeaf.checked) {
      const rate = currentSettings.rates.leaf;
      const amount = areaUnits * rate;
      lineItems.push({
        name: 'Leaf Cleanup & Collection',
        description: 'Leaf collection, blowing, and hauling from turf and landscape beds',
        qty: `${yardSize.toLocaleString()} sq ft (${areaUnits.toFixed(2)}k units)`,
        rate: `$${rate.toFixed(2)} / 1k sq ft`,
        amount: amount
      });
    }

    // 4. Mulch (per cubic yard)
    if (svcMulch.checked) {
      const rate = currentSettings.rates.mulch;
      const yards = Math.max(0.5, parseFloat(inputQtyMulch.value) || 1);
      const amount = yards * rate;
      lineItems.push({
        name: 'Mulch Delivery & Installation',
        description: 'Premium shredded hardwood mulch installed at 2-3" depth',
        qty: `${yards} cubic yard${yards === 1 ? '' : 's'}`,
        rate: `$${rate.toFixed(2)} / cu yd`,
        amount: amount
      });
    }

    // 5. Hedge Trimming (per crew hour)
    if (svcHedge.checked) {
      const rate = currentSettings.rates.hedge;
      const hours = Math.max(0.5, parseFloat(inputQtyHedge.value) || 1);
      const amount = hours * rate;
      lineItems.push({
        name: 'Hedge & Shrub Trimming',
        description: 'Precision trimming and clean-up of perimeter hedges and shrubs',
        qty: `${hours} crew hour${hours === 1 ? '' : 's'}`,
        rate: `$${rate.toFixed(2)} / hr`,
        amount: amount
      });
    }

    // Financial Totals:
    const subtotal = lineItems.reduce((acc, item) => acc + item.amount, 0);

    // Minimum Job Charge check
    const minCharge = currentSettings.minJobCharge || 0;
    let minChargeAdj = 0;
    let baseTotal = subtotal;

    if (subtotal < minCharge) {
      minChargeAdj = minCharge - subtotal;
      baseTotal = minCharge;
    }

    // Nearest $5 Rounding
    // Math.round(baseTotal / 5) * 5
    const finalTotal = Math.round(baseTotal / 5.0) * 5.0;
    const roundingAdj = finalTotal - baseTotal;

    // Build quote state object
    const today = new Date();
    const dateFormatted = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const quoteId = `Q-${Math.floor(1000 + Math.random() * 9000)}`;

    currentQuoteData = {
      quoteId,
      dateFormatted,
      custName,
      custAddress,
      custPhone,
      custEmail,
      yardSize,
      lineItems,
      subtotal,
      minCharge,
      minChargeAdj,
      roundingAdj,
      finalTotal,
      photos: [...attachedPhotos],
      sentHistory: []
    };

    renderQuotePreview(currentQuoteData);
    showScreen('screen-preview');
  });

  // ---------------------------------------------------------------------------
  // Screen 3: Render Quote Preview
  // ---------------------------------------------------------------------------
  function renderQuotePreview(quote) {
    viewBizName.textContent = currentSettings.businessName;
    viewBizPhone.textContent = currentSettings.phone ? `📞 ${currentSettings.phone}` : '';
    viewBizEmail.textContent = currentSettings.email ? `✉️ ${currentSettings.email}` : '';
    viewQuoteDate.textContent = quote.dateFormatted;
    viewQuoteId.textContent = `#${quote.quoteId}`;

    viewCustName.textContent = quote.custName;
    viewCustAddress.textContent = quote.custAddress;
    viewYardSize.textContent = `${quote.yardSize.toLocaleString()} sq ft`;

    // Customer Contact (if provided)
    if (quote.custPhone || quote.custEmail) {
      viewCustContact.style.display = 'block';
      const parts = [];
      if (quote.custPhone) parts.push(`📞 ${escapeHtml(quote.custPhone)}`);
      if (quote.custEmail) parts.push(`✉️ ${escapeHtml(quote.custEmail)}`);
      viewCustContact.innerHTML = parts.join(' <span class="divider">·</span> ');
    } else {
      viewCustContact.style.display = 'none';
      viewCustContact.innerHTML = '';
    }

    viewQuoteTerms.textContent = currentSettings.quoteTerms || 'Standard terms apply.';

    // Populate Table Line Items
    quoteLineItems.innerHTML = '';
    quote.lineItems.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="item-service-title">${escapeHtml(item.name)}</div>
          <div class="item-service-desc">${escapeHtml(item.description)}</div>
        </td>
        <td class="text-center">${escapeHtml(item.qty)}</td>
        <td class="text-right">${escapeHtml(item.rate)}</td>
        <td class="text-right"><strong>$${item.amount.toFixed(2)}</strong></td>
      `;
      quoteLineItems.appendChild(tr);
    });

    // Subtotal
    viewSubtotal.textContent = `$${quote.subtotal.toFixed(2)}`;

    // Minimum Job Charge Row
    if (quote.minChargeAdj > 0) {
      rowMinCharge.style.display = 'flex';
      viewMinChargeFloor.textContent = quote.minCharge.toFixed(0);
      viewMinChargeAdj.textContent = `+$${quote.minChargeAdj.toFixed(2)}`;
    } else {
      rowMinCharge.style.display = 'none';
    }

    // Rounding adjustment row
    const roundingSign = quote.roundingAdj >= 0 ? '+' : '-';
    viewRoundingAdj.textContent = `${roundingSign}$${Math.abs(quote.roundingAdj).toFixed(2)}`;

    // Final Total (Rounded to nearest $5)
    viewFinalTotal.textContent = `$${quote.finalTotal.toFixed(2)}`;

    // Render Preview Photos
    if (quote.photos && quote.photos.length > 0) {
      quotePreviewPhotos.style.display = 'block';
      quotePhotosGallery.innerHTML = '';
      quote.photos.forEach((dataUrl, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'preview-photo-wrap';
        const img = document.createElement('img');
        img.src = dataUrl;
        img.alt = `Site reference photo ${idx + 1}`;
        wrap.appendChild(img);
        quotePhotosGallery.appendChild(wrap);
      });
    } else {
      quotePreviewPhotos.style.display = 'none';
      quotePhotosGallery.innerHTML = '';
    }

    // Refresh Send to Customer buttons & preview messages
    updateSendSection(quote);
  }

  // ---------------------------------------------------------------------------
  // Message Generation & Send Helpers
  // ---------------------------------------------------------------------------
  function getCustomerFirstName(fullName) {
    if (!fullName) return 'there';
    const trimmed = fullName.trim();
    // Strip parenthetical suffixes (e.g., "(Fake Sample Customer)")
    const clean = trimmed.replace(/\s*\([^)]*\)/g, '').trim();
    const first = clean.split(/\s+/)[0];
    return first || trimmed;
  }

  function formatMoneyShort(amount) {
    const num = Number(amount) || 0;
    return num % 1 === 0 ? `$${num.toFixed(0)}` : `$${num.toFixed(2)}`;
  }

  function generateSmsMessage(quote, settings) {
    const firstName = getCustomerFirstName(quote.custName);
    const bizName = settings.businessName || 'our crew';
    const phone = settings.phone || '';

    // Extract validity days from quote terms, default to 14
    const daysMatch = settings.quoteTerms ? settings.quoteTerms.match(/(\d+)\s*days?/i) : null;
    const validityDays = daysMatch ? daysMatch[1] : '14';

    const lines = [
      `Hi ${firstName}, here's your quote from ${bizName}:`
    ];

    quote.lineItems.forEach(item => {
      let label = item.name;
      if (/mowing/i.test(item.name)) {
        label = 'Mowing';
      } else if (/edging/i.test(item.name)) {
        label = 'Edging';
      } else if (/leaf/i.test(item.name)) {
        label = 'Leaf cleanup';
      } else if (/mulch/i.test(item.name)) {
        const yards = item.qty.replace(/[^0-9.]/g, '');
        label = `Mulch (${yards} cu yd)`;
      } else if (/hedge/i.test(item.name)) {
        const hours = item.qty.replace(/[^0-9.]/g, '');
        label = `Hedge trimming (${hours} hr)`;
      }
      lines.push(`- ${label}: ${formatMoneyShort(item.amount)}`);
    });

    if (quote.minChargeAdj > 0) {
      lines.push(`- Minimum job charge floor: $${quote.minCharge.toFixed(0)} applied (+${formatMoneyShort(quote.minChargeAdj)})`);
    }

    lines.push(`Total: ${formatMoneyShort(quote.finalTotal)}`);
    lines.push(`Quote #${quote.quoteId}, valid for ${validityDays} days.`);

    if (phone) {
      lines.push(`Questions? Call ${phone}.`);
    } else if (settings.email) {
      lines.push(`Questions? Email ${settings.email}.`);
    } else {
      lines.push(`Questions? Let us know!`);
    }

    return lines.join('\n');
  }

  function generateEmailQuote(quote, settings) {
    const firstName = getCustomerFirstName(quote.custName);
    const bizName = settings.businessName || 'Our Lawn Care & Landscaping Crew';
    const bizPhone = settings.phone || '';
    const bizEmail = settings.email || '';
    const terms = settings.quoteTerms || 'Estimates valid for 14 days. Payment due upon completion of services.';

    const subject = `Your quote from ${bizName} – #${quote.quoteId}`;

    const lines = [
      `Hi ${firstName},`,
      '',
      `Thank you for the opportunity to quote lawn care and landscaping services for your property at ${quote.custAddress}.`,
      '',
      `QUOTE DETAILS (Ref: #${quote.quoteId} · Date: ${quote.dateFormatted})`,
      '--------------------------------------------------',
    ];

    quote.lineItems.forEach(item => {
      lines.push(`- ${item.name}: $${item.amount.toFixed(2)}`);
      lines.push(`  Scope: ${item.qty} @ ${item.rate}`);
    });

    lines.push('--------------------------------------------------');
    lines.push(`Subtotal: $${quote.subtotal.toFixed(2)}`);

    if (quote.minChargeAdj > 0) {
      lines.push(`Minimum Job Charge Adjustment: +$${quote.minChargeAdj.toFixed(2)} (Minimum job charge floor of $${quote.minCharge.toFixed(0)} applied)`);
    }

    const roundSign = quote.roundingAdj >= 0 ? '+' : '-';
    lines.push(`Nearest $5 Rounding Adjustment: ${roundSign}$${Math.abs(quote.roundingAdj).toFixed(2)}`);
    lines.push(`Total Quote: $${quote.finalTotal.toFixed(2)}`);
    lines.push('');
    lines.push('TERMS & CONDITIONS:');
    lines.push(terms);
    lines.push('');
    lines.push('If you have any questions or would like to approve this quote, please call or reply directly to this email!');
    lines.push('');
    lines.push('Best regards,');
    lines.push(bizName);
    if (bizPhone) lines.push(`Phone: ${bizPhone}`);
    if (bizEmail) lines.push(`Email: ${bizEmail}`);

    const body = lines.join('\n');
    return { subject, body };
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function buildSmsUrl(phone, text) {
    const cleanPhone = phone ? phone.replace(/[^\d+]/g, '') : '';
    // Encode properly for URL query parameters; encode single quote to %27
    const encodedBody = encodeURIComponent(text).replace(/'/g, '%27');

    if (isIOS()) {
      return cleanPhone ? `sms:${cleanPhone}&body=${encodedBody}` : `sms:&body=${encodedBody}`;
    } else {
      return cleanPhone ? `sms:${cleanPhone}?body=${encodedBody}` : `sms:?body=${encodedBody}`;
    }
  }

  function buildMailtoUrl(email, subject, body) {
    const cleanEmail = email ? email.trim() : '';
    const encodedSub = encodeURIComponent(subject).replace(/'/g, '%27');
    const encodedBody = encodeURIComponent(body).replace(/'/g, '%27');
    return `mailto:${cleanEmail}?subject=${encodedSub}&body=${encodedBody}`;
  }

  function copyToClipboard(text, onSuccess, onError) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(onSuccess)
        .catch(() => fallbackClipboardCopy(text, onSuccess, onError));
    } else {
      fallbackClipboardCopy(text, onSuccess, onError);
    }
  }

  function fallbackClipboardCopy(text, onSuccess, onError) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (successful) {
        onSuccess();
      } else {
        onError(new Error('execCommand copy returned false'));
      }
    } catch (err) {
      onError(err);
    }
  }

  function recordQuoteSent(channel) {
    if (!currentQuoteData) return;
    const now = new Date();
    const timeFormatted = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' at ' + now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });

    const entry = {
      channel,
      timestamp: now.toISOString(),
      displayDate: timeFormatted
    };

    if (!currentQuoteData.sentHistory) {
      currentQuoteData.sentHistory = [];
    }
    currentQuoteData.sentHistory.push(entry);

    const channelLabel = channel === 'text' ? 'text' : channel === 'email' ? 'email' : 'copy';
    sendStatusBadge.textContent = `✓ Sent on ${timeFormatted} by ${channelLabel}`;
    sendStatusBadge.style.display = 'inline-block';
  }

  function updateSendSection(quote) {
    const smsText = generateSmsMessage(quote, currentSettings);
    const emailData = generateEmailQuote(quote, currentSettings);

    btnSendSms.href = buildSmsUrl(quote.custPhone, smsText);
    if (quote.custPhone) {
      labelSmsTarget.textContent = `To: ${quote.custPhone}`;
    } else {
      labelSmsTarget.textContent = 'Pick contact in app';
    }

    btnSendEmail.href = buildMailtoUrl(quote.custEmail, emailData.subject, emailData.body);
    if (quote.custEmail) {
      labelEmailTarget.textContent = `To: ${quote.custEmail}`;
    } else {
      labelEmailTarget.textContent = 'Pick recipient in app';
    }

    previewSmsRecipient.innerHTML = `<strong>Recipient:</strong> ${quote.custPhone ? escapeHtml(quote.custPhone) : '<em>(None specified – select in messaging app)</em>'}`;
    previewSmsContent.textContent = smsText;

    previewEmailRecipient.innerHTML = `<strong>To:</strong> ${quote.custEmail ? escapeHtml(quote.custEmail) : '<em>(None specified – select in email app)</em>'}`;
    previewEmailSubject.innerHTML = `<strong>Subject:</strong> ${escapeHtml(emailData.subject)}`;
    previewEmailContent.textContent = emailData.body;

    if (quote.sentHistory && quote.sentHistory.length > 0) {
      const last = quote.sentHistory[quote.sentHistory.length - 1];
      const channelLabel = last.channel === 'text' ? 'text' : last.channel === 'email' ? 'email' : 'copy';
      sendStatusBadge.textContent = `✓ Sent on ${last.displayDate} by ${channelLabel}`;
      sendStatusBadge.style.display = 'inline-block';
    } else {
      sendStatusBadge.style.display = 'none';
      sendStatusBadge.textContent = '';
    }

    copyConfirmToast.style.display = 'none';
    copyErrorToast.style.display = 'none';
  }

  // Send action listeners
  btnSendSms.addEventListener('click', () => {
    recordQuoteSent('text');
  });

  btnSendEmail.addEventListener('click', () => {
    recordQuoteSent('email');
  });

  let copyToastTimeout = null;
  btnCopyQuote.addEventListener('click', () => {
    if (!currentQuoteData) return;
    const { body } = generateEmailQuote(currentQuoteData, currentSettings);
    copyToClipboard(
      body,
      () => {
        recordQuoteSent('copy');
        copyErrorToast.style.display = 'none';
        copyConfirmToast.style.display = 'block';
        if (copyToastTimeout) clearTimeout(copyToastTimeout);
        copyToastTimeout = setTimeout(() => {
          copyConfirmToast.style.display = 'none';
        }, 2000);
      },
      (err) => {
        console.warn('Clipboard write failed:', err);
        copyConfirmToast.style.display = 'none';
        copyErrorToast.style.display = 'block';
        showMsgPreview();
      }
    );
  });

  // Message preview toggle & tabs
  function showMsgPreview() {
    msgPreviewContainer.style.display = 'block';
    btnToggleMsgPreview.setAttribute('aria-expanded', 'true');
  }

  function hideMsgPreview() {
    msgPreviewContainer.style.display = 'none';
    btnToggleMsgPreview.setAttribute('aria-expanded', 'false');
  }

  btnToggleMsgPreview.addEventListener('click', () => {
    const isExpanded = btnToggleMsgPreview.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      hideMsgPreview();
    } else {
      showMsgPreview();
    }
  });

  tabBtnSms.addEventListener('click', () => {
    tabBtnSms.classList.add('active');
    tabBtnSms.setAttribute('aria-selected', 'true');
    tabBtnEmail.classList.remove('active');
    tabBtnEmail.setAttribute('aria-selected', 'false');
    previewPanelSms.style.display = 'block';
    previewPanelEmail.style.display = 'none';
  });

  tabBtnEmail.addEventListener('click', () => {
    tabBtnEmail.classList.add('active');
    tabBtnEmail.setAttribute('aria-selected', 'true');
    tabBtnSms.classList.remove('active');
    tabBtnSms.setAttribute('aria-selected', 'false');
    previewPanelEmail.style.display = 'block';
    previewPanelSms.style.display = 'none';
  });

  // ---------------------------------------------------------------------------
  // Screen 3 Actions: Print, Edit, Start Fresh
  // ---------------------------------------------------------------------------
  btnPrint.addEventListener('click', () => {
    window.print();
  });

  btnEditQuote.addEventListener('click', () => {
    showScreen('screen-newquote');
  });

  btnNewQuote.addEventListener('click', () => {
    if (confirm('Start a fresh new quote?')) {
      newQuoteForm.reset();
      inputCustPhone.value = '';
      inputCustEmail.value = '';
      phoneFeedback.style.display = 'none';
      emailFeedback.style.display = 'none';
      sendStatusBadge.style.display = 'none';
      copyConfirmToast.style.display = 'none';
      copyErrorToast.style.display = 'none';
      hideMsgPreview();
      attachedPhotos = [];
      renderThumbnails();
      toggleServiceQty(svcMulch, mulchQtyContainer, inputQtyMulch);
      toggleServiceQty(svcHedge, hedgeQtyContainer, inputQtyHedge);
      svcError.style.display = 'none';
      showScreen('screen-newquote');
    }
  });

  // Helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------
  loadSettings();
  showScreen('screen-newquote'); // Default opening view for fast mobile field quoting

})();
