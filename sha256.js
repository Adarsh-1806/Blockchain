var chrsz = 8;
var hexcase = 0;
var s = '';

//Rotate right operation
function rightRotate(value, n) {
    return (value >>> n) | (value << (32 - n));
};
// needed for algorithm
function upper_sigma0(x) {
    return rightRotate(x, 2) ^ rightRotate(x, 13) ^ rightRotate(x, 22);
}
function upper_sigma1(x) {
    return rightRotate(x, 6) ^ rightRotate(x, 11) ^ rightRotate(x, 25);
}
function lower_sigma0(x) {
    return rightRotate(x, 7) ^ rightRotate(x, 18) ^ x >>> 3;
}
function lower_sigma1(x) {
    return rightRotate(x, 17) ^ rightRotate(x, 19) ^ x >>> 10;
}
function Maj(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
}
function Ch(x, y, z) {
    return (x & y) ^ ((~x) & z);
}
//addition 
function addition(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}
// conversion 
function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    }
    return bin;
}

function binb2hex(binarray) {
    var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
    var str = '';
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
            hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
}
function hasing(m, l) {
    //constants 
    var K = new Array(
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2);

    var HASH = new Array(
        0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;

    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;

    //for Each block 512bit (16 words)
    for (var i = 0; i < m.length; i += 16) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];
        for (var j = 0; j < 64; j++) {
            if (j < 16) W[j] = m[j + i];
            else W[j] = addition(addition(addition(lower_sigma1(W[j - 2]), W[j - 7]), lower_sigma0(W[j - 15])), W[j - 16]);

            T1 = addition(addition(addition(addition(h, upper_sigma1(e)), Ch(e, f, g)), K[j]), W[j]);
            T2 = addition(upper_sigma0(a), Maj(a, b, c));

            h = g;
            g = f;
            f = e;
            e = addition(d, T1);
            d = c;
            c = b;
            b = a;
            a = addition(T1, T2);
        }
        HASH[0] = addition(a, HASH[0]);
        HASH[1] = addition(b, HASH[1]);
        HASH[2] = addition(c, HASH[2]);
        HASH[3] = addition(d, HASH[3]);
        HASH[4] = addition(e, HASH[4]);
        HASH[5] = addition(f, HASH[5]);
        HASH[6] = addition(g, HASH[6]);
        HASH[7] = addition(h, HASH[7]);
    }
    // console.log(HASH);
    return HASH;
}
function gethash(data){
    s = data.toString();
    // console.log(s.toString());
    return binb2hex(hasing(str2binb(s), s.length * chrsz));
}
export {gethash};
// console.log(output_hash);
// document.getElementById('output').innerHTML = output_hash;
// var output_hash = binb2hex(hasing(str2binb(s), s.length * chrsz));