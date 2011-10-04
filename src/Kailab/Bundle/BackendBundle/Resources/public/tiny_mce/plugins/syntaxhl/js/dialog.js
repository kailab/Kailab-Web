tinyMCEPopup.requireLangPack();

var SyntaxHLDialog = {
  init : function() {
  },

  insert : function() {
    var f = document.forms[0], textarea_output, options = '';

    //If no code just return.
    if(f.syntaxhl_code.value == '') {
      tinyMCEPopup.close();
      return false;
    }

    if(f.syntaxhl_nogutter.checked) {
      options += 'boc-nogutter ';
    }
    if(f.syntaxhl_light.checked) {
      options += 'boc-light ';
    }
    if(f.syntaxhl_collapse.checked) {
      options += 'boc-collapse ';
    }
    if(f.syntaxhl_fontsize.value != '') {
      var fontsize=parseInt(f.syntaxhl_fontsize.value);
      options += 'boc-fontsize[' + fontsize + '] ';
    }

    if(f.syntaxhl_firstline.value != '') {
      var linenumber = parseInt(f.syntaxhl_firstline.value);
      options += 'boc-firstline[' + linenumber + '] ';
    }
    if(f.syntaxhl_highlight.value != '') {
      options += 'boc-highlight[' + f.syntaxhl_highlight.value + '] ';
    }

    textarea_output = '<pre class="code"><code class="';
    textarea_output += f.syntaxhl_language.value + ' ' + options + '">';
    textarea_output +=  tinyMCEPopup.editor.dom.encode(f.syntaxhl_code.value);
    textarea_output += '</code></pre> '; /* note space at the end, had a bug it was inserting twice? */
    tinyMCEPopup.editor.execCommand('mceInsertContent', false, textarea_output);
    tinyMCEPopup.close();
  }
};

tinyMCEPopup.onInit.add(SyntaxHLDialog.init, SyntaxHLDialog);
