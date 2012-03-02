coffeelintnode - a coffee-script lint server for more expedient linting
=======================================================================

This is essentially a copy of `lintnode`_ (the David Miller fork
`davidmiller_lintnode`_) which is a fast way of Lint-ing JavaScript
code in the Emacs buffer, on-the-fly, using `flymake-mode`.  All I did
was make it work with `coffeelint`_ instead and make a few small
changes to make it work better with my set-up. YMMV.

Most of the explanation here is copied from `lintnode`_.

The following modules are needed with node: `coffeelint`_, `express`_
and underscore.  I recommend using npm to install them localling to
the directory.

.. _lintnode: https://github.com/keturn/lintnode
.. _davidmiller_lintnode: https://github.com/davidmiller/lintnode
.. _coffeelint: https://github.com/clutchski/coffeelint
.. _flymake-mode: http://www.emacswiki.org/emacs/FlymakeJavaScript
.. _JSLint: http://www.jslint.com/
.. _node.js: http://nodejs.org/
.. _Express: http://expressjs.com/
.. _npm: http://npmjs.org/

Note that this depends on


Usage
-----

::

  $ node coffeelintnode/app.js --port 3004 &
  Express started at http://localhost:3004/ in development mode

  $ coffeelintnode/coffeelint.curl myfilthycode.coffee

The exit code of ``coffeelint.curl`` is currently not nearly as
relevant as the output on standard out.  The output should be mostly
compatible with `JSLint's Rhino version`__ but it's missing the
'character' location as coffeelint doesn't support that.

.. __: http://www.jslint.com/rhino/


Emacs Usage
-----------

See the included `flymake-coffeelint.el`__.

.. __: flymake-coffeelint.el


Configuration
-------------

`coffeelint_port` may be passed on the node command line with the
``--port`` parameter.  It defaults to 3004.

`coffeelint_options` can be configured by passing the --exclude option to ``app.js``.
e.g.

$ node app.js --exclude no_tabs,no_plusplus

or

$ node app.js --set max_line_length:80,indentation:2

Alternatively they can be configured within emacs by setting the variable lintnode-jslint-excludes

For documentation on coffeelint's options, see `coffeelint
options`_.

.. _coffeelint options: http://www.coffeelint.org/#options


Support
-------

This project is hosted at github, which has a wiki and an issue tracker:

  http://github.com/ajkavanagh/coffeelintnode


License
-------

This software is distributed under the same license__ as JSLint, which
looks like the MIT License with one additional clause:

  The Software shall be used for Good, not Evil.

.. __: LICENSE
