import { f64ToS32pair, SInt64 as _SInt64 } from './int64'

export type Duration = number

export const
  Nanosecond  :Duration = 1,
  Microsecond :Duration = 1000 * Nanosecond,
  Millisecond :Duration = 1000 * Microsecond,
  Second      :Duration = 1000 * Millisecond,
  Minute      :Duration = 60 * Second,
  Hour        :Duration = 60 * Minute


// monotime returns a real timestamp
//
export const monotime : ()=>Duration = (
  typeof performance != 'undefined' ? () => performance.now() * Millisecond :
  (typeof process != 'undefined' && process.hrtime) ? () => {
    let t = process.hrtime()
    return (t[0] * 1e9) + t[1]
  } :
  () => Date.now() * Millisecond
)


interface WasmInterface {
  // writes to buffer, returns buffer offset
  fmtduration(low :int, hight :int) :int
  bufptr() :int   // provides the address of the shared buffer
  bufsize() :int  // provides the size of the shared buffer
}

const wasmMemory = new WebAssembly.Memory({ initial:2, maximum:2 })
const wasm = (typeof WebAssembly != 'undefined' ?
  new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
    //!<wasmdata src="time_fmtduration.wast">
    0,97,115,109,1,0,0,0,1,11,2,96,0,1,127,96,2,127,127,1,127,2,16,1,3,101,
    110,118,6,109,101,109,111,114,121,2,1,2,2,3,4,3,0,0,1,7,34,3,6,98,117,102,
    112,116,114,0,0,7,98,117,102,115,105,122,101,0,1,11,102,109,116,100,117,
    114,97,116,105,111,110,0,2,10,231,12,3,5,0,65,128,8,11,4,0,65,32,11,217,
    12,5,2,127,3,126,2,127,1,126,4,127,32,0,173,32,1,173,66,32,134,132,33,4,
    32,4,66,0,83,33,10,66,0,32,4,125,33,6,32,10,69,4,64,32,4,33,6,11,65,159,8,
    65,243,0,58,0,0,2,64,32,6,66,128,148,235,220,3,84,4,64,2,64,32,6,66,0,81,
    4,64,2,64,65,158,8,65,48,58,0,0,65,30,15,11,11,32,6,66,232,7,84,4,64,2,64,
    65,158,8,65,238,0,58,0,0,65,30,33,2,11,5,2,64,32,6,66,192,132,61,84,4,127,
    2,127,65,158,8,65,181,127,58,0,0,65,3,33,11,65,30,11,5,2,127,65,158,8,65,
    237,0,58,0,0,65,6,33,11,65,30,11,11,33,2,32,6,33,4,3,64,32,4,32,4,66,10,
    128,34,6,66,10,126,125,33,5,32,5,66,0,82,33,8,32,7,32,8,114,33,7,32,7,65,
    255,1,113,69,33,12,32,2,65,127,106,33,8,32,12,69,4,64,2,64,32,8,65,128,8,
    106,33,13,32,5,167,33,2,32,2,65,48,114,33,2,32,2,65,255,1,113,33,2,32,13,
    32,2,58,0,0,32,8,33,2,11,11,32,3,65,1,106,33,3,32,3,32,11,71,4,64,2,64,32,
    6,33,4,12,2,11,11,11,32,2,65,127,106,33,3,32,12,69,4,64,2,64,32,3,65,128,
    8,106,33,2,32,2,65,46,58,0,0,32,3,33,2,11,11,32,4,66,10,84,4,64,2,64,32,2,
    65,127,106,33,2,32,2,65,128,8,106,33,3,32,3,65,48,58,0,0,12,6,11,11,11,11,
    3,64,32,2,65,127,106,33,2,32,6,32,6,66,10,128,34,4,66,10,126,125,33,5,32,
    5,167,33,3,32,3,65,48,114,33,3,32,3,65,255,1,113,33,7,32,2,65,128,8,106,
    33,3,32,3,32,7,58,0,0,32,6,66,10,90,4,64,2,64,32,4,33,6,12,2,11,11,11,11,
    5,2,64,32,6,32,6,66,10,128,34,4,66,10,126,125,33,5,32,5,66,0,81,4,127,65,
    31,5,2,127,32,5,167,33,2,32,2,65,48,114,33,2,32,2,65,255,1,113,33,2,65,
    158,8,32,2,58,0,0,65,30,11,11,33,7,32,4,66,10,130,33,4,32,5,32,4,132,33,5,
    32,5,66,0,81,33,2,32,7,65,127,106,33,3,32,2,4,64,32,7,33,2,5,2,64,32,3,65,
    128,8,106,33,8,32,4,167,33,2,32,2,65,48,114,33,2,32,2,65,255,1,113,33,2,
    32,8,32,2,58,0,0,32,3,33,2,32,7,65,126,106,33,3,11,11,32,6,66,228,0,128,
    33,4,32,4,66,10,130,33,4,32,5,32,4,132,33,5,32,5,66,0,82,4,64,2,64,32,3,
    65,128,8,106,33,7,32,4,167,33,2,32,2,65,48,114,33,2,32,2,65,255,1,113,33,
    2,32,7,32,2,58,0,0,32,3,34,2,65,127,106,33,3,11,11,32,6,66,232,7,128,33,4,
    32,4,66,10,130,33,4,32,5,32,4,132,33,5,32,5,66,0,82,4,64,2,64,32,3,65,128,
    8,106,33,7,32,4,167,33,2,32,2,65,48,114,33,2,32,2,65,255,1,113,33,2,32,7,
    32,2,58,0,0,32,3,34,2,65,127,106,33,3,11,11,32,6,66,144,206,0,128,33,4,32,
    4,66,10,130,33,4,32,5,32,4,132,33,5,32,5,66,0,82,4,64,2,64,32,3,65,128,8,
    106,33,7,32,4,167,33,2,32,2,65,48,114,33,2,32,2,65,255,1,113,33,2,32,7,32,
    2,58,0,0,32,3,34,2,65,127,106,33,3,11,11,32,6,66,160,141,6,128,33,4,32,4,
    66,10,130,33,4,32,5,32,4,132,33,5,32,5,66,0,82,4,64,2,64,32,3,65,128,8,
    106,33,7,32,4,167,33,2,32,2,65,48,114,33,2,32,2,65,255,1,113,33,2,32,7,32,
    2,58,0,0,32,3,34,2,65,127,106,33,3,11,11,32,6,66,192,132,61,128,33,4,32,4,
    66,10,130,33,4,32,5,32,4,132,33,5,32,5,66,0,82,4,64,2,64,32,3,65,128,8,
    106,33,7,32,4,167,33,2,32,2,65,48,114,33,2,32,2,65,255,1,113,33,2,32,7,32,
    2,58,0,0,32,3,34,2,65,127,106,33,3,11,11,32,6,66,128,173,226,4,128,33,4,
    32,4,66,10,130,33,4,32,5,32,4,132,33,9,32,9,66,0,82,4,64,2,64,32,3,65,128,
    8,106,33,7,32,4,167,33,2,32,2,65,48,114,33,2,32,2,65,255,1,113,33,2,32,7,
    32,2,58,0,0,32,3,34,2,65,127,106,33,3,11,11,32,6,66,128,194,215,47,128,33,
    4,32,4,66,10,130,33,5,32,9,32,5,132,33,4,32,4,66,0,82,4,64,2,64,32,3,65,
    128,8,106,33,7,32,5,167,33,2,32,2,65,48,114,33,2,32,2,65,255,1,113,33,2,
    32,7,32,2,58,0,0,32,3,65,127,106,33,2,32,2,65,128,8,106,33,3,32,3,65,46,
    58,0,0,11,11,32,6,66,128,148,235,220,3,128,33,4,32,4,66,60,130,33,4,32,4,
    66,0,81,4,64,2,64,32,2,65,127,106,33,2,32,2,65,128,8,106,33,3,32,3,65,48,
    58,0,0,11,5,3,64,32,2,65,127,106,33,2,32,4,32,4,66,10,128,34,5,66,10,126,
    125,33,9,32,9,167,33,3,32,3,65,48,114,33,3,32,3,65,255,1,113,33,7,32,2,65,
    128,8,106,33,3,32,3,32,7,58,0,0,32,4,66,10,90,4,64,2,64,32,5,33,4,12,2,11,
    11,11,11,32,6,66,255,175,157,194,223,1,86,4,64,2,64,32,6,66,128,176,157,
    194,223,1,128,33,4,32,2,65,127,106,33,3,32,3,65,128,8,106,33,7,32,7,65,
    237,0,58,0,0,32,4,66,60,130,33,4,32,4,66,0,81,4,64,2,64,32,2,65,126,106,
    33,2,32,2,65,128,8,106,33,3,32,3,65,48,58,0,0,11,5,2,64,32,3,33,2,3,64,32,
    2,65,127,106,33,2,32,4,32,4,66,10,128,34,5,66,10,126,125,33,9,32,9,167,33,
    3,32,3,65,48,114,33,3,32,3,65,255,1,113,33,7,32,2,65,128,8,106,33,3,32,3,
    32,7,58,0,0,32,4,66,10,90,4,64,2,64,32,5,33,4,12,2,11,11,11,11,11,32,6,66,
    255,191,226,133,227,232,0,86,4,64,2,64,32,6,66,128,192,226,133,227,232,0,
    128,33,6,32,2,65,127,106,33,2,32,2,65,128,8,106,33,3,32,3,65,232,0,58,0,0,
    3,64,32,2,65,127,106,33,2,32,6,32,6,66,10,128,34,4,66,10,126,125,33,5,32,
    5,167,33,3,32,3,65,48,114,33,3,32,3,65,255,1,113,33,7,32,2,65,128,8,106,
    33,3,32,3,32,7,58,0,0,32,6,66,10,90,4,64,2,64,32,4,33,6,12,2,11,11,11,11,
    11,11,11,11,11,11,32,10,69,4,64,32,2,15,11,32,2,65,127,106,33,3,32,3,65,
    128,8,106,33,2,32,2,65,45,58,0,0,32,3,11
    //!</wasmdata>
  ])), {
    env: { memory: wasmMemory }
  }).exports as any as WasmInterface :
  null
)


