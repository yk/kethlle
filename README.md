# kethlle
clone recursively!

at first time: `meteor npm install` in the web directory, also put the ldap certs in `private/ssl`

to run: `ROOT_URL="http://localhost:3000/kethlle" meteor` in the web directory

to build: `meteor build ../docker/web` in the web directory, then build the `Dockerfile` in the docker directory.
