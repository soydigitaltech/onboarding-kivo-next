"use client";

type Punto = {
  x: number;
  y: number;
};

type CvLike = any;

declare global {
  interface Window {
    cv?: CvLike;
    __kivoOpenCvPromise?: Promise<CvLike>;
  }
}

async function esperarCv(): Promise<CvLike> {
  for (let intento = 0; intento < 200; intento += 1) {
    const cv = window.cv;

    if (cv) {
      if (cv.ready instanceof Promise) {
        await cv.ready;
      }

      if (
        typeof cv.imread === "function" &&
        typeof cv.Mat === "function"
      ) {
        return cv;
      }
    }

    await new Promise((resolve) =>
      window.setTimeout(resolve, 50),
    );
  }

  throw new Error(
    "OpenCV no pudo inicializarse.",
  );
}

async function cargarOpenCv(): Promise<CvLike> {
  if (typeof window === "undefined") {
    throw new Error(
      "OpenCV solo está disponible en el navegador.",
    );
  }

  if (
    window.cv &&
    typeof window.cv.imread === "function"
  ) {
    return window.cv;
  }

  if (window.__kivoOpenCvPromise) {
    return window.__kivoOpenCvPromise;
  }

  window.__kivoOpenCvPromise =
    new Promise<CvLike>((resolve, reject) => {
      const existente =
        document.querySelector<HTMLScriptElement>(
          'script[data-kivo-opencv="true"]',
        );

      const terminar = async () => {
        try {
          const cv = await esperarCv();
          resolve(cv);
        } catch (error) {
          reject(error);
        }
      };

      if (existente) {
        void terminar();
        return;
      }

      const script =
        document.createElement("script");

      script.src = "/vendor/opencv.js";
      script.async = true;
      script.dataset.kivoOpencv = "true";

      script.onload = () => {
        void terminar();
      };

      script.onerror = () => {
        reject(
          new Error(
            "No pudimos cargar OpenCV.",
          ),
        );
      };

      document.head.appendChild(script);
    });

  return window.__kivoOpenCvPromise;
}

function ordenarPuntos(puntos: Punto[]): [
  Punto,
  Punto,
  Punto,
  Punto,
] {
  const porSuma = [...puntos].sort(
    (a, b) => a.x + a.y - (b.x + b.y),
  );

  const porDiferencia = [...puntos].sort(
    (a, b) => a.y - a.x - (b.y - b.x),
  );

  const arribaIzquierda = porSuma[0];
  const abajoDerecha = porSuma[3];

  const arribaDerecha = porDiferencia[0];
  const abajoIzquierda = porDiferencia[3];

  return [
    arribaIzquierda,
    arribaDerecha,
    abajoDerecha,
    abajoIzquierda,
  ];
}

function cargarImagen(
  dataUrl: string,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () =>
      reject(
        new Error(
          "No pudimos preparar la imagen del carnet.",
        ),
      );

    image.src = dataUrl;
  });
}

export async function procesarCarnetOpenCv(
  dataUrl: string,
): Promise<string | null> {
  const cv = await cargarOpenCv();
  const image = await cargarImagen(dataUrl);

  const origenCanvas =
    document.createElement("canvas");

  origenCanvas.width = image.naturalWidth;
  origenCanvas.height = image.naturalHeight;

  const origenCtx =
    origenCanvas.getContext("2d");

  if (!origenCtx) return null;

  origenCtx.drawImage(image, 0, 0);

  let src: any;
  let gray: any;
  let blur: any;
  let edges: any;
  let contours: any;
  let hierarchy: any;

  try {
    src = cv.imread(origenCanvas);
    gray = new cv.Mat();
    blur = new cv.Mat();
    edges = new cv.Mat();

    cv.cvtColor(
      src,
      gray,
      cv.COLOR_RGBA2GRAY,
      0,
    );

    cv.GaussianBlur(
      gray,
      blur,
      new cv.Size(5, 5),
      0,
      0,
      cv.BORDER_DEFAULT,
    );

    cv.Canny(
      blur,
      edges,
      60,
      160,
    );

    contours = new cv.MatVector();
    hierarchy = new cv.Mat();

    cv.findContours(
      edges,
      contours,
      hierarchy,
      cv.RETR_LIST,
      cv.CHAIN_APPROX_SIMPLE,
    );

    let mejor:
      | {
          puntos: Punto[];
          area: number;
        }
      | null = null;

    const areaImagen =
      src.cols * src.rows;

    for (
      let i = 0;
      i < contours.size();
      i += 1
    ) {
      const contour = contours.get(i);

      const peri =
        cv.arcLength(contour, true);

      const approx =
        new cv.Mat();

      cv.approxPolyDP(
        contour,
        approx,
        0.02 * peri,
        true,
      );

      const area =
        Math.abs(
          cv.contourArea(approx),
        );

      if (
        approx.rows === 4 &&
        area > areaImagen * 0.18
      ) {
        const datos =
          approx.data32S;

        const puntos: Punto[] = [];

        for (
          let j = 0;
          j < datos.length;
          j += 2
        ) {
          puntos.push({
            x: datos[j],
            y: datos[j + 1],
          });
        }

        if (
          puntos.length === 4 &&
          (!mejor || area > mejor.area)
        ) {
          mejor = {
            puntos,
            area,
          };
        }
      }

      approx.delete();
      contour.delete();
    }

    if (!mejor) {
      return null;
    }

    const [
      tl,
      tr,
      br,
      bl,
    ] = ordenarPuntos(
      mejor.puntos,
    );

    const destinoWidth = 1400;
    const destinoHeight = 883;

    const srcTri = cv.matFromArray(
      4,
      1,
      cv.CV_32FC2,
      [
        tl.x, tl.y,
        tr.x, tr.y,
        br.x, br.y,
        bl.x, bl.y,
      ],
    );

    const dstTri = cv.matFromArray(
      4,
      1,
      cv.CV_32FC2,
      [
        0, 0,
        destinoWidth - 1, 0,
        destinoWidth - 1, destinoHeight - 1,
        0, destinoHeight - 1,
      ],
    );

    const transform =
      cv.getPerspectiveTransform(
        srcTri,
        dstTri,
      );

    const dst =
      new cv.Mat();

    cv.warpPerspective(
      src,
      dst,
      transform,
      new cv.Size(
        destinoWidth,
        destinoHeight,
      ),
      cv.INTER_LINEAR,
      cv.BORDER_CONSTANT,
      new cv.Scalar(),
    );

    const salidaCanvas =
      document.createElement("canvas");

    salidaCanvas.width =
      destinoWidth;

    salidaCanvas.height =
      destinoHeight;

    cv.imshow(
      salidaCanvas,
      dst,
    );

    const resultado =
      salidaCanvas.toDataURL(
        "image/jpeg",
        0.88,
      );

    srcTri.delete();
    dstTri.delete();
    transform.delete();
    dst.delete();

    return resultado;
  } finally {
    src?.delete?.();
    gray?.delete?.();
    blur?.delete?.();
    edges?.delete?.();
    contours?.delete?.();
    hierarchy?.delete?.();
  }
}
