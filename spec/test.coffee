describe 'promiser', ->

  it 'should be available', ->
    expect(promiser).toBeDefined()

  describe 'construction', ->

    it 'should act like a constructor', ->
      p = new promiser
      expect(p instanceof promiser).toBe true

    it 'should work like a function', ->
      p = promiser()
      expect(p.done).toBeDefined()

    it 'should wrap an existing object', ->
      p = {}
      p2 = promiser(p)
      expect(p is p2).toBe true
      expect(p.done).toBeDefined()

  p = null

  beforeEach ->
    p = new promiser

  describe 'utility methods', ->

    it 'has should return a boolean if exists', ->
      expect(p.has 'test').toBe false
      p.done 'test', ->
      expect(p.has 'test').toBe true

  describe 'resolve then call', ->

    it 'should call immediately if already resolved', ->

      flag = false
      p.resolve 'test'
      p.done 'test', -> flag = true

  describe 'defer methods', ->

    resolved = rejected = always = false

    beforeEach ->
      resolved = rejected = always = false
      p.always 'test', -> always = true

    it 'should resolve', ->

      p.done 'test', -> resolved = true
      p.resolve 'test'

      expect(resolved).toBe true
      expect(rejected).toBe false
      expect(always).toBe true

    it 'should reject', ->

      p.fail 'test', -> rejected = true
      p.reject 'test'

      expect(resolved).toBe false
      expect(rejected).toBe true
      expect(always).toBe true


  describe 'state methods', ->

    it 'should reflect state changes', ->

      expect(p.isPending('test')).toBe false
      expect(p.isResolved('test')).toBe false
      expect(p.isRejected('test')).toBe false

      p.done 'test', ->

      expect(p.isPending('test')).toBe true
      expect(p.isResolved('test')).toBe false
      expect(p.isRejected('test')).toBe false

  describe 'extension methods', ->

    it 'should manage other deferred', ->

      d = $.Deferred()
      p.manage 'test', d
      expect(p.has 'test').toBe(true)

    it 'should prevent managing by the same name', ->

      d = $.Deferred()
      p.manage 'test', d

      expect(-> p.manage 'test', d).toThrow()

    it 'should unmanage and return deferreds', ->

      resolved = false

      p.done 'test', -> resolved = true
      d = p.unmanage 'test'

      p.resolve 'test'
      expect(resolved).toBe false

      d.resolve()
      expect(resolved).toBe true

    it 'should "reset" a deferred', ->
      resolved = 0

      p.done 'test', -> resolved++
      p.reset 'test'
      p.done 'test', -> resolved++

      p.resolve 'test'
      expect(resolved).toBe 1

    it 'should enable watching a deferred', ->

      seq = []

      p.watch 'lazy', -> seq.push 1
      expect(seq).toEqual []

      p.done 'lazy', -> seq.push 2
      expect(seq).toEqual [1]

      p.done 'lazy', -> seq.push 3
      p.watch 'lazy', -> seq.push 4
      p.resolve 'lazy'

      expect(seq).toEqual [1, 2, 3]

    it 'should no longer watch an unmanaged deferred', ->

      triggered = false

      p.watch 'lazy', -> triggered = true
      p.unmanage 'lazy'

      p.done 'lazy', ->
      expect(triggered).toEqual false


    it 'should support the when method', ->

      count = 0

      p.when 'test1', 'test2', -> count++

      p.resolve 'test1'
      expect(count).toEqual 0

      p.resolve 'test2'
      expect(count).toEqual 1

      p.when 'test3', -> count++

      p.resolve 'test3'
      expect(count).toEqual 2
