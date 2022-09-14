import { removeKeys } from "./removeKeys";

describe('removeKeys test', () => {
   test('removeKeys basic test', () => {
      let obj = [{'test': 1, 'bonsoir': 2},
         {'allo': null, 'test': 333}];
      let validObj = [{'bonsoir': 2}, {'allo': null}];
      expect(removeKeys(obj, ['test'])).toEqual(validObj);
   });
});