#! /bin/bash
php application/libraries/composerlib/vendor/phpunit/phpunit/phpunit --prepend $PWD/tests/bootstrap.php --configuration $PWD/phpunit.xml --coverage-text
