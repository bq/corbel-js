'use strict';

(function(/* $, corbel */) {

    // var printResponse = function(response, method) {

    //     var HTML = '' +
    //         method + ': \n' +
    //         '<pre>' +
    //         '<h5> ----- Header:  ----- </h5>' +
    //         JSON.stringify(response.headers, null, 3) +
    //         '<h5> ----- Body: ------ </h5>' +
    //         JSON.stringify(response.body, null, 3) +
    //         '</pre>';

    //     $('#responses').prepend(HTML);

    // };

    // corbel.request.send({
    //     url: 'http://localhost:3000/',
    //     type: 'GET',
    //     headers: {
    //         'X-Custom1': true,
    //         'X-Custom2': true
    //     },
    //     success: function(res) {
    //         printResponse(res, 'GET');
    //     }
    // });

    // corbel.request.send({
    //     url: 'http://localhost:3000/',
    //     type: 'HEAD',
    //     headers: {
    //         'X-Custom1': true,
    //         'X-Custom2': true
    //     },
    //     success: function(res) {
    //         printResponse(res, 'HEAD');
    //     }
    // });

    // corbel.request.send({
    //     url: 'http://localhost:3000/',
    //     type: 'POST',
    //     //contentType: 'application/json',
    //     //responseType: 'json',
    //     //dataType: 'img/png',
    //     headers: {
    //         //'Content-type': 'application/json',
    //         'X-Custom1': true,
    //         'X-Custom2': true
    //     },
    //     data: {
    //         example: 'pepe'
    //     },
    //     success: function(res) {
    //         printResponse(res, 'POST');
    //     }
    // });

    var byteCharacters = atob('/9j/4AAQSkZJRgABAQEAlgCWAAD / 4QCARXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUA AAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAI3PAAAA8gAA jc8AAADyAAKgAgAEAAAAAQAAAXygAwAEAAAAAQAAAbgAAAAA / 9sAQwACAQECAQECAgECAgICAgMF AwMDAwMGBAQDBQcGBwcHBgYGBwgLCQcICggGBgkNCQoLCwwMDAcJDQ4NDA4LDAwL / 9sAQwECAgID AgMFAwMFCwgGCAsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsL CwsL / 8AAEQgBuAF8AwEiAAIRAQMRAf / EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC //E ALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJ ChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeI iYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq 8fLz9PX29 / j5 + v / EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC //EALURAAIBAgQEAwQH BQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJico KSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZ mqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5 + jp6vLz9PX29 / j5 + v / a AAwDAQACEQMRAD8A / aiiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo AKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi iigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK KACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo AKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi iigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK KACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo AKKKKACiiigAooooAKKKKACiiquta5ZeG9LmvvEV5a2FlbKXmuLmVYoolHUs7EAD3JoA8m / bg / bx + G3 / AATx + DieOf2ntXuNL0We + j022W2tmubm7uHVmEcUS8sdsbsTwAFJJr51 + BH / AAcj / sj / AB48 Tw6PafESfwrfXLhIf + El0ybTrdyTjm5IMKc4++618u / 8HLH7U / 7M37Wv7GsvhLQfjj4On + IfgzVU 1vRrLS5pNUS8mWN4pLSV7RJEiLpK2GYgK6ruIBJr + eagD + 5 / Rtas / Eek21 / 4fu7a + sbyNZoLi3lW WKdGGQyOpIYEcgg4qzX8kP8AwS6 / 4Lc / F3 / gmP4ntrPwtfy + LPhzLKGv / CepXDG22k / M9pIcm1l6 nKgqT95W4x + jX7bn / B4DpsfgrTrL9gLwVcSa7qFok19qniuHEGkyMuWgitopMzupyDIXVMjgODQB + 4lFfyx3H / B0X + 2FPc + Ynjbw7EM58tPDVnt / VCf1r0D4Vf8AB3L + 0z4Nvo / +Fj6R8N / GNmD + 8WfS pbKdh / syQTBR + KGgD + lyivyT / ZC / 4O6fgx8Xb210v9qrwtr / AMLNQnKodQhf + 19KDHjLPGizRjP / AEyYDu3Ga / Un4U / F / wAK / HTwPZeJfg14i0bxT4f1FN9tqGl3aXNvMPZ0JGfUdR3oA6OiiigAoooo AKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA ooooAKKKKACiivgj / gs3 / wAFz / BP / BMbwRc + HfBUtl4q + MeqWxOnaIkgeLSQw + W6vyp + RBnKxcPJ jjC5cAFj / gtH / wAFv / Cn / BK7wXb6L4atLbxZ8WfEFu02l6K0uINPi6C7vip3LHnIVBhpCpAKgFh / Nt + 2P / wUd + M / 7eniqfUv2mvHes65bvIZINJSU2 + l2QzkLDaJiNccDcQWOBliea86 + OPxw8VftI / F fXPG / wAbNZvPEHifxFctdX19ctl5XPQAdFVQAqoAAqgAAAVylABRRRQAUUUUAFFFFABXuX7DP / BR f4s / 8E7fiUniP9mXxPc6Ykrq2oaTOTNpmrqP4Lm3J2txwHGHXPysK8NooA / q6 / 4Ju / 8ABwF8D / 26 PhPDd / ELxP4d + F3jqxUJquga9qsNqpfHMtnNKyieE / g69GUcFvf9G / 4KX / s7 + IvGdt4d0D45fCe9 1y8kEMFlB4qspJpZCcBFUS8sf7vWv4xqAcHI60Af3UUV + Z3 / AAbS / wDBU5f23P2Vl + HHxa1Rrn4m / C63jtpXuJMzaxpn3Le6yTl3TiGQ8nIRj / rK / TGgAooooAKKKKACiiigAooooAKKKKACiiigAooo oAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqK9vYdNs5bjUZore3gQySyyOESNQMlm Y8AAc5NPllWGNnmZURAWZmOAoHUk1 / M3 / wAF8P8Agu74o / bM + K3iH4W / s0a9c6R8GdFmfT7h7GQx v4ulRiJJppBybbcCEiB2sBvbOQFAPrz / AILJf8HQ2nfDsar8Nf8Agm1e2usa8A1tqPjcKJbLTz0Z dPU / LPIOf3xBjH8Ifqv4J + MPGGrfEHxTqGueOtSvtY1nVZ2ub2 + vZ2nuLqVjlnkkYlmYnqSazaKA CiiigAooooAKKKKACiiigAooooAKKKKAPUf2NP2ufF / 7DP7R / hr4m / BK7 + z614duN7Qux8jUIG4l tpgPvRyJlSO3DDBAI / ru / YE / bq8E / wDBRH9mvRPiR8ErsNbX6CHUdPkcG50a8UDzbWcDoyk8Hoyl WHDCv4wK + m / +CW3 / AAVF8d / 8Eufj9D4p + Gkj6n4b1Jkh8ReHZZiltrFuCfwSZNzFJMHBJBBUkEA / sNor57 / ZP / 4KmfAv9sb4XaP4n + FfxE8MW7atEGfSNT1OCz1Swl6NDNbu4YMp4yMqwwVJBBr33T9V tdXgEulXMF1EwBDxSB1IPQ5BoAnooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAo oooAKKKKACiiigAooooAKKK4b9pr4 + 6J + yx + z54y + IvxFk8vRvBuk3GqXIBw0ojQlY19WdtqKO5Y CgD88P8Ag5T / AOCu2lfsj / s5ap8HvgvrUMvxU + IFo1neC1lBl8O6ZIuJZZCpzHLKhMcY4OGZ / wCE Z / mfrtP2ivjvr / 7T / wAdvFnxC + J9x9p17xhqc2p3jZ + VGkYkInoiLtRR2VQK4ugAooooAKKKKACi iigAooooAKKKKACiiigAooooAKKKKACv6Ef + DNJ5H / Zh + MgkZjGvie0CAnhf9FJOPzr + e6v6Hv8A gzYtdn7H3xbn7yeMYk / 75soj / wCzUAfsVRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAF FFFABRRRQAUUUUAFFFFABRRRQAV + PH / B3v8Atln4cfsxeDvgv4Xu9mpfEO //ALW1eNG5GnWjAojA dBJcmNh6 / Z2r9hLm5js7eSa7kSKKJS7u5wqKBkkk9ABX8g3 / AAWn / bi / 4b //AOCh/jnxroly1x4Y 0 + YaD4c + bK / 2falkSRfaVzLP / wBtqAPlOiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK KKKACv6H / wDgzYvkk / Y8 + LVsCPMi8ZRSkegayiA / 9ANfzwV9 + /8ABFb/AILjy / 8ABJHRvGWi6l8P j450jxpe2t5K0esfYJrBoUdCUUwyCTcHHUrjb1NAH9VdFfN3 / BMj / gp94B / 4Km / BO + 8YfBG11jSZ tEvRp2raVqkarcWM5QOuGQlJEZWyrg84IIBGK + kaACiiigAooooAKKKKACiiigAooooAKKKKACii igAooooAKKKKACiiigAooooAKKKKAPNf2yPg9qX7Qf7J3xI8DeD9TutG1bxZ4bvtLs723kMclvNL A6Idw5A3EA45wTX8Vmv6DeeFtdvdM8RW8tnqGnXElrdQSDDwSoxV0YdiGBB + lf3O1 / K9 / wAHMP7H I / ZV / wCCnPiLV / D1p9n8OfFO3XxVZFFxGtxIxS8Qe / no8p9p1oA / PiiiigAooooAKKKKACiiigAo oooAKKKKACiiigAooooAKKKKACtPwX4P1L4h + MdJ0DwbayX2r65ew6fY20f37ieVxHGi + 7MygfWs yveP + CYfxp8H / s5 / t / 8Awp8d / HuSaHwl4U16LUtQkit2uHiEYZkcRqCzESbDgDPFAH9TP / BJ / wD4 Jy + H / wDgmT + yLo3gPwz5d34gvNupeJtTGc6lqLookZc9I0CiNF7KoJ5LE / S9fNn7Kf8AwV7 / AGc / 22PGVn4c / Zu + Jul674jv43lg0qS1ubO8kVELuRFPEhO1QSfpX0nQAUUUUAFFFFABRRRQAUUUUAFF FFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAV + SP / B35 + zlD4 //AGHPBvxHsoFOo/D3xGtr NLt5Wzvk8txn / rvFa / ma / W6viz / g4e0S217 / AII5 / GqPVApSCws7lM9pI7 + 2dP8Ax5RQB / JVRRRQ AUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRX1N / wSA / 4Js6n / AMFQP2w9M8DQXEum + FtMi / tbxPqMeBJa2COqskWQR5sjMsa5zjcWIIUggH3J / wAGkH7B3iHxn + 0vq / x88SWc9n4Q8H2N xo + kzyIVGp6hOoSTyyfvJFCXDHpulQA5DAf0PVy3wT + Cvhj9nX4U6F4J + DOj2mg + GfDlqlnYWVuu EiRe5PVmJyzMclmJJJJJrqaACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiii gAooooAKKKKACvzJ / wCDrv8AaPtvhD / wTEl8HRzbdV + J + uWmmQxr977PbyC7mf6Awwof + uor9Nq / nt / 4PKviPcan + 098H / CZlb7Jo3hm61QR548y6uvLLY + lmo / OgD8aaKKKACiiigAooooAKKKKACii igAooooAKKKKACiiigAooooAK9K / ZH / aw8afsS / H7QPiP8BdUl0zX9BnDgBj5N9CSPMtp0B + eKRc qyn2IwQCPNaKAP7U / wBiT9rLQP25P2WPBnxS + G37vTvFlgtw9sXDvY3CkpPbuR1aOVJEJ77c969V r8bv + DOH443fij9l / wCK3w / 1KdpofCHiC21W0RjnyI72FlZR6DfZs31dq / ZGgAooooAKKKKACiii gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr + c7 / g8Y0CW0 / br + G2pOD5V94H WBD7xX1yT / 6NFf0Y1 + Gn / B518LDLo / wK8b28eBBNquh3D4671t5ogT7eXP8AmaAPwiooooAKKKKA CiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA / Yv8A4M2vG02nftd / Frw8jsLfV / CUN86Z 4L292iKfwF04 / Gv6Ha / nb / 4M3vCE2oftl / FTXEVvI0vwdHZu2OA095Eyj8Rbv + Rr + iSgAooooAKK KKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr80P + Dr74Tr8QP + CUd5 raxb5fA / ifTdVDY5RZWezb / 0rWv0vr53 / wCCs37P17 + 1F / wTe + Mfgnwzbm61bVfDdxNp0AXJmurf FxCgHq0kKqPrQB / G / RSspViGBBHBB7UlABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUA FFFeu / sLfsbeKv29 / wBqDwv8MfhHA7X + vXI + 1XewtFpdmpBnupcdEjTJ7bmKqOWFAH7u / wDBoV + y 7cfDD9ibxj8S9ftjBc / E3XBDYsy4MtjYh4lbPoZ5bsf8A96 / W6uP / Z++B + gfs0 / BHwr4A + F1t9k8 P + ENMg0uyj / iMcSBdznu7EFmPdmJ712FABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUA FFFFABRRRQAUUUUAFFFFABQRkYPOaKKAP5rv + DjT / gihq / 7Jfxe1n40 / s7aRNefCrxbdtearBax7 v + EWvpWJdWUfdtpHJZG6IzFDgbN35UV / c9rmh2XifRrvTvElpbahp99E0FzbXESyw3EbDDI6MCGU gkEEYOa / Cj / gvl / wbx / DH9n39n7xl8e / 2S7u88JReHzBc6j4S8vz9OmWa5jhZrRywe22 + dv2HemF 2qEoA / DiiiigAooooAKKKKACiiigAooooAKKKKACiiigAoor7E / 4Ief8E4NA / wCCnv7ayeBfij4g utD8P6LpEviDUI7RR9r1OGGaGI28LniMsZ1JfBIUNgZ5AB47 + xb + wT8U / wDgoB8UovCf7MPhe71u 7DKby9YGLT9KjJ / 1l1cEbY16kDlmwQqseK / qA / 4I9 / 8ABHvwd / wSn + Dk1tp00PiP4i + Io0bxF4iM OzzscrbWynmO3QnpnLt8zdlX6K / Zx / Zj8Bfsj / C2x8F / s5 + GNL8KeHNPHyWtlFtMr45klc5aWRsc u5LHua7ygAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoo ooAKKKKACvi7 / g4ZuRa / 8EdPjWTzu060T87 + 2H9a + 0a + V / 8Agtx8LL34yf8ABKT446J4cgkub5fD cuoxRIMtJ9ldLoqo7krA2B3NAH8f9FFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABX2R / wQI / aO X9mb / gq98J9V1CZYdM8Rag3hi + LHAKXyGCPJ7ATPA3P938a + N62vhvq994f + ImgX / hnf / aVlqNvc Wmz73mpKrJj33AUAf3HUVDp8jzWEDz / feNS31xzU1ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABR RRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFRXtlDqVnNb6hEk8FwjRyxuu5ZFIwVIPUEE jFS0UAfyMf8ABcP / AIJ3v / wTj / by8Q + GfDdtJH4I8Sg694WkK / ItnKzbrcH1gkDxY67VRj96vj6v 6hv + DnX9gY / tefsAXXjHwZZfafGPwfeTXbXy0zLcaeVAvYRgZICKk2B1NuB3r + XmgAooooAKKKKA CiiigAooooAKKKKACiiigAr9Ov8Ag3Y / 4Iz6 / wDtpfHfRPi58YtOuNO + EngbUY76CSZCv / CS30Dh 47eEEfNCjqplfoceWMktsm / 4II / 8EEbz / goHrFt8UP2nbe80z4OaZclba1UtDceLJo2w0cbdUtlY FXkHLEFFIIZl / pU8EeCNH + GvhHTdA + H2mWOi6Jo9ulpY2NnCsNvaxIMKiIoAUADoKANSiiigAooo oAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiig CHUNPg1awntdThjuLa5jaKWKRQySIwwysDwQQSCK / kh / 4Ld / 8E1r / wD4Jrftr61oek2ky + APFUkm seErrafLNq7Ze13dN9uzeWR12 + Wx + /X9clfAn/By38DvCvxY / wCCTXxA1nx / a251TwMbXWNDvWA8 20uTcxQlUb0kSV4yO + 4HqAQAfypUUUUAFFFFABRRRQAUUUUAFFFFABXof7JHwQP7S / 7Unw7 + HvnP bJ418R2GjSzoMtBHPcJG8g91Vmb8K88r6V / 4I43sNh / wVP8AgHJfkCP / AITTT059WlCr + pFAH9ev wt + GWh / Bf4b6F4S + GenW + k + H / DdjFp2n2cC7Ut4IkCIoH0A57nmt6iigAooooAKKKKACiiigAooo oAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK / G / 8A4PAf 2wl8Dfs3 + B / gt4duQNQ8d6h / bmrRqeVsLQ / ulYej3DKw / wCvY1 + x7MFBLEADkk9q / kT / AOC5 / wC2 SP23f + Cl3xD8S6NdfavDuhXI8NaEwOUNnZlo96f7MkxnlHtLQB8iUUUUAFFFFABRRRQAUUUUAFFF FABXY / s8 / FKT4HfH7wP41tN5l8Ia / Ya0oXqTbXEc2B / 3xXHUUAf3NeGfEVn4v8N6fq3h + eO5sNUt o7u2mQ5WWKRQ6MD3BVgfxq9X5w / 8Gyv / AAUBtP2u / wBgHTPBPia + WTxv8IEj0O9hd8y3GngH7FcA E5K + Wvkk / wB6An + IV + j1ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAU UUUAFFFFABRRRQAUUUUAFFFFABRRWZ418a6T8OPCOp6 / 491Gz0jRdGtpLy + vbuURQWsKKWd3c8AA AnNAHyN / wXh / b4i / YD / 4J5eLNY0G + Fr4z8Xxt4c8NKrYlW5nQh517 / uYvMkz03Kg / iFfyRk5PNfa X / Bcj / gqZdf8FP8A9rifVPCslzB8N / ByyaZ4VtJQVMsW797eOh6STsqnB5VFjU8g5 + LaACiiigAo oooAKKKKACiiigAooooAKKKKAPcf + CeP7e / jP / gnD + 05o3xI + Dkome0 / 0bVdMlcrb61ZOQZbaXHT O0MrYJV1VsHGD / Wf + wf + 3n8Pf + CiPwD0 / wAf / s + amLq0nAi1DT5iFvNGutoL21wn8LLngjKsMMpI Oa / i / r2j9hn9vz4m / wDBO / 4yweNP2addfTbtgsd / p84Mun6xCDnybqHIDrycMMMpJKsp5oA / tAor 8 / P + CYP / AAcRfBn / AIKB2dhoHjq8tvhl8TJQsbaHq10q2uoyH / nxumwsuT0jbbJ6KwG6v0DBDDKn INABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRXz / wDt b / 8ABUr4B / sPWk3 / AA0d8S / DukalEhYaRbzfbdUk9ALSDdKM8csoXnkigD6Aps0yW8TPcOqIoyzM cAD3NfhN + 2f / AMHiE863elfsG / DsQA7kTX / Frbm9N0djA + PcF5T2ynavyw / an / 4KkftAftoXE4 / a H + KXinWNPnJzpUFz9i01Qe32S3CRHA4yyk + pOTQB / Tn + 2B / wXH / Zn / YstrqH4k / EnSdb162BH9h + G3Gq37OP4GWIlIT / ANdXQV + Cv / BYf / gv / wCO / wDgpvu8IeArK58BfCaCQSf2Otx5l5rTqcrJfSLh SAQCsK / Kp5JcgEfnxRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAADg8V91 / sE / wDB w9 + 0V + wullpH / CQr8RfBdqBGND8Tu9yYIx / Db3efOhwMAAsyDHCV8KUUAf09 / sU / 8HSn7Ov7TMdp pvxuub74PeJZsI0euHztLd + PuX8Y2qvvMsVfo14Q8Z6P8QfD1tq / gPVdO1rSr1BJb3lhcpcW86nu kiEqw + hr + GqvVv2Yf25fi7 + xj4gGpfsw / EHxL4PlL75YLO6Js7k / 9NrV90MvT + NDQB / alRX8 / v7G / wDweFeL / CptdM / bj + H9j4ps1wkmt + GmFlfAf3ntJCYZW / 3XiHtX6x / sa / 8ABY / 9nb9uxba2 + Bnx G0ldfuB / yANXP9m6oG7qsE2PNx6xFx70AfT9FHWigAooooAKKKKACiiigAooooAKKKKACiiigAoo ooAKK + dv25f + CqnwO / 4J46C8 / wC0j40sbTWGj8y20CxIu9XvPTZbIcqp6b5NierV + Kf7df8Awds / Ff4xyXmj / sU6FafC / QZMouq3qx6hrcy / 3huBgtz7BZCOocUAfv38e / 2nfh5 + y14QfXv2ivGnhzwZ pKA4n1W + S380j + GNWO6Rv9lQSfSvzA / bF / 4O8PhH8L / tWm / sfeE9b + JeqR5RNSv92k6SD03LvUzy AdceXGD2bnI / n2 + LPxn8XfHnxlceIfjX4m13xZrl2SZb7Vr6S7nbnON0hJCjsowB2FczQB9sfthf 8HBf7UH7Y32qz13x7P4K8O3OV / sfwkraXFsP8LzqxuJBjghpCp9K + K7u7l1C6lnv5ZJ55mLySSMW eRicksTyST3qOigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACi iigAp0UrQSq8LMjoQyspwVI6EGm0UAfbP7EX / BwJ + 0r + xFJaWOieMpfHPhW3wp0LxWX1CFUH8MM5 YTw4HACvtHHynGK / Zb9gr / g6X + A / 7Uj2ei / tECf4OeK59qZ1SYT6NO5 / uXyqBHz / AM9ljA / vGv5k KKAP7ndC1 + x8UaPbaj4ZvbTUdPvIxLb3NtMssM6EZDI6khgR3Bq3X8dv7BH / AAVu + OP / AATl16J / 2ffF1y / h7zfMufDWqFrvR7vnLfuCR5THu8RRvUnpX9AX / BL7 / g43 + D37f0un + F / iU8Xwv + JlztiX StTuQbDVJfSyuzgMSekUgV + yh8ZoA / RCijOelFABRRRQAUUUUAFFFFABRRXzn / wUq / 4Kc / Dn / gmJ 8EJfFfxrvPterXqvHoXh + 2kX7drc4H3UB + 5GuRvlI2qD3YqpAPXfjp8fPBv7M / wz1Lxj8evEel + F vDWkx + Zc31 / MI419FUdXdjwqKCzHgAmvwU / 4Khf8HW3i / wCLk + oeEf8AgnZb3Xgjw0S0Mviq8iU6 xfr0JtojlbRCOjHdJyD + 7IxX5 + f8FGv + CoHxS / 4Ka / Fl / EPx61Uw6RZyN / Y3h2zdl03Roz0EaE / P IR96Vss3suFHzpQBoeKvFmqeOvEV5rHjbUr / AFjVtRlM91e3tw9xcXMh6vJI5LOx9SSaz6KKACii igAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKK ACiiigApVYowKEgg5BHUUlFAH6y / 8Ebv + Dl3xf8Ass6npHw9 / bkvdQ8afDVmS1tdclZp9W8NpwAW blrq3XjKNmRRnaWACV / RX4A + IGifFXwVpfiT4barYa5oOtWyXdhf2UyzW93E4yro6nBBFfw31 + m3 / Bvn / wAFvr79gT4l2nwy / aK1Sa4 + DPia62pLMxf / AIRO6kb / AI + Y / S3Zj + 9QcDPmDkMHAP6cqKis b6DVLGG502aO4trmNZYpY2DJIjDIZSOCCCCCKloAKKKKACiigkKCWOAKAPC / +Ci37e3hL / gnB + y3 rvxK + LDfaBZgW2laYkgSfWb5wfKto89M4LM2DtRWbHFfyS / ts / tq + PP2 + /2gdY+Iv7QOpvfatqTb La2QkWulWwJMdtbISdkaAnjqSWZiWYk/Vn / Bxf8A8FL5v29f22r / AMPeBdQab4cfC6abRtHSN8w3 90G23V7xw2502Ief3cakY3nP580AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUA FFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB / Qx / wauf8FXpvjX8O Zf2d / jrqZn8TeDbQ3PhK6uHy + oaYmA9pk / ee3yCvcxNjpGTX7IV / Ej + zN + 0L4i / ZQ + P3hP4jfCe5 Nrr / AIQ1GLULVs4WXacPE / qkiF42HdXIr + zD9lv9ojQf2s / 2ePB3xI + Gcwl0XxjpcOpQDOWhLr88 T + jo4ZGHYqaAO + ooooAK + Mf + C9n7cz / sIf8ABODxhrfhm8 + yeLvFoHhjw8yttkjublWDzJ7xQLPI D / eRfWvs6v5yv + DvL9rV / iZ + 2V4T + E2h3JbS / hrpAvb6NW + U6he7XIYeq26W + M9PNb15APyMJyea KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoo ooAKKKKACiiigAooooAKKKKACiiigAooooAK / oM / 4M9 / 2wpvGvwL8f8AwU8T3PmS + CbxNf0VHbkW l2xWeNB / dSdA / wBbk1 / PnX25 / wAG8n7U4 / ZV / wCCq3w6utTufs2jeNZX8I6kS21Sl5hYc9sC5W2P 0BoA / rMooooAh1C + h0uxnub + RYoLeNpZHY4CKoyST2AANfxa / t2ftE3H7Wn7ZHxL + I + oSGUeLfEF 3e22c / JbeYVt05 / uwrEv / Aa / qr / 4LWftCn9mP / glx8ZfE9pcfZr + XQJNGsHBwy3F6y2kZX3Uz7v + A + lfx + UAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFF ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFWtE1q78N61Z6joU8lrfWE6XNvMhw0Mi MGVh7ggH8Kq0UAf2p / sN / tG237XP7H / w4 + JOmMn / ABV + g2t / cIvSG4MYE8f1SVZF / wCA16rX5L / 8 Gh / 7T / 8Aws79hjxV8NNXuPMv / hlrzS20ZbJSxvg0ycennpefmK / WigD8eP8Ag8U / aA / 4RL9kr4a / DjT5wlx4z8RSarcxg8vbWMOMEehlu4j9Ur + d6iigAooooAKKKKACiiigAooooAKKKKACiiigAooo oAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiig AooooA / Tz / g06 / aJPwl / 4Kav4Qv7gR2HxN8PXWmiNjgPdW4F3CfqEhuFH + /X9NlFFAH/2Q == ');

    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    var blob = new Blob([byteArray], {
        type: 'image/jpeg'
    });
    //blob
    //
    window.corbel.request.send({
        url: 'http://localhost:3000/',
        type: 'POST',
        contentType: 'blob',
        dataType: 'image/jpeg',
        headers: {
            'X-Custom1': true,
            'X-Custom2': true
        },
        data: blob,
        success: function(res) {
            console.log((res.body instanceof blob));
            //printResponse(res, 'POST - Blob');
        }
    });

})(window.$, window.corbel);