// fmtduration produces a string representing d in the form "72h3m0.5s".
// Leading zero units are omitted. As a special case, durations less than one
// second format use a smaller unit (milli-, micro-, or nanoseconds) to ensure
// that the leading digit is non-zero. The zero duration formats as 0s.
//
export const fmtduration : (d :Duration)=>string = (
  wasm ? (() => {
    let p = wasm.bufptr()
    let z = wasm.bufsize()
    let u8heap = new Uint8Array(wasmMemory.buffer)
    return function fmtduration(d :Duration) :string {
      let [low, high] = f64ToS32pair(d)
      let w = wasm.fmtduration(low, high)
      return String.fromCharCode.apply(null, u8heap.subarray(p + w, p + z))
    }
  })() : 
  (d :Duration) => {
    // TODO
    return `${(d/1e9).toFixed(1)}ms`
  }
)


// fmtduration2 is like fmtduration, but rounds d to 2 decimals.
//
export function fmtduration2(d :Duration) {
  return fmtduration(
    d < Nanosecond  ? 1 :
    d < Microsecond ? Math.round(d / (Nanosecond/100)) * (Nanosecond/100) :
    d < Millisecond ? Math.round(d / (Microsecond/100)) * (Microsecond/100) :
    d < Second      ? Math.round(d / (Millisecond/100)) * (Millisecond/100) :
    d
  )
}


TEST("fmtduration", () => {

  const samples :[string,number][] = [
    [ "0s", 0],
    [ "1ns", 1 * Nanosecond],
    [ "1.1µs", 1100 * Nanosecond],
    [ "2.2ms", 2200 * Microsecond],
    [ "3.3s", 3300 * Millisecond],
    [ "4m5s", 4*Minute + 5*Second],
    [ "4m5.001s", 4*Minute + 5001*Millisecond],
    [ "5h6m7.001s", 5*Hour + 6*Minute + 7001*Millisecond],
    [ "8m0.000000001s", 8*Minute + 1*Nanosecond],
    [ "2562047h47m16.854775807s",
      // (Duration)(((u64)(1) << 63) - 1)
      _SInt64.ONE.shl(63).sub(_SInt64.ONE).toFloat64()
    ],
    [ "-2562047h47m16.854775808s",
      // (Duration)((u64)(-1) << 63)
      _SInt64.ONENEG.shl(63).toFloat64()
    ],
  ]
  for (let [expectedResult, input] of samples) {
    let actualResult = fmtduration(input)
    assert(actualResult == expectedResult,
      `${actualResult} == ${expectedResult}`)
  }
})
