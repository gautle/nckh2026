(function () {
  const KEY = 'METRICS';
  const LIMIT_EVENTS = 200;
  const DEFAULT_METRICS = {
    profile_views: 0,
    booking_clicks: 0,
    media_prompts: 0,
    media_consent_yes: 0,
    media_consent_no: 0,
    last_updated: null,
    events: [],
    by_place: {}
  };

  function cloneDefaults() {
    return JSON.parse(JSON.stringify(DEFAULT_METRICS));
  }

  function normalize(data) {
    const next = cloneDefaults();
    if (!data || typeof data !== 'object') return next;

    next.profile_views = Number(data.profile_views) || 0;
    next.booking_clicks = Number(data.booking_clicks) || 0;
    next.media_prompts = Number(data.media_prompts) || 0;
    next.media_consent_yes = Number(data.media_consent_yes) || 0;
    next.media_consent_no = Number(data.media_consent_no) || 0;
    next.last_updated = typeof data.last_updated === 'string' ? data.last_updated : null;
    next.events = Array.isArray(data.events) ? data.events.slice(0, LIMIT_EVENTS) : [];
    next.by_place = data.by_place && typeof data.by_place === 'object' ? data.by_place : {};
    return next;
  }

  function readMetrics() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return cloneDefaults();
      return normalize(JSON.parse(raw));
    } catch (_err) {
      return cloneDefaults();
    }
  }

  function writeMetrics(metrics) {
    const normalized = normalize(metrics);
    localStorage.setItem(KEY, JSON.stringify(normalized));
    return normalized;
  }

  function ensurePlace(metrics, placeId) {
    if (!placeId) return null;
    if (!metrics.by_place[placeId] || typeof metrics.by_place[placeId] !== 'object') {
      metrics.by_place[placeId] = {
        profile_views: 0,
        booking_clicks: 0,
        media_prompts: 0,
        media_consent_yes: 0,
        media_consent_no: 0
      };
    }
    return metrics.by_place[placeId];
  }

  function bump(metrics, field, placeId) {
    if (!Object.prototype.hasOwnProperty.call(metrics, field)) return;
    metrics[field] += 1;
    const placeMetrics = ensurePlace(metrics, placeId);
    if (placeMetrics && Object.prototype.hasOwnProperty.call(placeMetrics, field)) {
      placeMetrics[field] += 1;
    }
  }

  function track(eventName, payload) {
    const metrics = readMetrics();
    const placeId = payload && typeof payload.place_id === 'string' ? payload.place_id : '';
    const now = new Date().toISOString();

    if (eventName === 'profile_view') bump(metrics, 'profile_views', placeId);
    if (eventName === 'booking_click') bump(metrics, 'booking_clicks', placeId);
    if (eventName === 'media_prompt') bump(metrics, 'media_prompts', placeId);
    if (eventName === 'media_consent_yes') bump(metrics, 'media_consent_yes', placeId);
    if (eventName === 'media_consent_no') bump(metrics, 'media_consent_no', placeId);

    metrics.last_updated = now;
    metrics.events.unshift({
      event: eventName,
      place_id: placeId,
      source: payload && payload.source ? String(payload.source) : '',
      media: payload && payload.media ? String(payload.media) : '',
      at: now
    });
    if (metrics.events.length > LIMIT_EVENTS) metrics.events = metrics.events.slice(0, LIMIT_EVENTS);

    return writeMetrics(metrics);
  }

  window.AppMetrics = {
    KEY,
    readMetrics,
    writeMetrics,
    track
  };
})();
