export class Scheduler {
    private timeoutId: number | null = null;
    private callbacks: Function[] = [];

    constructor (public notificationIntervalMs: number) {
        this.start();
    }

    public subscribe(fc: Function): Function {
        this.callbacks.push(fc);
        return () => this.unsubscribe(fc)
    }

    public unsubscribe(callback: Function): void {
        this.callbacks = this.callbacks.filter(f => f !== callback);
    }

    private notify(): void {
        this.callbacks.forEach(c => c());
    }

    public destroy(): void {
        if (this.timeoutId !== null) {
            this.timeoutId = null;
        }
    }

    public stop(): void {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    public start(): void {
        this.tick();
    }

    public toggle(): void {
        if (this.timeoutId === null) {
            this.start();
        } else {
            this.stop();
        }
    }

    private tick(): void {
        this.timeoutId = window.setTimeout(() => {this.notify(); this.tick();}, this.notificationIntervalMs)
    }

    public isStopped(): boolean {
        return this.timeoutId === null;
    }

}