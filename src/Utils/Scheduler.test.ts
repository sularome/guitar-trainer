import { Scheduler } from "./Scheduler";

describe(Scheduler.name, () => {
    beforeEach(() => {
        jest.useFakeTimers();
    })
    afterEach(() => {
        jest.useRealTimers();
    })
    it (`should notify subscribers every 1s`, () => {
        const time: number = 1000;
        const scheduler: Scheduler = new Scheduler(time);
        const spy: jest.Mock = jest.fn(() => null);
        scheduler.subscribe(spy);
        jest.advanceTimersByTime(time);
        expect(spy).toHaveBeenCalled();
    })
    it (`should be able to unsubscribe`, () => {
        const time: number = 1000;
        const scheduler: Scheduler = new Scheduler(time);
        const spy: jest.Mock = jest.fn(() => null);
        scheduler.subscribe(spy);
        expect(spy).not.toHaveBeenCalled();
        scheduler.unsubscribe(spy);
        jest.advanceTimersByTime(time);
        expect(spy).not.toHaveBeenCalled();
    })
})