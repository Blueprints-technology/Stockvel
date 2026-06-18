"use client";

import { SciChartSurface, libraryVersion } from "scichart";

export type SciChartRuntimeState = {
  wasmContext: unknown | null;
  dataUrl: string;
  wasmUrl: string;
  initialized: boolean;
  licenseApplied: boolean;
  initPromise: Promise<SciChartRuntimeState> | null;
};

const SCI_CHART_GLOBAL_KEY = "__stockvelSciChartRuntime__";

type GlobalWithSciChart = typeof globalThis & {
  [SCI_CHART_GLOBAL_KEY]?: SciChartRuntimeState;
};

function getAssetUrls() {
  const version = libraryVersion;
  const baseCdn = `https://cdn.jsdelivr.net/npm/scichart@${version}/_wasm`;

  return {
    dataUrl:
      process.env.NEXT_PUBLIC_SCICHART_DATA_URL ?? `${baseCdn}/scichart2d.data`,
    wasmUrl:
      process.env.NEXT_PUBLIC_SCICHART_WASM_URL ?? `${baseCdn}/scichart2d.wasm`,
  };
}

function getRuntimeCache(): SciChartRuntimeState {
  const scopedGlobal = globalThis as GlobalWithSciChart;
  if (!scopedGlobal[SCI_CHART_GLOBAL_KEY]) {
    const { dataUrl, wasmUrl } = getAssetUrls();
    scopedGlobal[SCI_CHART_GLOBAL_KEY] = {
      wasmContext: null,
      dataUrl,
      wasmUrl,
      initialized: false,
      licenseApplied: false,
      initPromise: null,
    };
  }

  return scopedGlobal[SCI_CHART_GLOBAL_KEY]!;
}

function applyRuntimeLicense(cache: SciChartRuntimeState) {
  if (cache.licenseApplied) return;

  const runtimeKey = process.env.NEXT_PUBLIC_SCICHART_LICENSE_KEY?.trim();
  if (runtimeKey) {
    SciChartSurface.setRuntimeLicenseKey(runtimeKey);
  }

  cache.licenseApplied = true;
}

function configureWasm(cache: SciChartRuntimeState) {
  SciChartSurface.autoDisposeWasmContext = false;
  SciChartSurface.configure({
    dataUrl: cache.dataUrl,
    wasmUrl: cache.wasmUrl,
  });
}

async function warmSharedWasmContext(cache: SciChartRuntimeState) {
  if (typeof window === "undefined") {
    cache.initialized = true;
    return cache;
  }

  const bootstrapId = "__stockvel_scichart_bootstrap_surface__";
  let bootstrapHost = document.getElementById(
    bootstrapId,
  ) as HTMLDivElement | null;

  if (!bootstrapHost) {
    bootstrapHost = document.createElement("div");
    bootstrapHost.id = bootstrapId;
    bootstrapHost.setAttribute("aria-hidden", "true");
    bootstrapHost.style.position = "fixed";
    bootstrapHost.style.left = "-10000px";
    bootstrapHost.style.top = "0";
    bootstrapHost.style.width = "4px";
    bootstrapHost.style.height = "4px";
    bootstrapHost.style.pointerEvents = "none";
    bootstrapHost.style.opacity = "0";
    document.body.appendChild(bootstrapHost);
  }

  const { sciChartSurface, wasmContext } =
    await SciChartSurface.create(bootstrapHost);
  cache.wasmContext = wasmContext;
  cache.initialized = true;

  sciChartSurface.delete();
  bootstrapHost.remove();

  return cache;
}

export async function ensureSciChartInitialized() {
  const cache = getRuntimeCache();
  if (cache.initialized) {
    return cache;
  }

  if (cache.initPromise) {
    return cache.initPromise;
  }

  cache.initPromise = (async () => {
    applyRuntimeLicense(cache);
    configureWasm(cache);
    return warmSharedWasmContext(cache);
  })().finally(() => {
    cache.initPromise = null;
  });

  return cache.initPromise;
}

export function getSciChartRuntimeSnapshot() {
  return getRuntimeCache();
}

export function getSciChartDataUrl() {
  return getRuntimeCache().dataUrl;
}
