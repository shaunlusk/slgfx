var testfn = (a,b) => {
  return a + b;
};

describe('TheFirstTest', () => {
  describe('method 1', () => {
    it('should do', done => {
      var result = testfn(1,2);
      expect(result).toBe(1+2);
      done();
    });
  });
});
