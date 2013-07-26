coffeelintnode - a coffee-script lint server for more expedient linting
=======================================================================

I'm no longer maintaining this fork
-----------------------------------

I've stoped using Emacs in favour of Sublime Text 2 since I got a Mac and thus I'm no longer updating this repository.  However, there is a more upto date fork by Andrei Neculau at `andreineculau`_.

Continues:
----------

This is essentially a copy of `lintnode`_ (the David Miller fork
`davidmiller_lintnode`_) which is a fast way of Lint-ing JavaScript
code in the Emacs buffer, on-the-fly, using `flymake-mode`.  All I did
was make it work with `coffeelint`_ instead and make a few small
changes to make it work better with my set-up. YMMV.

Most of the explanation here is copied from `lintnode`_.

The following modules are needed with node: `coffeelint`_, `express`_
and underscore.  I recommend using npm to install them localling to
the directory.

See also `JSLint`_.

.. _lintnode: https://github.com/keturn/lintnode
.. _davidmiller_lintnode: https://github.com/davidmiller/lintnode
.. _coffeelint: https://github.com/clutchski/coffeelint
.. _flymake-mode: http://www.emacswiki.org/emacs/FlymakeJavaScript
.. _JSLint: http://www.jslint.com/
.. _node.js: http://nodejs.org/
.. _Express: http://expressjs.com/
.. _npm: http://npmjs.org/
.. _andreineculau: https://github.com/andreineculau/coffeelintnode


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

The following configuration should be useful in getting it to work:


.. code-block:: lisp

	;; make coffeelinenode work nicely!
	(add-to-list 'load-path "path-to-coffeelintnode")
	(require 'flymake-coffeelint)
	;; Make sure we can find the lintnode executable
	(setq coffeelintnode-location "path-to-coffeelintnode")
	(setq coffeelintnode-node-program "path-to-node-executable")
	(setq coffeelintnode-coffeelint-excludes (list 'max_line_length))
	(setq coffeelintnode-coffeelint-includes '())
	(setq coffeelintnode-coffeelint-set "")
	;; Start the server when we first open a coffee file and start checking
	(setq coffeelintnode-autostart 'true)
	(add-hook 'coffee-mode-hook
	  (lambda ()
	    (coffeelintnode-hook)
	    (unless (eq buffer-file-name nil) (flymake-mode 1)) ;dont invoke flymake on temporary buffers for the interpreter
	    (local-set-key [f2] 'flymake-goto-prev-error)
	    (local-set-key [f3] 'flymake-goto-next-error)))



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
