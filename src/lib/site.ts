/**
 * Identidade canônica do site. Mantido em um lugar só porque a URL aparece em
 * meta tags e no JSON-LD.
 *
 * Forma canônica: com `www`, sem barra final.
 * O equivalente de build time vive em `scripts/lib/load-articles.mjs`, que roda
 * em Node puro e não pode importar deste módulo.
 */
export const SITE_URL = "https://www.orafaelferreira.com";
