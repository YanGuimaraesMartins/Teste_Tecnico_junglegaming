// Network Scenarios for MSW

export const SCENARIOS = [
  'success',
  'empty',
  'paginated',
  'slow',
  'variable-latency',
  'out-of-order',
  'timeout',
  'network-error',
  'http-error-4xx',
  'http-error-5xx',
  'ranking-fail',
  'history-fail',
  'match-timeout-recover',
  'match-unavailable-recover',
] as const;

export type Scenario = typeof SCENARIOS[number];

class ScenarioManager {
  private currentScenario: Scenario = 'success';
  private seed: number = 42;
  
  constructor() {
    this.loadFromStorage();
    // Default to env var if available
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_MSW_SCENARIO) {
      this.currentScenario = import.meta.env.VITE_MSW_SCENARIO as Scenario;
    }
  }

  public get() { return this.currentScenario; }
  
  public set(scenario: Scenario) {
    this.currentScenario = scenario;
    this.saveToStorage();
  }
  
  public getSeed() { return this.seed; }
  
  public setSeed(seed: number) {
    this.seed = seed;
    this.saveToStorage();
  }

  private loadFromStorage() {
    try {
      const s = localStorage.getItem('msw_scenario');
      if (s && SCENARIOS.includes(s as Scenario)) this.currentScenario = s as Scenario;
      
      const seed = localStorage.getItem('msw_seed');
      if (seed) this.seed = parseInt(seed, 10);
    } catch {
      // ignore
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('msw_scenario', this.currentScenario);
      localStorage.setItem('msw_seed', this.seed.toString());
    } catch {
      // ignore
    }
  }
}

export const scenarioManager = new ScenarioManager();
