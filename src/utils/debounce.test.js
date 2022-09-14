import { debounce } from "./debounce";

describe("debounce tests", () => {
   test('basic debounce test', () => {
       let tmp = [1, 2, 3, 'soleil']

       const test = debounce((tmp) => {
           for (let i = 0; i < tmp.length; i++) {
               tmp[i]++;
           }
       }, 500);

       test(tmp);
       test(tmp);
       test(tmp);
       setTimeout(() => {
           expect(test).toHaveBeenCalledTimes(1);
       }, 600);
   });
});