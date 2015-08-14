[![Travis](https://travis-ci.org/meslater1030/calcutor.svg)](https://travis-ci.org/meslater1030/calcutor.svg)

# Calcutor
A TI-83 Emulator.  Available on [calcutor.net](http://calcutor.net).  Written in Pyramid.

## Collaborators:
- [Wesley Wooten](https://github.com/doctorMcbob)
- [Nick Draper](https://github.com/ndraper2)
- [Megan Slater](https://github.com/meslater1030)

## DOWNLOAD AND DEPLOY

**Make sure to run `python setup.py develop` after pulling
down from GitHub.  This will create the system-specific egg
for gunicorn, etc. to use**

To deploy using ansible first establish an ssh connection to your
remote server and then run ansible from the ansible-deployment server
using the command `ansible-playbook -i plugins/inventory/ deploy_pyramid.yml`

## Functionality

An effort has been made to remain relatively true to the functionality
and error reporting provided by the original TI-83.  Complex and imaginary numbers
are unsupported.  Undeveloped features render as Monty Python
videos.

