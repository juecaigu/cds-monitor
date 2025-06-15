export type RecordType = Record<string, unknown>;

export interface MPerformanceNavigationTiming {
  FP?: number;
  TTI?: number;
  DomReady?: number;
  Load?: number;
  FirstByte?: number;
  DNS?: number;
  TCP?: number;
  SSL?: number;
  TTFB?: number;
  Trans?: number;
  DomParse?: number;
  Res?: number;
}

export interface Dpss {
  score: number;
  els: { score: number; weight: number; node: Element }[];
  dpss: Dpss[];
}
