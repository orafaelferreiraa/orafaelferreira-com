declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
        _gaInitialized?: boolean;
    }
}

export function initGA(measurementId?: string) {
    if (!measurementId || typeof window === "undefined") return;
    // If analytics already exists, don't inject second script
    if (window._gaInitialized) return;
    if (typeof window.gtag === 'function') {
        window._gaInitialized = true;
        return;
    }
    window._gaInitialized = true;

    // Load gtag script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
        window.dataLayer!.push(args);
    }
    window.gtag = gtag;
    window._gaInitialized = true;
    window.gtag("js", new Date());
    // Prevent automatic page_view — SPA will call trackPageView on navigation
    window.gtag("config", measurementId, { send_page_view: false });
}

export function trackPageView(measurementId: string | undefined, path: string) {
    if (typeof window === "undefined" || !window.gtag) return;
    // If measurementId provided, update config for GA4 property and set path
    if (measurementId) {
        window.gtag("config", measurementId, { page_path: path });
        return;
    }
    // If GA was already included (hard-coded in index.html), send page_view event directly
    window.gtag("event", "page_view", { page_path: path });
}
