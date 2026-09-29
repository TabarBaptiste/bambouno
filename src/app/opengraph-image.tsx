import { ImageResponse } from "next/og";
import { site } from "@/data/site";

/**
 * Aperçu affiché quand le lien du site est partagé (WhatsApp, Facebook…).
 * Généré au build, dans la charte : fond noir, titre rouge. Pas de photo tant
 * qu'on n'a pas les vraies pizzas du client.
 */
export const alt = `${site.name} — pizzas, crêpes et friands à emporter à ${site.address.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(circle at 50% -10%, #5a1511 0%, #0a0a0a 60%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 140, fontWeight: 900, fontStyle: "italic", lineHeight: 1 }}>
          <span>BAMBOU</span>
          <span style={{ color: "#e63329" }}>NO</span>
        </div>
        <div style={{ marginTop: 12, width: 520, height: 6, background: "#ffffff" }} />
        <div style={{ marginTop: 40, fontSize: 48, fontWeight: 700 }}>
          Pizzas, crêpes & friands à emporter
        </div>
        <div style={{ marginTop: 16, fontSize: 36, color: "#a3a3a3" }}>
          {`${site.address.city}, ${site.address.region} · ${site.phoneDisplay}`}
        </div>
      </div>
    ),
    size,
  );
}
