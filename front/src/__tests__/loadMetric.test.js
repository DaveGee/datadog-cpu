import loadReducer from '../features/loadMetric/loadSlice'
  
  describe('load metric reducer should', () => {

    it('should handle initial state', () => {
      expect(loadReducer(undefined, { type: 'unknown' })).toEqual({
        currentLoad: 0,
      })
    })
  
  })
  