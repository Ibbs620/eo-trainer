let wasm;

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}
/**
 * @param {string} alg_str
 * @returns {string}
 */
export function invert_alg_string(alg_str) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(alg_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.invert_alg_string(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

export function start() {
    wasm.start();
}

/**
 * @enum {0 | 1 | 2}
 */
export const Axis = Object.freeze({
    UD: 0, "0": "UD",
    RL: 1, "1": "RL",
    FB: 2, "2": "FB",
});
/**
 * @enum {0 | 1 | 2}
 */
export const CO = Object.freeze({
    Good: 0, "0": "Good",
    Cw: 1, "1": "Cw",
    Ccw: 2, "2": "Ccw",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
export const Center = Object.freeze({
    U: 0, "0": "U",
    D: 1, "1": "D",
    F: 2, "2": "F",
    L: 3, "3": "L",
    B: 4, "4": "B",
    R: 5, "5": "R",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}
 */
export const Corner = Object.freeze({
    UFR: 0, "0": "UFR",
    UBL: 1, "1": "UBL",
    DFL: 2, "2": "DFL",
    DBR: 3, "3": "DBR",
    UFL: 4, "4": "UFL",
    UBR: 5, "5": "UBR",
    DFR: 6, "6": "DFR",
    DBL: 7, "7": "DBL",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
export const CornerShape = Object.freeze({
    Shape0c: 0, "0": "Shape0c",
    Shape4a: 1, "1": "Shape4a",
    Shape4b: 2, "2": "Shape4b",
    Shape2c: 3, "3": "Shape2c",
    Shape6c: 4, "4": "Shape6c",
    Shape8c: 5, "5": "Shape8c",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19}
 */
export const CornerSubset = Object.freeze({
    S0c0: 0, "0": "S0c0",
    S0c3: 1, "1": "S0c3",
    S0c4: 2, "2": "S0c4",
    S2c3: 3, "3": "S2c3",
    S2c4: 4, "4": "S2c4",
    S2c5: 5, "5": "S2c5",
    S4a1: 6, "6": "S4a1",
    S4a2: 7, "7": "S4a2",
    S4a3: 8, "8": "S4a3",
    S4a4: 9, "9": "S4a4",
    S4b2: 10, "10": "S4b2",
    S4b3: 11, "11": "S4b3",
    S4b4: 12, "12": "S4b4",
    S4b5: 13, "13": "S4b5",
    S6c3: 14, "14": "S6c3",
    S6c4: 15, "15": "S6c4",
    S6c5: 16, "16": "S6c5",
    S8c0: 17, "17": "S8c0",
    S8c3: 18, "18": "S8c3",
    S8c4: 19, "19": "S8c4",
});
/**
 * @enum {0 | 1}
 */
export const EO = Object.freeze({
    Good: 0, "0": "Good",
    Bad: 1, "1": "Bad",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11}
 */
export const Edge = Object.freeze({
    UF: 0, "0": "UF",
    DF: 1, "1": "DF",
    DB: 2, "2": "DB",
    UB: 3, "3": "UB",
    UR: 4, "4": "UR",
    DR: 5, "5": "DR",
    DL: 6, "6": "DL",
    UL: 7, "7": "UL",
    FR: 8, "8": "FR",
    BR: 9, "9": "BR",
    BL: 10, "10": "BL",
    FL: 11, "11": "FL",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35}
 */
export const Move = Object.freeze({
    U: 0, "0": "U",
    UPrime: 1, "1": "UPrime",
    U2: 2, "2": "U2",
    D: 3, "3": "D",
    DPrime: 4, "4": "DPrime",
    D2: 5, "5": "D2",
    R: 6, "6": "R",
    RPrime: 7, "7": "RPrime",
    R2: 8, "8": "R2",
    L: 9, "9": "L",
    LPrime: 10, "10": "LPrime",
    L2: 11, "11": "L2",
    F: 12, "12": "F",
    FPrime: 13, "13": "FPrime",
    F2: 14, "14": "F2",
    B: 15, "15": "B",
    BPrime: 16, "16": "BPrime",
    B2: 17, "17": "B2",
    X: 18, "18": "X",
    X2: 19, "19": "X2",
    XPrime: 20, "20": "XPrime",
    Y: 21, "21": "Y",
    Y2: 22, "22": "Y2",
    YPrime: 23, "23": "YPrime",
    Z: 24, "24": "Z",
    Z2: 25, "25": "Z2",
    ZPrime: 26, "26": "ZPrime",
    M: 27, "27": "M",
    MPrime: 28, "28": "MPrime",
    M2: 29, "29": "M2",
    S: 30, "30": "S",
    SPrime: 31, "31": "SPrime",
    S2: 32, "32": "S2",
    E: 33, "33": "E",
    EPrime: 34, "34": "EPrime",
    E2: 35, "35": "E2",
});
/**
 * @enum {0 | 1 | 2}
 */
export const Slice = Object.freeze({
    E: 0, "0": "E",
    S: 1, "1": "S",
    M: 2, "2": "M",
});
/**
 * @enum {0 | 1}
 */
export const Tetrad = Object.freeze({
    UFR: 0, "0": "UFR",
    UFL: 1, "1": "UFL",
});

const ArrayCubeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_arraycube_free(ptr >>> 0, 1));

export class ArrayCube {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ArrayCube.prototype);
        obj.__wbg_ptr = ptr;
        ArrayCubeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ArrayCubeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_arraycube_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.arraycube_new();
        this.__wbg_ptr = ret >>> 0;
        ArrayCubeFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {ArrayCube}
     */
    static new_random() {
        const ret = wasm.arraycube_new_random();
        return ArrayCube.__wrap(ret);
    }
    /**
     * @returns {ArrayCube}
     */
    static new_random_dr() {
        const ret = wasm.arraycube_new_random_dr();
        return ArrayCube.__wrap(ret);
    }
    /**
     * @returns {ArrayCube}
     */
    static new_random_htr() {
        const ret = wasm.arraycube_new_random_htr();
        return ArrayCube.__wrap(ret);
    }
    randomize() {
        wasm.arraycube_randomize(this.__wbg_ptr);
    }
    randomize_dr() {
        wasm.arraycube_randomize_dr(this.__wbg_ptr);
    }
    randomize_htr() {
        wasm.arraycube_randomize_htr(this.__wbg_ptr);
    }
    /**
     * @returns {string}
     */
    to_visualcube_url() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.arraycube_to_visualcube_url(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    to_min2phase_string() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.arraycube_to_min2phase_string(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {Corner} slot
     * @returns {Corner}
     */
    corner_at(slot) {
        const ret = wasm.arraycube_corner_at(this.__wbg_ptr, slot);
        return ret;
    }
    /**
     * @param {Edge} slot
     * @returns {Edge}
     */
    edge_at(slot) {
        const ret = wasm.arraycube_edge_at(this.__wbg_ptr, slot);
        return ret;
    }
    /**
     * @param {Corner} slot
     * @param {Axis} axis
     * @returns {CO}
     */
    co_at(slot, axis) {
        const ret = wasm.arraycube_co_at(this.__wbg_ptr, slot, axis);
        return ret;
    }
    /**
     * @param {Edge} slot
     * @param {Axis} axis
     * @returns {EO}
     */
    eo_at(slot, axis) {
        const ret = wasm.arraycube_eo_at(this.__wbg_ptr, slot, axis);
        return ret;
    }
    /**
     * True if the edges have even parity
     * @returns {boolean}
     */
    edge_parity_even() {
        const ret = wasm.arraycube_edge_parity_even(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * True if the corners have even parity
     * @returns {boolean}
     */
    corner_parity_even() {
        const ret = wasm.arraycube_corner_parity_even(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * True if the parity of the permutation within a single tetrad is even
     * @param {Tetrad} tetrad
     * @returns {boolean}
     */
    tetrad_parity_even(tetrad) {
        const ret = wasm.arraycube_tetrad_parity_even(this.__wbg_ptr, tetrad);
        return ret !== 0;
    }
    /**
     * True if the parity of the slice permutation is even
     * @param {Slice} slice
     * @returns {boolean}
     */
    slice_parity_even(slice) {
        const ret = wasm.arraycube_slice_parity_even(this.__wbg_ptr, slice);
        return ret !== 0;
    }
    /**
     * @param {Axis} axis
     * @returns {number}
     */
    bad_edge_count(axis) {
        const ret = wasm.arraycube_bad_edge_count(this.__wbg_ptr, axis);
        return ret;
    }
    /**
     * @param {Axis} axis
     * @returns {number}
     */
    good_corner_count(axis) {
        const ret = wasm.arraycube_good_corner_count(this.__wbg_ptr, axis);
        return ret;
    }
    /**
     * @param {Axis} axis
     * @returns {number}
     */
    cw_corner_count(axis) {
        const ret = wasm.arraycube_cw_corner_count(this.__wbg_ptr, axis);
        return ret;
    }
    /**
     * @param {Axis} axis
     * @returns {number}
     */
    ccw_corner_count(axis) {
        const ret = wasm.arraycube_ccw_corner_count(this.__wbg_ptr, axis);
        return ret;
    }
    /**
     * Returns whether a corner slot contains a corner from its home tetrad
     * @param {Corner} slot
     * @returns {boolean}
     */
    in_home_tetrad(slot) {
        const ret = wasm.arraycube_in_home_tetrad(this.__wbg_ptr, slot);
        return ret !== 0;
    }
    /**
     * Returns whether an edge slot contains an edge from its home slice
     * @param {Edge} slot
     * @returns {boolean}
     */
    in_home_slice(slot) {
        const ret = wasm.arraycube_in_home_slice(this.__wbg_ptr, slot);
        return ret !== 0;
    }
    /**
     * @param {string} alg_str
     */
    do_alg(alg_str) {
        const ptr0 = passStringToWasm0(alg_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.arraycube_do_alg(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} alg_str
     * @returns {ArrayCube}
     */
    static from_alg(alg_str) {
        const ptr0 = passStringToWasm0(alg_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.arraycube_from_alg(ptr0, len0);
        return ArrayCube.__wrap(ret);
    }
    /**
     * @param {string} alg_str
     */
    premove_alg(alg_str) {
        const ptr0 = passStringToWasm0(alg_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.arraycube_premove_alg(this.__wbg_ptr, ptr0, len0);
    }
    invert() {
        wasm.arraycube_invert(this.__wbg_ptr);
    }
    /**
     * @returns {ArrayCube}
     */
    inverse() {
        const ret = wasm.arraycube_inverse(this.__wbg_ptr);
        return ArrayCube.__wrap(ret);
    }
    /**
     * @param {ArrayCube} rhs
     */
    apply(rhs) {
        _assertClass(rhs, ArrayCube);
        wasm.arraycube_apply(this.__wbg_ptr, rhs.__wbg_ptr);
    }
    /**
     * @param {Axis} axis
     * @returns {boolean}
     */
    is_eo(axis) {
        const ret = wasm.arraycube_is_eo(this.__wbg_ptr, axis);
        return ret !== 0;
    }
    /**
     * @param {Axis} axis
     * @returns {boolean}
     */
    is_dr(axis) {
        const ret = wasm.arraycube_is_dr(this.__wbg_ptr, axis);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    is_htr() {
        const ret = wasm.arraycube_is_htr(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {ArrayCube} other
     * @param {Axis} axis
     * @returns {boolean}
     */
    is_dr_equivalent(other, axis) {
        _assertClass(other, ArrayCube);
        const ret = wasm.arraycube_is_dr_equivalent(this.__wbg_ptr, other.__wbg_ptr, axis);
        return ret !== 0;
    }
    /**
     * @param {string} c_subset
     * @param {string} e_subset
     * @returns {ArrayCube}
     */
    static new_random_from_subset(c_subset, e_subset) {
        const ptr0 = passStringToWasm0(c_subset, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(e_subset, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.arraycube_new_random_from_subset(ptr0, len0, ptr1, len1);
        return ArrayCube.__wrap(ret);
    }
    /**
     * @returns {CornerShape}
     */
    get_bad_corner_shape() {
        const ret = wasm.arraycube_get_bad_corner_shape(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {CornerSubset}
     */
    get_htr_subset_slow() {
        const ret = wasm.arraycube_get_htr_subset_slow(this.__wbg_ptr);
        return ret;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_crypto_ed58b8e10a292839 = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_getRandomValues_bcb4912f16000dc4 = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_msCrypto_0a36e2ec3a343d26 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_node_02999533c4ea02e3 = function(arg0) {
        const ret = arg0.node;
        return ret;
    };
    imports.wbg.__wbg_process_5c1d670bc53614b8 = function(arg0) {
        const ret = arg0.process;
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_ab2cfe79ebbf2740 = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_require_79b1e9274cde3c87 = function() { return handleError(function () {
        const ret = module.require;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_versions_c71aa1626a93e0a1 = function(arg0) {
        const ret = arg0.versions;
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('cubelab_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;