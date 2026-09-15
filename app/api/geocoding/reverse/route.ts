import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
) {
  const { searchParams } =
    new URL(request.url);

  const lat = Number(
    searchParams.get("lat"),
  );

  const lng = Number(
    searchParams.get("lng"),
  );

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return NextResponse.json(
      {
        error:
          "Coordenadas inválidas.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const url = new URL(
      "https://nominatim.openstreetmap.org/reverse",
    );

    url.searchParams.set(
      "format",
      "jsonv2",
    );

    url.searchParams.set(
      "lat",
      String(lat),
    );

    url.searchParams.set(
      "lon",
      String(lng),
    );

    url.searchParams.set(
      "zoom",
      "18",
    );

    url.searchParams.set(
      "addressdetails",
      "1",
    );

    url.searchParams.set(
      "accept-language",
      "es",
    );

    const response = await fetch(
      url.toString(),
      {
        headers: {
          Accept:
            "application/json",
          "User-Agent":
            "Kivo-Onboarding-Mock/1.0",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        "Nominatim no respondió correctamente.",
      );
    }

    const data = await response.json();

    const address =
      data.address ?? {};

    const calle =
      address.road ??
      address.pedestrian ??
      address.residential ??
      address.footway ??
      "";

    const numero =
      address.house_number ?? "";

    const zona =
      address.neighbourhood ??
      address.suburb ??
      address.quarter ??
      "";

    const ciudad =
      address.city ??
      address.town ??
      address.village ??
      address.municipality ??
      "";

    const calleCompleta = [
      calle,
      numero,
    ]
      .filter(Boolean)
      .join(" ");

    const direccionCorta = [
      calleCompleta,
      zona,
      ciudad,
    ]
      .filter(Boolean)
      .join(", ");

    return NextResponse.json({
      lat,
      lng,

      direccion:
        direccionCorta ||
        data.display_name ||
        "",

      direccionCompleta:
        data.display_name ??
        "",

      zona,
      ciudad,
    });
  } catch (error) {
    console.error(
      "Error reverse geocoding:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No pudimos identificar la dirección.",
      },
      {
        status: 502,
      },
    );
  }
}
