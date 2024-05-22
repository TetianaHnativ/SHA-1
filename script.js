const textareaInput = document.getElementById("textarea-input");
const hashParagraph = document.querySelector(".hash");

const buttonhash = document.querySelector(".button-hash");
const buttonClean = document.querySelector(".button-clean");

buttonClean.addEventListener("click", () => textareaClean());

buttonhash.addEventListener("click", () => hashCalculator());

function textareaClean() {
  textareaInput.value = "";
  hashParagraph.textContent = "";
}

function hashCalculator() {
  hashParagraph.textContent = "hash: " + SHA1(textareaInput.value);
}

function SHA1(message) {
  function utf8Encode(str) {
    return decodeURIComponent(encodeURIComponent(str));
  }

  function rotateLeft(n, s) {
    return (n << s) | (n >>> (32 - s));
  }

  function toHex(str) {
    return (str >>> 0).toString(16).padStart(8, "0");
  }

  let i;
  let w = new Array(80);

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  message = utf8Encode(message);
  let msgLength = message.length;

  let wordArray = [];

  for (let i = 0; i < msgLength - 3; i += 4) {
    const fourChars = message.slice(i, i + 4);
    wordArray.push(
      (fourChars.charCodeAt(0) << 24) |
        (fourChars.charCodeAt(1) << 16) |
        (fourChars.charCodeAt(2) << 8) |
        fourChars.charCodeAt(3)
    );
  }

  switch (msgLength % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = (message.charCodeAt(msgLength - 1) << 24) | 0x0800000;
      break;
    case 2:
      i =
        (message.charCodeAt(msgLength - 2) << 24) |
        (message.charCodeAt(msgLength - 1) << 16) |
        0x08000;
      break;
    case 3:
      i =
        (message.charCodeAt(msgLength - 3) << 24) |
        (message.charCodeAt(msgLength - 2) << 16) |
        (message.charCodeAt(msgLength - 1) << 8) |
        0x80;
      break;
  }
  wordArray.push(i);

  while ((wordArray.length * 32) % 512 !== 448) {
    wordArray.push(0);
  }

  wordArray.push(msgLength >>> 29);
  wordArray.push((msgLength << 3) & 0x0ffffffff);

  for (let blockstart = 0; blockstart < wordArray.length; blockstart += 16) {
    for (i = 0; i < 16; i++) w[i] = wordArray[blockstart + i];

    for (i = 16; i <= 79; i++) {
      w[i] = rotateLeft(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
    }

    let [a, b, c, d, e] = [h0, h1, h2, h3, h4];

    for (i = 0; i <= 79; i++) {
      let f, k;
      if (i <= 19) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (i <= 39) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (i <= 59) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }

      let temp = rotateLeft(a, 5) + f + e + k + w[i];
      e = d;
      d = c;
      c = rotateLeft(b, 30);
      b = a;
      a = temp & 0xffffffff;
    }

    h0 = (h0 + a) & 0xffffffff;
    h1 = (h1 + b) & 0xffffffff;
    h2 = (h2 + c) & 0xffffffff;
    h3 = (h3 + d) & 0xffffffff;
    h4 = (h4 + e) & 0xffffffff;
  }

  let temphash = toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4);

  return temphash.toLowerCase();
}
