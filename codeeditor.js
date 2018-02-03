'use strict'

function CodeFlask(indent) {
    this.indent = indent || "    ";
}

CodeFlask.prototype.run = function(selector, options) {
    var target = document.getElementById(selector)
    this.scaffold(target, options);
}

CodeFlask.prototype.scaffold = function(target, options) {
    var engine = this;
    var initialCode = target.textContent;
    var textarea = document.createElement('textarea');
    var highlightPre = document.createElement('pre');
    var highlightCode = document.createElement('code');


    // opts를 만들까
    // WHAT_NEED
    // if(opts && !opts.enableAutocorrect)
    // {
    //     // disable autocorrect and spellcheck features
    //     textarea.setAttribute('spellcheck', 'false');
    //     textarea.setAttribute('autocapitalize', 'off');
    //     textarea.setAttribute('autocomplete', 'off');
    //     textarea.setAttribute('autocorrect', 'off');
    // }


    target.classList.add('CodeFlask');
    textarea.classList.add('CodeFlask_textarea');
    highlightPre.classList.add('CodeFlask_pre');
    highlightCode.classList.add('CodeFlask_code');
    highlightCode.classList.add('language-' + options.language);

    target.innerHTML = '';
    target.appendChild(textarea);
    target.appendChild(highlightPre);
    highlightPre.appendChild(highlightCode);
    
    textarea.value = initialCode;
    engine.renderOutput(highlightCode, textarea);
    // WHAT_NEED
    // Prisom.highlightAll();

    engine.handleInput(textarea, highlightCode, highlightPre);
    engine.handleScroll(textarea, highlightPre);
}

CodeFlask.prototype.renderOutput = function(highlightCode, input) {
    highlightCode.innerHTML = input.value.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\n\n";
}

CodeFlask.prototype.handleInput = function(textarea, highlightCode, highlightPre) {
    var engine = this;
    
    textarea.addEventListener('input', function() {
        this.value = this.value.replace(/\t/g, engine.indent);
        engine.renderOutput(highlightCode, this);
        // WHAT_NEED
        // Prisom.highlightAll();
    });

    textarea.addEventListener('keydown', function(e) {
        if(e.keyCode === 9) {
            e.preventDefault();

            var input = this;
            var selectionDirection = input.selectionDirection;
            var selectionStartPosition = input.selectionStart;
            var selectionEndPosition = input.selectionEnd;

            var beforeSelection = input.value.substr(0, selectionStartPosition);
            var selectionValue = input.value.substring(selectionStartPosition, selectionEndPosition);
            var afterSelection = input.value.substring(selectionEndPosition);

             // WHAT_NEED : 데이터의 길이가 인덴트의 길이보다 길어야 하는 이유가 뭐지
            if(selectionStartPosition !== selectionEndPosition && selectionValue.length >= engine.indent.length) {
                var currentLineStart = selectionStartPosition - beforeSelection.split('\n').pop().length;
                var startIndentLen = engine.indent.length;
                var endIndentLen = engine.indent.length;

                // Unindent
                if(e.shiftKey) {
                    var currentLineStartString = input.value.substr(currentLineStart, engine.indent.length);
                    if(currentLineStartString === engine.indent) {
                        // WHAT_NEED
                        startIndentLen = -startIndentLen;

                        if(currentLineStart > selectionStartPosition) {
                            selectionValue = selectionValue.substring(0, currentLineStart) + selectionValue.substring(currentLineStart + engine.indent.length);
                            endIndentLen = 0;
                        } else if(currentLineStart == selectionStartPosition) {
                            startIndentLen = 0;
                            endIndentLen = 0;
                            selectionValue = selectionValue.substring(engine.indent.length);
                        } else {
                            endIndentLen = -endIndentLen;
                            beforeSelection = beforeSelection.substring(0, currentLineStart) + beforeSelection.substring(currentLineStart + engine.indent.length);
                        }
                    } else {
                        startIndentLen = 0;
                        endIndentLen = 0;
                    }

                    selectionValue = selectionValue.replace(new RegExp('\n' + engine.indent.split('').join('\\'), 'g'), '\n');
                } else {
                    beforeSelection = beforeSelection.substr(0, currentLineStart) + engine.indent + beforeSelection.substring(currentLineStart, selectionStartPosition);
                    selectionValue = selectionValue.replace(/\n/g, '\n' + engine.indent);
                }

                input.value = beforeSelection + selectionValue + afterSelection;
                input.selectionStart = selectionStartPosition + startIndentLen;
                input.selectionEnd = selectionStartPosition + selectionValue.length + endIndentLen;
                input.selectionDirection = selectionDirection;
            } else {
                input.value = beforeSelection + engine.indent + afterSelection;
                input.selectionStart = selectionStartPosition + engine.indent.length;
                input.selectionEnd = selectionStartPosition + engine.indent.length;
            }
        }

        engine.renderOutput(highlightCode, this);
        // WHAT_NEED
        // Prisom.highlightAll();

            // if(e.shiftKey) {
            //     indentLength = engine.indent.length;

            //     if(this.value.substring(currentLineStart, currentLineStart + indentLength) == engine.indent) {
            //         this.value = this.value.substring(0, currentLineStart) + this.value.substring(currentLineStart + indentLength, this.value.length);
            //         this.selectionStart = selectionStartPosition - engine.indent.length;
            //         this.selectionEnd = selectionStartPosition - engine.indent.length;
            //     }
            // } else {
            //     this.value = this.value.substring(0, this.selectionStart) + engine.indent + this.value.substring(this.selectionStart, this.value.length);
            //     this.selectionStart = selectionStartPosition + engine.indent.length;
            //     this.selectionEnd = selectionStartPosition + engine.indent.length;
            // }
    });
}

CodeFlask.prototype.handleScroll = function(textarea, highlightPre) {
    textarea.addEventListener('scroll', function(){
        highlightPre.scrollTop = this.scrollTop;
    });
}

// WHAT_NEED
// CodeFlask.prototype.handlePreElement = function(highlightPre) {
//         highlightPre.addEventListener('scroll', function(e) {
//             e.preventDefault();
//             e.stopPropagation();
//         });

//         highlightPre.addEventListener('click', function(e) {
//             e.preventDefault();
//             e.stopPropagation();
//         });

//         highlightPre.addEventListener('mouseover', function(e) {
//             e.preventDefault();
//             e.stopPropagation();
//         });

//         highlightPre.addEventListener('wheel', function(e) {
//             e.preventDefault();
//             e.stopPropagation();
//         });            
//     }


// function initiateCodeFlask() {



//     CodeFlask.onUpdate = function(cb) {
//         CodeFlask.textarea.addEventListener('input', function(e) {
//             cb(this.value);
//         });
//     }

//     CodeFlask.update = function(string) {
//         var evt = document.createEvent("HTMLEvents");
//         CodeFlask.textarea.value = string;
//         CodeFlask.renderOutput(CodeFlask.highlightCode, CodeFlask.textarea);
//         evt.initEvent("input", false, true);
//         CodeFlask.textarea.dispatchEvent(evt);
//     }

//     return CodeFlask;
// }

// if(typeof(CodeFlask) === 'undefined') {
//     window.CodeFlask = initiateCodeFlask();
// } else {
//     console.error('CodeFlask already exists in your page.');
//     console.error('Please check for conflicts on your JS libraries.');
// }