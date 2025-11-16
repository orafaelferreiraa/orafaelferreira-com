declare global {
    interface Window {
        dataLayer?: any[];
        gtag?: (...args: any[]) => void;
        _gaInitialized?: boolean;
    }
}

export function initGA(measurementId?: string) {
    if (!measurementId || typeof window === "undefined") return;
    if (window._gaInitialized) return;
    window._gaInitialized = true;

    // Load gtag script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
        window.dataLayer!.push(arguments);
    }
    window.gtag = gtag as any;
    window.gtag("js", new Date());
    window.gtag("config", measurementId);
}

export function trackPageView(measurementId: string, path: string) {
    if (typeof window === "undefined" || !window.gtag || !measurementId) return;
    window.gtag("config", measurementId, { page_path: path });
}
