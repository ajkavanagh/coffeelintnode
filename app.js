/* HTTP interface to coffeelint
 * 
 * Basically copied from lintnode.git: https://github.com/keturn/lintnode

   Invoke from bash script like:

     curl --form source="<${1}" --form filename="${1}" ${COFFEELINT_URL}
     
   or use the provided coffeelint.curl
   
     coffeelint.curl <file>

*/

/*global process, require */
var express = require("express");
var COFFEELINT = require('coffeelint');
var fs = require('fs');
var _ = require('underscore');

var app = express.createServer();

app.configure(function () {
    app.use(express.errorHandler(
        { dumpExceptions: true, showStack: true }));
    app.use(express.bodyParser());
});

var coffeelint_port = 3004;

// from https://raw.github.com/clutchski/coffeelint/master/examples/coffeelint.json
var coffeelint_options = {
  "no_tabs" : {
    "level" : "error"
  },

  "no_trailing_whitespace" : {
    "level" : "error"
  },

  "max_line_length" : {
    "value": 80,
    "level" : "error"
  },

  "camel_case_classes" : {
    "level" : "error"
  },

  "indentation" : {
    "value" : 2,
    "level" : "error"
  },

  "no_implicit_braces" : {
    "level" : "ignore"
  },

  "no_trailing_semicolons" : {
    "level" : "error"
  },

  "no_plusplus" : {
    "level" : "ignore"
  },

  "no_throwing_strings" : {
    "level" : "error"
  },

  "cyclomatic_complexity" : {
    "value" : 11,
    "level" : "ignore"
  }
};

var outputErrors = function (errors) {
    var e, i, output = [];
    //console.log("Handling " + errors.length + "errors" + '\n');
    function write(s) {
        output.push(s + '\n');
    }
    /* This formatting is copied from JSLint's rhino.js, to be compatible with
       the command-line invocation. */
    for (i = 0; i < errors.length; i += 1) {
        e = errors[i];
	//console.log(e);
        if (e) {
            write('Lint at line ' + e.lineNumber + ': ' + e.message);
            write((e.context || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
            write('');
        }
    }
    return output.join('');
};

app.get('/', function (req, res) {
    res.send('lintnode');
});

app.post('/coffeelint', function (req, res) {
    function doLint(sourcedata) {
        var errors, results;
        errors = COFFEELINT.lint(sourcedata, coffeelint_options);
	//console.log(errors);
        if (!errors.length) {
            results = "coffeelint: No problems found in " + req.body.filename + "\n";
        } else {
            results = outputErrors(errors);
        }
        return results;
    }
    res.send(doLint(req.body.source), {'Content-Type': 'text/plain'});
});

/* This action always return some JSLint problems. */
var exampleFunc = function (req, res) {
    var errors = COFFEELINT.lint("a = () -> alert 'end of line - no need for ;';",
				 coffeelint_options);
    res.send(outputErrors(errors),
             {'Content-Type': 'text/plain'});
};

app.get('/example/errors', exampleFunc);
app.post('/example/errors', exampleFunc);

/* This action always returns JSLint's a-okay message. */
app.post('/example/ok', function (req, res) {
    res.send("coffeelint: No problems found in example.js\n",
        {'Content-Type': 'text/plain'});
});

function parseCommandLine() {
    var port_index, exclude_index, exclude_opts, include_index, include_opts, set_index, set_opts, set_pair, properties;
    port_index = process.argv.indexOf('--port');
    exclude_index = process.argv.indexOf('--exclude');
    include_index = process.argv.indexOf('--include');
    set_index = process.argv.indexOf('--set');
    if (port_index > -1) {
        coffeelint_port = process.argv[port_index + 1];
    }
    if (exclude_index > -1) {
        exclude_opts = process.argv[exclude_index + 1].split(",");
        if (exclude_opts.length > 0 && exclude_opts[0] !== '') {
            _.each(exclude_opts, function (opt) {
		console.log("Found " + opt);
                coffeelint_options[opt]['level'] = 'ignore';
            });
        }
    }
    if (include_index > -1) {
        include_opts = process.argv[include_index + 1].split(",");
        if (include_opts.length > 0 && include_opts[0] !== '') {
            _.each(include_opts, function (opt) {
                coffeelint_options[opt]['level'] = 'error';
            });
        }
    }
    if (set_index > -1) {
        set_opts = process.argv[set_index + 1].split(",");
        if (set_opts.length > 0 && set_opts[0] !== '') {
            _.each(set_opts, function (opt) {
                if (opt.indexOf(":") > -1) {
                    set_pair = opt.split(":");
                    if (set_pair[1] === "true") {
                        set_pair[1] = true;
                    } else if (set_pair[1] === "false") {
                        set_pair[1] = false;
                    }
                    coffeelint_options[set_pair[0]]['value'] = set_pair[1];
                } else {
                    coffeelint_options[opt]['level'] = 'error';
                }
            });
        }
    }
    properties = "";
    _.each(coffeelint_options, function (value, opt) {
        properties = properties + opt + ": " + value + ", ";
    });
    console.log("Properties (full) are " + properties);
    return properties.substring(0, properties.length-2);
}

process.on('SIGINT', function () {
    console.log("\n[coffeelintnode] received SIGINT, shutting down");
    process.exit(0);
});

console.log("[lintnode]", parseCommandLine());
app.listen(coffeelint_port, function () {
    console.log("[coffeelintnode] server running on port", coffeelint_port);
});