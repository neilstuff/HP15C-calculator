var digits = [];
var uiDisplay = [];
var displayDecimal = [];
var mouseDown = false;
var justSawKeydown = false;

function CalcDisplay() {
    this.clear_digit = function(i) {
        uiDisplay[i].css("display", "none");
    }

    this.clear_digits = function() {
        $(".lcd").css("display", "none");
        $("#neg").css("display", "none");
        for (var iStack = 0; iStack < 4; iStack++) {
            $(`#stack_${iStack}`).val(Stack[iStack]);
        }

        $("#last_x").val(LastX);
        if (Flags[8]) {
            for (var i = 0; i < 4; i++) {
                $("#stacki_" + i).val(StackI[i]);
            }
            $("#last_xi").val(LastXI);
        }
        for (var iRegister = 0; iRegister < 10; iRegister++) {
            $(`#reg_${iRegister}`).val(Reg[iRegister]);
        }
        $("#reg_I").val(Reg['I']);
        $(".stacki").css("display", Flags[8] ? "inline" : "none");
    }

    this.clear_shift = function() {
        $(".shift").removeClass("indicator-on");
    }

    this.set_complex = function(on) {
        $("#complex").toggleClass("indicator-on", Flags[8]);
    }

    this.set_comma = function(i) {
        displayDecimal[i].css("display", "inline");
        displayDecimal[i].attr("src", "assets/images/comma.png");
    }

    this.set_decimal = function(i) {

        displayDecimal[i].css("display", "inline");
        displayDecimal[i].attr("src", "assets/images/decimal.png");


    }

    this.set_digit = function(i, d) {
        console.log
        uiDisplay[i].css("position", "absolute");
        uiDisplay[i].css("display", "inline");
        uiDisplay[i].attr("src", digits[d].src);

    }

    this.set_neg = function() {
        $("#neg").css("display", "inline");
    }

    this.set_prgm = function(on) {
        $("#program").toggleClass("indicator-on", on);
    }

    this.set_shift = function(mode) {
        $("#" + mode).addClass("indicator-on");
    }

    this.set_trigmode = function(mode) {
        if (mode === null) {
            $("#trigmode").removeClass("indicator-on");
        } else {
            $("#trigmode").addClass("indicator-on").text(mode);
        }
    }

    this.set_user = function(on) {
        $("#user").toggleClass("indicator-on", on);
    }
}

function run_test() {
    start_tests();
}

function help() {
    if ($(".help").length === 0) {
        var frame = $("#frame");
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 10; j++) {
                if (i === 3 && j === 5) continue;
                var c = KeyTable[i][j];
                var w = "1em";
                if (c === "\b") {
                    c = "\u2190";
                } else if (c === "\r") {
                    c = "\u21b2";
                } else if (c === "\u001b") {
                    c = "esc";
                    w = "2em";
                }
                var top = 167 + 65 * i;
                var left = 70 + 57 * j;
                frame.append('<div class="help" style="top: ' + top + '; left: ' + left + '; width: ' + w + '">' + c + '</div>');
            }
        }
        for (var i in ExtraKeyTable) {
            var top = 167 + 65 * ExtraKeyTable[i][0] + 20 * ExtraKeyTable[i][2];
            var left = 70 + 57 * ExtraKeyTable[i][1];
            var colour = ["goldenrod", null, "lightblue"][ExtraKeyTable[i][2] + 1];
            frame.append('<div class="help" style="top: ' + top + '; left: ' + left + '; background: ' + colour + '">' + ExtraKeyTable[i][3] + '</div>');
        }
    }
    $(".help").toggleClass("showhelp");
    return null;
}

$(() => {

    const DIGITS = "0123456789-ABCDEoru";

    for (var iDigit = 0; iDigit < DIGITS.length; iDigit++) {
        var digit = DIGITS.substr(iDigit, 1);

        digits[digit] = new Image(20, 30);
        digits[digit].src = `assets/images/${digit}.png`;

    }

    for (var iDigit = 0; iDigit < 10; iDigit++) {
        var d = $("#dig" + iDigit);
        d.css("left", 175 + iDigit * 27);
        d.css("top", 47);
        uiDisplay[uiDisplay.length] = d;
    }

    for (var iDigit = 0; iDigit < 10; iDigit++) {
        var d = $("#decimal" + iDigit);
        d.css("left", 194 + iDigit * 27);
        d.css("top", 71);
        displayDecimal[displayDecimal.length] = d;
    }

    var neg = $("#neg");
    neg.css("left", 158);
    neg.css("top", 60);

    Display = new CalcDisplay();

    $("#calc").mousedown(function(e) {
        let calc = $("#calc");
        let x = e.pageX - calc.offset().left;
        let y = e.pageY - calc.offset().top;

        if (x >= 52 && x < 800 && y >= 155 && y < 405) {
            console.log(`${x}:${y}:${Math.floor((x - 10)/ 79)}:${(x - 10) % 75}`)

            var c = Math.floor((x - 10) / 75);
            var r = Math.floor((y - 159) / 65);

            if (c >= 0 && c < 10 && r >= 0 && r < 4) {

                mouseDown = true;
                var h = 40;

                if (c == 5 && r >= 2) {
                    r = 2;
                    h = 110;
                }
                var keyx = 50 + c * 72;
                var keyy = 159 + r * 71;
                var press = $("#press");
                var presskey = $("#presskey");

                press.css("left", keyx);
                press.css("top", keyy);
                press.css("height", h);

                presskey.css("left", -keyx);
                presskey.css("top", -keyy - 1);
                press.css("display", "block");

                key(KeyTable[r][c]);

            }
        }
        e.preventDefault();
    });

    $("#calc").mouseup(function(e) {
        if (mouseDown) {
            $("#press").css("display", "none");
            mouseDown = false;
        }
    });

    $("#press").mouseup(function(e) {
        if (mouseDown) {
            $("#press").css("display", "none");
            mouseDown = false;
        }
    });

    $(document).keydown(function(e) {
        justSawKeydown = false;
        if (e.which == 8) {
            key("\b");
            e.preventDefault();
            justSawKeydown = true;
        }
    });

    $(document).keypress(function(e) {
        var c = String.fromCharCode(e.which);
        alert(c);
        if (CharTable[c]) {
            if (c === "\b" && justSawKeydown) {
                // ignore
            } else {
                key(c);
            }
            e.preventDefault();
        } else if (c === "h" || c === "?") {
            help();
        } else if (e.which == 20) {
            run_test();
        }
        e.stopPropagation();
    });

    init();

});